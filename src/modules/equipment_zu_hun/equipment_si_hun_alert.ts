///<reference path="../config/equipment_zhuhun_cfg.ts"/>
///<reference path="../config/equipment_shihun_cfg.ts"/>
namespace modules.equipment_zu_hun {
    import EquipmentSiHunAlertUI = ui.EquipmentSiHunAlertUI;
    import Event = Laya.Event;
    import item_material = Configuration.item_material;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_materialFields = Configuration.item_materialFields;
    import item_stoneFields = Configuration.item_stoneFields;
    import BagModel = modules.bag.BagModel;
    import PlayerModel = modules.player.PlayerModel;
    import item_rune = Configuration.item_rune;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import runeRefine = Configuration.runeRefine;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import EquipmentShiHunCfg = modules.config.EquipmentShiHunCfg;
    import shihunFields = Configuration.shihunFields;
    import ShihunGrids = Protocols.ShihunGrids;
    import ShihunGridsFields = Protocols.ShihunGridsFields;
    import BagUtil = modules.bag.BagUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class EquipmentSiHunAlert extends EquipmentSiHunAlertUI {
        private _nameTextArry: Array<Laya.Text>;
        private _valueTextArry: Array<Laya.Text>;
        private _upValueTextArry: Array<Laya.Text>;
        private _upValueImgArry: Array<Laya.Image>;
        private _btnClip: CustomClip;//按钮特效1
        private _btnClip1: CustomClip;//按钮特效2

        private _dates: ShihunGrids;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._nameTextArry = [
                this.attributeNameText1,
                this.attributeNameText2,
                this.attributeNameText3,
                this.attributeNameText4,
                this.attributeNameText5,
                this.attributeNameText6];
            this._valueTextArry = [
                this.attributeValueText1,
                this.attributeValueText2,
                this.attributeValueText3,
                this.attributeValueText4,
                this.attributeValueText5,
                this.attributeValueText6];
            this._upValueTextArry = [
                this.attributeUpValueText1,
                this.attributeUpValueText2,
                this.attributeUpValueText3,
                this.attributeUpValueText4,
                this.attributeUpValueText5,
                this.attributeUpValueText6];
            this._upValueImgArry = [
                this.attributeUpImg1,
                this.attributeUpImg2,
                this.attributeUpImg3,
                this.attributeUpImg4,
                this.attributeUpImg5,
                this.attributeUpImg6];
            this.creatEffect();
        }

