///<reference path="handle_pool.ts"/>
///<reference path="recover_queue.ts"/>
///<reference path="../../utils/array_utils.ts"/>
///<reference path="../../utils/collections/heap.ts"/>
///<reference path="../../game/misc/log_utils.ts"/>

namespace base.assets {
    import LoadCommand = base.background.LoadCommand;
    import LoadCompleteCommand = base.background.LoadCompleteCommand;
    import ArrayUtils = utils.ArrayUtils;
    import Heap = utils.collections.Heap;
    import HeapElement = utils.collections.HeapElement;
    import LogUtils = game.misc.LogUtils;
    import IActor = base.background.IActor;
    import Unit = utils.Unit;

    type ResourceCallback = (url: string, handle: number, res: ArrayBuffer) => void;
    type CallbackArray = Array<ResourceCallback>;

    class ResourceEntry implements HeapElement {
        private static _freeEntry: ResourceEntry;
        public value: int32;
        public pointer: int32;
        public url: string;
        public res: ArrayBuffer;
        public callback: CallbackArray = [];
        public type: number = 0;
        public handle: number = 0;
        public cache: number = 0;
        private next: ResourceEntry;

        public static allocEntry(): ResourceEntry {
            let result: ResourceEntry;
            if (ResourceEntry._freeEntry != null) {
                result = ResourceEntry._freeEntry;
                ResourceEntry._freeEntry = result.next;
            } else {
                result = new ResourceEntry();
            }
            result.res = null;
            return result;
        }

        public static freeEntry(entry: ResourceEntry): void {
            entry.value = 0;
            entry.pointer = 0;
            entry.url = "";
            entry.res = null;
            entry.callback.length = 0;
            entry.type = 0;
            entry.handle = 0;
            entry.cache = 0;
            entry.next = this._freeEntry;
            this._freeEntry = entry;
        }

        public removeCallback(fun: ResourceCallback): void {
            ArrayUtils.remove(this.callback, fun);
        }

        public addCallback(fun: ResourceCallback): void {
            if (this.callback.indexOf(fun) == -1)
                this.callback.push(fun);
        }
    }

    type ResourceEntryMap = Table<ResourceEntry>;
    type ResourceEntryArray = Array<ResourceEntry>;
    type ResourceEntryHeap = Heap<ResourceEntry>;

    export class ResourcePool {
        private static _instance: ResourcePool = new ResourcePool();

        public static get instance(): ResourcePool {
            return ResourcePool._instance;
        }

        private readonly _handlePool: HandlePool;
        private readonly _recoverQueue: RecoverQueue;
        private readonly _recoverLimit: number;
        private _init: boolean;
        private readonly _processLimit: number;
        private readonly _realTimeProcessLimit: number;
        private _processCount: number;
        private _realTimeProcessCount: number;
        private readonly _waitPool: ResourceEntryMap;
        private readonly _waitQueue: ResourceEntryHeap;
        private readonly _realTimePool: ResourceEntryMap;
        private readonly _realTimeQueue: ResourceEntryArray;
        private readonly _successPool: ResourceEntryMap;
        private readonly _failurePool: ResourceEntryMap;
        private _notifyQueue: ResourceEntryMap;
        private readonly _processQueue: ResourceEntryMap;
        private _notifyList: CallbackArray;
        private _backupQueue: ResourceEntryMap;

        private _actor: IActor;
        private _totalMemorySize: number;

        private constructor() {
            this._handlePool = HandlePool.instance;
            this._recoverQueue = new RecoverQueue("ResourcePool", 5 * Unit.MB);
            this._recoverLimit = 30 * 1000;
            this._init = false;
            this._processLimit = 10;
            this._realTimeProcessLimit = 6;
            this._processCount = 0;
            this._realTimeProcessCount = 0;
            this._waitPool = {};
            this._waitQueue = new Heap<ResourceEntry>(
                function (l: ResourceEntry, r: ResourceEntry) {
                    return l.value < r.value;
                }
            );
            this._realTimePool = {};
            this._realTimeQueue = [];
            this._successPool = {};
            this._failurePool = {};
            this._notifyQueue = {};
            this._processQueue = {};
            this._notifyList = [];
            this._backupQueue = {};
            this._totalMemorySize = 0;

            LogUtils.enable(LogFlags.ResourcePool);
        }

        public init(actor: IActor): void {
            if (this._init) {
                return;
            }
            this._init = true;
            this._actor = actor;
            actor.registerOpcode(LoadCommand.opcode, LoadCommand);
            actor.registerOpcode(LoadCompleteCommand.opcode, LoadCompleteCommand);
            actor.addCommandHandler(LoadCompleteCommand.opcode, this.onRequestComplete);
        }

        public get recoverQueue(): RecoverQueue {
            return this._recoverQueue;
        }

