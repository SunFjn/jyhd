namespace base.background.system {
    type InitCallback = (error: number) => void;

    export class IndexedDBCache {
        private static db: IDBDatabase;
        private static initCallback: InitCallback;
        private static enableCache: boolean;

        private static openOnSuccess(event: Event): void {
            let request = <IDBOpenDBRequest>event.target;
            IndexedDBCache.db = request.result;
            if (!IndexedDBCache.db.objectStoreNames.contains("cache")) {
                IndexedDBCache.db.createObjectStore("cache", {keyPath: "url"});
            }
            IndexedDBCache.initCallback(0);
        }

        private static openOnUpgradeNeeded(event: Event): void {
            let request = <IDBOpenDBRequest>event.target;
            IndexedDBCache.db = request.result;
            if (!IndexedDBCache.db.objectStoreNames.contains("cache")) {
                IndexedDBCache.db.createObjectStore("cache", {keyPath: "url"});
            }
            IndexedDBCache.initCallback(0);
        }

        private static openOnError(event: Event): void {
            IndexedDBCache.initCallback(1);
        }

        public static initCache(enableCache: boolean, callback: InitCallback): void {
            IndexedDBCache.enableCache = enableCache;
            if (IndexedDBCache.enableCache) {
                try {
                    let request = indexedDB.open("routine");
                    IndexedDBCache.initCallback = callback;
                    request.onsuccess = IndexedDBCache.openOnSuccess;
                    request.onupgradeneeded = IndexedDBCache.openOnUpgradeNeeded;
                    request.onerror = IndexedDBCache.openOnError;
                } catch (e) {
                    callback(1);
                }
            } else {
                callback(0);
            }
        }

        public static writeCache(url: string, version: number, buffer: ArrayBuffer): void {
            if (IndexedDBCache.db == null) {
                return;
            }

            try {
                let store = IndexedDBCache.db.transaction("cache", "readwrite").objectStore("cache");
                store.put({url: url, version: version, value: buffer});
            } catch (e) {

            }
        }

        public static readCache(url: string, callback: (url: string, version: number, buffer: ArrayBuffer) => void): void {
            if (IndexedDBCache.db == null) {
                callback(url, 0, null);
                return;
            }

            try {
                let store = IndexedDBCache.db.transaction("cache").objectStore("cache");
                let request = store.get(url);
                request.onerror = function (event: Event) {
                    callback(url, 0, null);
                };

                request.onsuccess = function (event: Event) {
                    if (request.result) {
                        callback(url, request.result.version, request.result.value);
                    } else {
                        callback(url, 0, null);
                    }
                };
            } catch (e) {
                callback(url, 0, null);
            }
        }
    }
}