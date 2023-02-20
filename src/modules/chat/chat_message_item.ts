/////<reference path="../$.ts"/>

/** 聊天消息单项 */
namespace modules.chat {
    import ChatMessageItemUI = ui.ChatMessageItemUI;
    import ChatPackage = Protocols.ChatPackage;
    import ChatPlayerInfo = Protocols.ChatPlayerInfo;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import ChatContent = Protocols.ChatContent;
    import ChatPlayerInfoFields = Protocols.ChatPlayerInfoFields;
    import ChatContentFields = Protocols.ChatContentFields;
    import Event = Laya.Event;
    import BlackInfo = Protocols.BlackInfo;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import CustomClip = modules.common.CustomClip;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import ItemEquipCfg = modules.config.ItemEquipCfg;
    import item_equipFields = Configuration.item_equipFields;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import StoneCfg = modules.config.StoneCfg;
    import gemRefineFields = Configuration.gemRefineFields;
    import BagUtil = modules.bag.BagUtil;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import xianwei_riseFields = Configuration.xianwei_riseFields;
    import BlackInfoFields = Protocols.BlackInfoFields;
    import xianwei_rise = Configuration.xianwei_rise;

    export class ChatMessageItem extends ChatMessageItemUI {

        private _playerInfo: BlackInfo;
        private _expendFace: CustomClip;
        private _itemData: Item;
        private _otherPlayerPgId: number;  //玩家的服务器Id

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.contentTxt.style.wordWrap = true;
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 22;
            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.leading = 5;
            this.contentTxt.style.valign = "middle";
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.shieldImg, Event.CLICK, this, this.shieldImgHandler);
            this.addAutoListener(this.contentTxt, Event.LINK, this, this.linkHandler);
            this.addAutoListener(this.headIcon, Event.CLICK, this, this.playerInfoAlert);
        }

        public setData(value: any): void {
            value = value as ChatPackage;
            this.updateView(value);
        }

        private updateView(value: ChatPackage): void {
            let mineId: number = PlayerModel.instance.actorId;
            let playerInfo: ChatPlayerInfo = value[ChatPackageFields.senderInfo];
            let chatContent: ChatContent = value[ChatPackageFields.content];
            /** pgId*/
            this._otherPlayerPgId = playerInfo[ChatPlayerInfoFields.pgId];
            let occ: number = playerInfo[ChatPlayerInfoFields.occ];
            let image: number = playerInfo[ChatPlayerInfoFields.image];
            let vipLv: number = playerInfo[ChatPlayerInfoFields.vip];
            let vipf: number = playerInfo[ChatPlayerInfoFields.vipf];
            CommonUtil.setSVIPandVIP(vipf, vipLv, this.vipBg, this.vipLvMSZ);
            /*玩家id*/
            let id: number = playerInfo[ChatPlayerInfoFields.agentId];
            this.commonBox.visible = true;
            this.specialBox.visible = false;
            if (id == 0) {
                this.systemMessage(chatContent[ChatContentFields.content]);
                return;
            }
            /*名字*/
            let name: string = playerInfo[ChatPlayerInfoFields.name];
            this._playerInfo = [id, name];
            this.shieldImg.visible = !(id == mineId); //玩家本人不能拉近黑名单
            /*头像id*/
            // this.headIcon.skin = `assets/icon/head/${occ}.png`;
            this.headIcon.skin = `assets/icon/head/${CommonUtil.getHeadUrl(image + occ)}`;
            // this.maskCircle._renderType = 0;
            this.sexImg.skin = `chat/sex_${occ}.png`;
            /*职业*/

            /*成就id*/
            let riseId: number = playerInfo[ChatPlayerInfoFields.riseId];
            let xianweiCfg: xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(riseId);
            let riseName: string = xianweiCfg ? `[${xianweiCfg[xianwei_riseFields.name]}]` : "";
            this.nameTxt.text = riseName + name;

            /*战力*/
            let type: number = chatContent[ChatContentFields.contentType];
            let content: string;
            /*聊天类型：0：文字  1：快捷语句  2：高级表情  3：道具  4:广播*/
            this.contentTxt.visible = true;
            if (this._expendFace) {
                this._expendFace.visible = false;
                this._expendFace.stop();
            }
            this.bgImg.height = 75;
            this.contentTxt.style.height = 55;
            this.height = 130;
            this.contentTxt.y = 45;
            if (type == 0) { //文字信息
                content = chatContent[ChatContentFields.content];
                this.contentTxt.innerHTML = content;
            } else if (type == 1) { //1：快捷语句
                let contentId: number = chatContent[ChatContentFields.contentId];
                content = ChatModel.instance.chatFaceformatStr(BlendCfg.instance.chatMarkedWords[contentId]);
                this.contentTxt.innerHTML = content;
            } else if (type == 2) { //高级表情
                let contentId: number = chatContent[ChatContentFields.contentId];
                this.contentTxt.visible = false;
                if (!this._expendFace) {
                    this._expendFace = new CustomClip();
                    this._expendFace.pos(140, 35);
                    this.addChild(this._expendFace);
                }
                this._expendFace.visible = true;
                ChatModel.instance.setFaceEffFrame(this._expendFace, contentId);
                this._expendFace.play();
            } else if (type == 3) { //道具
                let item: Item = chatContent[ChatContentFields.item];
                this._itemData = item;
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
                this.contentTxt.innerHTML = `<a href= ${null} ><span style='color:${color}'>[${itemName}]</span></a>`;
            } else if (type == 4) { //广播
                let str: string = ChatUtil.parseBroadcaset(chatContent);
                this.contentTxt.innerHTML = str;
            }

            if (this.contentTxt.height > 55) {
                this.bgImg.height = this.contentTxt.height + 20;
                if (this.bgImg.height > 75) {
                    this.height = this.bgImg.height + 40;
                }
            }
        }
        //系统消息处理
        private systemMessage(content: string): void {
            this.commonBox.visible = false;
            this.specialBox.visible = true;
            this.contentTxt.y = 0;
            this.contentTxt.innerHTML = content;
            this.height = this.contentTxt.height;
        }

        private linkHandler(value: string): void {
            if (value) {
                ChatUtil.linkHandler(value);
            } else {
                BagUtil.openBagItemTip([this._itemData[0], this._itemData[1], 0, null]);
            }
        }

        private shieldImgHandler(): void {
            let listInfo = ChatModel.instance.blackList;
            if (listInfo.length >= BlendCfg.instance.getCfgById(26007)[blendFields.intParam][0]) {
                notice.SystemNoticeManager.instance.addNotice("黑名单已达上限", true);
            }
            WindowManager.instance.open(WindowEnum.JOIN_BLACK_LIST_HINT_ALERT, this._playerInfo);
        }

        private playerInfoAlert(): void {
            ChatCtrl.instance.getChatDetailedInfo([PlayerModel.instance.actorId, this._playerInfo[BlackInfoFields.agentId], this._otherPlayerPgId]);
            WindowManager.instance.open(WindowEnum.OTHER_PLAYER_INFO_ALERT);
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
