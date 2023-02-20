///<reference path="../common/btn_group.ts"/>
///<reference path="../common/progress_bar_ctrl.ts"/>
///<reference path="../common/num_input_ctrl.ts"/>
///<reference path="../common_alert/got_item_alert.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../config/vip_cfg.ts"/>
///<reference path="../config/item_smelt_cfg.ts"/>
///<reference path="../common/custom_clip.ts"/>
///<reference path="../bottom_tab/bottom_tab_ctrl.ts"/>
///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../vip/vip_model.ts"/>


/** 背包面板*/


namespace modules.bag {
    import blendFields = Configuration.blendFields;
    import Event = Laya.Event;
    import List = Laya.List;
    import BtnGroup = modules.common.BtnGroup;
    import BlendCfg = modules.config.BlendCfg;
    import BagViewUI = ui.BagViewUI;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import VipModel = modules.vip.VipModel;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import ItemEquipCfg = modules.config.ItemEquipCfg;
    import item_equipFields = Configuration.item_equipFields;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class BagPanel extends BagViewUI {
        // 按钮组
        private _btnGroup: BtnGroup;
        private _list: List;
        private _bagAletTxt: laya.display.Text;
        private _addBagGridsBtn: Laya.Image;
        private _addEqGridsTxt: laya.display.Text;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.propBtn, this.equipBtn, this.gemBtn, this.magicWeaponBtn);
            this._list = new List();
            this._list.vScrollBarSkin = "";
            this._list.itemRender = BagItem;
            this._list.repeatX = 5;
            // list.repeatY = 6;
            this._list.spaceX = 20;
            this._list.spaceY = 8;
            this._list.width = 585;
            this._list.height = 850;
            this._list.x = 26;
            this.itemPanel.addChild(this._list);
            this._list.selectEnable = true;
            this.titleTxt.text = "背包";

