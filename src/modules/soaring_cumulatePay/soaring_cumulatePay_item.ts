/////<reference path="../$.ts"/>
///<reference path="../config/soaring_cumulate_pay_fs.ts"/>
/**
 * 累计充值（封神榜）
 */
namespace modules.soaring_cumulatePay {
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import cumulate_pay_fs = Configuration.cumulate_pay_fs;
    import cumulate_pay_fsFields = Configuration.cumulate_pay_fsFields;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;

    export class SoaringCumulatePayItem extends ui.SoaringItemUI {
        private _taskBase: Array<BaseItem>;
        private _btnClip: CustomClip;//按钮特效
        private _Datas: cumulate_pay_fs;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.continueBase1, this.continueBase2, this.continueBase3, this.continueBase4];
            this.StatementHTML.color = "white";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "left";

            this.CanBuyHTML.color = "#eaff00";
            this.CanBuyHTML.style.fontFamily = "SimHei";
            this.CanBuyHTML.style.fontSize = 26;
            this.CanBuyHTML.style.align = "left";

            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
        }

        protected setData(value: cumulate_pay_fs): void {
            super.setData(value);
            // this.sureBox.y = 63;
            this._Datas = value;
            this.showUI();
        }

        public sureBtnHandler() {
            let shuju = this._Datas;
            let state = 0;
            let _CumulatepayReward = SoaringCumulatePayModel.instance.rewardList[shuju[cumulate_pay_fsFields.id]];
            if (_CumulatepayReward) {
                state = _CumulatepayReward[CumulatepayRewardFields.state]
            }
            switch (state) {
                case 0:
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                    this.close();
                    break;
                case 1:
                    let items: Array<Item> = [];
                    let rewards = shuju[cumulate_pay_fsFields.reward];
                    if (rewards) {
                        for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                            let item: Items = rewards[i];
                            items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                        }
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            SoaringCumulatePayCtrl.instance.getCumulatepayFSReward(this._Datas[cumulate_pay_fsFields.id]);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        public showUI() {
            let shuju = this._Datas;
            let money = shuju[cumulate_pay_fsFields.money];
            let rewards = shuju[cumulate_pay_fsFields.reward];
            this.StatementHTML.innerHTML = `累计充值<span style='color:#eaff00'>${money}元</span>,可领取奖励`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                }
            }
            this.setBtnSure();
            this.showScheduleText();
            // this.showCanBuyHTML();//
        }

        public showScheduleText() {
            let shuju = this._Datas;
            let param = SoaringCumulatePayModel.instance.totalMoney;
            let condition = shuju[cumulate_pay_fsFields.money];
            let str = `(${param}/${condition})`;
            this.scheduleText.text = str;
            if (param >= condition) {
                this.scheduleText.color = "#16ba17";

            } else {
                this.scheduleText.color = "#FF3e3e";
            }
        }

        /**
         * 显示可领取次数 进度
         */
        public showCanBuyHTML() {
            let param = 10;
            let condition = 10;
            let str = `(${param}/${condition})`;
            if (param >= condition) {
                this.CanBuyHTML.innerHTML = `可领取<span style='color:#16ba17'>${str}</span>`;
            } else {
                this.CanBuyHTML.innerHTML = `可领取<span style='color:#FF3e3e'>${str}</span>`;
            }
        }

        public setBtnSure() {
            let shuju = this._Datas;
            let state = 0;
            let _CumulatepayReward = SoaringCumulatePayModel.instance.rewardList[shuju[cumulate_pay_fsFields.id]];
            if (_CumulatepayReward) {
                state = _CumulatepayReward[CumulatepayRewardFields.state]
            }
            let endFlag = SoaringCumulatePayModel.instance.endFlag;
            if (endFlag == 0) {
                if (state == 0) {
                    this.sureBtn.skin = "common/btn_common_an03.png";
                    this.sureBtn.labelColors = "#ffffff,#ffffff,#ffffff,#ffffff";
                    this.sureBtn.label = "前往充值";
                    this.sureBtn.visible = true;
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.receivedImg.visible = false;
                    this.overImg.visible = false;
                } else if (state == 1) {
                    this.sureBtn.skin = "common/17.png";
                    this.sureBtn.labelColors = "#ffffff,#ffffff,#ffffff,#ffffff";
                    this.sureBtn.label = "领取";
                    this.sureBtn.visible = true;
                    this._btnClip.play();
                    this._btnClip.visible = true;
                    this.receivedImg.visible = false;
                    this.overImg.visible = false;
                } else {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                    this.overImg.visible = false;
                }
            } else {
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.sureBtn.visible = false;
                this.receivedImg.visible = false;
                this.overImg.visible = true;
            }

        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        public close(): void {
            super.close();
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
            this._btnClip.pos(-5, -17, true);
            this._btnClip.scale(0.8, 1.05);
            this._btnClip.visible = false;
        }
    }
}
