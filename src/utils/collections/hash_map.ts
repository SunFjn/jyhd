//还没写完，暂不能用
namespace utils.collections {
    interface HashEntry<K, V> {
        key: K;
        value: V;
        next: HashEntry<K, V>
    }

    type HashFunction<K> = (key: K) => uint;

    function generalHashFunction(data: Uint8Array): uint {
        let hash = 5381;
        for (let i = 0, bytes = data.byteLength; i < bytes; ++i) {
            // hash = ((hash << 5) + hash) + data[i];
            hash = ((hash * 32) + hash) + data[i];
        }
        return hash;
    }

    class HashMap<K, V> {
        private _size: uint;
        private _mask: uint;
        private _capacity: uint;
        private _elements: Array<HashEntry<K, V>>;
        private readonly _hash: HashFunction<K>;

        constructor(capacity: uint, hash: HashFunction<K>) {
            this._capacity = MathUtils.ceilPowerOfTwo(capacity);
            this._size = 0;
            this._elements = new Array<HashEntry<K, V>>(this._capacity);
            this._hash = hash;
            this._mask = this._capacity - 1;
        }

        public has(key: K): boolean {
            let h = this._hash(key);
            let index = h & this._mask;
            let entry = this._elements[index];
            while (entry != null) {
                if (entry.key == key) {
                    break;
                }
                entry = entry.next;
            }
            return entry != null;
        }

        public set(key: K, value: V): HashMap<K, V> {
            let h = this._hash(key);
            let index = h & this._mask;
            let entry = this._elements[index];
            while (entry != null) {
                if (entry.key == key) {
                    break;
                }
                entry = entry.next;
            }

            if (entry != null) {
                entry.value = value;
            } else {
                entry = {
                    key: key,
                    value: value,
                    next: this._elements[index]
                };
                this._elements[index] = entry;
            }
            return this;
        }

        public get(key: K): V {
            let h = this._hash(key);
            let index = h & this._mask;
            let entry = this._elements[index];
            while (entry != null) {
                if (entry.key == key) {
                    break;
                }
                entry = entry.next;
            }
            return entry == null ? null : entry.value;
        }

        public remove(key: K): boolean {
            let h = this._hash(key);
            let index = h & this._mask;
            let entry = this._elements[index];
            if (entry == null) {
                return false;
            }
            let head = entry;
            let prev = head;
            do {
                if (entry.key == key) {
                    if (prev == head) {
                        this._elements[index] = entry.next;
                    } else {
                        prev.next = entry.next;
                    }
                    return true;
                }
                prev = entry;
                entry = entry.next;
            } while (entry != null);
            return false;
        }

        public clear(): void {
            for (let i = 0, size = this._elements.length; i < size; ++i) {
                this._elements[i] = null;
            }
            this._size = 0;
        }

        private resetHash(): void {

        }
    }
}