///<reference path="../assets/asset_pool_base.ts"/>
///<reference path="lwjs_avatar_parser.ts"/>

namespace base.mesh {
    import AssetEntry = base.assets.AssetEntry;
    import AssetPoolBase = base.assets.AssetPoolBase;
    import Unit = utils.Unit;

    export class MeshDataPool extends AssetPoolBase {
        private static _instance: MeshDataPool = new MeshDataPool();

        public static get instance(): MeshDataPool {
            return MeshDataPool._instance;
        }

        protected constructor() {
            super("MeshDataPool", 5 * Unit.MB);
        }

        public load(url: string, callback: (url: string, handle: number, res: MeshData) => void): void {
            let entry: AssetEntry = this.checkNeedLoad(url, callback, false);
            if (entry == null) {
                return;
            }

            if (entry.status == 0) {
                entry.status = 1;
                ResourcePool.instance.load(url, this.onResourceComplete, 0, false, false, 1);
            }
        }

        protected doRecover = (entry: AssetEntry): void => {
            let mesh: MeshData = entry.res;
            mesh.destroy();
        };

        public cancel(url: string, callback: (url: string, handle: number, res: MeshData) => void): void {
            let entry: AssetEntry = this.findNeedCancelEntry(url, callback);
            if (entry == null) {
                return;
            }

            ResourcePool.instance.cancel(url, this.onResourceComplete);
            delete this._waitPool[url];
            AssetEntry.freeEntry(entry);
        }

        private onResourceComplete = (url: string, handle: number, res: ArrayBuffer): void => {
            if (res == null) {
                this.onComplete(url, null, 0);
            } else {
                let mesh = MeshData.create(res);
                this.onComplete(url, mesh, res.byteLength);
            }
        };
    }
}