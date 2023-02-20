///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/store_cfg.ts"/>
/// <reference path="../store/store_model.ts" />

namespace modules.treasure {
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Point = laya.maths.Point;
    import List = laya.ui.List;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import TreasureCfg = modules.config.TreasureCfg;
    import Image = laya.ui.Image;
    import Label = laya.ui.Label;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import StoreCfg = modules.config.StoreCfg;
    import mallFields = Configuration.mallFields;
    import MallNodeFields = Protocols.MallNodeFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import StoreModel = modules.store.StoreModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class TreasureAlert extends ui.TreasureAlertUI {
        private _list: List;
        private _showIds: Array<any>;
        private tenWidth: number = 550;
        private fifWidth: number = 807;
        private _costNumArr: Array<Label>;
        private _costImgArr: Array<Image>;
        private _type: number;
        private _cdFlag: boolean;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._list = new List();
            this._list.vScrollBarSkin = "";
            this._list.width = 620;
            this._list.height = 530;
            this._list.repeatX = 5;
            this._list.spaceX = 20;
            this._list.spaceY = 20;
            this._list.itemRender = BagItem;
            this._list.x = 40;
            this._list.y = 90;
            this.addChild(this._list);

        }

        public onOpened(): void {
            super.onOpened();

        }

        public close(): void {
            this.setFlag();
            super.close();
        }

