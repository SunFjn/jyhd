/** 超级vip专属联系方式获取界面 */

namespace modules.vip {
    import SuperVipContactAlertUI = ui.SuperVipContactAlertUI;

    export class SuperVipContactAlert extends SuperVipContactAlertUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.addAutoListener(this.btnSure, common.LayaEvent.CLICK, this, this.handleGoBtn);
        }


        protected addListeners(): void {
            super.addListeners();
        }

        onOpened(): void {
            super.onOpened();

            // this.qrcode.skin = ``

        }

        public close(): void {
            super.close();

        }

        public handleGoBtn(): void {
            // console.log(66661);
            // https://work.weixin.qq.com/kfid/kfc0e3e85fd79e31183 //客服微信地址


            window.location.href = "https://work.weixin.qq.com/kfid/kfc0e3e85fd79e31183";
        }

    }
}