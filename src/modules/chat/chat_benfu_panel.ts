/////<reference path="../$.ts"/>

/** 本服聊天面板 */
namespace modules.chat {

    import ChatPackage = Protocols.ChatPackage;

    export class ChatBenfuPanel extends ChatJiuzhouPanel {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list.itemRender = ChatMessageItem;

            this._selectBtn = this.benfuBtn;
            this._selectBtnHandler = this.benfuBtnHandler;

            this._type = ChatChannel.local;
            this._messageType = CommonEventType.BENFU_MESSAGE_UPDATE;
        }

        public onOpened(): void {
            super.onOpened();

            ChatModel.instance.currChatChannel = ChatChannel.local;
            GlobalData.dispatcher.event(CommonEventType.SELECT_CHAT_CHANNEL);
        }

        protected getListDatas(): ChatPackage[] {
            let listInfos: ChatPackage[] = ChatModel.instance.benfuChatRecord;
            return listInfos;
        }
    }
}