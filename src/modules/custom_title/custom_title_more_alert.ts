/** 称号定制 */
namespace modules.customtitle {
    import CustomTitleMoreAlertUI = ui.CustomTitleMoreAlertUI;
    import GetCustomDesignationReply = Protocols.GetCustomDesignationReply;
    import GetCustomDesignationReplyFields = Protocols.GetCustomDesignationReplyFields;

    export class CustomTitleMoreAlert extends CustomTitleMoreAlertUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }


        protected addListeners(): void {
            super.addListeners();
        }

        onOpened(): void {
            super.onOpened();

            this.updateShow();
        }

        public close(): void {
            super.close();
        }


        private updateShow() {

            let superVipStatus: GetCustomDesignationReply = CustomModel.instance.getStatusInfo();

            let today: number = superVipStatus[GetCustomDesignationReplyFields.dayTotalMoney];
            let total: number = superVipStatus[GetCustomDesignationReplyFields.totalMoney];

            this.t1_2000Txt.text = `${today}/2000`;
            this.t1_5000Txt.text = `${total}/5000`;

            this.t2_5000Txt.text = `${today}/5000`;
            this.t2_10000Txt.text = `${total}/10000`;

            this.t3_10000Txt.text = `${today}/10000`;
            this.t3_15000Txt.text = `${total}/15000`;

            this.t4_15000Txt.text = `${today}/15000`;
            this.t4_20000Txt.text = `${total}/20000`;

        }
    }
}