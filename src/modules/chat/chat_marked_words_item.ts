namespace modules.chat {
    import ChatMarkedWordsItemUI = ui.ChatMarkedWordsItemUI;
    import ChatContent = Protocols.ChatContent;

    export class ChatMarkedWordsItem extends ChatMarkedWordsItemUI {

        private _index: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._index = -1;

            this.conTxt.color = "#2d2d2d";
            this.conTxt.style.fontFamily = "SimHei";
            this.conTxt.style.fontSize = 22;
            this.conTxt.style.lineHeight = 40;
            this.conTxt.style.wordWrap = true;
            this.conTxt.mouseEnabled = false;

        }

        protected addListeners(): void {
            super.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();

        }

        public setData(value: any): void {
            let content: string = value[0];
            this._index = value[1];
            this.conTxt.innerHTML = ChatModel.instance.chatFaceformatStr(content);
            this.conTxt.style.height = 40;
            for (let i: int = 0, len: int = this.conTxt.numChildren; i < len; i++) {
                let child: Laya.Node = this.conTxt.getChildAt(i);
                if (child instanceof Laya.HTMLImageElement) {
                    this.txtMiddle();
                    break;
                }
            }
        }

        private txtMiddle(): void {
            for (let i: int = 0, len: int = this.conTxt.numChildren; i < len; i++) {
                let child: Laya.Node = this.conTxt.getChildAt(i);
                if (!(child instanceof Laya.HTMLImageElement)) {
                    (<Laya.HTMLImageElement>child).y = -(this.conTxt.height - this.conTxt.style.fontSize) / 2;
                }
            }
        }

        public clickHandler(): void {
            WindowManager.instance.close(WindowEnum.CHAT_MARKED_WORDS_PANEL);

            //发送协议
            let sendChatInfo: ChatContent = [ChatModel.instance.currChatChannel, 1, this._index, ``, ChatModel.instance.virtualItem, [], [], []];
            ChatCtrl.instance.sendChatMessage(sendChatInfo);
        }
    }
}