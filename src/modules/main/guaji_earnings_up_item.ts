///<reference path="../config/onhook_income_cfg.ts"/>
namespace modules.main {
    import GuaJiearningsUpItemUI = ui.GuaJiearningsUpItemUI;
    import OnhookIncomeCfg = modules.config.OnhookIncomeCfg;
    import MissionModel = modules.mission.MissionModel;
    import onhook_income = Configuration.onhook_income;
    import onhook_incomeFields = Configuration.onhook_incomeFields;
    import Point = laya.maths.Point;
    import Layer = ui.Layer;

    export class GuaJiearningsUpItem extends GuaJiearningsUpItemUI {
        private _tween: TweenJS;

        protected onOpened(): void {
            super.onOpened();
            this.updateLv();
            this.pos(CommonConfig.viewWidth / 2, 372);
            this.itemEffect();
        }

        private updateLv(): void {
            let tempLv: number = MissionModel.instance.curLv;
            let incomeCfg: onhook_income = OnhookIncomeCfg.instance.getIncomeCfgByLv(tempLv);
            if (!incomeCfg) {
                tempLv -= 1;
                incomeCfg = OnhookIncomeCfg.instance.getIncomeCfgByLv(tempLv);
            }
            if (!incomeCfg) return;
            let coin = incomeCfg[onhook_incomeFields.coin];
            let exp = incomeCfg[onhook_incomeFields.exp];
            this.coinTxt.text = `${coin}/小时`;
            this.expTxt.text = `${exp}/小时`;

            let incomeCfg1: onhook_income = OnhookIncomeCfg.instance.getIncomeCfgByLv(tempLv - 1);
            let upcoin = 0;
            let upexp = 0;
            if (incomeCfg1) {
                let coin1 = incomeCfg1[onhook_incomeFields.coin];
                let exp1 = incomeCfg1[onhook_incomeFields.exp];
                upcoin = coin - coin1;
                upexp = exp - exp1;
                this.coinNextTxt.text = `${upcoin}`;
                this.expNextTxt.text = `${upexp}`;
            } else {
                upcoin = coin;
                upexp = exp;
                this.coinNextTxt.text = `${upcoin}`;
                this.expNextTxt.text = `${upexp}`;
            }
        }

        public itemEffect(): void {
            let spr: Point = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.offLine);
            if (spr) {
                Point.TEMP.setTo(spr.x, spr.y);
                LayerManager.instance.getLayerById(Layer.EFFECT_LAYER).globalToLocal(Point.TEMP);
                let destinX = Point.TEMP.x;
                let destinY = Point.TEMP.y;
                // let destinX = spr.x;
                // let destinY = spr.y;
                if (this._tween) {
                    this._tween.stop();
                }
                this._tween = TweenJS.create(this).to({
                    x: destinX,
                    y: destinY,
                    scaleX: 0.1,
                    scaleY: 0.1
                }, 600).delay(1500).onComplete((): void => {
                    this.visible = false;
                    if (modules.vip_new.VipNewModel.instance.isUp) {
                        WindowManager.instance.open(WindowEnum.VIP_SVIP_UP_ALERT);
                        modules.vip_new.VipNewModel.instance.isUp = false;
                    }
                    this.destroy(true)
                }).start();
            } else {
                this.removeSelf();
                this.destroy(true)
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            super.destroy(destroyChild);
        }
    }
}