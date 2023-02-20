///<reference path="../../utils/array_utils.ts"/>

namespace utils.collections {
    export class Queue<T> {
        private _front: uint;
        private _rear: uint;
        private _size: uint;
        private _capacity: uint;
        private _list: Array<T>;

        constructor(capacity: uint = 8) {
            this._capacity = MathUtils.ceilPowerOfTwo(capacity > 8 ? capacity : 8);
            this._list = new Array<T>(this._capacity);
            this._front = 0;
            this._rear = 0;
            this._size = 0;
        }

        private expand(): void {
            this._capacity *= 2;
            let temp = this._list;
            this._list = new Array<T>(this._capacity);
            let cursor = 0;
            if (this._front >= this._rear) {
                let limit = temp.length;
                for (let i = this._front; i < limit; ++i) {
                    this._list[cursor++] = temp[i];
                }
                for (let i = 0; i < this._rear; ++i) {
                    this._list[cursor++] = temp[i];
                }
            } else {
                for (let i = this._front; i < this._rear; ++i) {
                    this._list[cursor++] = temp[i];
                }
            }
            this._front = 0;
            this._rear = cursor;
        }

        public push(value: T): void {
            if (this._size == this._capacity) {
                this.expand();
            }
            this._list[this._rear] = value;
            this._rear = (this._rear + 1) % this._capacity;
            this._size++;
        }

        public pull(): T {
            if (this.isEmpty()) {
                return null;
            }
            let result = this._list[this._front];
            this._front = (this._front + 1) % this._capacity;
            this._size--;
            return result;
        }

        public isEmpty(): boolean {
            return this._size == 0;
        }

        public get front(): T {
            if (this.isEmpty()) {
                return null;
            }
            return this._list[this._front];
        }

        public get size(): uint {
            return this._size;
        }

        public get capacity(): uint {
            return this._capacity;
        }
    }
}