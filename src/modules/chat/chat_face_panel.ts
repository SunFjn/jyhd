///<reference path="../config/chat_face_cfg.ts"/>


namespace modules.chat {
    import ChatFaceViewUI = ui.ChatFaceViewUI;
    import CustomList = modules.common.CustomList;
    import BtnGroup = modules.common.BtnGroup;
    import ChatFaceCfg = modules.config.ChatFaceCfg;
    import Event = Laya.Event;
    import VipModel = modules.vip.VipModel;
    import Button = Laya.Button;
    import BagModel = modules.bag.BagModel;
    import ItemEquipCfg = modules.config.ItemEquipCfg;
    import ItemFields = Protocols.ItemFields;
    import item_equipFields = Configuration.item_equipFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import item_stoneFields = Configuration.item_stoneFields;
    import Item = Protocols.Item;
    import Handler = Laya.Handler;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ItemStoneCfg = modules.config.ItemStoneCfg;

    export class ChatFacePanel extends ChatFaceViewUI {

        private _list: CustomList;
        private _itemList: CustomList;
        private _tab: BtnGroup;

        protected initialize(): void {
            super.initialize();

            this.centerX = -3;
            this.bottom = 185;

            this._list = new CustomList();
            this._list.width = 600;
            this._list.x = 100;
            this._list.spaceY = 10;
            this._list.spaceX = 12;
            this._list.itemRender = ChatFaceItem;
            this.addChild(this._list);

            this._itemList = new CustomList();
            this._itemList.spaceX = 2;
            this._itemList.spaceY = 2;
            this._itemList.width = 600;
            this._itemList.height = 315;
            this._itemList.x = 125;
            this._itemList.y = 20;
            this._itemList.hCount = 6;
            this._itemList.itemRender = ChatSendItem;
            this.addChild(this._itemList);

            this._tab = new BtnGroup();
            this._tab.canSelectHandler = Handler.create(this, this.canSelectHandler, null, false);
            this._tab.setBtns(this.btnGroup_0, this.btnGroup_1, this.btnGroup_2);
            this._tab.selectedIndex = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._tab, Event.CHANGE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.updateVipLv);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private canSelectHandler(nextIndex: number) {

            let playerLv: number = PlayerModel.instance.level;
            if (nextIndex == 1) { //高级表情

            } else if (nextIndex == 2) { //道具
                let unlockLv: number = ChatModel.instance.getUnlockLv(3);
                if (playerLv < unlockLv) {
                    SystemNoticeManager.instance.addNotice(`等级达到${unlockLv}解锁`, true);
                    return false;
                }
            }
            return true;
        }

        private updateView(): void {

            if (this._tab.oldSelectedIndex !== -1) {
                (<Button>this._tab.oldSelectedBtn).skin = `chat/btn_lt_bqbtn_0.png`;
            }
            (<Button>this._tab.selectedBtn).skin = `chat/btn_lt_bqbtn_1.png`;

            this.hintBox.visible = false;
            this._itemList.visible = this._list.visible = false;
            this._list.height = 315;
            this._list.y = 20;
            if (this._tab.selectedIndex == 0) {  //普通
                this._list.visible = true;
                let ids: number[] = ChatFaceCfg.instance.getFaceIdsByType(0);
                ChatModel.instance.faceType = 0;
                this._list.hCount = 10;
                this._list.datas = ids;
            } else if (this._tab.selectedIndex == 1) {
                this.updateVipLv();
                //剩余次数
                let residueTime: number = ChatModel.instance.maxExpertFaceTime - ChatModel.instance.sendVipFaceTime;
                this.timeTxt.text = `${residueTime}/${ChatModel.instance.maxExpertFaceTime}`;
                this.timeTxt.color = residueTime == 0 ? "#ff3e3e" : "#0ecf09";
                this._list.visible = true;
                let ids: number[] = ChatFaceCfg.instance.getFaceIdsByType(1);
                ChatModel.instance.faceType = 1;
                if (this.v4Txt.visible) { //有次数限制
                    this._list.height = 277;
                    this._list.y = 60;
                }
                this._list.hCount = 8;
                this._list.datas = ids;
            } else if (this._tab.selectedIndex == 2) { // 道具
                this._itemList.visible = true;
                let items: Item[] = [];
                // 装备
                items = items.concat(this.judgeItem(BagId.equipType));
                //材料
                items = items.concat(this.judgeItem(BagId.itemType));
                //玉荣
                items = items.concat(this.judgeItem(BagId.rune));
                //仙石
                items = items.concat(this.judgeItem(BagId.stoneType));
                //圣物
                items = items.concat(this.judgeItem(BagId.magicWeaponType));
                this._itemList.datas = items;
            }
        }

        private judgeItem(type: int): Item[] {
            let arr: Item[] = [];
            let items: Item[] = BagModel.instance.getItemsByBagId(type);
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                let id: number = items[i][ItemFields.ItemId];
                let flag: number;
                if (type == BagId.stoneType) {
                    flag = ItemStoneCfg.instance.getItemCfgById(id)[item_stoneFields.isChat];
                } else if (type == BagId.rune) {
                    let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                    flag = ItemRuneCfg.instance.getCfgById(dimId)[item_runeFields.isChat];
                } else if (type == BagId.itemType) {
                    flag = ItemMaterialCfg.instance.getItemCfgById(id)[item_materialFields.isChat];
                } else if (type == BagId.equipType) {
                    flag = ItemEquipCfg.instance.getItemCfgById(id)[item_equipFields.isChat];
                } else if (type == BagId.magicWeaponType) {
                    flag = ItemMaterialCfg.instance.getItemCfgById(id)[item_materialFields.isChat];
                }

                if (flag) {
                    arr.push(items[i]);
                }
            }
            return arr;
        }

        private updateVipLv(): void {
            let vipLv: number = VipModel.instance.vipLevel;
            this.v4Txt.visible = this.hintBox.visible = !(vipLv >= ChatModel.instance.minSendVipFaceLv);
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._itemList = this.destroyElement(this._itemList);
            this._tab = this.destroyElement(this._tab);
            super.destroy(destroyChild);
        }

    }
}