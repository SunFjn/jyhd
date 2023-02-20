/////<reference path="../$.ts"/>
/** 系统聊天面板 */
namespace modules.chat {

    import ChatPackage = Protocols.ChatPackage;

    export class ChatSystemPanel extends ChatJiuzhouPanel {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.inputBox.visible = false;
            this.banBox.visible = true;

            this._list.itemRender = SystemMessageItem;
            this._list.spaceY = 15;

            this._selectBtn = this.xitongBtn;
            this._selectBtnHandler = this.xitongBtnHandler;
            this._messageType = CommonEventType.SYSTEM_MESSAGE_UPDATE;
        }

        public onOpened(): void {
            super.onOpened();

            ChatModel.instance.currChatChannel = ChatChannel.system;
            GlobalData.dispatcher.event(CommonEventType.SELECT_CHAT_CHANNEL);
        }

        protected getListDatas(): ChatPackage[] {
            let listInfos: ChatPackage[] = ChatModel.instance.systemChatRecord;
            return listInfos;
        }
    }
}