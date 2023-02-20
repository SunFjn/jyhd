
namespace modules.commonAlert {
    import Event = Laya.Event;
    import Handler = Laya.Handler;
    import LayaEvent = modules.common.LayaEvent;
    import NoMoreNoticeId = ui.NoMoreNoticeId;
    export class CommonTxtCatAlert extends ui.CommonTxtCatAlertUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okHandler);
            this.addAutoListener(this.cancelBtn, LayaEvent.CLICK, this, this.cancelHandler);
        }
        public setOpenParam(value: InwardParams): void {
            super.setOpenParam(value);

        }
        public okHandler() {
            WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);

            this.close();

        }
        public cancelHandler() {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);

            this.close();
        }
    }
}