        public cancel(url: string, callback: ResourceCallback): void {
            //判断是否已经在通知队列（不管成功还是失败都会放到通知队列）中了，是的话从通知队列移除。
            let entry: ResourceEntry = this._notifyQueue[url];
            if (entry != null) {
                entry.removeCallback(callback);
                return;
            }

            //判断是否已经在等待队列中，是的话移出回调，并判断是不是还有其它回调，没有代表这个加载已经可以不加载了。
            entry = this._waitPool[url];
            if (entry != null) {
                entry.removeCallback(callback);
                if (entry.callback.length == 0) {
                    delete this._waitPool[url];
                    this._waitQueue.remove(entry);
                    ResourceEntry.freeEntry(entry);
                }
                return;
            }

            //判断是否已经在实时加载等待队列中，是的话移出回调，并判断是不是还有其它回调，没有代表这个加载已经可以不加载了。
            entry = this._realTimePool[url];
            if (entry != null) {
                entry.removeCallback(callback);
                if (entry.callback.length == 0) {
                    delete this._realTimePool[url];
                    ArrayUtils.remove(this._realTimeQueue, entry);
                    ResourceEntry.freeEntry(entry);
                }
                return;
            }

            //判断是否已经在进行加载了，是的话移出回调，但是不中断加载
            entry = this._processQueue[url];
            if (entry != null) {
                entry.removeCallback(callback);
                return;
            }
        }

        //对于同一个URL，高优先级覆盖低优先级，实时覆盖非实时加载
        public load(url: string, callback: ResourceCallback, priority: number = 0, realTime: boolean = false, forceTry: boolean = false, uncompress: number = 0): void {
            // if (url.indexOf("0.png") != -1) {
            //     console.log();
            // }

            //相对优先级，根据时间戳和指定的优化级来计算，防止出现低优先级的加载出现饥饿现象
            let now: number = Date.now();
            priority = now + priority * 1000;

            //判断是不是之前已经是加载完成了，是的话就加入通知队列
            let entry: ResourceEntry = this._successPool[url];
            if (entry != null) {
                entry.addCallback(callback);
                this._notifyQueue[url] = entry;
                return;
            }

            //先判断是否是已经加载失败的，如果是再看是不是要强制尝试，如果是强制尝试那就移出通知队列和失败队列，并看是否为实时的类型是就放到实时队列去不是就放到普通等待队列去。不强制尝试就放到通知队列，通知加载失败。
            entry = this._failurePool[url];
            if (entry != null) {
                entry.addCallback(callback);
                if (!forceTry) {
                    this._notifyQueue[url] = entry;
                } else {
                    delete this._notifyQueue[url];
                    delete this._failurePool[url];
                    entry.value = priority;
                    entry.type = uncompress;
                    if (realTime) {
                        this._realTimePool[url] = entry;
                        this._realTimeQueue.push(entry);
                    } else {
                        this._waitPool[url] = entry;
                        this._waitQueue.push(entry);
                    }
                }
                return;
            }

            //判断是不是之前已经在等待加载中，并判断是不是要求实时加载的，要求实时加载的就放到实时加载队列去，不要实时加载的话就把回调加入，然后再判断新的优先级是不是要更新
            entry = this._waitPool[url];
            if (entry != null) {
                if (realTime) {
                    delete this._waitPool[url];
                    this._waitQueue.remove(entry);
                    this._realTimePool[url] = entry;
                    this._realTimeQueue.push(entry);
                } else {
                    entry.addCallback(callback);
                    if (entry.value > priority) {
                        entry.value = priority;
                        this._waitQueue.updateElement(entry);
                    }
                    return;
                }
            }

            //判断是不是之前已经在实时加载中，是的话把回调加入
            entry = this._realTimePool[url];
            if (entry != null) {
                entry.addCallback(callback);
                return;
            }

            //判断是不是之前已经在进行加载中，是的话把回调加入
            entry = this._processQueue[url];
            if (entry != null) {
                entry.addCallback(callback);
                return;
            }

            entry = ResourceEntry.allocEntry();
            entry.url = url;
            entry.res = null;
            entry.value = priority;
            entry.type = uncompress;
            entry.callback.push(callback);

            if (realTime) {
                this._realTimePool[url] = entry;
                this._realTimeQueue.push(entry);
            } else {
                this._waitPool[url] = entry;
                this._waitQueue.push(entry);
            }
        }

