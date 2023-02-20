///<reference path="../../utils/collections/heap.ts"/>

namespace base.assets {
    import Heap = utils.collections.Heap;
    import HeapElement = utils.collections.HeapElement;
    import Unit = utils.Unit;
    type RecoverCallback = (res: string) => void;

    class RecoverEntry implements HeapElement {
        private static _freeEntry: RecoverEntry = null;
        public value: int32;
        public pointer: int32;
        public res: string;
        public recover: RecoverCallback;
        public cost: uint32;
        private next: RecoverEntry;

        public static allocEntry(): RecoverEntry {
            let result: RecoverEntry;
            if (RecoverEntry._freeEntry != null) {
                result = RecoverEntry._freeEntry;
                RecoverEntry._freeEntry = result.next;
            } else {
                result = new RecoverEntry();
            }
            return result;
        }

        public static freeEntry(e: RecoverEntry): void {
            e.res = "";
            e.value = 0;
            e.recover = null;
            e.pointer = 0xFFFFFFFF;
            e.next = this._freeEntry;
            e.cost = 0;
            this._freeEntry = e;
        }
    }

    export class RecoverQueue {
        private static sid: uint32 = 0;
        private static _default: RecoverQueue = new RecoverQueue("default", 100 * Unit.MB);

        public static get default(): RecoverQueue {
            return RecoverQueue._default;
        }

        private _cache: Table<RecoverEntry> = {};
        private _heap: Heap<RecoverEntry> = new Heap<RecoverEntry>(
            function (l: RecoverEntry, r: RecoverEntry) {
                return l.value < r.value;
            }
        );
        private _id: uint32 = 0;
        private _name: string = "RecoverQueue";
        private _cost: uint32 = 0;
        private _limit: uint32 = 0;

        constructor(name: string, limit: uint32) {
            this._name = name;
            this._id = ++RecoverQueue.sid;
            this._limit = limit;
        }

        public get name(): string {
            return this._name;
        }

        public gc(force: boolean = false): void {
            let queue = new Array<RecoverEntry>();
            while (!this._heap.isEmtry() && (this._cost > this._limit || force)) {
                let e: RecoverEntry = this._heap.pop();
                delete this._cache[e.res];
                queue.push(e);
            }

            for (let e of queue) {
                if (e.recover != null)
                    e.recover(e.res);
                this._cost -= e.cost;
                RecoverEntry.freeEntry(e);
            }
        }

        public addToQueue(res: string, cost: uint32, recover: RecoverCallback, interval: uint32): void {
            let entry: RecoverEntry = this._cache[res];
            if (entry == null) {
                entry = RecoverEntry.allocEntry();
                entry.res = res;
                entry.recover = recover;
                entry.pointer = 0;
                entry.cost = cost;
                entry.value = Date.now() + interval;
                this._heap.push(entry);
                this._cache[res] = entry;
                this._cost += cost;
            } else {
                entry.recover = recover;
                this._cost -= entry.cost;
                this._cost += cost;
                entry.cost = cost;
                entry.value = Date.now() + interval;
                this._heap.updateElement(entry);
            }
        }

        public removeToQueue(res: string): void {
            let entry: RecoverEntry = this._cache[res];
            if (entry != null) {
                this._cost -= entry.cost;
                this._heap.remove(entry);
                delete this._cache[res];
                RecoverEntry.freeEntry(entry);
            }
        }

        public updateQueue(): void {
            let now: uint32 = Date.now();
            if (!this._heap.isEmtry()) {
                let e: RecoverEntry = this._heap.top;
                if (e.value <= now) {
                    this._cost -= e.cost;
                    this._heap.pop();
                    delete this._cache[e.res];
                    if (e.recover != null)
                        e.recover(e.res);
                    RecoverEntry.freeEntry(e);
                }
            }

            this.gc();

            if (this._heap.isEmtry() && this._cost != 0) {
                throw new Error(`${this._name} cost not emtry~~~`);
            }
        }
    }
}