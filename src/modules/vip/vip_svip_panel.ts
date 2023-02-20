///<reference path="../config/onhook_income_cfg.ts"/>
namespace modules.vip {
    import VIPAndSVIPUpViewUI = ui.VIPAndSVIPUpViewUI;
    import Point = laya.maths.Point;
    import TweenGroup = utils.tween.TweenGroup;
    import Event = Laya.Event;
    import Layer = ui.Layer;

    export class VIPAndSVIPUpView extends VIPAndSVIPUpViewUI {
        private _tweenGroup: TweenGroup;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;
            this.layer = Layer.EFFECT_LAYER;
            this._tweenGroup = new TweenGroup();
        }

        private loadedHandler(): void {
            this.resizeHandler();
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resizeHandler);
            this.addAutoListener(this.maskImg, Event.CLICK, this, () => {
            });//这个背景绑事件 是为了防止遮罩过程中 点击UI

        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.RESIZE_UI, this, this.resizeHandler);
            Laya.timer.clear(this, this.itemEffect);
        }

        protected onOpened(): void {
            super.onOpened();
            this.alpha = 1;
            this.resizeHandler();
            // LayerManager.instance.addToCityLayer(this.vipBox);
            this.vipBox.pos(360, 640);
            this.vipBox.scale(1, 1);
            this.tipText.visible = this.maskImg.visible = true;
            this.updateLv();
            Laya.timer.once(800, this, this.itemEffect);
        }

        private updateLv(): void {
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                this.vipBtn.skin = 'left_top/btn_zjm_svip.png';
                this.vipNum.value = `${modules.vip.VipModel.instance.vipLevel}`;
            } else {
                this.vipBtn.skin = 'left_top/btn_zjm_vip.png';
                let vipLevel = modules.vip_new.VipNewModel.instance.getVipLevelTrue();
                this.vipNum.value = `${vipLevel}`;
            }
        }

        protected resizeHandler(): void {
            this.maskImg.width = CommonConfig.viewWidth;
            this.maskImg.height = CommonConfig.viewHeight;
            this.maskImg.alpha = 0.8;
            let offsetX: number = (CommonConfig.viewWidth - 720) / 2;
            let offsetY: number = (CommonConfig.viewHeight - 1280) / 2;
            this.maskImg.x = -offsetX;
            this.maskImg.y = -offsetY;
        }

        public destroy(destroyChild: boolean = true): void {
            this._tweenGroup = this.destroyElement(this._tweenGroup);
            super.destroy(destroyChild);

        }

        public close(): void {
            this._tweenGroup.removeAll();
            super.close();
        }

        public itemEffect(): void {
            // LayerManager.instance.addToEffectLayer(this.vipBox);
            this.maskImg.visible = false;
            let spr: Point = modules.action_preview.actionPreviewModel.instance.getPosSprite(ActionOpenId.vip);
            if (spr) {
                Point.TEMP.setTo(spr.x, spr.y);
                this.globalToLocal(Point.TEMP);
                let destinX = Point.TEMP.x;
                let destinY = Point.TEMP.y;
                TweenJS.create(this.vipBox, this._tweenGroup).to({
                    scaleX: 1.5,
                    scaleY: 1.5
                }, 400).onComplete((): void => {
                    TweenJS.create(this.vipBox, this._tweenGroup).to({
                        scaleX: 1.1,
                        scaleY: 1.1
                    }, 400).onComplete((): void => {
                        TweenJS.create(this.vipBox, this._tweenGroup).to({
                            x: destinX,
                            y: destinY,
                            scaleX: 0.2,
                            scaleY: 0.2
                        }, 600).onComplete((): void => {
                            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_ENTER);
                            this.close();
                        }).start()
                    }).start()
                }).start()
            } else {
                this.close();
            }
        }
    }
}