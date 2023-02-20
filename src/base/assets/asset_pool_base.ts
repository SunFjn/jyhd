///<reference path="handle_pool.ts"/>
///<reference path="recover_queue.ts"/>
///<reference path="../../utils/collections/set.ts"/>

namespace base.assets {
    type ResourceCallback = (url: string, handle: number, res: any) => void;
    type CallbackArray = Array<ResourceCallback>;

    export class AssetEntry {
        private static _freeEntry: AssetEntry;
        private static _handlePool: HandlePool = HandlePool.instance;
        public url: string;
        public res: any;
        public callback: utils.collections.Set<ResourceCallback> = new utils.collections.Set<ResourceCallback>();
        public status: number = 0;
        public handle: number = 0;
        public cache: number = 0;
        public cost: uint32 = 0;
        public args: any;
        public assets: Array<number> = [];

        public static allocEntry(): AssetEntry {
            let result: AssetEntry;
            if (AssetEntry._freeEntry != null) {
                result = AssetEntry._freeEntry;
                AssetEntry._freeEntry = result.res;
            } else {
                result = new AssetEntry();
            }
            result.res = null;
            return result;
        }

        public static freeEntry(entry: AssetEntry): void {
            entry.url = "";
            entry.res = this._freeEntry;
            entry.callback.clear();
            entry.status = 0;
            entry.handle = 0;
            entry.cache = 0;
            entry.cost = 0;
            entry.args = null;
            for (let handle of entry.assets) {
                AssetEntry._handlePool.free(handle);
            }
            entry.assets.length = 0;
            this._freeEntry = entry;
        }
    }

    type AssetEntryMap = Table<AssetEntry>;

    export abstract class AssetPoolBase {
        private static _poolQueue = new Array<AssetPoolBase>();

        public static onUpdate(): void {
            for (let pool of AssetPoolBase._poolQueue) {
                pool.update();
            }
        }

        public static gc(force: boolean): void {
            for (let pool of AssetPoolBase._poolQueue) {
                pool.recoverQueue.gc(force);
            }
        }

        protected readonly _handlePool: HandlePool;
        protected readonly _recoverQueue: RecoverQueue;
        protected readonly _recoverLimit: number;
        protected readonly _waitPool: AssetEntryMap;
        protected readonly _successPool: AssetEntryMap;
        protected readonly _failurePool: AssetEntryMap;
        protected _notifyQueue: AssetEntryMap;
        protected _notifyList: CallbackArray;
        protected _backupQueue: AssetEntryMap;

        protected constructor(name: string, limit: uint32, recoverLimit: uint32 = 30 * 1000) {
            this._handlePool = HandlePool.instance;
            this._recoverQueue = new RecoverQueue(name, limit);
            this._recoverLimit = recoverLimit;
            this._waitPool = {};
            this._successPool = {};
            this._failurePool = {};
            this._notifyQueue = {};
            this._notifyList = [];
            this._backupQueue = {};

            AssetPoolBase._poolQueue.push(this);
        }

        public get recoverQueue(): RecoverQueue {
            return this._recoverQueue;
        }

        public waitingNotify(url: string, callback: ResourceCallback): boolean {
            let entry: AssetEntry = this._successPool[url];
            if (entry != null) {
                return entry.callback.has(callback);
            }

            entry = this._failurePool[url];
            if (entry != null) {
                return entry.callback.has(callback);
            }

            entry = this._waitPool[url];
            if (entry != null) {
                return entry.callback.has(callback);
            }

            return false;
        }

        protected findNeedCancelEntry(url: string, callback: ResourceCallback): AssetEntry {
            let entry: AssetEntry = this._successPool[url];
            if (entry != null) {
                entry.callback.del(callback);
                return null;
            }

            entry = this._failurePool[url];
            if (entry != null) {
                entry.callback.del(callback);
                return null;
            }

            entry = this._waitPool[url];
            if (entry == null) {
                return null;
            }

            if (!entry.callback.del(callback)) {
                return null;
            }

            if (!entry.callback.isEmpty()) {
                return null;
            }

            return entry;
        }

