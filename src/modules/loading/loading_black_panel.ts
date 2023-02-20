/** 加载面板(黑色)*/


namespace modules.loading {
    import CustomClip = modules.common.CustomClip;
    import Sprite = Laya.Sprite;

    export class LoadingBlackPanel extends BaseView {
        private _bg: Sprite;
        private _clip: CustomClip;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._clip) {
                this._clip.removeSelf();
                this._clip.destroy();
                this._clip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._bg = new Sprite();
            this.addChild(this._bg);
            this._bg.alpha = 0;

            this._clip = new CustomClip();
            this._clip.skin = "assets/effect/loading_black.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0, len: int = 8; i < len; i++) {
                arr[i] = `loading_black/${i}.png`;
            }
            this._clip.frameUrls = arr;
            this.addChild(this._clip);
            this._clip.scale(2, 2, true);
            this._clip.centerX = 0;
            this._clip.centerY = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resizeHandler);
            this.addAutoListener(this._bg, Laya.Event.CLICK, this, this.bgClickHandler);

            this.resizeHandler();

            this._clip.play();
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.RESIZE_UI, this, this.resizeHandler);

            this._clip.stop();
        }

        private bgClickHandler(): void {
            // console.log("..........................aaaaaa");
        }

        protected resizeHandler(): void {
            this.width = CommonConfig.viewWidth;
            this.height = CommonConfig.viewHeight;
            this._bg.width = CommonConfig.viewWidth;
            this._bg.height = CommonConfig.viewHeight;
            this._bg.graphics.clear();
            this._bg.graphics.drawRect(0, 0, this.width, this.height, "#ff0000");
            // this._bg.pos((720 - CommonConfig.viewWidth) * 0.5, (1280 - CommonConfig.viewHeight) * 0.5, true);
        }
    }
}