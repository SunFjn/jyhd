///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>


/** 背包道具单元项*/


namespace modules.bag {
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import PlayerModel = modules.player.PlayerModel;
    import IMsgFields = Protocols.IMsgFields;
    import item_equipFields = Configuration.item_equipFields;
    import CommonUtil = modules.common.CommonUtil;
    import item_material = Configuration.item_material;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import VipModel = modules.vip.VipModel;

    //装备归属类型
    export enum ItemBelongType {
        mine, //本人身上装备
        bag,  //背包装备
        otherMan,  //其他人装备
        preview, //预览装备
    }

    export class BagItem extends BaseItem {

        private _type: ItemBelongType;

        constructor() {
            super();
            this.height = 122;
        }

        protected initialize(): void {
            super.initialize();
            this.nameVisible = true;
            this.needTip = true;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_CHANGE_NUM, this, this.changeNumHandler);
        }

        private changeNumHandler(uid: number): void {
            if (this._itemData && this._itemData[Protocols.ItemFields.uid] === uid) {
                this._numTxt.text = this._itemData[Protocols.ItemFields.count].toString();
            }
        }

        protected setDataSource(value: Protocols.Item) {
            super.setDataSource(value);
            let item: Item = value;
            if (item == null) {
                GlobalData.dispatcher.off(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkRP);
                GlobalData.dispatcher.off(CommonEventType.VIP_UPDATE, this, this.checkRP);
                return;
            }
            let id = item[ItemFields.ItemId];
            let bagId = CommonUtil.getBagIdById(id);
            if (item[ItemFields.uid] != 0 && bagId == BagId.equipType && this._type != ItemBelongType.otherMan) {
                let part = CommonUtil.getPartById(id);
                let playerEquip = PlayerModel.instance.getEquipByPart(part);
                let playerEquipScore: number;
                playerEquip == null ? playerEquipScore = 0 : playerEquipScore = playerEquip[ItemFields.iMsg][IMsgFields.baseScore];
                let itemScore = item[ItemFields.iMsg][IMsgFields.baseScore];
                if (playerEquipScore < itemScore) {
                    this.upImgVisible = true;
                } else {
                    this.upImgVisible = false;
                }
                let lv = this._itemCfg[item_equipFields.wearLvl];
                let era = this._itemCfg[item_equipFields.era];
                let pLv = PlayerModel.instance.level;
                let pEra = PlayerModel.instance.eraLevel;
                if (lv > pLv || era > pEra) {
                    this.maskImg.visible = true;
                } else {
                    this.maskImg.visible = false;
                }
            } else {
                this.upImgVisible = false;
                this.maskImg.visible = false;
            }

            if (this._itemCfg && (this._itemCfg as item_material)[item_materialFields.shortcutUse] && value[ItemFields.uid]) {
                GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkRP);
                GlobalData.dispatcher.on(CommonEventType.VIP_UPDATE, this, this.checkRP);

                this.checkRP();
            }
        }

        protected clickHandler(): void {
            if (this.needTip) {
                if (this._itemData == null) {
                    return;
                }
                let itemId: number = this._itemData[ItemFields.ItemId];
                let itemType: int = CommonUtil.getItemTypeById(itemId);
                if (itemType == ItemMType.Equip) {
                    if (this._type == null) {
                        BagUtil.openBagItemTip(this._itemData);
                    } else if (this._type == ItemBelongType.mine) {
                        WindowManager.instance.openDialog(WindowEnum.EQUIP_WEAR_ALERT, this._itemData);
                    } else if (this._type == ItemBelongType.bag) {
                        WindowManager.instance.openDialog(WindowEnum.BAG_EQUIP_ALERT, this._itemData);
                    } else if (this._type == ItemBelongType.otherMan) {
                        WindowManager.instance.openDialog(WindowEnum.OTHER_EQUIP_ALERT, this._itemData);
                    } else if (this._type == ItemBelongType.preview) {
                        WindowManager.instance.openDialog(WindowEnum.NOT_GENERATED_ALERT, this._itemData);
                    }
                } else {
                    BagUtil.openBagItemTip(this._itemData);
                }
            } else if (this._clickHandleEvent) {
                this._clickHandleEvent();
            }
        }

        public set type(param: ItemBelongType) {
            this._type = param;
        }
        public get type(): ItemBelongType {
            return this._type;
        }

        private checkRP(): void {
            let cfg: item_material = this._itemCfg as item_material;
            this.rpImg.visible = PlayerModel.instance.level >= cfg[item_materialFields.useLvl] && VipModel.instance.vipLevel >= cfg[item_materialFields.vipLvl];
        }
    }
}