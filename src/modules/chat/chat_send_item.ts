/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.chat {
    import BaseItem = modules.bag.BaseItem;
    import ChatContent = Protocols.ChatContent;
    import ItemFields = Protocols.ItemFields;
    import IMsgFields = Protocols.IMsgFields;
    import GemGridsFields = Protocols.GemGridsFields;

    export class ChatSendItem extends BaseItem {

        protected initialize(): void {
            super.initialize();

            this.scale(0.8, 0.8);
        }

        public onOpened(): void {
            super.onOpened();

            this.needTip = false;
        }

        protected clickHandler() {
            super.clickHandler();
            WindowManager.instance.close(WindowEnum.CHAT_FACE_PANEL);
            if (!this.itemData[ItemFields.iMsg]) { //无值
                this.itemData[ItemFields.iMsg] = [[], [], [], [], [0, []], 0, 0, 0, 0];
            } else {
                if (!this.itemData[ItemFields.iMsg][IMsgFields.blueAttr]) {
                    this.itemData[ItemFields.iMsg][IMsgFields.blueAttr] = [];
                }
                if (!this.itemData[ItemFields.iMsg][IMsgFields.purpleAttr]) {
                    this.itemData[ItemFields.iMsg][IMsgFields.purpleAttr] = [];
                }
                if (!this.itemData[ItemFields.iMsg][IMsgFields.orangeAttr]) {
                    this.itemData[ItemFields.iMsg][IMsgFields.orangeAttr] = [];
                }
                if (!this.itemData[ItemFields.iMsg][IMsgFields.gems]) {
                    this.itemData[ItemFields.iMsg][IMsgFields.gems] = [0, []];
                } else {
                    if (!this.itemData[ItemFields.iMsg][IMsgFields.gems][GemGridsFields.gems]) {
                        this.itemData[ItemFields.iMsg][IMsgFields.gems][GemGridsFields.gems] = [];
                    }
                }
            }
            let content: ChatContent = [ChatModel.instance.currChatChannel, 3, 0, "", this.itemData, [], [], []];
            ChatCtrl.instance.sendChatMessage(content);
        }
    }
}
