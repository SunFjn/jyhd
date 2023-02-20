/////<reference path="../$.ts"/>
///<reference path="../config/single_pay_jade_cfg.ts"/>
/**
 * 单笔充值（返神兽）
 */
namespace modules.cumulatePay_shenHun {
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import ThreeNumberFields = Protocols.ThreeNumberFields;
    import single_pay_jade = Configuration.single_pay_jade;
    import single_pay_jadeFields = Configuration.single_pay_jadeFields;
    import LayaEvent = modules.common.LayaEvent;

    export class CumulatePayShenHunItem extends ui.SoaringItemUI {
        private _taskBase: Array<BaseItem>;
        private _btnClip: CustomClip;//按钮特效
        private _Datas: single_pay_jade;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.continueBase1, this.continueBase2, this.continueBase3, this.continueBase4];
            this.StatementHTML.color = "#ffffff";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.align = "left";

            this.CanBuyHTML.color = "#fff51c";
            this.CanBuyHTML.style.fontFamily = "SimHei";
            this.CanBuyHTML.style.fontSize = 26;
            this.CanBuyHTML.style.align = "left";

            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
        }

        protected setData(value: single_pay_jade): void {
            super.setData(value);
            this._Datas = value;
            this.showUI();
        }

        public sureBtnHandler() {
            let id = this._Datas[single_pay_jadeFields.id];
            let count = this._Datas[single_pay_jadeFields.count];
            let shuju = CumulatePayShenHunModel.instance.rewardList[id];
            if (shuju) {

                let param = shuju[ThreeNumberFields.v2];
                let condition = shuju[ThreeNumberFields.v2];
                if (param > 0) {
                    let items: Array<Item> = [];
                    let rewards = this._Datas[single_pay_jadeFields.award];
                    if (rewards) {
                        for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                            let item: Items = rewards[i];
                            items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                        }
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            CumulatePayShenHunCtrl.instance.GetSinglePayJadeAward(this._Datas[single_pay_jadeFields.id]);
                        }
                    }
                } else {
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                }

            } else {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                this.close();
            }
        }

        public showUI() {
            let shuju = this._Datas;
            let money = shuju[single_pay_jadeFields.money];
            let rewards = shuju[single_pay_jadeFields.award];
            this.StatementHTML.innerHTML = `单笔充值<span style='color:#fff51c'>${money}元</span>,可领取奖励`;
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
            this.showCanBuyHTML();
        }

        public showScheduleText() {
            /*[id, 可领取数量， 已充值数量]*/
            let id = this._Datas[single_pay_jadeFields.id];
            let shuju = CumulatePayShenHunModel.instance.rewardList[id];
            let param = 0;
            if (shuju) {
                param = shuju[ThreeNumberFields.v2];
                let id = this._Datas[single_pay_jadeFields.id];
                let count = this._Datas[single_pay_jadeFields.count];
                let condition = shuju[ThreeNumberFields.v2];
                let condition1 = shuju[ThreeNumberFields.v3];
                let shifou = count - (condition1 - condition);
                if (param == 0 && shifou == 0) {
                    param = 1;
                }
                let str = `(${param > 1 ? 1 : param}/${1})`;
                this.scheduleText.text = str;
                if (param >= 1) {
                    this.scheduleText.color = "#16ba17";

                } else {
                    this.scheduleText.color = "#FF3e3e";
                }
            } else {
                let str = `(${0}/${1})`;
                this.scheduleText.text = str;
                this.scheduleText.color = "#FF3e3e";
            }
        }

        /**
         * 显示可领取次数 进度
         */
        public showCanBuyHTML() {
            let id = this._Datas[single_pay_jadeFields.id];
            let count = this._Datas[single_pay_jadeFields.count];
            let shuju = CumulatePayShenHunModel.instance.rewardList[id];
            if (shuju) {
                let condition = shuju[ThreeNumberFields.v2];
                let condition1 = shuju[ThreeNumberFields.v3];
                let param = count - (condition1 - condition);
                let str = `${param}/${count}`;
                this.CanBuyHTML.visible = (count > 1);
                if (param > 0) {
                    this.CanBuyHTML.innerHTML = `活动次数:<span style='color:#16ba17'>${str}</span>`;
                } else {
                    this.CanBuyHTML.innerHTML = `活动次数:<span style='color:#FF3e3e'>${str}</span>`;
                }
            } else {
                let condition = 0;
                let param = count - condition;
                let str = `${param}/${count}`;
                this.CanBuyHTML.visible = (count > 1);
                if (param > 0) {
                    this.CanBuyHTML.innerHTML = `活动次数:<span style='color:#16ba17'>${str}</span>`;
                } else {
                    this.CanBuyHTML.innerHTML = `活动次数:<span style='color:#FF3e3e'>${str}</span>`;
                }
            }

        }

        public setBtnSure() {
            let id = this._Datas[single_pay_jadeFields.id];
            let count = this._Datas[single_pay_jadeFields.count];
            let shuju = CumulatePayShenHunModel.instance.rewardList[id];
            if (CumulatePayShenHunModel.instance.state) {
                if (shuju) {
                    let id = shuju[ThreeNumberFields.v1];
                    let aState: number = CumulatePayShenHunModel.instance.getSteat(id);
                    if (aState == 0) {
                        // this.sureBtn.skin = "common/btn_tongyong_23.png";
                        // this.sureBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
                        this.sureBtn.label = "领取";
                        this.sureBtn.visible = true;
                        this._btnClip.play();
                        this._btnClip.visible = true;
                        this.receivedImg.visible = false;
                        this.overImg.visible = false;
                    } else if (aState == 1) {
                        // this.sureBtn.skin = "common/btn_tongyong_24.png";
                        // this.sureBtn.labelColors = "#465460,#465460,#465460,#465460";
                        this.sureBtn.label = "前往充值";
                        this.sureBtn.visible = true;
                        this._btnClip.stop();
                        this._btnClip.visible = false;
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
                    // this.sureBtn.skin = "common/btn_tongyong_24.png";
                    // this.sureBtn.labelColors = "#465460,#465460,#465460,#465460";
                    this.sureBtn.label = "前往充值";
                    this.sureBtn.visible = true;
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.receivedImg.visible = false;
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
            // // this._btnClip.play();
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -16, true);
            this._btnClip.scale(0.81, 1.06);
            this._btnClip.visible = false;
        }
    }
}
