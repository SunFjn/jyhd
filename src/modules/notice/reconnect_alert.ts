/** 断线重连 */
namespace modules.notice {
    export class ReconnectAlertUI extends ui.ReconnectAlertUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.closeOnSide = false;
        }
        public onOpened(): void {
            super.onOpened();

        }
        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.loginBtn, common.LayaEvent.CLICK, this, this.gotoLogin);

        }

        /** 重新加载本界面 */
        private gotoLogin() {
            window.location.reload();
            console.log("断线重连关闭!刷新当前页面!");
        }

    }
}
