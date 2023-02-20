namespace base.assets {
    type HandleDestroyCallback = (args: any, res: any) => void;

    const enum Constant {
        IndexBits = 16,
        MaxIndexCount = 1 << IndexBits,
        IndexMask = MaxIndexCount - 1,

        BasicMagic = 1 << IndexBits,
        MagicMask = (1 << (32 - IndexBits)) - 1,
        MaxMagicValue = MagicMask,
    }

    class Entry {
        public args: any;
        public res: any;
        public destroy: HandleDestroyCallback;
        public ref: uint32;
        public handle: uint32;
    }

    export class HandlePool {
        private static _instance: HandlePool = new HandlePool();

        public static get instance(): HandlePool {
            return HandlePool._instance;
        }

        private readonly _slots: Array<Entry>;
        private _freeSlot: Entry;

        private constructor() {
            this._slots = new Array<Entry>(4096);
            this._count = 0;
            this._freeSlot = null;
        }

        private _count: uint32;

        public get count(): uint32 {
            return this._count;
        }

        public lock(handle: uint32): any {
            let slot: Entry = this.findEntry(handle);
            if (slot == null) {
                return null;
            }

            ++slot.ref;
            return slot.res;
        }

        public getValue<T>(handle: uint32): T {
            let slot: Entry = this.findEntry(handle);
            if (slot == null) {
                return null;
            }
            return slot.res as T;
        }

        public getArgs(handle: uint32): any {
            let slot: Entry = this.findEntry(handle);
            if (slot == null) {
                return null;
            }
            return slot.args;
        }

        public getRefCount(handle: uint32): uint32 {
            let slot: Entry = this.findEntry(handle);
            if (slot == null) {
                return 0;
            }
            return slot.ref;
        }

        //返回句柄是否失效了
        public free(handle: uint32): boolean {
            let slot: Entry = this.findEntry(handle);
            if (slot == null) {
                return true;
            }

            if (--slot.ref > 0) {
                return false;
            }

            let destroy: HandleDestroyCallback = slot.destroy;
            let args: any = slot.args;
            let res: any = slot.res;

            // let magic: uint32 = (slot.handle >> Constant.IndexBits) & Constant.MagicMask;
            let magic: uint32 = (slot.handle / Constant.MaxIndexCount) | 0;
            magic = magic == Constant.MaxMagicValue ? 1 : magic + 1;
            // slot.handle = (magic << Constant.IndexBits) | (slot.handle & Constant.IndexMask);
            slot.handle = (magic * Constant.MaxIndexCount) + (slot.handle & Constant.IndexMask);
            slot.ref = this._freeSlot == null ? -1 : (this._freeSlot.handle & Constant.IndexMask);
            slot.args = null;
            slot.res = null;
            slot.destroy = null;
            this._freeSlot = slot;
            --this._count;
            if (destroy != null) {
                destroy(args, res);
            }

            return true;
        }

        public alloc(args: any, res: object, destroy: HandleDestroyCallback): uint32 {
            if (res == null) {
                return 0;
            }

            if (this._count == this._slots.length) {
                if (this._count * 2 > Constant.MaxIndexCount) {
                    throw Error("HandlePool overflow");
                }
                this._slots.length = this._count * 2;
            }

            let slot: Entry;
            if (this._freeSlot != null) {
                ++this._count;
                slot = this._freeSlot;
                let next: uint32 = slot.ref;
                slot.ref = 1;
                this._freeSlot = next != -1 ? this._slots[next] : null;
            } else {
                slot = new Entry();
                slot.handle = Constant.BasicMagic | this._count;
                slot.ref = 1;
                this._slots[this._count++] = slot;
            }
            slot.args = args;
            slot.res = res;
            slot.destroy = destroy;
            return slot.handle;
        }

        private findEntry(handle: uint32): Entry {
            let index: uint32 = handle & 0xFFFF;
            if (index >= this._slots.length) {
                return null;
            }

            let slot: Entry = this._slots[index];

            if (slot == null || slot.res == null || slot.handle != handle) {
                return null;
            }

            return slot;
        }
    }
}