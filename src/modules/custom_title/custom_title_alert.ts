/** 称号定制 */

namespace modules.customtitle {
    import CustomTitleAlertUI = ui.CustomTitleAlertUI
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetCustomDesignationReply = Protocols.GetCustomDesignationReply;
    import GetCustomDesignationReplyFields = Protocols.GetCustomDesignationReplyFields;

    export class CustomTitleAlert extends CustomTitleAlertUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, common.LayaEvent.CLICK, this, this.handleGetBtn);
            this.addAutoListener(this.moreBtn, common.LayaEvent.CLICK, this, this.handleMoreBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CUSTOM_TITILE_UPDATE, this, this.updateShow);
            // this.addAutoRegisteRedPoint(this.rpImg, ["customTitleRP"]);
        }

        onOpened(): void {
            super.onOpened();

            this.updateShow();
        }

        public close(): void {
            super.close();

        }

        public handleGetBtn(): void {
            RedPointCtrl.instance.setRPProperty("customTitleRP", false);
            this.rpImg.visible = false;
            WindowManager.instance.open(WindowEnum.SUPER_VIP_CONTACT_ALERT);
        }

        public handleMoreBtn(): void {
            WindowManager.instance.open(WindowEnum.CUSTOM_TITLE_MORE_ALERT);
        }

        //奖励数据展示
        private updateShow() {
            this.rpImg.visible = RedPointCtrl.instance.getRPStatusByOnlyShowOnce("customTitleRP");

            //客服名字展示
            this.qqTxt.text = `客服：小酒窝`

            let vipStatus: GetCustomDesignationReply = CustomModel.instance.getStatusInfo();

            let today: number = vipStatus[GetCustomDesignationReplyFields.dayTotalMoney];
            let total: number = vipStatus[GetCustomDesignationReplyFields.totalMoney];
            let status: boolean = vipStatus[GetCustomDesignationReplyFields.getState] == 0;

            //进度展示
            this.sureBtn.disabled = status;
            this.process1Txt.text = `(${today}/2000)`
            this.process2Txt.text = `(${total}/5000)`
        }
    }
}