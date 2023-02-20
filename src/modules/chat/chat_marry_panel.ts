/////<reference path="../$.ts"/>
/** 姻缘聊天面板 */
namespace modules.chat {
    import ChatPackage = Protocols.ChatPackage;

    export class ChatMarryPanel extends ChatJiuzhouPanel {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list.itemRender = ChatMessageItem;

            this._selectBtn = this.xianyuanBtn;
            this._selectBtnHandler = this.marryBtnHandler;

            this._type = ChatChannel.marry;
            this._messageType = CommonEventType.MARRY_MESSAGE_UPDATE;
        }

        public onOpened(): void {
            super.onOpened();

            ChatModel.instance.currChatChannel = ChatChannel.marry;
            GlobalData.dispatcher.event(CommonEventType.SELECT_CHAT_CHANNEL);
        }

        protected getListDatas(): ChatPackage[] {
            let listInfos: ChatPackage[] = ChatModel.instance.marryChatRecord;
            return listInfos;
        }
    }
}