        public update(): void {
            let entry: ResourceEntry;
            let url: string;
            let uncompress: number = 0;
            //先满足实时加载要求的处理器数量
            while (this._processCount < this._processLimit && this._realTimeProcessCount < this._realTimeProcessLimit && this._realTimeQueue.length != 0) {
                entry = this._realTimeQueue.shift() as ResourceEntry;
                url = entry.url;
                uncompress = entry.type;
                entry.type = 1;
                delete this._realTimePool[url];
                if (this.processRequest(entry, uncompress)) {
                    this._processCount++;
                    this._realTimeProcessCount++;
                }
            }

            //把剩下的处理器数量分配给普通加载
            while (this._processCount < this._processLimit && !this._waitQueue.isEmtry()) {
                entry = this._waitQueue.pop() as ResourceEntry;
                url = entry.url;
                uncompress = entry.type;
                entry.type = 0;
                delete this._waitPool[url];
                if (this.processRequest(entry, uncompress)) {
                    this._processCount++;
                }
            }

            //再次看下是否还有空闲的处理器，有的话再看看实时队列是否还需要
            while (this._processCount < this._processLimit && this._realTimeQueue.length != 0) {
                entry = this._realTimeQueue.shift() as ResourceEntry;
                url = entry.url;
                uncompress = entry.type;
                entry.type = 1;
                delete this._realTimePool[url];
                //实现真正的加载
                if (this.processRequest(entry, uncompress)) {
                    this._processCount++;
                    this._realTimeProcessCount++;
                }
            }

            this.notify();

            this._recoverQueue.updateQueue();
            RecoverQueue.default.updateQueue();
        }

        private processRequest(entry: ResourceEntry, uncompress: number): Boolean {
            let url: string = entry.url;
            this._processQueue[url] = entry;
            let command = new LoadCommand();
            command.url = url;
            command.uncompress = uncompress;
            this._actor.sendCommand(command);
            return true;
        }

        private onRequestComplete = (command: LoadCompleteCommand): void => {
            let status = command.status;
            if (status == 200 || status == 0) {
                // LogUtils.info(LogFlags.ResourcePool, `加载成功：${command.url} => ${command.bytes.byteLength}`);
                this.onComplete(command.url, 0, command.bytes);
            } else {
                LogUtils.info(LogFlags.ResourcePool, `加载失败：${command.url}`);
                this.onComplete(command.url, 0, null);
            }
        };

        private onRecover = (url: string): void => {
            let entry: ResourceEntry = this._notifyQueue[url];
            if (entry != null) {
                if (entry.callback.length != 0) {
                    this._recoverQueue.addToQueue(url, entry.res.byteLength, this.onRecover, this._recoverLimit);
                    return;
                }
                delete this._notifyQueue[url];
            } else {
                entry = this._successPool[url];
            }
            delete this._successPool[url];
            this._totalMemorySize -= entry.res.byteLength;
            // LogUtils.info(LogFlags.ResourcePool, `释放资源：${url} => ${entry.res.byteLength}, ${this._totalMemorySize}`);
            ResourceEntry.freeEntry(entry);
        };

        private onDestroy = (url: any, res: ArrayBuffer): void => {
            // LogUtils.info(LogFlags.ResourcePool, `释放句柄：${url} => ${res.byteLength}, 0x${this._successPool[url].handle.toString(16)}`);
            let entry = this._successPool[url];
            entry.handle = 0;
            this._recoverQueue.addToQueue(url, entry.res.byteLength, this.onRecover, this._recoverLimit);
        };

        private onComplete(url: string, cache: number, res: ArrayBuffer): void {
            let entry: ResourceEntry = this._processQueue[url];
            delete this._processQueue[url];
            entry.res = res;
            entry.cache = cache;

            this._processCount--;
            if (entry.type == 1) {
                this._realTimeProcessCount--;
            }

            if (res == null) {
                this._failurePool[url] = entry;
            } else {
                this._totalMemorySize += res.byteLength;
                this._successPool[url] = entry;
            }
            if (entry.callback.length != 0) {
                this._notifyQueue[url] = entry;
            } else if (res != null) {
                this._recoverQueue.addToQueue(url, entry.res.byteLength, this.onRecover, this._recoverLimit);
            }
        }

        private notify(): void {
            //交换前后台数据，防止在通知的时候发生改变
            let temp: ResourceEntryMap = this._notifyQueue;
            this._notifyQueue = this._backupQueue;
            this._backupQueue = temp;
            for (let url in this._backupQueue) {
                let entry: ResourceEntry = this._backupQueue[url];
                //交换前后台数据，防止在通知的时候发生改变
                let list: CallbackArray = entry.callback;
                entry.callback = this._notifyList;
                this._notifyList = list;

                let handle: number = entry.handle;
                let res: ArrayBuffer = entry.res;
                if (res != null) {
                    if (handle == 0) {
                        this._recoverQueue.removeToQueue(url);
                        handle = entry.handle = this._handlePool.alloc(url, entry.res, this.onDestroy);
                    } else {
                        this._handlePool.lock(handle);
                    }
                }

                for (let callback of this._notifyList) {
                    // this._handlePool.lock(handle);
                    callback(url, handle, res);
                }
                this._handlePool.free(handle);

                this._notifyList.length = 0;
                delete this._backupQueue[url];
            }
        }
    }
}