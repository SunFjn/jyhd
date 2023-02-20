///<reference path="../config/soaring_rush_buy_fs.ts"/>
/**
 * 抢购礼包 （封神榜）
 */
namespace modules.soaring_panicBuyingGift {

    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BagModel = modules.bag.BagModel;
    import SoaringPanicBuyingGiftCfg = modules.config.SoaringPanicBuyingGiftCfg;
    import rush_buy_fs = Configuration.rush_buy_fs;
    import rush_buy_fsFields = Configuration.rush_buy_fsFields;
    import RedPiontCtrl = modules.redPoint.RedPointCtrl;

    export class SoaringPanicBuyingGiftPanel extends ui.SoaringPanicBuyingGiftViewUI {
        private _Datas: rush_buy_fs;
        private _btnClip: CustomClip;//按钮特效
        private _list: CustomList;
        private _taskBase: Array<BaseItem>;
        private _allMingCiArr: Array<number>;
        private _isUpdateBtnClickNum = 1000;//刷新按钮CD
        private _isUpdateBtnClick = true;//刷新按钮是否可点击
        private isOver: boolean = false;
        private tempParam1: number = 1;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._taskBase = [this.continueBase1, this.continueBase2, this.continueBase3, this.continueBase4];
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_PANICBUYINGGIFT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_PANICBUYINGGIFT_COUNT_UPDATE, this, this.showNumStr);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
            Laya.timer.clear(this, this.activityHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public onOpened(): void {
            super.onOpened();
            SoaringPanicBuyingGiftCtrl.instance.GetRushBuyFSInfo();
        }

        public sureBtnHandler() {
            this.isCion();
        }

        public isCion() {
            if (SoaringPanicBuyingGiftModel.instance.totalCountRandom == 0) {//如果全服数量没有了
                SystemNoticeManager.instance.addNotice("抢购礼包已售罄", true);
                return;
            }
            let num = PlayerModel.instance.getCurrencyById(MoneyItemId.glod);
            if (num == null) {
                num = BagModel.instance.getItemCountById(MoneyItemId.glod);
            }
            let price = this._Datas[rush_buy_fsFields.price];
            if (num >= price) {
                let items: Array<Item> = [];
                let rewards = this._Datas[rush_buy_fsFields.reward];
                if (rewards) {
                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    //通过传入需要领取的道具判断有没有背包满了
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        //钱够  发送购买请求
                        SoaringPanicBuyingGiftCtrl.instance.BuyRushBuyFS();
                    }
                }
            } else {
                CommonUtil.goldNotEnoughAlert();
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }

        public showUI() {
            this._Datas = SoaringPanicBuyingGiftCfg.instance.getCfgById(SoaringPanicBuyingGiftModel.instance.cuyType);
            this.showNumStr();
            this.showAwardAndTitleStr();
            this.setActivitiTime();
            this.setBtnSure();
            RedPiontCtrl.instance.setRPProperty("soaringPanicBuyingGifRP", false);
        }

        public setBtnSure() {
            // this.sureBtn.skin = "common/btn_tongyong_6.png";
            // this.sureBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
            this.sureBtn.label = "购买";
            this._btnClip.stop();
            this._btnClip.visible = false;
            let count = this._Datas[rush_buy_fsFields.count];
            let totalCount = this._Datas[rush_buy_fsFields.totalCount];
            if (SoaringPanicBuyingGiftModel.instance.endFlag == 0) {
                if (count == SoaringPanicBuyingGiftModel.instance.count) {//如果个人购买数量达到上限
                    this.isOver = false;
                    this.sureBtn.visible = false;
                    this.maxCeilingText.visible = true;
                    this.overImg.visible = false;
                    this.maxCeilingText.text = "已达上限";
                } else {
                    this.isOver = false;
                    this._btnClip.play();
                    this._btnClip.visible = true;
                    this.sureBtn.visible = true;
                    this.maxCeilingText.visible = false;
                    this.overImg.visible = false;
                }
            } else {
                this.isOver = true;
                this.sureBtn.visible = false;
                this.maxCeilingText.visible = false;
                this.overImg.visible = true;
                this.overText.visible = false;
                this.sureBtn.visible = false;
            }
        }

        /**
         * 显示对应的奖励和标题
         */
        public showAwardAndTitleStr() {
            let titleStr = this._Datas[rush_buy_fsFields.name];
            let originalPrice = this._Datas[rush_buy_fsFields.originalPrice];
            let price = this._Datas[rush_buy_fsFields.price];
            let discount = this._Datas[rush_buy_fsFields.discount];
            this.nameText.text = titleStr;
            this.zeKouTxt.text = `${discount}折`;

            this.originalPriceText.text = `${price}`;
            this.nowPriceText.text = `${originalPrice}`;

            let leng = this.originalPriceImg.width + this.originalPriceText.width;
            let posX = (this.width - leng) / 2;
            this.originalPriceImg.x = posX;
            this.originalPriceText.x = this.originalPriceImg.width + posX + 1;
            this.originalPriceRedImg.width = leng;
            this.originalPriceRedImg.x = posX;

            // let leng1 = this.nowPriceImg.width + this.nowPriceText.width;
            // let posX1 = (this.width - leng1) / 2;
            this.nowPriceImg.x = posX;
            this.nowPriceText.x = this.nowPriceImg.width + posX + 1;


            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            //这里根据 名次 去拿对应的奖励和上榜条件
            let rewards = this._Datas[rush_buy_fsFields.reward];
            let allAward = new Array<BaseItem>();
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                    _taskBase.nameVisible = true;
                    allAward.push(_taskBase);
                }
            }
            //居中适配 奖励
            let lengNum = allAward.length * 100 + (allAward.length - 1) * 30;
            let startPosX = (this.width - lengNum) / 2;
            for (let index = 0; index < allAward.length; index++) {
                let element = allAward[index];
                element.x = startPosX;
                element.grayMask.visible = true;
                element.grayMask.alpha = 1;
                element.grayMask.pos(-41, 11);
                element.grayMask.width = 186;
                element.grayMask.height = 127;
                element._nameTxt.y = 108;
                element.grayMask.skin = "soaringActivity/icon_fsb_djtz.png";
                element.setChildIndex(element.grayMask, 0);
                startPosX += (element.width) + 30;
            }
        }

        /**
         * 显示并适配 个人剩余购买数量 全服剩余数量
         */
        public showNumStr() {
            if (this._Datas) {
                this._Datas = SoaringPanicBuyingGiftCfg.instance.getCfgById(SoaringPanicBuyingGiftModel.instance.cuyType);
                let param = this._Datas[rush_buy_fsFields.count] - SoaringPanicBuyingGiftModel.instance.count;
                let condition = this._Datas[rush_buy_fsFields.count];
                let str = `${param}/${condition}`;
                this.CanBuyText.text = str;
                param = param < 0 ? 0 : param;
                if (param > 0) {
                    this.CanBuyText.color = "#16ba17";
                } else {
                    this.CanBuyText.color = "#FF3e3e";
                    if (SoaringPanicBuyingGiftModel.instance.endFlag != 0) {
                        this.maxCeilingText.visible = true;
                        this.overText.visible = false;
                        this.sureBtn.visible = false;
                    }
                }
                //todo 剩余
                //剩余可购买后端值
                let param1 = SoaringPanicBuyingGiftModel.instance.totalCountRandom;
                if (!this.isOver) {
                    param1 = SoaringPanicBuyingGiftModel.instance.totalCountRandom;
                    this.tempParam1 = param1;
                } else {
                    this.maxCeilingText.visible = false;
                    param1 = this.tempParam1;
                }

                let condition1 = this._Datas[rush_buy_fsFields.totalCount];
                let str1 = `${param1}/${condition1}`;
                this.allBuyText.text = str1;
                param1 = param1 < 0 ? 0 : param1;
                this.tempParam1 = param1;
                if (param1 > 0) {
                    this.allBuyText.color = "#16ba17";
                    this.overText.visible = false;
                } else {
                    this.allBuyText.color = "#FF3e3e";
                    this.allBuyText.text = "已售罄";
                    if (SoaringPanicBuyingGiftModel.instance.endFlag != 0) {
                        this.maxCeilingText.visible = false;
                        this.overText.visible = true;
                        this.sureBtn.visible = false;
                    }
                }
            } else {
                console.log("this._Datas[rush_buy_fsFields.count] == null!");
            }

            // this.Text2.visible = this.allBuyText.visible = param1 > 0;
            // this.overText.visible = param1 <= 0;
            let leng = this.Text1.width + this.CanBuyText.width;
            let posX = (this.width - leng) / 2;
            this.Text1.x = posX;
            this.CanBuyText.x = this.Text1.width + posX + 1;

            let leng1 = this.Text2.width + this.allBuyText.width;
            let posX1 = (this.width - leng1) / 2;
            this.Text2.x = posX1;
            this.allBuyText.x = this.Text2.width + posX1 + 1;
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.rushBuyFS);
            if (SoaringPanicBuyingGiftModel.instance.restTm >= GlobalData.serverTime &&
                isOpen &&
                SoaringPanicBuyingGiftModel.instance.endFlag == 0) {
                this.activityText1.color = "#ffffff";
                this.activityText.visible = true;
                this.activityText1.text = "活动倒计时:";
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";

                //处理活动结束了但是物品还可以购买的问题 
                this.isOver = false;
                this.sureBtn.visible = false;
                this.maxCeilingText.visible = true;
                this.overImg.visible = false;
                this.maxCeilingText.text = "活动已结束";
            }
        }

        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(SoaringPanicBuyingGiftModel.instance.restTm)}`;
            if (SoaringPanicBuyingGiftModel.instance.restTm < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -18, true);
            this._btnClip.scale(1.23, 1.2);
            this._btnClip.visible = false;
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }
    }
}
