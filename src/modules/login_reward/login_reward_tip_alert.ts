namespace modules.login_reward {
    import Point = laya.maths.Point;
    import Event = Laya.Event;

    export class LoginRewardTipAlert extends ui.LoginRewardTipAlertUI {
        private _pos: Point;
        private _type: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        public onOpened(): void {
            super.onOpened();
        }

        protected addListeners(): void {
            super.addListeners();

            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
        }

        private sureBtnHandler(): void {
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                WindowManager.instance.open(WindowEnum.VIP_PANEL);
            }
            else {
                WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
            }

            this.close();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public destroy(): void {
            super.destroy();
        }
    }
}