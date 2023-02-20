/** 公告界面*/

namespace modules.login {
    import HTMLDivElement = Laya.HTMLDivElement;
    import LayaEvent = modules.common.LayaEvent;
    import CustomBox = modules.common.CustomBox;

    export class LoginNoticeAlert extends ui.LoginNoticeUI {

        private infoTxt: HTMLDivElement;
        private txtBox: CustomBox;

        constructor() {
            super();
            this.txtBox = new CustomBox();
            this.txtBox.x = 55;
            this.txtBox.y = 120
            this.txtBox.width = 570;
            this.txtBox.height = 760;
            this.addChild(this.txtBox);
            this.infoTxt = new HTMLDivElement();
            this.infoTxt.style.fontFamily = "SimHei";
            this.infoTxt.style.fontSize = 30;
            this.infoTxt.style.width = 570;
        }

        public destroy(): void {

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

        }

        public onOpened(): void {
            super.onOpened();
            this.updateView();
        }

        // 更新提示文字
        private updateView(): void {
            this.infoTxt.innerHTML = modules.login.LoginModel.instance.allParams.notices.contents;
            this.txtBox.resetChild(this.infoTxt);
        }

        protected addListeners(): void {
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.close);
        }

    }
}