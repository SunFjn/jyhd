///<reference path="../common/num_input_ctrl.ts"/>
///<reference path="../bag/base_item.ts"/>
///<reference path="../bag/bag_model.ts"/>
///<reference path="../config/get_way_cfg.ts"/>
///<reference path="../common_alert/lack_prop_alert.ts"/>
///<reference path="../faction/faction_ctrl.ts"/>
/** 道具使用弹框*/


namespace modules.commonAlert {
    import FactionCtrl = modules.faction.FactionCtrl;
    import item_equip = Configuration.item_equip;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import item_stone = Configuration.item_stone;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import CommonUtil = modules.common.CommonUtil;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import PropUseAlertUI = ui.PropUseAlertUI;
    import GetWayCfg = modules.config.GetWayCfg;
    import ItemFields = Protocols.ItemFields;
    import BagModel = modules.bag.BagModel;
    import PlayerModel = modules.player.PlayerModel;
    import runeRefine = Configuration.runeRefine;
    import BagUtil = modules.bag.BagUtil;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;


    export class PropUseAlert extends PropUseAlertUI {

        private _numInputCtrl: NumInputCtrl;

        // 道具
        private _item: Protocols.Item;
        private _baseItem: BaseItem;
        private _sourceBtns: Array<Laya.Image>;
        private _sourceBtnY: number;
        private _sourceBtnBg: Array<Laya.Image>;
        private _decTex: Array<laya.display.Text>;
        // 是否强制使用（强制使用忽略配置表的canUse字段）
        private _forceUse: boolean;

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            this._numInputCtrl.addListeners();
            this.useBtn.on(Event.CLICK, this, this.useHandler);
            for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
                this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._numInputCtrl.removeListeners();
            this.useBtn.off(Event.CLICK, this, this.useHandler);
        }

        protected initialize(): void {
            super.initialize();
            this._numInputCtrl = new NumInputCtrl(this.numInput, this.addBtn, this.minusBtn, this.addTenBtn, this.minusTenBtn);
            this._baseItem = new BaseItem();
            this.addChild(this._baseItem);
            this._baseItem.pos(48, 79, true);
            this._baseItem.nameVisible = false;
            this._baseItem.needTip = false;
            this.descTxt.color = "#ffffff";
            this.descTxt.style.fontFamily = "SimHei";
            this.descTxt.style.fontSize = 24;
            this._sourceBtns = new Array<Laya.Image>();
            this._sourceBtnBg = new Array<Laya.Image>();
            this._decTex = new Array<laya.display.Text>();
            for (let i: number = 0; i < 4; i++) {
                this._sourceBtns[i] = new Laya.Image();
                this._sourceBtns[i].mouseEnabled = true;
                this._sourceBtnBg[i] = new Laya.Image();
                this._decTex[i] = new laya.display.Text();
                PropAlertUtil.setDesTxt(this._decTex[i]);
            }
        }

