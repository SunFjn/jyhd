///<reference path="../assets/asset_pool_base.ts"/>

namespace base.textures {
    import AssetEntry = base.assets.AssetEntry;
    import AssetPoolBase = base.assets.AssetPoolBase;
    import Unit = utils.Unit;

    class BufferTexture extends Laya.DataTexture2D {
        constructor(buffer: ArrayBuffer) {
            super();
            let view = new DataView(buffer);
            this.resetResource(new Uint8Array(buffer, 8), view.getUint32(0), view.getUint32(4));
        }

        private resetResource(buffer: ArrayBuffer, w: int32, h: int32): void {
            this._buffer = buffer;
            this._width = w;
            this._height = h;
            this._mipmap = false;
            this._magFifter = Laya.WebGLContext.NEAREST;
            this._minFifter = Laya.WebGLContext.NEAREST;
            this._size = new Laya.Size(this._width, this._height);
            this._endLoaded();
            this.activeResource();
            this._buffer = null;
        }
    }

    export class TexturePool extends AssetPoolBase {
        private static _instance = new TexturePool();

        public static get instance(): TexturePool {
            return TexturePool._instance;
        }

        protected constructor() {
            super("TexturePool", 64 * Unit.MB, 5 * Unit.minute);
        }

        public load(url: string, callback: (url: string, handle: number, res: Laya.BaseTexture) => void, priority: number = 0): void {
            let entry: AssetEntry = this.checkNeedLoad(url, callback, false);
            if (!entry) {
                return;
            }

            if (entry.status == 0) {
                entry.status = 1;
                ResourcePool.instance.load(url, this.onResourceComplete, priority);
            }
        }

        public cancel(url: string, callback: (url: string, handle: number, res: Laya.BaseTexture) => void): void {
            let entry: AssetEntry = this.findNeedCancelEntry(url, callback);
            if (entry == null) {
                return;
            }

            ResourcePool.instance.cancel(url, this.onResourceComplete);
            delete this._waitPool[url];
            AssetEntry.freeEntry(entry);
        }

        protected doRecover = (entry: AssetEntry): void => {
            let res: BufferTexture = entry.res;
            res.destroy();
        };

        private onResourceComplete = (url: string, handle: number, buffer: ArrayBuffer): void => {
            if (buffer == null) {
                this.onComplete(url, null, 0);
            } else {
                let res = new BufferTexture(buffer);
                this.onComplete(url, res, buffer.byteLength);
            }
        }
    }
}