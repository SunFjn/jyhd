/** 自定义剪辑播放器，原生clip不支持未打包的大图播放，且图片不能裁剪空白，必须长宽固定*/


namespace modules.common {
    import Event = Laya.Event;
    import Handler = Laya.Handler;
    import Image = Laya.Image;
    import Component = Laya.Component;
    import Loader = Laya.Loader;
    import Texture = Laya.Texture;

    export class CustomClip extends Component {
        public static createAndPlay(skin: string, prefix: string, count: number, auto: boolean = true, loop: boolean = true, duration: number = 5): CustomClip {
            let clip = new CustomClip();
            clip.skin = skin;
            let urls = new Array<string>(count);
            for (let i = 0; i < count; ++i) {
                urls[i] = `${prefix}/${i}.png`;
            }
            clip.frameUrls = urls;
            clip.durationFrame = duration;
            clip.loop = loop;
            auto && clip.play();
            return clip;
        }

        public static thisPlay(eff: CustomClip): void {
            if (!eff) return;
            eff.visible = true;
            eff.play();
        }
        public static thisStop(eff: CustomClip): void {
            if (!eff) return;
            eff.visible = false;
            eff.stop();
        }

        private _img: Image;
        private _loaded: boolean;
        private _isPlaying: boolean;
        private _frameUrls: Array<string>;
        private _index: int;
        private _loop: boolean;
        private _durationFrame: int;
        private _count: int;

        // 皮肤（图集，如果没有图集，不用设置）
        private _skin: string;
        // 播放完成后是否自动删除（循环播放模式下无效）
        private _autoRemove: boolean;

        // private _signature: string;
        constructor() {
            super();

            this._img = new Image();
            this.addChild(this._img);

            this._loaded = false;
            this._isPlaying = false;
            this._index = 0;
            this._loop = true;
            this._durationFrame = 5;
            this._count = 1;
            this._autoRemove = false;

            this.on(Event.DISPLAY, this, this.displayHandler);
            this.on(Event.UNDISPLAY, this, this.undisplayHandler);

            this._skin = null;
            // this._signature = new Error().stack;
        }

        private displayHandler(): void {

        }

        private undisplayHandler(): void {
            this.stop();
        }

        public set skin(value: string) {
            if (this._skin == value) {
                return;
            }

            this.clearCache(1);
            if (this._skin) {
                Laya.loader.cancelLoadByUrl(this._skin);
            }

            this._skin = value;
            this._loaded = false;
            this.keepCache();
            Laya.loader.load(value, Handler.create(this, this.loadedHandler));

        }

        // 播放完成后是否自动删除（循环播放模式下无效）
        public get autoRemove(): boolean {
            return this._autoRemove;
        }

        public set autoRemove(value: boolean) {
            this._autoRemove = value;
        }

        public set durationFrame(value: int) {
            if (this._durationFrame == value) {
                return;
            }
            this._durationFrame = value;
            if (this._isPlaying) {
                Laya.timer.clear(this, this.loopHandler);
                Laya.timer.loop(this._durationFrame * (1000 / 60), this, this.loopHandler);
            }
        }

        public set frameUrls(value: Array<string>) {
            if (this._frameUrls == value) {
                return;
            } else if (value && this._frameUrls) {
                if (this._frameUrls.length == value.length) {
                    let has = true;
                    for (let i = 0, length = value.length; i < length; ++i) {
                        if (this._frameUrls[i] !== value[i]) {
                            has = false;
                            break;
                        }
                    }
                    if (has) {
                        return;
                    }
                }
            }

            this.clearCache(2);

            this._frameUrls = value;
            if (!this._skin) {
                this._loaded = false;
                this.keepCache();
                Laya.loader.load(value, Handler.create(this, this.loadedHandler));
            }
            if (this._loaded && this._frameUrls && this._frameUrls.length > 0) {
                let texture: Texture = Loader.getRes(this._frameUrls[0]);
                this.width = texture.sourceWidth;
                this.height = texture.sourceHeight;
            }
        }

        private keepCache(): void {
            if (this._skin != null) {
                Laya.Loader.keepCache(this, this._skin);
            } else {
                if (this._frameUrls) {
                    for (let url of this._frameUrls) {
                        Laya.Loader.keepCache(this, url);
                    }
                }
            }
        }

        private clearCache(type: number = 3): void {
            if (this._skin != null) {
                if ((type & 0x01) != 0) {
                    Laya.Loader.clearCache(this, this._skin);
                }
            } else if (this._frameUrls != null && (type & 0x02) != 0) {
                for (let url of this._frameUrls) {
                    Laya.Loader.clearCache(this, url);
                }
            }
        }

        public set loop(value: boolean) {
            this._loop = value;
        }

        private loadedHandler(): void {
            if (this.destroyed) return;
            this._loaded = true;

            if (this._frameUrls && this._frameUrls.length > 0) {
                let texture: Texture = Loader.getRes(this._frameUrls[0]);
                if (texture) {
                    this.width = texture.sourceWidth;
                    this.height = texture.sourceHeight;
                }
            }
            this.event(Event.LOADED);
            this.loopHandler();
        }

        public play(): void {
            if (this._isPlaying) {
                this.stop();
            }
            this._isPlaying = true;
            this._count = 1;
            this._index = 0;
            Laya.timer.loop(this._durationFrame * (1000 / 60), this, this.loopHandler);
            this.loopHandler();
        }

        public stop(): void {
            // 停在第一帧
            this._count = 1;
            this._index = 0;
            this.loopHandler();
            this._isPlaying = false;
            Laya.timer.clear(this, this.loopHandler);
        }

        // 暂停
        public pause(): void {
            if (!this._isPlaying) {
                return;
            }
            this._isPlaying = false;
            Laya.timer.clear(this, this.loopHandler);
        }

        // 继续
        public resume(): void {
            if (this._isPlaying) {
                return;
            }
            this._isPlaying = true;
            Laya.timer.loop(this._durationFrame * (1000 / 60), this, this.loopHandler);
            this.loopHandler();
        }

        public destroy(destroyChild?: boolean): void {
            this.clearCache();
            Laya.timer.clear(this, this.loopHandler);
            this.off(Event.DISPLAY, this, this.displayHandler);
            this.off(Event.UNDISPLAY, this, this.undisplayHandler);
            super.destroy(destroyChild);
        }

        private loopHandler(): void {
            if (!this._frameUrls || this._frameUrls.length === 0 || !this._loaded) return;
            this._img.skin = this._frameUrls[this._index];
            if (!this._isPlaying) return;
            // console.log(".............." + this._index);
            // if (this._count % this._durationFrame === 0) {
            //     this._count = 0;
            //     this._index++;
            //     if (this._index === this._frameUrls.length) {
            //         if (this._loop) {
            //             this._index = 0;
            //         } else {
            //             Laya.timer.clear(this, this.loopHandler);
            //             this.event(Event.COMPLETE);
            //             // this.stop();
            //             // 播放完自动删除
            //             if (this._autoRemove) this.removeSelf();
            //         }
            //     }
            // }
            // this._count++;

            this._index++;
            if (this._index === this._frameUrls.length) {
                if (this._loop) {
                    this._index = 0;
                } else {
                    Laya.timer.clear(this, this.loopHandler);
                    this.event(Event.COMPLETE);
                    // this.stop();
                    // 播放完自动删除
                    if (this._autoRemove) this.removeSelf();
                }
            }
        }
    }
}