        protected checkNeedCancel(url: string, callback: ResourceCallback): boolean {
            let entry: AssetEntry = this._successPool[url];
            if (entry != null) {
                entry.callback.del(callback);
                return false;
            }

            entry = this._failurePool[url];
            if (entry != null) {
                entry.callback.del(callback);
                return false;
            }

            entry = this._waitPool[url];
            if (entry == null) {
                return false;
            }

            if (!entry.callback.del(callback)) {
                return false;
            }

            if (!entry.callback.isEmpty()) {
                return false;
            }

            delete this._waitPool[url];
            AssetEntry.freeEntry(entry);
            return true;
        }

        protected checkNeedLoad(url: string, callback: ResourceCallback, forceTry: boolean): AssetEntry {
            let entry: AssetEntry = this._successPool[url];
            if (entry != null) {
                entry.callback.add(callback);
                this._notifyQueue[url] = entry;
                return null;
            }

            entry = this._failurePool[url];
            if (entry != null) {
                if (forceTry) {
                    delete this._failurePool[url];
                    delete this._notifyQueue[url];
                    this._waitPool[url] = entry;
                } else {
                    this._notifyQueue[url] = entry;
                    return null;
                }
            }

            entry = this._waitPool[url];
            if (entry == null) {
                entry = AssetEntry.allocEntry();
                entry.url = url;
                entry.res = null;
                this._waitPool[url] = entry;
            }
            entry.callback.add(callback);
            return entry;
        }

        protected onComplete(url: string, res: any, cost: uint32): void {
            let entry: AssetEntry = this._waitPool[url];
            delete this._waitPool[url];
            if (!DEBUG) {
                if (!entry) {
                    return;
                }
            }
            entry.res = res;
            entry.cost = cost;
            if (res == null) {
                for (let handle of entry.assets) {
                    this._handlePool.free(handle);
                }
                entry.assets.length = 0;
                entry.args = null;
                entry.status = 0;
                this._failurePool[url] = entry;
            } else {
                this._successPool[url] = entry;
            }
            if (!entry.callback.isEmpty()) {
                this._notifyQueue[url] = entry;
            } else if (res != null) {
                this._recoverQueue.addToQueue(url, entry.cost, this.onRecover, this._recoverLimit);
            }
        }

        protected doRecover = (entry: AssetEntry): void => {
        };

        protected onDestroy = (url: string, res: any): void => {
            let entry = this._successPool[url];
            entry.handle = 0;
            this._recoverQueue.addToQueue(url, entry.cost, this.onRecover, this._recoverLimit);
        };

        protected doNotify(url: string, handle: uint, res: any, callback: ResourceCallback): void {
            callback(url, handle, res);
        }

        protected onRecover = (url: string): void => {
            let entry: AssetEntry = this._notifyQueue[url];
            if (entry != null) {
                if (!entry.callback.isEmpty()) {
                    this._recoverQueue.addToQueue(url, entry.cost, this.onRecover, this._recoverLimit);
                    return;
                } else {
                    delete this._notifyQueue[url];
                }
            } else {
                entry = this._successPool[url];
            }

            delete this._successPool[url];
            this.doRecover(entry);
            AssetEntry.freeEntry(entry);
        };

        private update(): void {
            //交换前后台数据，防止在通知的时候发生改变
            let temp: AssetEntryMap = this._notifyQueue;
            this._notifyQueue = this._backupQueue;
            this._backupQueue = temp;
            for (let url in this._backupQueue) {
                let entry = this._backupQueue[url];
                let handle = entry.handle;
                let res = entry.res;
                if (res != null) {
                    if (handle == 0) {
                        this._recoverQueue.removeToQueue(url);
                        handle = entry.handle = this._handlePool.alloc(url, res, this.onDestroy);
                    } else {
                        this._handlePool.lock(handle);
                    }
                }

                //交换前后台数据，防止在通知的时候发生改变
                this._notifyList = entry.callback.swap(this._notifyList);
                for (let callback of this._notifyList) {
                    this.doNotify(url, handle, res, callback);
                }
                this._handlePool.free(entry.handle);
                this._notifyList.length = 0;
                delete this._backupQueue[url];
            }

            this._recoverQueue.updateQueue();

            // let count = 0;
            // for (let value in this._successPool) {
            //     ++count;
            // }
            // console.log(`${this._recoverQueue.name}: ${count}`);
        }
    }
}
