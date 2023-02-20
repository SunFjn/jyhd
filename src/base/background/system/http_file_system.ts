namespace base.background.system {
    type LoadVersionDBCallback = (error: number) => void;
    type ReadCallback = (url: string, status: uint, buffer: ArrayBuffer, args: Array<ArrayBuffer>) => void;

    const enum HttpFileStatus {
        Wait = 0,
        Loading = 1,
        NeedDependency = 2
    }

    class HttpFileEntry {
        private static _freeEntry: HttpFileEntry;

        public static allocEntry(): HttpFileEntry {
            let result: HttpFileEntry;
            if (HttpFileEntry._freeEntry != null) {
                result = this._freeEntry;
                this._freeEntry = this._freeEntry.next;
            } else {
                result = new HttpFileEntry();
            }
            result.live = 0;
            result.uncompress = 0;
            return result;
        }

        public static freeEntry(entry: HttpFileEntry): void {
            entry.callback = null;
            entry.request = null;
            entry.request = null;

            if (entry.dependencyUrls != null) {
                entry.dependencyUrls.length = 0;
            }

            // if (entry.dependencyBuffers != null) {
            //     entry.dependencyBuffers.length = 0;
            // }
            entry.dependencyBuffers = null;

            entry.next = this._freeEntry;
            HttpFileEntry._freeEntry = entry;
        }

        public url: string;
        public request: XMLHttpRequest;
        public uncompress: uint;
        public live: int;
        public callback: ReadCallback;
        public status: HttpFileStatus;
        public startTime: number;

        public dependencyUrls: Array<string>;
        public dependencyBuffers: Array<ArrayBuffer>;

        private next: HttpFileEntry;
    }

    export class HttpFileSystem {
        private static readonly _processorQueue: Array<XMLHttpRequest> = new Array<XMLHttpRequest>();
        private static readonly _liveLimit: number = 3;
        private static readonly _loaderPool: Table<HttpFileEntry> = {};
        private static _versionPool: Table<number> = {};
        private static _versionDBStatus: number = 0;
        private static _enableCheck: boolean;
        private static _host: string;

        public static init(host: string, enableCheck: boolean, callback: LoadVersionDBCallback): void {
            if (host != "" && host[host.length - 1] != "/") {
                host += "/";
            }
            this._host = host;
            this._enableCheck = enableCheck;

            if (HttpFileSystem._versionDBStatus != 0) {
                return;
            }

            HttpFileSystem._versionDBStatus = 1;
            let entry = HttpFileSystem.createEntry("brother.big", 1, (url: string, status: uint, buffer: ArrayBuffer) => {
                if (buffer == null) {
                    callback(status)
                }

                if (HttpFileSystem._enableCheck) {
                    HttpFileSystem._versionPool = msgpack.decode(new Zlib.Inflate(new Uint8Array(buffer)).decompress());
                }
                HttpFileSystem._versionDBStatus = 2;

                for (let url in HttpFileSystem._loaderPool) {
                    let entry = HttpFileSystem._loaderPool[url];
                    HttpFileSystem.triggerEntry(entry);
                }

                callback(0);
            });
            HttpFileSystem.openEntry(entry);
        }

        private static fromCache(url: string, version: number, buffer: ArrayBuffer): void {
            if (buffer != null) {
                if (HttpFileSystem._versionPool[url] == version) {
                    HttpFileSystem.onComplete(url, 0, buffer);
                    return;
                }
            }
            let entry = HttpFileSystem._loaderPool[url];
            HttpFileSystem.openEntry(entry);
        }

        private static triggerEntry(entry: HttpFileEntry): void {
            let url = entry.url;
            if (HttpFileSystem._versionPool[url] != null) {
                IndexedDBCache.readCache(url, HttpFileSystem.fromCache);
            } else {
                HttpFileSystem.openEntry(entry);
            }
        }

        public static read(url: string, uncompress: uint, callback: ReadCallback): void {
            let entry = HttpFileSystem._loaderPool[url];
            if (entry != null) {
                return;
            }

            entry = HttpFileSystem.createEntry(url, uncompress, callback);
            if (HttpFileSystem._versionDBStatus != 2) {
                return;
            }
            HttpFileSystem.triggerEntry(entry);
        }

        private static createEntry(url: string, uncompress: uint, callback: ReadCallback): HttpFileEntry {
            let entry = HttpFileEntry.allocEntry();
            entry.url = url;
            entry.uncompress = uncompress;
            entry.live = HttpFileSystem._liveLimit;
            entry.callback = callback;
            entry.status = HttpFileStatus.Wait;
            HttpFileSystem._loaderPool[url] = entry;

            return entry;
        }

        private static openEntry(entry: HttpFileEntry): void {
            if (entry.status != HttpFileStatus.Wait) {
                return;
            }
            entry.startTime = Date.now();
            // if (HttpFileSystem.needDependency(entry)) {
            //     return;
            // }

            let url = entry.url;
            entry.status = HttpFileStatus.Loading;
            let request = entry.request = HttpFileSystem._processorQueue.length != 0 ? HttpFileSystem._processorQueue.pop() : new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request.onreadystatechange = (e: Event) => {
                let request: XMLHttpRequest = (e.target as XMLHttpRequest);
                if (request.readyState != 4) {
                    return;
                }
                if (request.status == 200 || (request.status == 0 && request.response != null && request.response.byteLength > 0)) {
                    if (HttpFileSystem._versionPool[url] != null) {
                        IndexedDBCache.writeCache(url, HttpFileSystem._versionPool[url], request.response);
                    }
                    HttpFileSystem.onComplete(url, request.status, request.response);
                } else {
                    if (--entry.live == 0) {
                        HttpFileSystem.onComplete(url, request.status, null);
                    } else {
                        request.abort();
                        let version = HttpFileSystem._versionPool[url] || Date.now();
                        request.open("GET", `${HttpFileSystem._host}${url}?v=${version}`);
                        request.send();
                    }
                }
            };
            let version = HttpFileSystem._versionPool[url] || Date.now();
            request.open("GET", `${HttpFileSystem._host}${url}?v=${version}`);
            request.send();
        }

        // private static needDependency(entry: HttpFileEntry): boolean {
        //     let name = entry.url;
        //     if (name.lastIndexOf(".til") != (name.length - 4)) {
        //         return false;
        //     }
        //
        //     entry.status = HttpFileStatus.NeedDependency;
        //
        //     if (entry.dependencyUrls == null) {
        //         entry.dependencyUrls = [];
        //     }
        //     entry.dependencyUrls.push(entry.url.replace(".til", "_a.bin"));
        //     entry.dependencyUrls.push(entry.url.replace(".til", ".jpg"));
        //
        //     if (entry.dependencyBuffers == null) {
        //         entry.dependencyBuffers = [];
        //     }
        //
        //     let request = entry.request = HttpFileSystem._processorQueue.length != 0 ? HttpFileSystem._processorQueue.pop() : new XMLHttpRequest();
        //     request.responseType = "arraybuffer";
        //     request.onreadystatechange = (e: Event) => {
        //         let request: XMLHttpRequest = (e.target as XMLHttpRequest);
        //         if (request.readyState != 4) {
        //             return;
        //         }
        //         if (request.status == 200 || (request.status == 0 && request.response != null)) {
        //             let url = entry.dependencyUrls[entry.dependencyUrls.length - 1];
        //             if (HttpFileSystem._versionPool[url] != null) {
        //                 IndexedDBCache.writeCache(entry.url, HttpFileSystem._versionPool[url], request.response);
        //             }
        //             entry.dependencyBuffers.push(request.response);
        //             entry.dependencyUrls.pop();
        //             if (entry.dependencyUrls.length == 0) {
        //                 HttpFileSystem.onComplete(entry.url, 0, null);
        //             } else {
        //                 let url = entry.dependencyUrls[entry.dependencyUrls.length - 1];
        //                 let version = HttpFileSystem._versionPool[url] || Date.now();
        //                 entry.live = HttpFileSystem._liveLimit;
        //                 request.open("GET", `${HttpFileSystem._host}${url}?v=${version}`);
        //                 request.send();
        //             }
        //         } else {
        //             if (--entry.live == 0) {
        //                 entry.dependencyBuffers.length = 0;
        //                 entry.dependencyUrls.length = 0;
        //                 HttpFileSystem.onComplete(entry.url, request.status, null);
        //             } else {
        //                 request.abort();
        //                 let url = entry.dependencyUrls[entry.dependencyUrls.length - 1];
        //                 let version = HttpFileSystem._versionPool[url] || Date.now();
        //                 request.open("GET", `${HttpFileSystem._host}${url}?v=${version}`);
        //                 request.send();
        //             }
        //         }
        //     };
        //
        //     let url = entry.dependencyUrls[entry.dependencyUrls.length - 1];
        //     let version = HttpFileSystem._versionPool[url] || Date.now();
        //     request.open("GET", `${HttpFileSystem._host}${url}?v=${version}`);
        //     request.send();
        //
        //     return true;
        // }

        private static onComplete(url: string, status: uint, buffer: ArrayBuffer): void {
            let entry = HttpFileSystem._loaderPool[url];
            delete HttpFileSystem._loaderPool[url];

            let callback = entry.callback;
            if (entry.request != null) {
                entry.request.abort();
                HttpFileSystem._processorQueue.push(entry.request);
            }
            status = buffer ? 200 : 404;
            callback(url, status, buffer, entry.dependencyBuffers);
            HttpFileEntry.freeEntry(entry);
        }
    }
}
