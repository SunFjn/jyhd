/** 邮件单元项*/


namespace modules.email {
    import EmailItemUI = ui.EmailItemUI;
    import Email = Protocols.Email;
    import EmailFields = Protocols.EmailFields;
    import Item = Protocols.Item;

    export class EmailItem extends EmailItemUI {
        constructor() {
            super();
        }

        protected clickHandler(): void {
            super.clickHandler();
            if (!this._dataSource) return;
            WindowManager.instance.openDialog(WindowEnum.EMAIL_DETAIL_PANEL, this._dataSource);
        }

        protected setData(value: any): void {
            super.setData(value);
            this._dataSource = value as Email;
            this.titleTxt1.text = value[EmailFields.title];
            let time: number = value[EmailFields.end_time] - GlobalData.serverTime; //value[EmailFields.end_time] - value[EmailFields.create_time];
            this.timeTxt.text = "剩余" + Math.ceil(time / (1000 * 60 * 60 * 24)) + "天";
            let items: Array<Item> = value[EmailFields.items];
            if (items && items.length != 0) {
                this.awardImg.visible = true;
                if (value[EmailFields.state] == 0) {  //未读未取
                    this.isNewImg.visible = true;
                    this.readImg.skin = "email/btn_youjian_1.png";
                    this.awardImg.skin = "email/zs_youjian_1.png"
                } else if (value[EmailFields.state] == 1) {  //已读未取
                    this.isNewImg.visible = false;
                    this.readImg.skin = "email/btn_youjian_2.png";
                    this.awardImg.skin = "email/zs_youjian_1.png"
                } else if (value[EmailFields.state] == 2) {   //已取，默认已读
                    this.isNewImg.visible = false;
                    this.readImg.skin = "email/btn_youjian_2.png";
                    this.awardImg.skin = "email/zs_youjian_2.png"
                }
            } else {
                this.awardImg.visible = false;
                if (value[EmailFields.state] == 0) {
                    this.isNewImg.visible = true;
                    this.readImg.skin = "email/btn_youjian_1.png";
                } else if (value[EmailFields.state] == 1) {
                    this.isNewImg.visible = false;
                    this.readImg.skin = "email/btn_youjian_2.png";
                }
            }
        }
    }
}