namespace utils {
    export class TableUtils {
        /**
         * 获取所有键
         * @param table
         * @param array
         */
        public static keys<T>(table: Table<T>, array?: Array<string>): Array<string> {
            if (array == null) {
                array = [];
            } else {
                array.length = 0;
            }

            for (let key in table) {
                array.push(key);
            }

            return array;
        }

        /**
         * 获取所有值
         * @param table
         * @param array
         */
        public static values<T>(table: Table<T>, array?: Array<T>): Array<T> {
            if (array == null) {
                array = [];
            } else {
                array.length = 0;
            }

            for (let key in table) {
                array.push(table[key]);
            }

            return array;
        }

        /**
         * 获取所有的键值对
         * @param table
         * @param array
         */
        public static entries<T>(table: Table<T>, array?: Array<[string, T]>): Array<[string, T]> {
            if (array == null) {
                array = [];
            } else {
                array.length = 0;
            }

            for (let key in table) {
                array.push([key, table[key]]);
            }

            return array;
        }

        /**
         * 判断是否为空
         * @param table
         */
        public static isEmpty<T>(table: Table<T>): boolean {
            for (let key in table) {
                return false;
            }
            return true;
        }

        /**
         * 清空
         * @param table
         */
        public static clear<T>(table: Table<T>): void {
            for (let key in table) {
                delete table[key];
            }
        }
    }
}