        public playEffect(value: any): void {
            let effectItems = value as number[];
            for (let i = 0; i < this._list.cells.length; i++) {
                let x = this._list.cells[i].x + this._list.cells[i].width / 2;
                let y = this._list.cells[i].y + this._list.cells[i].height / 2;
                let start = new Point(x, y);
                let arr = [effectItems[i], start, this.height];
                GlobalData.dispatcher.event(CommonEventType.XUNBAO_EFFECT, [arr]);
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value == null) return;
            this._showIds.length = 0;
            let items = value[0];
            this._type = value[1];
            let len = items.length;
            if (len == 10) {
                this.height = this.bg.height = this.tenWidth;
                this._list.height = 280;
                this.btn1.y = 392;
            } else {
                this.height = this.bg.height = this.fifWidth;
                this._list.height = 530;
                this.btn1.y = 649;
            }
            for (let i = 0; i < items.length; i++) {
                let arr = [items[i], 0, 0, null];
                this._showIds.push(arr);
            }
            // this._showIds.sort((l: Array<number>, r: Array<number>): number => {
            //     let lId = l[0];
            //     let rId = r[0];
            //     let lQuailty = CommonUtil.getItemQualityById(lId);
            //     let rQuailty = CommonUtil.getItemQualityById(rId);
            //     if (lQuailty == rQuailty) {
            //         return lId > rId ? -1 : 1;
            //     }
            //     return lQuailty > rQuailty ? -1 : 1;
            // });
            this._list.array = this._showIds;
            this._list.scrollTo(0);

            this.playEffect(items);

            this._costNumArr = [null, this.tenCount, this.fiftyCount];
            this._costImgArr = [null, this.tenCountImg, this.fifityCountImg];

            let bollll = false;
            this.tenBtn.label = "探索10次";
            this.fiftyBtn.label = "探索50次";
            switch (this._type) {
                case 0:
                    bollll = StoreModel.instance.dontShowTreasure;
                    break;
                case 4:
                    bollll = StoreModel.instance.dontShowTalisman;
                    break;
                case 3:
                    bollll = StoreModel.instance.dontShowFuWen;
                    this.tenBtn.label = "10连抽";
                    this.fiftyBtn.label = "30连抽";
                    break;
                case 2:
                    bollll = StoreModel.instance.dontShowZhiZun;
                    break;
                case 1:
                    bollll = StoreModel.instance.dontShowDianFeng;
                    break;
            }
            for (let i = 0; i < this._costNumArr.length; i++) {
                let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, i);
                if (this._costImgArr[i]) {
                    this._costImgArr[i].skin = CommonUtil.getIconById(condition[idCountFields.id]);
                    this._costImgArr[i].scale(0.4, 0.4);
                    let cost = condition[idCountFields.count];
                    let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
                    this._costNumArr[i].text = count + "/" + cost;
                    if (count >= cost) {
                        this._costNumArr[i].color = "#2d2d2d";
                    } else {
                        if (bollll) {
                            this._costImgArr[i].skin = `common/icon_tongyong_2.png`;
                            this._costNumArr[i].color = "#2d2d2d";
                            this._costImgArr[i].scale(1, 1);
                            let mallCfg: Configuration.mall = CommonUtil.getMallByItemId(condition[idCountFields.id]);
                            if (mallCfg) {
                                let xianjia = mallCfg[Configuration.mallFields.realityPrice][1];
                                let chaNum = cost - count;
                                let moneyNum = chaNum * xianjia;
                                this._costNumArr[i].text = `${moneyNum}`;
                                if (modules.player.PlayerModel.instance.ingot >= moneyNum) {
                                    this._costNumArr[i].color = "#2d2d2d";
                                }
                                else {
                                    this._costNumArr[i].color = "#E6372E";
                                }
                            }
                        }
                        else {
                            this._costNumArr[i].color = "#E6372E";
                        }
                    }
                }
            }
        }

        private xunBaoHandler(value: any): void {
            //condition没有用枚举 
            if (value) {
                if (this._cdFlag) {
                    SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
                    return;
                }
                this._cdFlag = true;
                Laya.timer.once(500, this, this.setFlag);
            }
            let bollll = false;
            switch (this._type) {
                case 0:
                    bollll = StoreModel.instance.dontShowTreasure;
                    break;
                case 4:
                    bollll = StoreModel.instance.dontShowTalisman;
                    break;
                case 3:
                    bollll = StoreModel.instance.dontShowFuWen;
                    break;
                case 2:
                    bollll = StoreModel.instance.dontShowZhiZun;
                    break;
                case 1:
                    bollll = StoreModel.instance.dontShowDianFeng;
                    break;
            }
            if (bollll) {
                let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, value);
                let cost = condition[idCountFields.count];
                let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
                let isMianFei = TreasureModel.instance.fistMianFei(this._type);
                if (count >= cost || (isMianFei && value == 0)) {
                    //直接发送抽奖请求
                    //如果数量足够，直接探索
                    TreasureCtrl.instance.runXunbao(this._type, value, true); return;
                } else {
                    let mallCfg: Configuration.mall = CommonUtil.getMallByItemId(condition[idCountFields.id]);
                    if (mallCfg) {
                        let xianjia = mallCfg[Configuration.mallFields.realityPrice][1];
                        let chaNum = cost - count;
                        let moneyNum = chaNum * xianjia;
                        if (modules.player.PlayerModel.instance.ingot >= moneyNum) {
                            //直接发送抽奖请求
                            TreasureCtrl.instance.runXunbao(this._type, value, true); return;
                        }
                        else {
                            CommonUtil.goldNotEnoughAlert();
                        }
                    }
                }
            }
            else {//改之前的逻辑并不想动
                let condition = TreasureCfg.instance.getItemConditionByGrad(this._type, value);/*消耗道具 道具ID#道具数量*/
                let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);   //拥有道具的数量
                let maxNum = condition[1];//消耗道具数量
                let conditionId = condition[0];//消耗道具ID
                maxNum = maxNum ? maxNum : 1;
                //如果数量足够，直接探索
                let isMianFei = TreasureModel.instance.fistMianFei(this._type);
                if (count >= maxNum || (isMianFei && value == 0)) {
                    TreasureCtrl.instance.runXunbao(this._type, value); return;
                }
                let shortcutBuy: number = ItemMaterialCfg.instance.getItemCfgById(conditionId)[item_materialFields.shortcutBuy];
                let malldata: Configuration.mall = StoreCfg.instance.getCfgByitemId(shortcutBuy);
                let need: number = maxNum - count;     //需要购买的数量
                //装备0 巅峰1 至尊2 圣物4
                switch (this._type) {
                    case 0:
                        if (StoreModel.instance.dontShowTreasure) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        }
                        else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;

                    case 4:
                        if (StoreModel.instance.dontShowTalisman) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        }
                        else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;

                    case 3:
                        if (StoreModel.instance.dontShowFuWen) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        }
                        else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;

                    case 2:
                        if (StoreModel.instance.dontShowZhiZun) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        }
                        else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;

                    case 1:
                        if (StoreModel.instance.dontShowDianFeng) {
                            Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [malldata[mallFields.id], need])
                        }
                        else {
                            WindowManager.instance.openDialog(WindowEnum.STORE_SPECIAL_ALERT, [malldata, need]);
                        }
                        break;
                }
            }
        }

        private setFlag(): void {
            this._cdFlag = false;
        }

        /**
         * 钥匙不够 显示快捷购买界面
         */
        public showStoreAlert(ID: number) {
            let shortcutBuy: number = ItemMaterialCfg.instance.getItemCfgById(ID)[item_materialFields.shortcutBuy];
            let malldata: Configuration.mall = StoreCfg.instance.getCfgByitemId(shortcutBuy);
            let limitBuy = malldata[mallFields.limitBuy];
            //判断数量
            let _limitCount = limitBuy[idCountFields.count];
            let _nowCount = 0;
            let _id = malldata[mallFields.id];
            let limit = modules.store.StoreModel.instance.getLimitById(_id);
            if (limit != null) {
                _nowCount = limit[MallNodeFields.limitCount];
            }
            let count = _limitCount - _nowCount;//剩余可购买数
            WindowManager.instance.openDialog(WindowEnum.STORE_ALERT, [malldata, count]);
        }

        protected addListeners(): void {
            super.addListeners();
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.fiftyBtn.on(Event.CLICK, this, this.xunBaoHandler, [2]);
            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply)

        }

        //监听下 购买返回事件 成功了就关闭界面
        private puchaseReply() {
            let result = modules.store.StoreModel.instance.PurchaseReply[BuyMallItemReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                WindowManager.instance.close(WindowEnum.STORE_ALERT);
                this.close();
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.fiftyBtn.off(Event.CLICK, this, this.xunBaoHandler);
            GlobalData.dispatcher.off(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
            Laya.timer.clear(this, this.setFlag);
        }

    }

}