/////<reference path="../$.ts"/>
/** 主界面的聊天Item项 */
namespace modules.chat {
    import MainChatItemUI = ui.MainChatItemUI;
    import CustomClip = modules.common.CustomClip;
    import ChatPlayerInfo = Protocols.ChatPlayerInfo;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import ChatPlayerInfoFields = Protocols.ChatPlayerInfoFields;
    import ChatContentFields = Protocols.ChatContentFields;
    import ChatContent = Protocols.ChatContent;
    import BlendCfg = modules.config.BlendCfg;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import item_materialFields = Configuration.item_materialFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_equipFields = Configuration.item_equipFields;
    import ItemEquipCfg = modules.config.ItemEquipCfg;
    import item_runeFields = Configuration.item_runeFields;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import StoneCfg = modules.config.StoneCfg;
    import gemRefineFields = Configuration.gemRefineFields;
    import CommonUtil = modules.common.CommonUtil;

    export class MainChatItem extends MainChatItemUI {

        private _expendFace: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.txt.style.wordWrap = true;
            this.txt.style.fontFamily = "SimHei";
            this.txt.style.fontSize = 22;
            this.txt.color = "#ffffff";
            this.txt.style.leading = 5;

            this._expendFace = new CustomClip();
            this.addChild(this._expendFace);
        }

        public setData(value: any): void {

            let massage = value;
            let currChannel: number = ChatModel.instance.currChatChannel;
            this._expendFace.stop();
            this._expendFace.visible = false;
            this.txt.innerHTML = ``;
            this.txt.style.height = this.height = 22;
            this.txt.y = 0;
            let fuStr: string = currChannel == ChatChannel.cross ? "jz" : currChannel == ChatChannel.local ? "bf" : currChannel == ChatChannel.faction ? "xm" : "xt";
            this.serveImg.skin = `chat/image_lt_${fuStr}.png`;
            if (massage[ChatPackageFields.senderInfo] && massage[ChatPackageFields.senderInfo][ChatPlayerInfoFields.agentId] == 0) {
                this.serveImg.skin = `chat/image_lt_xt.png`;
            }
            this.txt.x = 60;
            this.txt.width = 516;
            this.VipMsz.visible = false;
            this.serveImg.visible = true;
            if (currChannel == ChatChannel.system) { //系统
                let str: string = ChatUtil.parseBroadcaset(massage[ChatPackageFields.content]);
                this.txt.innerHTML = str;
                this.height = this.txt.height;
            } else {
                let playerInfo: ChatPlayerInfo = massage[ChatPackageFields.senderInfo];
                let vipLv: number = playerInfo[ChatPlayerInfoFields.vip];
                let chatContent: ChatContent = massage[ChatPackageFields.content];
                let content: string = chatContent[ChatContentFields.content];
                let type: number = chatContent[ChatContentFields.contentType];
                let playerName: string = playerInfo[ChatPlayerInfoFields.name];
                playerName = ChatModel.instance.wordReplace(playerName);
                if (vipLv) { //是vip
                    this.txt.x = 80;
                    this.txt.width = 496;
                    this.VipMsz.visible = true;
                }
                if (type == 0) {  //文字
                    // return;
                    this.txt.innerHTML = `<span style='color:#ffec7c'>${playerName}</span>:` + content;
                    this.height = this.txt.height;
                    this.centerYHtml();
                } else if (type == 1) { //快捷语句
                    let contentId: number = chatContent[ChatContentFields.contentId];
                    content = ChatModel.instance.chatFaceformatStr(BlendCfg.instance.chatMarkedWords[contentId]);
                    this.txt.innerHTML = `<span style='color:#ffec7c'>${playerName}</span>:` + content;
                    this.height = this.txt.height;
                    this.centerYHtml();
                } else if (type == 2) { //高级表情
                    let contentId: number = chatContent[ChatContentFields.contentId];
                    this.txt.innerHTML = `<span style='color:#ffec7c'>${playerName}</span>:`;
                    this._expendFace.x = this.txt.contextWidth + this.txt.x + 10;
                    ChatModel.instance.setFaceEffFrame(this._expendFace, contentId);
                    this._expendFace.play();
                    this._expendFace.visible = true;
                    this.height = 64;
                    let initY: number = (this.height - this.txt.height) / 2;
                    this.txt.y = initY;
                    this.serveImg.y = this.VipMsz.y = this.txt.y;
                } else if (type == 3) { //道具
                    let item: Item = chatContent[ChatContentFields.item];
                    let itemId: number = item[ItemFields.ItemId];
                    let itemType: number = CommonUtil.getItemTypeById(itemId);
                    let color: string = CommonUtil.getColorById(itemId);
                    let itemName: string;
                    if (itemType == ItemMType.Material || itemType == ItemMType.MagicWeapon || itemType == ItemMType.Giftbag) {
                        itemName = ItemMaterialCfg.instance.getItemCfgById(itemId)[item_materialFields.name];
                    } else if (itemType == ItemMType.Equip) {
                        itemName = ItemEquipCfg.instance.getItemCfgById(itemId)[item_equipFields.name];
                    } else if (itemType == ItemMType.Rune) {
                        let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                        itemName = ItemRuneCfg.instance.getCfgById(dimId)[item_runeFields.name] + `玉荣`;
                    } else if (itemType == ItemMType.Stone) {
                        itemName = StoneCfg.instance.getCfgById(itemId)[gemRefineFields.name];
                    }
                    this.txt.innerHTML = `<span style='color:#ffec7c'>${playerName}</span><span style='color:${color}'>[${itemName}]</span>`;
                    this.serveImg.y = this.VipMsz.y = this.txt.y;
                } else if (type == 4) { //广播
                    let name: string = `<span style='color:#ffec7c'>${playerName}</span>:`;
                    let str: string = name + ChatUtil.parseBroadcaset(chatContent);
                    this.txt.innerHTML = str;
                    this.serveImg.y = this.VipMsz.y = this.txt.y;
                    this.height = this.txt.height;
                }
            }
        }

        private centerYHtml(): void {
            let tempY: number = -1;
            for (let i: int = 0, len: int = this.txt.numChildren; i < len; i++) {
                let child: Laya.Node = this.txt.getChildAt(i);
                if (child instanceof Laya.HTMLImageElement) {
                    tempY = child.y;
                    break;
                }
            }
            this.serveImg.y = this.VipMsz.y = tempY === 0 ? 18 : 0;
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._expendFace) {
                this._expendFace.removeSelf();
                this._expendFace.destroy();
                this._expendFace = null;
            }
            super.destroy(destroyChild);
        }
    }
}