///<reference path="../assets/asset_pool_base.ts"/>
///<reference path="lwjs_avatar_parser.ts"/>

namespace base.mesh {
    import Unit = utils.Unit;

    export class AnimationDataPool extends base.assets.AssetPoolBase {
        private static _instance: AnimationDataPool = new AnimationDataPool();

        public static get instance(): AnimationDataPool {
            return AnimationDataPool._instance;
        }

        protected constructor() {
            super("AnimationDataPool", 10 * Unit.MB);
        }

        public load(url: string, callback: (url: string, handle: number, res: AnimationData) => void): void {
            let entry = this.checkNeedLoad(url, callback, false);
            if (entry == null) {
                return;
            }

            if (entry.status == 0) {
                entry.status = 1;
                ResourcePool.instance.load(url, this.onResourceComplete, 0, false, false, 1);
            }
        }

        public cancel(url: string, callback: (url: string, handle: number, res: AnimationData) => void): void {
            let entry = this.findNeedCancelEntry(url, callback);
            if (entry == null) {
                return;
            }

            ResourcePool.instance.cancel(url, this.onResourceComplete);
            delete this._waitPool[url];
            base.assets.AssetEntry.freeEntry(entry);
        }

        private onResourceComplete = (url: string, handle: number, res: ArrayBuffer): void => {
            if (res == null) {
                this.onComplete(url, null, 0);
            } else {
                let animation = AnimationData.create(res);
                this.onComplete(url, animation, res.byteLength);
            }
        };
    }
}
