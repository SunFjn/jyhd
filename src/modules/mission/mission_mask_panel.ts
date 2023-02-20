/** 天关遮罩面板*/


namespace modules.mission {
    import MissionMaskViewUI = ui.MissionMaskViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;

    export class MissionMaskPanel extends MissionMaskViewUI {
        private _lvClipTween: TweenJS;
        private _tween: TweenJS;


        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;
            this.layer = Layer.CITY_LAYER;


            this._lvClipTween = TweenJS.create(this.lvClip).yoyo(true);
            this._tween = TweenJS.create(this).to({ alpha: 0 }, 500).delay(1500).onComplete(this.close.bind(this));
        }


        protected addListeners(): void {
            super.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();
            this.alpha = 1;
            this.lvClip.value = MissionModel.instance.curLv.toString();

            if (this.lvClip.value) {
                let len = this.lvClip.value.length
                switch (len) {
                    case 1:
                    case 2:
                        this.preTxt.x = 201;
                        this.lastTxt.x = 458;
                        break;
                    case 3:
                        this.preTxt.x = 170;
                        this.lastTxt.x = 490;
                        break;
                    case 4:
                        this.preTxt.x = 155;
                        this.lastTxt.x = 500;
                        break;
                    case 5:
                        this.preTxt.x = 136;
                        this.lastTxt.x = 523;
                        break;
                    default:
                        break;
                }
            }

            this.lvClip.value.length
            this.lvClip.scaleX = 0.8;
            this.lvClip.scaleY = 0.8;
            this._lvClipTween.to({ scaleX: 1.2, scaleY: 1.2 }, 400).start();
            this._tween.start();
        }

        public close(): void {
            this._tween.stop();
            this._lvClipTween.stop();
            super.close();
        }


    }
}