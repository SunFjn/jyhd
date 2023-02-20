/////<reference path="../$.ts"/>
/** 仙盟聊天面板 */
namespace modules.chat {
    import ChatPackage = Protocols.ChatPackage;

    export class ChatFactionPanel extends ChatJiuzhouPanel {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list.itemRender = ChatMessageItem;

            this._selectBtn = this.xianmengBtn;
            this._selectBtnHandler = this.xianmengBtnHandler;

            this._type = ChatChannel.faction;
            this._messageType = CommonEventType.FACTION_MESSAGE_UPDATE;
        }

        public onOpened(): void {
            super.onOpened();

            ChatModel.instance.currChatChannel = ChatChannel.faction;
            GlobalData.dispatcher.event(CommonEventType.SELECT_CHAT_CHANNEL);
            this.factionRP.visible = false;
        }

        protected getListDatas(): ChatPackage[] {
            let listInfos: ChatPackage[] = ChatModel.instance.factionChatRecord;
            return listInfos;
        }
    }
}