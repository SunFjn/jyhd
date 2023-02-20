///<reference path="../store/store_model.ts"/>
///<reference path="../config/store_cfg.ts"/>
///<reference path="./prop_alert_util.ts"/>
namespace modules.commonAlert {
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import BaseItem = modules.bag.BaseItem;
    import Event = laya.events.Event;
    import item_material = Configuration.item_material;
    import item_equip = Configuration.item_equip;
    import item_rune = Configuration.item_rune;
    import item_stone = Configuration.item_stone;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_materialFields = Configuration.item_materialFields;
    import GetWayCfg = modules.config.GetWayCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import StoreCfg = modules.config.StoreCfg;
    import StoreModel = modules.store.StoreModel;
    import item_runeFields = Configuration.item_runeFields;
    import erorr_codeFields = Configuration.erorr_codeFields;
    import ErrorCodeCfg = modules.config.ErrorCodeCfg;
    import PlayerModel = modules.player.PlayerModel;
    import runeRefine = Configuration.runeRefine;
    import Handler = laya.utils.Handler;
    import CommonUtil = modules.common.CommonUtil;

    export class LackPropAlert extends ui.LackPropAlertUI {

        private _numInputCtrl: NumInputCtrl;
        private _item: Protocols.Item;
        private _baseItem: BaseItem;
        private _sourceBtns: Array<Laya.Image>;
        private _sourceBtnY: number;
        private _soureceBtnH: number = 0;
        private _sale: number;
        private _buyPropNum: number;
        private _id: number;
        private _image: Array<Laya.Image>;
        private _desTxt: Array<laya.display.Text>;
        private _isCoinBtn: boolean;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._numInputCtrl = new NumInputCtrl(this.numInput, this.addBtn, this.minusBtn, this.addTenBtn, this.minusTenBtn);
            this._baseItem = new BaseItem();
            // this._baseItem.needTip = true;
            this.addChild(this._baseItem);
            this._baseItem.pos(280, 129, true);
            this._baseItem.nameVisible = true;
            this._baseItem.nameColor = '#000000';
            this._sourceBtns = new Array<Laya.Image>();
            this._image = new Array<Laya.Image>();
            this._desTxt = new Array<laya.display.Text>();

            for (let i: number = 0; i < 4; i++) {
                this._sourceBtns[i] = new Laya.Image();
                this._image[i] = new Laya.Image();
                this._desTxt[i] = new laya.display.Text();
                PropAlertUtil.setDesTxt(this._desTxt[i]);
                this._sourceBtns[i].mouseEnabled = true;
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this._numInputCtrl.addListeners();
            this.buyBtn.on(Event.CLICK, this, this.buyHandler);
            this.closeBtn.on(Event.CLICK, this, this.close);
            for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
                this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
                this._sourceBtns[i][GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            }
            this._numInputCtrl.on(Event.CHANGE, this, this.sortcutBuy);

            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.purChase);
        }

        protected removeListeners(): void {
            super.removeListeners();

            this._numInputCtrl.removeListeners();
            this.closeBtn.off(Event.CLICK, this, this.close);
            this.buyBtn.off(Event.CLICK, this, this.buyHandler);
            this._numInputCtrl.off(Event.CHANGE, this, this.sortcutBuy);
            GlobalData.dispatcher.off(CommonEventType.PURCHASE_REPLY, this, this.purChase);
        }

        private buyHandler(): void {
            this._buyPropNum = parseInt(this.numInput.text);
            if (this._buyPropNum == 0) {
                CommonUtil.goldNotEnoughAlert();
                this.close();
            } else {
                Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [this._id, this._buyPropNum]);
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            this.close();
        }

        private purChase(): void {
            let errofCfg: Configuration.erorr_code = ErrorCodeCfg.instance.getErrorCfgById(StoreModel.instance.PurchaseReply[0]);
            if (errofCfg[erorr_codeFields.error_code] != 0) {
                CommonUtil.noticeError(errofCfg[erorr_codeFields.error_code]);
            } else {
                SystemNoticeManager.instance.addNotice("购买成功");
                this.close();
            }
        }