        public destroy(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this._sourceBtns[i].destroy(true);
                    this._sourceBtnBg[i].destroy(true);
                    this._decTex[i].destroy(true);
                }
                this._sourceBtns = this._sourceBtnBg = this._decTex = null;
            }
            super.destroy();
        }

        private useHandler(): void {
            if (!this._item) return;
            let itemId: number = this._item[ItemFields.ItemId];

            let cfg: item_material = ItemMaterialCfg.instance.getItemCfgById(itemId);
            if (!this._forceUse && cfg && cfg[item_materialFields.canUse] > 0) {
                WindowManager.instance.openByActionId(cfg[item_materialFields.canUse]);
            } else {
                let count: number = this._numInputCtrl.value;
                if (BagUtil.checkIsManualGift(itemId)) {
                    WindowManager.instance.openDialog(WindowEnum.MANUAL_GIFT_ALERT, this._item);
                } else if (config.BlendCfg.instance.getCfgById(36035)[Configuration.blendFields.intParam][0] == itemId) {
                    let id: number = config.BlendCfg.instance.getCfgById(36035)[Configuration.blendFields.intParam][0];
                    FactionCtrl.instance.addCopyTime([id, count]);
                } else {
                    BagCtrl.instance.useBagItemByIdUid(itemId, this._item[ItemFields.uid], count);
                }
            }
            this.close();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._forceUse = value[1];
            this.item = value[0];
        }

        public set item(value: Protocols.Item) {
            this._item = value;
            this.removeChildSource();
            let itemId: number = value[Protocols.ItemFields.ItemId];
            let num: number = 0;
            if (itemId == MoneyItemId.zq || itemId == MoneyItemId.copper || itemId == MoneyItemId.glod || itemId == MoneyItemId.exp || itemId == MoneyItemId.bind_gold) {
                num = PlayerModel.instance.getCurrencyById(itemId);
            } else {
                num = BagModel.instance.getItemCountById(itemId);
            }
            this.numTxt.text = "拥有数量：" + num.toString();
            this._baseItem.dataSource = value;
            //this.numInput.text=value[Protocols.ItemFields.count].toString();
            this._numInputCtrl.max = BagUtil.checkIsManualGift(itemId) ? 1 : value[Protocols.ItemFields.count];
            this._numInputCtrl.value = this._numInputCtrl.max;
            // let itemType: int = CommonUtil.getItemTypeById(itemId);
            // if (itemType === ItemMType.Material) {
            //     this._numInputCtrl.value = this._numInputCtrl.max;
            // }
            // else {
            //     this._numInputCtrl.value = 1;
            // }

            // 剩余次数还没有
            // this.restTimesTxt.text = ;
            // 获取配置信息
            let itemCfg: item_material = CommonUtil.getItemCfgById(itemId) as item_material;
            this.nameTxt.text = itemCfg[item_materialFields.name];
            // this.nameTxt.color = CommonUtil.getColorById(itemId);
            //.....新增 道具品质背景图
            this.qualityImg.skin = CommonUtil.getBgImgById(itemId);  // getBgImgById  
            let quality: int = CommonUtil.getItemQualityById(itemId);
            this.qualityImg1.visible = this.qualityImg2.visible = this.qualityImg3.visible = quality == 6;
            //.....
            this.descTxt.style.height = 0;
            this.descTxt.style.leading = 10;
            this.descTxt.innerHTML = itemCfg[item_materialFields.des] as string;
            this.levelTxt.text = `使用等级：${itemCfg[item_materialFields.useLvl]}`;

            let arr: Array<number> = <Array<number>>itemCfg[Configuration.item_materialFields.itemSourceId];
            this.setImagePosition(arr);
            let getWayCfg: Configuration.get_way;
            for (let i: number = 0, len: number = arr.length; i < len; i++) {
                this.addChild(this._sourceBtnBg[i]);
                this.addChild(this._sourceBtns[i]);
                getWayCfg = GetWayCfg.instance.getCfgById(arr[i]);
                this._sourceBtns[i].pos(30 + (510 - 158 * len + 42 * (len - 1)) * 0.5 + i * 116, this._sourceBtnY);
                this._sourceBtns[i].skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
                this._sourceBtnBg[i].skin = `assets/icon/ui/get_way/btn_ydrk_bg.png`;
                this._sourceBtns[i].addChild(this._decTex[i]);
                this._decTex[i].text = getWayCfg[Configuration.get_wayFields.desc];
                this._sourceBtnBg[i].pos(this._sourceBtns[i].x, this._sourceBtns[i].y);
                this._decTex[i].pos(6, 70);
            }
        }


        private removeChildSource(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this._sourceBtns[i].skin = "";
                    this.removeChild(this._sourceBtns[i]);
                    this._sourceBtnBg[i].skin = "";
                    this.removeChild(this._sourceBtnBg[i]);
                    this._decTex[i].text = "";
                    this.removeChild(this._decTex[i]);
                }
            }
        }

        private getOpenPlaneId(index: number): void {
            let itemCfg: item_material | item_equip | item_stone | runeRefine = CommonUtil.getItemCfgById(this._item[Protocols.ItemFields.ItemId]);
            let arr: Array<number> = <Array<number>>itemCfg[Configuration.item_materialFields.itemSourceId];
            let id: number = arr[index];
            PropAlertUtil.clickHandler(id);
        }

        private setImagePosition(arr: Array<number>): void {
            if (arr.length > 0) {
                this.getSoureImage.visible = true;
                this.getSoureTxt.visible = true;
                this.getSoureImage.y = this.descTxt.y + this.descTxt.height - 5;
                this.getSoureTxt.y = this.descTxt.y + this.descTxt.height;
                this._sourceBtnY = this.getSoureImage.y + this.getSoureImage.height + 20;
                this.lineimage.y = this._sourceBtnY + 100 + 10;
            } else {
                this.getSoureImage.visible = false;
                this.getSoureTxt.visible = false;
                this.lineimage.y = this.descTxt.y + this.descTxt.height - 5;
            }
            let cfg: item_material = ItemMaterialCfg.instance.getItemCfgById(this._item[ItemFields.ItemId]);
            let isNotShowBox: boolean = cfg[item_materialFields.canUse] > 0 && !this._forceUse;  //配有跳转途径无法使用

            if (BagUtil.checkIsManualGift(this._item[ItemFields.ItemId]) || isNotShowBox) {       // N选一礼包不显示输入数量组件
                this.buttonBox.visible = false;
                this.useBtn.y = this.lineimage.y + this.lineimage.height + 20;
            } else {
                this.buttonBox.visible = true;
                this.buttonBox.y = this.lineimage.y + this.lineimage.height + 20;
                this.useBtn.y = this.buttonBox.y + 74;
            }

            this.bgImg.height = this.useBtn.y + 136;
            this.height = this.bgImg.height;
            this.closetex.y = this.height + 20;
            this.qualityImg1.height = this.height + 6;
            this.backTxt.y = this.height;
        }
    }
}