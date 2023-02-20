/** 加载面板（白色） */

namespace modules.loading {
    import Sprite = Laya.Sprite;
    import CustomClip = modules.common.CustomClip;

    export class LoadingWhitePanel extends BaseView {
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
            this._bg.alpha = 0.8;

            this._clip = new CustomClip();
            this._clip.skin = "assets/effect/loading_white.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0, len: int = 8; i < len; i++) {
                arr[i] = `loading_white/${i}.png`;
            }
            this._clip.frameUrls = arr;
            this.addChild(this._clip);
            this._clip.centerX = 0;
            this._clip.centerY = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resizeHandler);

            this.resizeHandler();

            this._clip.play();
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.RESIZE_UI, this, this.resizeHandler);

            this._clip.stop();
        }

        protected resizeHandler(): void {
            this.width = this._bg.width = CommonConfig.viewWidth;
            this.height = this._bg.height = CommonConfig.viewHeight;
            this._bg.graphics.clear();
            this._bg.graphics.drawRect(0, 0, this.width, this.height, "#000000");
        }
    }
}