        private sortcutBuy(): void {
            this._numInputCtrl.min = 1;
            let goldnum: number = parseInt(this.numInput.text);
            this.allMoneyTxt.text = (this._sale * goldnum).toString();
            this._buyPropNum = goldnum;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._isCoinBtn = false;
            if (value[2] !== undefined) {
                this._isCoinBtn = value[2];
            }
            this.item = [[value[0], 0, 0, null], value[1]];
        }

        public set item(value: [Protocols.Item, number]) {
            this.removeChildSource();
            this._item = value[0];
            //this._buyPropNum=value[1];
            let itemId: number = value[0][Protocols.ItemFields.ItemId];
            this._baseItem.needTip = true;
            let itemCfg: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(itemId);
            let isStone: boolean = CommonUtil.getItemTypeById(itemId) === ItemMType.Stone;
            let arr: Array<number> = <Array<number>>itemCfg[isStone ? item_stoneFields.itemSourceId : item_materialFields.itemSourceId];

            // 玉荣新增-待优化
            if (CommonUtil.getItemTypeById(itemId) === ItemMType.Rune) {
                arr = itemCfg[item_runeFields.itemSourceId] as unknown as any;
            }

            if (this._isCoinBtn) {
                this.Title.text = '通过以下途径获取';
            } else {
                this.Title.text = '材料不足，通过以下途径获取';
            }
            //是否有快捷购买
            if (this.shortBuy(itemCfg, isStone)) {
                this.shortCutBuyBox.visible = true;

                let mallCfg: Configuration.mall = StoreCfg.instance.getCfgByitemId(<number>itemCfg[isStone ? item_stoneFields.shortcutBuy : item_materialFields.shortcutBuy]);
                this._sale = mallCfg[Configuration.mallFields.realityPrice][1];
                if (mallCfg[Configuration.mallFields.realityPrice][0] == MoneyItemId.copper) {

                    this._numInputCtrl.max = Math.floor(PlayerModel.instance.copper / mallCfg[Configuration.mallFields.realityPrice][1]);

                }
                if (mallCfg[Configuration.mallFields.realityPrice][0] == MoneyItemId.glod) {
                    this._numInputCtrl.max = Math.floor(PlayerModel.instance.ingot / mallCfg[Configuration.mallFields.realityPrice][1]);
                }
                let itemType: int = CommonUtil.getItemTypeById(itemId);
                // if (itemType === ItemMType.Material) {
                //     this._numInputCtrl.value = this._numInputCtrl.max;
                // }
                // else {
                this._numInputCtrl.value = 1;
                // }

                value[0] = [itemId, mallCfg[Configuration.mallFields.count], 0, null];
                this._baseItem.dataSource = value[0];
                this.goldImg.skin = CommonUtil.getIconById(mallCfg[Configuration.mallFields.realityPrice][0], true);
                this.lgoldImg.skin = CommonUtil.getIconById(mallCfg[Configuration.mallFields.realityPrice][0], true);
                this._id = mallCfg[Configuration.mallFields.id];
                this.allMoneyTxt.text = (this._numInputCtrl.value * this._sale).toString();
                this.moneyTxt.text = this._sale.toString();
                if (arr.length == 0) {
                    this.bgImg.height = this.shortCutBuyBox.y + this.shortCutBuyBox.height + 36;
                    this.height = this.bgImg.height;
                } else {
                    this._sourceBtnY = 490;
                    for (let i: number = 0, len: number = arr.length; i < len; i++) {
                        this.getWayBtn(this._sourceBtns[i], arr[i], arr.length, i, this._image[i]);
                    }
                    this._soureceBtnH = 100;
                    this.bgImg.height = this._sourceBtnY + this._soureceBtnH + 56;
                    this.height = this.bgImg.height;
                }
            } else {
                this._baseItem.dataSource = value[0];
                this.shortCutBuyBox.visible = false;
                this.lineimage.y = this.shortCutBuyBox.y;
                this._sourceBtnY = this.lineimage.y + this.lineimage.height + 16;
                for (let i: number = 0, len: number = arr.length; i < len; i++) {
                    this.getWayBtn(this._sourceBtns[i], arr[i], arr.length, i, this._image[i]);
                }
                this._soureceBtnH = 100;
                this.bgImg.height = this._sourceBtnY + this._soureceBtnH + 36;
                this.height = this.bgImg.height;
            }
            this.backTxt.y = this.height + 24;
        }

