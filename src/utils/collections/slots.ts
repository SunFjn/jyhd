///<reference path="../math_utils.ts"/>

namespace utils.collections {
    const enum Constant {
        IndexBits = 16,
        MaxIndexCount = 1 << IndexBits,
        IndexMask = MaxIndexCount - 1,

        BasicMagic = 1 << IndexBits,
        MagicMask = (1 << (32 - IndexBits)) - 1,
        MaxMagicValue = MagicMask,
    }

    interface Entry<T extends object> {
        res: T;
        handle: uint32;
        next: uint32;
    }

    export class Slots<T extends object> {
        private readonly _slots: Array<Entry<T>>;
        private _freeSlot: Entry<T>;
        private _count: uint32;

        public constructor(initialSize: uint32 = 256) {
            initialSize = MathUtils.ceilPowerOfTwo(initialSize);
            this._slots = new Array<Entry<T>>(initialSize);
            this._count = 0;
            this._freeSlot = null;
        }

        public get count(): uint32 {
            return this._count;
        }

        public get(handle: uint32): T {
            let slot: Entry<T> = this.findEntry(handle);
            if (slot == null) {
                return null;
            }
            return slot.res;
        }

        public has(handle: uint32): boolean {
            let slot: Entry<T> = this.findEntry(handle);
            return slot != null;
        }

        public alloc(res: T): uint32 {
            if (res == null) {
                return 0;
            }

            if (this._count == this._slots.length) {
                if (this._count * 2 > Constant.MaxIndexCount) {
                    throw Error("Slots overflow!");
                }
                this._slots.length = this._count * 2;
            }

            let slot: Entry<T>;
            if (this._freeSlot != null) {
                ++this._count;
                slot = this._freeSlot;
                let next: uint32 = slot.next;
                this._freeSlot = next != -1 ? this._slots[next] : null;
            } else {
                slot = Object.create(null);
                slot.handle = Constant.BasicMagic | this._count;
                this._slots[this._count++] = slot;
            }
            slot.next = -1;
            slot.res = res;
            return slot.handle;
        }

        public free(handle: uint32): T {
            let slot: Entry<T> = this.findEntry(handle);
            if (slot == null) {
                return null;
            }

            let res: T = slot.res;
            // let magic: uint32 = (slot.handle >> Constant.IndexBits) & Constant.MagicMask;
            let magic: uint32 = (slot.handle / Constant.MaxIndexCount) | 0;
            magic = (magic == Constant.MaxMagicValue) ? 1 : magic + 1;
            // slot.handle = (magic << Constant.IndexBits) | (slot.handle & Constant.IndexMask);
            slot.handle = (magic * Constant.MaxIndexCount) + (slot.handle & Constant.IndexMask);
            slot.next = (this._freeSlot == null) ? -1 : (this._freeSlot.handle & Constant.IndexMask);
            slot.res = null;
            this._freeSlot = slot;
            --this._count;
            return res;
        }

        private findEntry(handle: uint32): Entry<T> {
            let index: uint32 = handle & Constant.IndexMask;
            if (index >= this._slots.length) {
                return null;
            }

            let slot: Entry<T> = this._slots[index];
            if (slot == null || slot.res == null || slot.handle != handle) {
                return null;
            }
            return slot;
        }
    }
}