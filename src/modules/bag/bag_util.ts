namespace modules.bag {
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import PlayerModel = modules.player.PlayerModel;
    import item_material = Configuration.item_material;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Handler = laya.utils.Handler;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_runeFields = Configuration.item_runeFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import runeRefine = Configuration.runeRefine;
    import item_rune = Configuration.item_rune;
    import CommonUtil = modules.common.CommonUtil;


    export class BagUtil {
        constructor() {

        }

        //根据道具数据和类型弹背包提示框    0背包装备 1自己装备 2别人装备
        public static openBagItemTip(item: Item): void {
            if (!item) return;
            let itemId: number = item[ItemFields.ItemId];
            let itemType: int = CommonUtil.getItemTypeById(itemId);
            switch (itemType) {
                case ItemMType.Material:        // 临时
                case ItemMType.Consume:     // 消耗类礼包类可以直接使用
                case ItemMType.Giftbag:
                case ItemMType.Unreal:
                case ItemMType.Stone:
                case ItemMType.Rune:
                case ItemMType.MagicWeapon:
                    if (item[ItemFields.uid] === 0) {
                        // 展示道具

                        if (CommonUtil.getItemSubTypeById(itemId) == 52) {
                            WindowManager.instance.openDialog(WindowEnum.CashEquip_ALERT, item);

                        } else {
                            WindowManager.instance.openDialog(WindowEnum.PROP_ALERT, item);

                        }


                    } else {


                        let isStone: boolean = CommonUtil.getItemTypeById(itemId) === ItemMType.Stone;
                        let isRune: boolean = CommonUtil.getItemTypeById(itemId) === ItemMType.Rune;
                        if (isStone || isRune) {       // 仙石不可使用
                            WindowManager.instance.openDialog(WindowEnum.PROP_ALERT, item);
                        } else {
                            let cfg: item_material = ItemMaterialCfg.instance.getItemCfgById(itemId);
                            if (cfg[item_materialFields.canUse]) {
                                WindowManager.instance.openDialog(WindowEnum.PROP_USE_ALERT, [item, false]);
                            } else {
                                WindowManager.instance.openDialog(WindowEnum.PROP_ALERT, item);
                            }
                        }
                    }
                    break;
                case ItemMType.Equip:
                    if (!item[ItemFields.iMsg]) {     // 角色身上穿的装备UID是0，所以这里需要用IMSG判断
                        WindowManager.instance.openDialog(WindowEnum.NOT_GENERATED_ALERT, item);
                    } else {
                        // 判断是否是身上穿的装备
                        let equip: Item = PlayerModel.instance.getEquipByPart(CommonUtil.getPartById(itemId));
                        if (equip && equip === item) {
                            WindowManager.instance.openDialog(WindowEnum.EQUIP_WEAR_ALERT, item);
                        } else {
                            // 判断是自己的装备还是别人的装备
                            if (BagModel.instance.getItemByBagIdUid(BagId.equipType, item[ItemFields.uid])) {
                                WindowManager.instance.openDialog(WindowEnum.BAG_EQUIP_ALERT, item);
                            } else if (item[ItemFields.uid] === 0) {
                                WindowManager.instance.openDialog(WindowEnum.NOT_GENERATED_ALERT, item);
                            } else {
                                // WindowManager.instance.openDialog(WindowEnum.OTHER_EQUIP_ALERT, item);
                            }
                        }
                    }
                    break;
                case ItemMType.Rune:
                    WindowManager.instance.openDialog(WindowEnum.PROP_ALERT, item);
                    break;
            }
        }

        //打开道具不足获取面板，参数为物品ID和需要的数量
        public static openLackPropAlert(id: number, num: number, isCoin?: boolean): void {
            let itemCfg: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(id);
            let isStone: boolean = CommonUtil.getItemTypeById(id) === ItemMType.Stone;
            let isOpenPlane: boolean = false;
            let arr: Array<number> = <Array<number>>itemCfg[isStone ? item_stoneFields.itemSourceId : item_materialFields.itemSourceId];

            // 玉荣新增-待优化
            if (CommonUtil.getItemTypeById(id) === ItemMType.Rune) {
                arr = itemCfg[item_runeFields.itemSourceId] as unknown as any;
            }

            let _isCoin = false;
            if (isCoin !== undefined) {
                _isCoin = isCoin;
            }
            if (itemCfg[isStone ? item_stoneFields.shortcutBuy : item_materialFields.shortcutBuy] || arr.length > 0) {
                isOpenPlane = true;
            }
            if (isOpenPlane) {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.openDialog(WindowEnum.LACK_PROP_ALERT, [id, num, _isCoin]);
            } else {
                SystemNoticeManager.instance.addNotice(itemCfg[isStone ? item_stoneFields.name : item_materialFields.name] + "道具不足", true);
            }

        }

        //背包空间是否足够并弹出提示
        public static canAddItemsByBagIdCount(arr: Array<Item>): boolean {
            let equipNum: number = 0;
            let itemNum: number = 0;
            let runeNum: number = 0;
            for (let i = 0; i < arr.length; i++) {
                let itemId = arr[i][ItemFields.ItemId];
                let type = CommonUtil.getBagIdById(itemId);
                if (type == BagId.equipType) {
                    equipNum++;
                } else if (type == BagId.itemType) {
                    itemNum++;
                } else if (type === BagId.rune) {
                    runeNum++;
                }
            }
            if (equipNum > 0) {
                let bagNum = BagModel.instance.getBagEnoughById(BagId.equipType);
                if (bagNum <= BlendCfg.instance.getCfgById(10007)[blendFields.intParam][0]) {
                    let arr: Array<Item> = BagModel.instance.getSmeltRank();
                    if (arr && arr.length > 0) {
                        let handler: Handler = Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt);
                        CommonUtil.alert("温馨提示", "装备背包格子不足，是否一键熔炼", [handler]);
                    }
                    return false;
                } else if (equipNum > bagNum) {
                    CommonUtil.noticeError(12002);
                    return false;
                }
            }
            if (itemNum > 0) {
                let bagNum = BagModel.instance.getBagEnoughById(BagId.itemType);
                if (itemNum > bagNum) {
                    SystemNoticeManager.instance.addNotice("道具背包已满，请先整理", true);
                    return false;
                }
            }
            if (runeNum > 0) {
                let bagNum = BagModel.instance.getBagEnoughById(BagId.rune);
                if (runeNum > bagNum) {
                    SystemNoticeManager.instance.addNotice("玉荣背包已满，请先整理", true);
                    return false;
                }
            }
            return true;
        }

        // 检测是否需要弹一键熔炼提示
        public static checkNeedSmeltTip(): boolean {
            let flag: boolean = false;
            if (BagModel.instance.getBagEnoughById(BagId.equipType) <= BlendCfg.instance.getCfgById(10007)[blendFields.intParam][0]) {
                let arr: Array<Item> = BagModel.instance.getSmeltRank();
                if (arr && arr.length > 0) {
                    flag = true;
                    let handler: Handler = Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt);
                    CommonUtil.alert("温馨提示", "装备背包格子不足，是否一键熔炼", [handler]);
                } else if (arr && arr.length == 0) {
                    SystemNoticeManager.instance.addNotice("装备背包格子不足，但又无可熔炼装备", true);
                    flag = true;
                }
            }
            return flag;
        }

        // 判断是否N选一礼包
        public static checkIsManualGift(itemId: number): boolean {
            return Math.floor(itemId * 0.00001) % 100 === 99;
        }
    }
}