namespace modules.rune {
    import CommonTxtAlertUI = ui.CommonTxtAlertUI;
    import Event = Laya.Event;
    import BlackInfo = Protocols.BlackInfo;
    import ChatModel = modules.chat.ChatModel;

    export class JoinBlackListHintAlert extends CommonTxtAlertUI {

        private _playerInfo: BlackInfo;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.valign = "middle";
            this.contentTxt.style.lineHeight = 28;
            this.contentTxt.mouseEnabled = false;
            this.contentTxt.innerHTML = `是否确认屏蔽该玩家聊天信息并将该玩家加入黑名单?`;

            this.titleTxt.text = `信息提示`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.cancelBtn, Event.CLICK, this, this.close);
        }

        private okBtnHandler(): void {
            ChatModel.instance.blackListOpt = 1;
            ChatCtrl.instance.blackListOpt([this._playerInfo, 1]);
            this.close();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._playerInfo = value as BlackInfo;
        }
    }
}
