namespace modules.common {
    import Loader = Laya.Loader;

    export class AtlasImage extends Laya.Image {
        private _atlas: string;

        public get atlas(): string {
            return this._atlas || null;
        }

        public set atlas(value: string) {
            if (this._atlas != value) {
                Loader.clearCache(this, this._atlas);
                this._atlas = value;
                if (value) {
                    Loader.keepCache(this, this._atlas);
                    let source = Loader.getRes(value);
                    if (source && this._skin) {
                        let source = Loader.getRes(this._skin);
                        if (source) {
                            this.source = source;
                            this.onCompResize();
                        }
                    } else Laya.loader.load(this._atlas, Handler.create(this, this.setSource, [this._atlas]));
                } else {
                    this.source = null;
                }
            }
        }

        protected setSource(url: string, img?: any): void {
            if (url === this._atlas) {
                if (img && this._skin) {
                    let source = Loader.getRes(this._skin);
                    if (source) {
                        this.source = source;
                        this.onCompResize();
                    }
                }
            }
        }

        public set skin(value: string) {
            if (this._skin != value) {
                Loader.clearCache(this, this._skin);
                this._skin = value;
                if (value) {
                    Loader.keepCache(this, this._skin);
                    let source = Loader.getRes(value);
                    if (source) {
                        this.source = source;
                        this.onCompResize();
                    }
                } else {
                    this.source = null;
                }
            }
        }

        public destroy(destroyChild?: boolean): void {
            super.destroy(true);
            Loader.clearCache(this, this._atlas);
        }
    }
}