        // 设置打开面板时的参数
        public setOpenParam(value: ShihunGrids): void {
            super.setOpenParam(value);
            this._dates = value;
            if (this._dates) {
                this.showUI();
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.instenBtn, LayaEvent.CLICK, this, this.upGrade);
            this.addAutoListener(this.oneInstenBtn, LayaEvent.CLICK, this, this.oneKeyUpGrade);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EQUIPMENT_ZUHUN_UPDATE, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIPS, this, this.updateUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateUI);
        }

        public updateUI() {
            // console.log("噬魂界面刷新");
            let sClass = this._dates[ShihunGridsFields.sClass];
            let level = this._dates[ShihunGridsFields.level];
            let shihunListDate = EquipmentZuHunModel.instance.shihunList[sClass];
            if (shihunListDate) {
                this._dates = shihunListDate;
            }
            this.showUI();
        }

        public showUI() {
            let sClass = this._dates[ShihunGridsFields.sClass];
            let level = this._dates[ShihunGridsFields.level];
            let shihunListDate = EquipmentZuHunModel.instance.shihunList[sClass];
            if (shihunListDate) {
                this._dates = shihunListDate;
            }
            let maxSihunLv = EquipmentShiHunCfg.instance.getMaxLevelByPart(sClass);//当前能达到的最大等级
            level = level > maxSihunLv ? maxSihunLv : level;//判断最大等级防止越界
            let equipmentShiDate = EquipmentShiHunCfg.instance.getDateByPartAndLevel(sClass, level);
            let items = equipmentShiDate[shihunFields.items];
            let parts = equipmentShiDate[shihunFields.parts];
            let maxZhuhunLv = equipmentShiDate[shihunFields.maxZhuhunLv];
            let isOpen = EquipmentZuHunModel.instance.getWhetherToMeet(maxZhuhunLv, parts);


            let tuPoLv = 0;
            if (isOpen) {
                tuPoLv = level;
            } else {
                tuPoLv = level - 1;
                tuPoLv = tuPoLv < 0 ? 0 : tuPoLv;
            }
            let LvMaxSihun = EquipmentShiHunCfg.instance.getMaxLevelByPartAndLevel(sClass, tuPoLv);
            this.devourText.text = `${level}/${LvMaxSihun}`;

            this.setItem = [items[0], 1, 0, null];
            let num = BagModel.instance.getItemCountById(items[0]);
            this.haveText.text = `${num}`;
            if (num > 0) {
                if (this._btnClip) {
                    this._btnClip.play();
                    this._btnClip.visible = true;
                }
                if (this._btnClip1) {
                    this._btnClip1.play();
                    this._btnClip1.visible = true;
                }
            } else {
                if (this._btnClip) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
                if (this._btnClip1) {
                    this._btnClip1.stop();
                    this._btnClip1.visible = false;
                }
            }
            if (maxSihunLv > level) {
                this.instenBtn.visible = this.oneInstenBtn.visible = true;
                this.manjiText.visible = false;
                this.tipText.visible = false;
                if (isOpen) {
                } else {
                    this.tipText.visible = true;
                    this.instenBtn.visible = this.oneInstenBtn.visible = false;
                    let str = ``;
                    for (let index = 0; index < parts.length; index++) {
                        let element = parts[index];
                        if (index == parts.length - 1) {
                            str = str + CommonUtil.getNameByPart(element);
                        } else {
                            str = str + CommonUtil.getNameByPart(element) + "、";
                        }
                    }
                    this.tipText.text = `${str}${maxZhuhunLv}阶提高吞噬上限`;
                }
            } else {
                this.instenBtn.visible = this.oneInstenBtn.visible = false;
                this.manjiText.visible = true;
                this.tipText.visible = false;
            }
            this.setAttribute();
        }

        public set setItem(value: Protocols.Item) {
            let itemId: number = value[Protocols.ItemFields.ItemId];
            let num: number = 0;
            if (itemId == MoneyItemId.zq || itemId == MoneyItemId.copper || itemId == MoneyItemId.glod || itemId == MoneyItemId.exp || itemId == MoneyItemId.bind_gold) {
                num = PlayerModel.instance.getCurrencyById(itemId);
            } else {
                num = BagModel.instance.getItemCountById(itemId);
            }
            this.nowBaseItem.dataSource = value;
            this.nowBaseItem._numTxt.visible = false;
            this.nameText.color = CommonUtil.getColorById(itemId);
            let itemCfg: item_material | item_equip | item_stone | runeRefine = CommonUtil.getItemCfgById(itemId);
            let type: number = CommonUtil.getItemTypeById(itemId);
            let isStone: boolean = type === ItemMType.Stone;
            if (type == ItemMType.Rune) {
                let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                let dimCfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
                this.nameText.text = dimCfg[item_runeFields.name];
            } else {
                this.nameText.text = itemCfg[isStone ? item_stoneFields.name : item_materialFields.name].toString();
            }
        }

        private setAttribute() {
            for (let index = 0; index < this._nameTextArry.length; index++) {
                let _nameText = this._nameTextArry[index];
                let _valueText = this._valueTextArry[index];
                let _upValueText = this._upValueTextArry[index];
                let _upValueImg = this._upValueImgArry[index];
                _nameText.visible = _valueText.visible = _upValueText.visible = _upValueImg.visible = false;
            }
            let sClass = this._dates[ShihunGridsFields.sClass];
            let level = this._dates[ShihunGridsFields.level];
            let cfg = EquipmentShiHunCfg.instance.getDateByPartAndLevel(sClass, level);
            let nextCfg = EquipmentShiHunCfg.instance.getDateByPartAndLevel(sClass, level + 1);
            //设置属性
            let leng = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTextArry,
                this._valueTextArry,
                this._upValueImgArry,
                this._upValueTextArry,
                shihunFields.attrs
            );
            // console.log("属性个数：   " + leng);
            let startY = (this.diTuImg.height - (leng * 24 + (leng - 1) * 21)) / 2;
            for (let index = 0; index < this._nameTextArry.length; index++) {
                let _nameText = this._nameTextArry[index];
                let _valueText = this._valueTextArry[index];
                let _upValueText = this._upValueTextArry[index];
                let _upValueImg = this._upValueImgArry[index];
                _nameText.y = _valueText.y = _upValueText.y = _upValueImg.y = startY + index * 45;
            }
        }

        //噬魂
        private upGrade(): void {
            let sClass = this._dates[ShihunGridsFields.sClass];
            let level = this._dates[ShihunGridsFields.level];

            let equipmentShiDate = EquipmentShiHunCfg.instance.getDateByPartAndLevel(sClass, level);
            let items = equipmentShiDate[shihunFields.items];
            let num = BagModel.instance.getItemCountById(items[0]);
            if (num > 0) {
                EquipmentZuHunCtrl.instance.ShihunOper(sClass);
            } else {
                BagUtil.openLackPropAlert(items[0], 1);
            }
        }

        //一键噬魂
        private oneKeyUpGrade(): void {
            let sClass = this._dates[ShihunGridsFields.sClass];
            let level = this._dates[ShihunGridsFields.level];

            let equipmentShiDate = EquipmentShiHunCfg.instance.getDateByPartAndLevel(sClass, level);
            let items = equipmentShiDate[shihunFields.items];
            let num = BagModel.instance.getItemCountById(items[0]);
            if (num > 0) {
                EquipmentZuHunCtrl.instance.ShihunOperOneKey(sClass);
            } else {
                BagUtil.openLackPropAlert(items[0], 1);
            }
        }

        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.play();
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.instenBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -8, true);
            // this._btnClip.scale(0.8, 0.8);
            this._btnClip.visible = false;

            // this._btnClip1 = new CustomClip();
            // this._btnClip1.skin = "assets/effect/btn_light.atlas";
            // this._btnClip1.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip1.durationFrame = 5;
            // this._btnClip1.play();
            // this._btnClip1.loop = true;
            this._btnClip1 = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.oneInstenBtn.addChild(this._btnClip1);
            this._btnClip1.pos(-6, -8, true);
            // this._btnClip1.scale(0.8, 0.8);
            this._btnClip1.visible = false;
        }

        public destroy(): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._btnClip1 = this.destroyElement(this._btnClip1);
            super.destroy();
        }
    }
}
