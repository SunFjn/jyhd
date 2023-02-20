namespace utils {
    interface WritableArrayLike<T> {
        readonly length: number;

        [n: number]: T;
    }

    export class ArrayUtils {
        public static copy<T>(source: WritableArrayLike<T>, sourceOffset: int, target: WritableArrayLike<T>, targetOffset: int, length: int): boolean {
            if (source.length < (sourceOffset + length)) {
                return false;
            }

            if (target.length < (targetOffset + length)) {
                return false;
            }

            while (length--) {
                target[targetOffset++] = source[sourceOffset++];
            }
            return true;
        }

        public static insertAt<T>(array: Array<T>, index: int, obj: T): void {
            array.push(obj);
            if (index < 0) {
                return;
            }
            for (let j: int = array.length - 1; j > index; --j) {
                obj = array[j];
                array[j] = array[j - 1];
                array[j - 1] = obj;
            }
        }

        public static removeAt<T>(array: Array<T>, index: int32): T {
            let last: int32 = array.length - 1;
            if (index > last) return null;
            let obj: T = array[index];
            for (let j: int32 = index; j < last; ++j) {
                array[j] = array[j + 1];
            }
            array.length = last;
            return obj;
        }

        // 移到数组尾部清除
        public static remove<T>(array: Array<T>, obj: T): int {
            let index: int32 = array.indexOf(obj);
            if (index === -1) {
                return -1;
            }

            let last: int32 = array.length - 1;
            for (let j: int32 = index; j < last; ++j) {
                array[j] = array[j + 1];
            }
            array.length = last;
            return index;
        }

        public static removeRange<T>(array: Array<T>, index: int, count: int, result: Array<T> = null): void {
            let last: int = array.length - count;
            if (index > last) {
                last = index;
            }

            if (result != null) {
                let size: int = (index + count) > array.length ? array.length : index + count;
                for (let i: int = index; i < size; ++i) {
                    result[i - index] = array[i];
                }
            }

            for (let j: int = index; j < last; ++j) {
                array[j] = array[j + count];
            }
            array.length = last;
        }

        public static removeAll<T>(array: Array<T>, obj: T): void {
            let index: int = 0;
            while ((index = array.indexOf(obj, index)) != -1) {
                let last: int = array.length - 1;
                for (let j: int = index; j < last; ++j) {
                    array[j] = array[j + 1];
                }
                array.length = last;
            }
        }

        /*
        根据索引不安全的移除一个元素，会破坏原来的顺序，只能对元素顺序没有要求的数组用
         */
        public static unsafeRemoveAt<T>(array: Array<T>, index: int32): T {
            let last: int32 = array.length - 1;
            if (index > last) return null;
            let obj: T = array[index];
            array[index] = array[last];
            array.length = last;
            return obj;
        }

        /*
        不安全的移除一个元素，会破坏原来的顺序，只能对元素顺序没有要求的数组用
         */
        public static unsafeRemove<T>(array: Array<T>, obj: T): int {
            let index: int32 = array.indexOf(obj);
            if (index === -1) {
                return -1;
            }

            let last: int32 = array.length - 1;
            array[index] = array[last];
            array.length = last;
            return index;
        }

        /*
        打乱数组
         */
        public static disturb<T>(array: Array<T>): Array<T> {
            let size = array.length;
            for (let i = size - 1; i >= 0; --i) {
                let upper = i + 1;
                let index = Math.floor(Math.random() * upper) % upper;
                if (i != index) {
                    let temp = array[i];
                    array[i] = array[index];
                    array[index] = temp;
                }
            }
            return array;
        }

        public static random<T>(array: Array<T>, offset: number = 0): T {
            let size = array.length - offset;
            let index = Math.floor(Math.random() * size) % size;
            return array[index + offset];
        }

        public static randomIndex<T>(array: Array<T>, offset: number = 0): uint {
            let size = array.length - offset;
            let index = Math.floor(Math.random() * size) % size;
            return index + offset;
        }

        public static reverse<T>(array: Array<T>): void {
            for (let l = 0, r = array.length - 1; l < r; ++l, --r) {
                let temp = array[l];
                array[l] = array[r];
                array[r] = temp;
            }
        }

        /**值类型相邻重复元素筛选 会改变原来数组*/
        public static removeRepetition<T>(array: Array<T>): void {
            if (!array || array.length <= 1) return;
            let tempIndex: number = 1;
            for (let i: int = 1; i < array.length; i++) {
                if (array[i] !== array[i - 1]) { //当前这个不等于上一个
                    array[tempIndex] = array[i];
                    tempIndex++;
                }
            }
            array.length = tempIndex;
        }

        public static binarySearch(t, e) {
            for (var i = 0, n = t.length - 1, r = 0, s = 0; i <= n;)
                if (0 < (s = e(t[r = i + n >> 1], r))) i = r + 1;
                else {
                    if (!(s < 0)) return r;
                    n = r - 1
                }
            return -1
        }

        public static binarySearchRange(t, e) {
            for (var i = 0, n = t.length - 1, r = i + n >> 1; i < n;) e(t[r], r) <= 0 ? n = r : i = r + 1, r = i + n >> 1;
            if (0 != e(t[r], r)) return null;
            for (var s = (i = 0) + (n = t.length - 1) + 1 >> 1; i < n;) e(t[s], s) < 0 ? n = s - 1 : i = s, s = i + n + 1 >> 1;
            return [r, s]
        }
    }
}