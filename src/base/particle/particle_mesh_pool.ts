///<reference path="../assets/asset_pool_base.ts"/>

namespace base.mesh {
    import AssetEntry = base.assets.AssetEntry;
    import AssetPoolBase = base.assets.AssetPoolBase;

    // class SnowflakeParticleMesh extends Laya.Mesh {
    //     static load(url: string): SnowflakeParticleMesh {
    //         return Laya.loader.create(url, null, null, SnowflakeParticleMesh);
    //     }
    // }

    export class ParticleMeshPool extends AssetPoolBase {
        private static _instance = new ParticleMeshPool();

        public static get instance(): ParticleMeshPool {
            return ParticleMeshPool._instance;
        }

        protected constructor() {
            super("ParticleMeshPool", 10);
        }

        public load(url: string, callback: (url: string, handle: number, res: Laya.Mesh) => void): void {
            let entry: AssetEntry = this.checkNeedLoad(url, callback, false);
            if (entry == null) {
                return;
            }

            if (entry.status == 0) {
                entry.status = 1;
                let res = Laya.Mesh.load(url);
                entry.res = res;
                if (res.loaded) {
                    this.onResourceComplete(url, res);
                } else {
                    res.once(Laya.Event.LOADED, this, this.onResourceComplete, [url, res]);
                }
            }
        }

        public cancel(url: string, callback: (url: string, handle: number, res: Laya.Mesh) => void): void {
            let entry: AssetEntry = this.findNeedCancelEntry(url, callback);
            if (entry == null) {
                return;
            }

            entry.res.off(Laya.Event.LOADED, this, this.onResourceComplete);
            delete this._waitPool[url];
            AssetEntry.freeEntry(entry);
        }

        protected doRecover = (entry: AssetEntry): void => {
            let res: Laya.Mesh = entry.res;
            res.destroy();
        };

        private onResourceComplete = (url: string, res: Laya.Mesh): void => {
            if (res == null) {
                this.onComplete(url, null, 0);
            } else {
                this.onComplete(url, res, 1);
            }
        };
    }
}