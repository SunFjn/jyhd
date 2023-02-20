///<reference path="../vip_new/vip_new_model.ts"/>
namespace modules.first_login_alert_panel {
    import Event = Laya.Event;
    import VipNewModel = modules.vip_new.VipNewModel;
    import FirstLoginAlertCtrl = modules.first_login_alert.FirstLoginAlertCtrl;
    import OnceRewardCtrl = modules.onceReward.OnceRewardCtrl;
    import LayaEvent = modules.common.LayaEvent;
    import OnceRewardId = ui.OnceRewardId;
    import CustomClip = modules.common.CustomClip;
    export class FirstLoginAlertPanel extends ui.FirstLoginAlertUI {
        private _count: number;
        private vipLevel: number = 0;
        private _btnClip: CustomClip;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._count = 5;
            this.createEffect();
        }
        public onOpened(): void {
            super.onOpened();
            this.zOrder = 50;
            this.vipLevel = VipNewModel.instance.vipLevel;
            Laya.timer.loop(1000, this, this.countDown);
            this.countDown();
            this._btnClip.visible = true;
            this._btnClip.play();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
        }

        private sureBtnHandler(): void {
            this.close();
        }
        private createEffect() {
            this._btnClip = CommonUtil.creatEff(this.sureBtn, "btn_light", 15);
            this._btnClip.pos(-5, -10);
            this._btnClip.scaleX = 1.1
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            Laya.timer.clearAll(this);
            OnceRewardCtrl.instance.drawOnceReward(OnceRewardId.vipFree);
            BagCtrl.instance.showWeaponGet()
        }

        private countDown() {
            this.restTimeText.text = `${this._count}秒后自动关闭`;
            if (this._count <= 0) {
                this.close();
            }
            this._count--;
        }
    }
}