        //判断是否有快捷购买
        private shortBuy(itemCfg: item_material | item_equip | item_stone | runeRefine | item_rune, isStone: boolean): boolean {
            if (isStone) {
                return !!itemCfg[item_stoneFields.shortcutBuy];
            } else {
                return !!itemCfg[item_materialFields.shortcutBuy];
            }
        }

        private getWayBtn(img: Laya.Image, arr: number, len: number, n: number, image: Laya.Image): void {
            let getWayCfg: Configuration.get_way;
            this.addChild(image);
            this.addChild(img);
            getWayCfg = GetWayCfg.instance.getCfgById(arr);
            img.pos(30 + (660 - 158 * len + 42 * (len - 1)) * 0.5 + n * 116, this._sourceBtnY);
            img.skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
            image.skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
            image.pos(img.x, img.y);
            img.addChild(this._desTxt[n]);
            this._desTxt[n].pos(6, 70);
            this._desTxt[n].text = getWayCfg[Configuration.get_wayFields.desc];
        }

        private getOpenPlaneId(index: number): void {
            let itemCfg: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(this._item[Protocols.ItemFields.ItemId]);
            let arr: Array<number> = <Array<number>>itemCfg[Configuration.item_materialFields.itemSourceId];
            let getWayCfg: Configuration.get_way = GetWayCfg.instance.getCfgById(arr[index]);
            let openPlane: Array<number> = getWayCfg[Configuration.get_wayFields.params];
            let id: number = getWayCfg[Configuration.get_wayFields.id];
            if (id != 500) {
                this.close();
                WindowManager.instance.closeAllDialog();
            } else {
                modules.notice.SystemNoticeManager.instance.addNotice("请多关注游戏内活动哦", false);
            }
            let skipId: number = getWayCfg[Configuration.get_wayFields.params][0];
            if (skipId) {
                if (skipId > 999) { //进场景
                    if (skipId == SCENE_ID.scene_homestead) {
                        xianfu.XianfuCtrl.instance.enterScene();
                    } else {
                        dungeon.DungeonCtrl.instance.reqEnterScene(skipId);
                    }
                } else {
                    WindowManager.instance.openByActionId(skipId);
                }
            }
        }

        private removeChildSource(): void {
            if (this._sourceBtns != null) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this.removeChild(this._sourceBtns[i]);
                }
            }
            if (this._image != null) {
                for (let i: number = 0; i < this._image.length; i++) {
                    this.removeChild(this._image[i]);
                    this.removeChild(this._desTxt[i]);
                }
            }
            this.bgImg.height = this.height = 700;
            this.backTxt.y = 750;
            this.lineimage.y = 463;
        }

        public destroy(): void {
            if (this._sourceBtns != null) {
                for (let e of this._sourceBtns) {
                    e.destroy(true);
                }
                this._sourceBtns = null;
            }

            if (this._image != null) {
                for (let e of this._image) {
                    e.destroy(true);
                }
                this._image = null;
            }

            if (this._desTxt != null) {
                for (let e of this._desTxt) {
                    e.destroy(true);
                }
                this._desTxt = null;
            }
            super.destroy();
        }
    }
}