            this._bagAletTxt = new laya.display.Text();
            this.addChild(this._bagAletTxt);
            this._bagAletTxt.color = "#664d3e";
            this._bagAletTxt.font = "SimHei";
            this._bagAletTxt.fontSize = 26;
            this._addBagGridsBtn = new Laya.Image();
            // this.addChild(this._addBagGridsBtn);
            this._addBagGridsBtn.skin = "common/btn_tongyong_3.png";
            // this._addBagGridsBtn.visible = false;
            this._addEqGridsTxt = new laya.display.Text();
            this.addChild(this._addEqGridsTxt);
            this._addEqGridsTxt.fontSize = 24;
            this._addEqGridsTxt.font = "SimHei";
            this._addEqGridsTxt.color = "#202020";
            this._addEqGridsTxt.text = "提升SVIP可增加装备格子";
            this._addEqGridsTxt.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.changeBagHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateHandler);
            this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.changeBagHandler);
            this._btnGroup.selectedIndex = 0;
            this.addAutoListener(this._addBagGridsBtn, LayaEvent.CLICK, this, this.addBagGrids);

            this.addAutoRegisteRedPoint(this.itemRPImg, ["bagRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this.changeBagHandler();
        }

        private addBagGrids(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.bagEquipSize);
        }

        private updateHandler(bagId: BagId): void {
            let index: int = bagId;
            if (index === this._btnGroup.selectedIndex) {
                this.changeBagHandler();
            }
        }

        // 切换背包
        private changeBagHandler(): void {
            let items: Protocols.Item[] = null;
            switch (this._btnGroup.selectedIndex) {
                case 0:
                    items = this.genGrids(BagId.itemType).concat();
                    items.sort(this.itemSort.bind(this));
                    break;
                case 1:
                    items = this.genGrids(BagId.equipType).concat();
                    items.sort(this.equipSort.bind(this));
                    break;
                case 2:
                    items = this.genGrids(BagId.stoneType).concat();
                    items.sort(this.stoneOrMagicWeaponSort.bind(this));
                    break;
                case 3:
                    items = this.genGrids(BagId.magicWeaponType).concat();
                    items.sort(this.stoneOrMagicWeaponSort.bind(this));
                    break;
            }
            if (items) {
                this._list.array = items;
                this._list.scrollTo(0);
            }
        }

        //道具排序
        private itemSort(a: Item, b: Item): number {
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            // 1材料类 2消耗类 3礼包类   消耗>礼包>材料
            let aType: number = CommonUtil.getItemTypeById(aItemId);
            let bType: number = CommonUtil.getItemTypeById(bItemId);
            let aQuality: number = CommonUtil.getItemQualityById(aItemId);
            let bQuality: number = CommonUtil.getItemQualityById(bItemId);
            if (aType == bType) {           //同类
                if (aQuality > bQuality) {
                    return -1;
                } else if (aQuality < bQuality) {
                    return 1;
                } else {
                    if (aItemId > bItemId) {
                        return -1;
                    } else if (aItemId < bItemId) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            } else if ((aType == 2) && (bType != 2)) {   //有一个最高类型判断
                return -1;
            } else if ((aType != 2) && (bType == 2)) {   //有一个最高类型判断
                return 1;
            } else if ((aType == 3) && (bType != 3)) {   //有一个中类型
                return -1;
            } else if ((aType != 3) && (bType == 3)) {   //有一个中类型
                return 1;
            }
        }

        //装备排序
        private equipSort(a: Item, b: Item): number {
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            let aFight: number = ItemEquipCfg.instance.getItemCfgById(aItemId)[item_equipFields.fight];
            let bFight: number = ItemEquipCfg.instance.getItemCfgById(bItemId)[item_equipFields.fight];
            if (aFight > bFight) {
                return -1;
            } else if (aFight < bFight) {
                return 1;
            } else {
                if (aItemId > bItemId) {
                    return -1;
                } else if (aItemId < bItemId) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        //仙石排序
        private stoneOrMagicWeaponSort(a: Item, b: Item): number {
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            let aQuality: number = CommonUtil.getItemQualityById(aItemId);
            let bQuality: number = CommonUtil.getItemQualityById(bItemId);
            if (aQuality > bQuality) {
                return -1;
            } else if (aQuality < bQuality) {
                return 1;
            } else {
                if (aItemId > bItemId) {
                    return -1;
                } else if (aItemId < bItemId) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        // 根据背包ID生成格子数据
        private genGrids(bagId: number): Array<Protocols.Item> {
            let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(bagId);
            let maxCount: number = 0;
            let vipLv = VipModel.instance.vipLevel;
            if (bagId === BagId.itemType) {
                let params: PrivilegeNode = PrivilegeCfg.instance.getVipInfoByLevel(vipLv, Privilege.itemEquipSize);
                maxCount = BlendCfg.instance.getCfgById(10001)[blendFields.intParam][0];
                if (params)
                    maxCount += params[PrivilegeNodeFields.param1];
            } else if (bagId === BagId.equipType) {
                let params: PrivilegeNode = PrivilegeCfg.instance.getVipInfoByLevel(vipLv, Privilege.bagEquipSize);
                maxCount = BlendCfg.instance.getCfgById(10002)[blendFields.intParam][0];
                if (params)
                    maxCount += params[PrivilegeNodeFields.param1];
            } else if (bagId === BagId.stoneType) {
                maxCount = BlendCfg.instance.getCfgById(10003)[blendFields.intParam][0];
                // maxCount += vipCfg[vipFields.stoneBagSize];
            } else if (bagId === BagId.magicWeaponType) {
                maxCount = BlendCfg.instance.getCfgById(10004)[blendFields.intParam][0];
                // maxCount += vipCfg[vipFields.magiceWeaponBagSize];
            }
            if (maxCount > items.length) {
                items = items.concat(new Array<Protocols.Item>(maxCount - items.length));
            }
            this.addBagAlert(bagId, maxCount);
            return items;
        }

        //增加背包容量提示
        private addBagAlert(bagId: number, maxaccount: number): void {
            let account: number = BagModel.instance.getItemsByBagId(bagId).length;
            /*let addcount: number = 0;
            if (VipModel.instance.vipLevel === 0) {
                addcount = 0;
            }
            else {
                addcount = PrivilegeCfg.instance.getCfgByType(VipModel.instance.vipLevel)[Configuration.privilegeFields.nodes][0][1];
            }*/
            this._bagAletTxt.text = "容量：" + account.toString() + "/" + (maxaccount).toString();
            if (bagId === BagId.equipType) {
                this._bagAletTxt.text = "容量：" + account.toString() + "/" + (maxaccount/* + addcount*/).toString();
                if (this.canAddGrids()) {
                    // this._addBagGridsBtn.visible = true;
                    this.addChild(this._addBagGridsBtn);
                    this._bagAletTxt.x = this.width - this._bagAletTxt.width - this._addBagGridsBtn.width - 80;
                    this._addEqGridsTxt.pos(Math.floor((this._bagAletTxt.x - this._addEqGridsTxt.width) / 2 + 40), 1020);
                    this._addBagGridsBtn.pos(this._bagAletTxt.x + this._bagAletTxt.width + 5, 1013);
                } else {
                    // this._addBagGridsBtn.visible = false;
                    this._addBagGridsBtn.removeSelf();
                    this._bagAletTxt.x = this.width - this._bagAletTxt.width - 80;
                    this._addEqGridsTxt.text = "已达最大格子数";
                }
                this._addEqGridsTxt.visible = true;
                this._addEqGridsTxt.pos(Math.floor((this._bagAletTxt.x - this._addEqGridsTxt.width) / 2 + 40), 1020);
            } else {
                // this._addBagGridsBtn.visible = false;
                this._addBagGridsBtn.removeSelf();
                this._addEqGridsTxt.visible = false;
                this._bagAletTxt.x = this.width - this._bagAletTxt.width - 80;
            }
            this._bagAletTxt.y = 1020;
        }

        //判断是否还可以增加格子
        private canAddGrids(): boolean {
            let nextLevl: number = VipModel.instance.vipLevel + 1;
            if (nextLevl > PrivilegeCfg.instance.getVipMaxLevel()) {
                nextLevl = PrivilegeCfg.instance.getVipMaxLevel();
            }
            let gridCfg: Configuration.privilege = PrivilegeCfg.instance.getCfgByType(VipModel.instance.vipLevel);
            let nextCfg: Configuration.privilege = PrivilegeCfg.instance.getCfgByType(nextLevl);
            let grids: number = 0;
            if (VipModel.instance.vipLevel !== 0) {
                grids = gridCfg[Configuration.privilegeFields.nodes][Configuration.PrivilegeNodeFields.type][Configuration.PrivilegeNodeFields.param1];
            }

            let nextGrids = nextCfg[Configuration.privilegeFields.nodes][0][1];
            while (grids == nextGrids && nextLevl <= PrivilegeCfg.instance.getVipMaxLevel()) {
                nextLevl++;
                if (nextLevl > PrivilegeCfg.instance.getVipMaxLevel()) {
                    return false;
                }
                nextCfg = PrivilegeCfg.instance.getCfgByType(nextLevl);
                nextGrids = nextCfg[Configuration.privilegeFields.nodes][0][1];
            }
            return true;
        }

        public destroy(destroyChild: boolean = true): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._list = this.destroyElement(this._list);
            this._bagAletTxt = this.destroyElement(this._bagAletTxt);
            this._addBagGridsBtn = this.destroyElement(this._addBagGridsBtn);
            this._addEqGridsTxt = this.destroyElement(this._addEqGridsTxt);
            super.destroy(destroyChild);
        }
    }
}