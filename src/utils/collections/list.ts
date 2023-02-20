namespace utils.collections {
    interface ListElement {
        next?: ListElement;
        element?: any;
    }

    //单向链表
    export class List<T> {
        private static _free: ListElement;

        private static allocNode(): ListElement {
            let result = List._free;
            if (result) {
                List._free = result.next;
            } else {
                result = {};
            }
            result.next = null;
            return result;
        }

        private static freeNode(e: ListElement): void {
            e.element = null;
            e.next = List._free;
            List._free = e;
        }

        private _head: ListElement;
        private _size: number;

        constructor() {
            this._head = null;
            this._size = 0;
        }

        public shift(): T {
            let node = this._head;
            if (!node) {
                return null;
            }
            let e = node.element;
            this._head = node.next;
            List.freeNode(node);
            --this._size;
            return e;
        }

        public unshift(e: T): void {
            let node = List.allocNode();
            node.element = e;
            node.next = this._head;
            this._head = node;
            ++this._size;
        }

        public clear(): void {
            let next = this._head;
            while (next) {
                let node = next;
                next = next.next;
                List.freeNode(node);
            }
        }

        public get isEmpty(): boolean {
            return !this._head;
        }

        public get size(): number {
            return this._size;
        }

        public swap(list: this): void {
            let head = this._head;
            this._head = list._head;
            list._head = head;

            let size = this._size;
            this._size = list._size;
            list._size = size;
        }
    }
}
