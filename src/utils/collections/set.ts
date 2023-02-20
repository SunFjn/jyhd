///<reference path="../../utils/array_utils.ts"/>

namespace utils.collections {
    export class Set<T> {
        private _list: Array<T>;

        constructor(list?: Array<T>) {
            this._list = new Array<T>();
            if (list != null) {
                for (let value of list) {
                    this.add(value);
                }
            }
        }

        public add(value: T): boolean {
            if (this._list.indexOf(value) != -1) {
                return false;
            }
            this._list.push(value);
            return true;
        }

        public swap(list: Array<T>): Array<T> {
            let result = this._list;
            this._list = list;
            return result;
        }

        public has(value: T): boolean {
            return this._list.indexOf(value) != -1;
        }

        public del(value: T): boolean {
            return ArrayUtils.remove(this._list, value) != -1;
        }

        public isEmpty(): boolean {
            return this._list.length == 0;
        }

        public get size(): uint {
            return this._list.length;
        }

        public get values(): Array<T> {
            return this._list;
        }

        public clear(): void {
            this._list.length = 0;
        }
    }
}