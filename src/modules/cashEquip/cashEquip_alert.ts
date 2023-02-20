namespace modules.cashEquip {
    import CashEquipAlertUI = ui.CashEquipAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import item_stoneFields = Configuration.item_stoneFields;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import runeRefine = Configuration.runeRefine;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import cash_EquipFields = Configuration.cashEquipFields;
    import GetWayCfg = modules.config.GetWayCfg;
    import Event = Laya.Event;// 事件
    import MissionModel = modules.mission.MissionModel;
    import cash_Equip = Configuration.cashEquip;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class CashEquipAlert extends CashEquipAlertUI {

        private _baseItem: BaseItem;
        private _h: number = 500;
        private _recordFuncIds: number[];
        private _sourceBtns: Array<Laya.Image>; // 获取来按钮
        private _sourceBtnBg: Array<Laya.Image>; // 获取来按钮背景
        private _desTxt: Array<laya.display.Text>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();



            //物品位置
            this._baseItem = new BaseItem();
            this._baseItem.pos(48, 79, true);
            this._baseItem.nameVisible = false;
            this._baseItem.needTip = false;
            this.addChild(this._baseItem);


            this.descTxt.color = "#ffffff";
            this.descTxt.style.fontFamily = "SimHei";
            this.descTxt.style.fontSize = 22;

            this.descTxt2.color = "#ffffff";
            this.descTxt2.style.fontFamily = "SimHei";
            this.descTxt2.style.fontSize = 22;

            this.zOrder = 1;
            this._recordFuncIds = [];



            this._sourceBtns = new Array<Laya.Image>();
            this._sourceBtnBg = new Array<Laya.Image>();
            this._desTxt = new Array<laya.display.Text>();
            for (let i: number = 0; i < 4; i++) {
                this._sourceBtns[i] = new Laya.Image();
                this._sourceBtns[i].mouseEnabled = true;
                this._sourceBtnBg[i] = new Laya.Image();
                this._desTxt[i] = new laya.display.Text();
                modules.commonAlert.PropAlertUtil.setDesTxt(this._desTxt[i]);
            }
            this.regGuideSpr(GuideSpriteId.BOTTOM_CashEquip_CLOSE2, this.getBtn);
        }

        protected addListeners(): void {
            super.addListeners();
            for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
                this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
            }

            this.tixianBtn.on(Event.CLICK, this, this._clickHandler);
            this.rollText.on(Event.CLICK, this, this.openList);
            this.getBtn.on(Event.CLICK, this, this.getOpenPlaneId, [0]);

            if (15260002 != this.itemId) {
                this.guideSprUndisplayHandler(GuideSpriteId.BOTTOM_CashEquip_CLOSE2)
            }
        }

        protected removeListeners(): void {
            super.removeListeners();

        }
        private openList() {
            if (this.cashEquipCfg[cash_EquipFields.roll] > 100) {
                if (15260001 == this.itemId && MissionModel.instance.curLv <= 2)
                    return;
                if (15260002 == this.itemId && MissionModel.instance.curLv <= 11)
                    return;

                WindowManager.instance.closeAllDialog()
                WindowManager.instance.open(WindowEnum.CashEquip_Probability_Alert, [this.cashEquipCfg[cash_EquipFields.roll]]);
            }

        }
        private _clickHandler() {
            WindowManager.instance.open(WindowEnum.CashEquip_Sell_Alert, [this.itemId]);
        }



        public getOpenPlaneId(index: number): void {
            WindowManager.instance.close(WindowEnum.MANUAL_GIFT_ALERT);
            WindowManager.instance.close(WindowEnum.XIANFU_PET_TRAVELING_ALERT);
            WindowManager.instance.close(WindowEnum.XIANFU_PET_READY_GO_ALERT);
            WindowManager.instance.close(WindowEnum.PAYREWARDRANK_ALERT);

            if (15260002 == this.itemId && MissionModel.instance.curLv <= 11) {
                WindowManager.instance.close(WindowEnum.CashEquip_ALERT);
                WindowManager.instance.close(WindowEnum.CashEquip_PANEL);
            } else {
                let id: number = this._recordFuncIds[index];
                switch (id) {
                    case 505://合成装备
                        modules.notice.SystemNoticeManager.instance.addNotice("合成条件不足,无法前往合成", true);
                        return;
                        CashEquipCtrl.instance.MergeCashEquip();
                        WindowManager.instance.close(WindowEnum.CashEquip_ALERT);
                        break;
                    case 507://800级特殊BOSS
                        {
                            if (PlayerModel.instance.eraLevel >= 7 && PlayerModel.instance.level >= 800) {
                                DungeonCtrl.instance.reqEnterScene(2031, 8, [-99]);
                            } else {
                                modules.notice.SystemNoticeManager.instance.addNotice("等级未达到,无法前往", true);
                            }
                        }
                        break;
                    case 506://邀请好友
                        modules.notice.SystemNoticeManager.instance.addNotice("该功能暂未开放", true);
                        break;
                    default://功能跳转
                        modules.commonAlert.PropAlertUtil.clickHandler(id);
                        break;
                }

            }





        }
        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this.sourceBtnBox.removeChildren();

        }
        private itemId: number = 0
        private cashEquipCfg: cash_Equip
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.removeChildSource();
            let data = value as Item

            let itemId;
            let arr: Array<number> = [];
            this.itemId = itemId = data[ItemFields.ItemId]
            let count = data[ItemFields.count]
            let type: number = CommonUtil.getItemTypeById(itemId);
            let itemCfg: item_material | item_equip | item_stone | runeRefine = CommonUtil.getItemCfgById(itemId);
            this.cashEquipCfg = CashEquipCfg.instance.getCfgId(itemId)
            let roll = this.cashEquipCfg[cash_EquipFields.roll] as number

            this.qualityImg.skin = CommonUtil.getBgImgById(itemId);  // getBgImgById  
            let quality: int = CommonUtil.getItemQualityById(itemId);
            this.qualityImg1.visible = this.qualityImg2.visible = this.qualityImg3.visible = quality == 6;
            this.priceText.text = CashEquipCfg.instance.getCfgId(itemId)[cash_EquipFields.gold].toString() + "元";

            //概率大于100读取blend概率表

            this.rollText.text = roll <= 100 ? roll + "%" : this.rollText.text = "查看详情"
            this.numTxt.text = "拥有数量：" + count.toString();
            this._baseItem.dataSource = value;
            this._baseItem._numTxt.visible = false;
            this._baseItem.needTip = false;
            // this.nameTxt.color = CommonUtil.getColorById(itemId);
            this.nameTxt.text = itemCfg[item_materialFields.name].toString();
            this.levelTxt.text = `使用等级：${itemCfg[item_materialFields.useLvl]}`;

            let py = 0 // 功能偏移 
            let py2 = 0 // 获取条件偏移

            this.descTxt.style.height = 0;
            this.descTxt.style.leading = 10;
            this.descTxt.innerHTML = itemCfg[item_materialFields.des] as string;

            this.descTxt2.style.height = 0;
            this.descTxt2.style.leading = 10;
            let desc = this.cashEquipCfg[cash_EquipFields.desc] as string;
            this.descTxt2.innerHTML = desc
            py2 = desc == "" ? -100 : 0//如果没有途径描述 就界面高度变小

            let isStone: boolean = type === ItemMType.Stone;
            this.hasText.text = CashEquipModel.instance.getSurplusCount(itemId).toString()
            if (type == ItemMType.Rune) {
                let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                let dimCfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
                arr = dimCfg[item_runeFields.itemSourceId];
            } else {
                arr = <Array<number>>itemCfg[isStone ? item_stoneFields.itemSourceId : item_materialFields.itemSourceId];
            }
            // 策划要求 前两件装备 有新人装备属性 特殊显示
            //【主线任务】首次通过天关第1关必获得<br/>
            //【主线任务】首次通过天关第10关必获得<br/>
            let curLv = MissionModel.instance.curLv

            py = arr.length == 0 ? -98 : 0

            if (15260001 == itemId && curLv <= 2) {
                this.descTxt.innerHTML = '【主线任务】首次通过天关第1关必获得'
                arr = []
                this.rollText.text = "100%"
                this.descTxt2.innerHTML = desc = ""
                py = -198
            }

            if (15260002 == itemId && curLv <= 11) {
                this.descTxt.innerHTML = '【主线任务】首次通过天关第10关必获得'
                this.rollText.text = "100%"
                arr = []
                this.descTxt2.innerHTML = desc = ""
                py = -198
            }



            this.tixianBtn.x = py != 0 ? 175 : 68
            this.getBtn.visible = py == 0

            if (15260002 == itemId && curLv <= 11) {
                this.getBtn.visible = true;
                this.tixianBtn.x = 68
            }
            this.getBtn.label = itemId == 15260007 ? "合成装备" : "前往获取"


            // 策划要求 合成装备 没有概率 改为通用属性 概率为-1 不显示概率
            if (roll == -1) {
                this.rollTitleTxt.visible = this.rollText.visible = false
                this.hasTitleText.y = this.hasText.y = 118
            } else {
                this.rollTitleTxt.visible = this.rollText.visible = true
                this.hasTitleText.y = this.hasText.y = 153
            }

            //渲染 获取途径按钮
            this._recordFuncIds = arr;
            for (let i: number = 0, len: number = arr.length; i < len; i++) {
                let getWayCfg: Configuration.get_way = GetWayCfg.instance.getCfgById(arr[i]);

                // 获取来源按钮
                this._sourceBtns[i].pos(30 + (500 - 158 * len + 42 * (len - 1)) * 0.5 + i * 116, 0);
                this._sourceBtns[i].skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;

                // 获取来源按钮背景
                this._sourceBtnBg[i].skin = `assets/icon/ui/get_way/btn_ydrk_bg.png`;
                this._sourceBtnBg[i].pos(this._sourceBtns[i].x, this._sourceBtns[i].y);

                this._desTxt[i].pos(6, 70);
                this._desTxt[i].text = getWayCfg[Configuration.get_wayFields.desc];

                this.sourceBtnBox.addChild(this._sourceBtnBg[i]);
                this.sourceBtnBox.addChild(this._sourceBtns[i]);
                this._sourceBtns[i].addChild(this._desTxt[i]);

            }


            // 根据所有条件 重新适应高度
            if (desc == "") {
                this.getBox.visible = false
                this.getBox2.y = 380
            } else {
                this.getBox.visible = true
                this.getBox2.y = 400 + 100 + (this.descTxt2.height - 32)
            }

            this.height = 800 + (this.descTxt.height - 32) + py + py2 + (this.descTxt2.height - 32)
            this.backTxt.y = this.height;
        }

        private removeChildSource(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this.removeChild(this._sourceBtns[i]);
                    this.removeChild(this._sourceBtnBg[i]);
                    this.removeChild(this._desTxt[i]);
                }
            }
        }
        public destroy(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this._sourceBtns[i].destroy(true);
                    this._sourceBtnBg[i].destroy(true);
                    this._desTxt[i].destroy(true);
                }
                this._sourceBtns = this._sourceBtnBg = this._desTxt = null;
            }
            super.destroy();
        }
    }

}