///<reference path="../assets/handle_pool.ts"/>
///<reference path="../assets/recover_queue.ts"/>

namespace base.textures {
    import RecoverQueue = base.assets.RecoverQueue;
    import Resource = Laya.Resource;
    import Size = Laya.Size;
    import BaseTexture = Laya.BaseTexture;
    import LayaEvent = modules.common.LayaEvent;
    import Unit = utils.Unit;

    const TextureCacheTimeout = 5 * Unit.minute;

    let NullTexture = new Laya.SolidColorTexture2D(new Laya.Vector4(0, 0, 0, 0));
    NullTexture.lock = true;

    export class LayaTexture2D extends Laya.DataTexture2D {
        static load(url: string, priority: number = 0, args: any = null): LayaTexture2D {
            let cache = Resource.getResourceByURL(url) as LayaTexture2D;
            if (cache != null) {
                return cache;
            }
            let result = new LayaTexture2D(priority);
            if (args != null) {
                if (args.wrapModeU)
                    result._wrapModeU = args.wrapModeU;
                if (args.wrapModeV)
                    result._wrapModeV = args.wrapModeV;
            }
            result._loaded = false;
            result._setUrl(url);
            Laya.loader.cacheRes(url, result);
            ResourcePool.instance.load(url, result.onResourceComplete, priority);
            return result;
        }

        private _isComplete: boolean;
        private readonly _priority: number;
        private _isRecover: boolean;

        protected constructor(priority: number) {
            super();
            this._isComplete = false;
            this._priority = priority;
            this._isRecover = false;
        }

        private onResourceComplete = (url: string, handle: number, buffer: ArrayBuffer): void => {
            this._isComplete = true;
            if (buffer == null) {
                this.event(LayaEvent.ERROR);
                // console.log(`Load failure: ${url}`);
                return;
            }
            let view = new DataView(buffer);
            this.resetResource(new Uint8Array(buffer, 8), view.getUint32(0), view.getUint32(4));
        };

        private resetResource(buffer: ArrayBuffer, w: int32, h: int32): void {
            this._buffer = buffer;
            this._width = w;
            this._height = h;
            this._mipmap = false;
            this._magFifter = Laya.WebGLContext.LINEAR;
            this._minFifter = Laya.WebGLContext.LINEAR;
            this._size = new Size(this._width, this._height);
            this._endLoaded();
            this.activeResource();
            this._buffer = null;
        }

        _addReference(): void {
            if (this._isRecover) {
                this._isRecover = false;
                RecoverQueue.default.removeToQueue(this.url);
                if (!this._isComplete) {
                    ResourcePool.instance.load(this.url, this.onResourceComplete, this._priority);
                }
            }
            super._addReference();
        }

        _removeReference(): void {
            super._removeReference();
            if (this.referenceCount <= 0) {
                if (!this._isComplete) {
                    ResourcePool.instance.cancel(this.url, this.onResourceComplete);
                }
                this._isRecover = true;
                RecoverQueue.default.addToQueue(this.url, this.width * this.height * 4, (url: string): void => {
                    let cache = Resource.getResourceByURL(url) as LayaTexture2D;
                    if (cache != null) {
                        cache.destroy();
                    }
                }, TextureCacheTimeout);
            }
        }

        public destroy(): void {
            if (!this._isComplete) {
                ResourcePool.instance.cancel(this.url, this.onResourceComplete);
            }
            super.destroy();
        }

        public get defaulteTexture(): BaseTexture {
            return NullTexture;
        }
    }
}
