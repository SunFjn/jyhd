/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.chat {

    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ChatPackage = Protocols.ChatPackage;

    export class ChatBlackListPanel extends ChatJiuzhouPanel {

        private _maxBlackListNum: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.inputBox.visible = false;
            this.banBox.visible = this.blackListBox.visible = true;
            this._list.itemRender = ChatBlackListItem;
            this._list.y = 90;
            this._list.height = 450;

            this._selectBtn = this.blackListBtn;
            this._selectBtnHandler = this.blackListBtnHandler;

            this._maxBlackListNum = BlendCfg.instance.getCfgById(26007)[blendFields.intParam][0];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CHAT_BLACK_LIST_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();

            ChatModel.instance.currChatChannel = ChatChannel.cross;
            this.updateView();
        }

        protected offSelectFunc(): void {
            this.blackListBtnHandler();
        }

        protected getListDatas(): ChatPackage[] {
            return null;
        }

        protected updateView(): void {

            let listInfo = ChatModel.instance.blackList;

            this.maxBlackListNumTxt.text = `屏蔽上限:${listInfo.length}/${this._maxBlackListNum}`;
            if (!listInfo) return;
            this._list.datas = listInfo;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }
    }
}