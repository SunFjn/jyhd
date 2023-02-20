///<reference path="../config/soaring_single_pay_fs.ts"/>
/**
 * 单笔充值 （封神榜）
 */
namespace modules.soaring_singlePay {
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import pay_single_fs = Configuration.pay_single_fs;
    import pay_single_fsFields = Configuration.pay_single_fsFields;
    import PaySingleFSRewardFields = Protocols.PaySingleFSRewardFields;

    export class SoaringSinglePayItem extends ui.SoaringItemUI {
        private _taskBase: Array<BaseItem>;
        private _btnClip: CustomClip;//按钮特效
        private _Datas: pay_single_fs;

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

            this.CanBuyHTML.color = "#5f300c";
            this.CanBuyHTML.style.fontFamily = "SimHei";
            this.CanBuyHTML.style.fontSize = 26;
            this.CanBuyHTML.style.align = "center";

            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            //这里绑定 更新 事件
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
        }

        protected setData(value: pay_single_fs): void {
            super.setData(value);
            // this.sureBox.y = 72;
            this._Datas = value;
            this.showUI();
        }

        public sureBtnHandler() {
            let shuju = this._Datas;
            let state = 0;
            let _PaySingleFSReward = SoaringSinglePayModel.instance.rewardList[shuju[pay_single_fsFields.id]];
            if (_PaySingleFSReward) {
                state = SoaringSinglePayModel.instance.getState(_PaySingleFSReward);
            }
            switch (state) {
                case 0:
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                    this.close();
                    break;
                case 1:
                    let items: Array<Item> = [];
                    let rewards = shuju[pay_single_fsFields.reward];
                    if (rewards) {
                        for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                            let item: Items = rewards[i];
                            items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                        }
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            SoaringSinglePayCtrl.instance.GetPaySingleFSReward(this._Datas[pay_single_fsFields.id]);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        public showUI() {
            let shuju = this._Datas;
            let money = shuju[pay_single_fsFields.money];
            let rewards = shuju[pay_single_fsFields.reward];
            this.StatementHTML.innerHTML = `单笔充值<span style='color:#eaff00'>${money}元</span>,可领取奖励`;
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
            let shuju = this._Datas;
            let state = 0;
            let _PaySingleFSReward = SoaringSinglePayModel.instance.rewardList[shuju[pay_single_fsFields.id]];
            if (_PaySingleFSReward) {
                state = SoaringSinglePayModel.instance.getState(_PaySingleFSReward);
            }
            let param = (state != 0) ? 1 : 0;
            let condition = 1;//shuju[pay_single_fsFields.money];
            let str = `(${param}/${condition})`;
            this.scheduleText.text = str;
            let endFlag = SoaringSinglePayModel.instance.endFlag;
            if (endFlag == 0) {
                if (param >= condition) {
                    this.scheduleText.color = "#16ba17";

                } else {
                    this.scheduleText.color = "#FF3e3e";
                }
            } else {
                let str = `(${1}/${1})`;
                this.scheduleText.color = "#16ba17";
            }
        }

        /**
         * 显示可领取次数 进度
         */
        public showCanBuyHTML() {
            let shuju = this._Datas;
            let state = 0;
            let useCount = 0;
            let _PaySingleFSReward = SoaringSinglePayModel.instance.rewardList[shuju[pay_single_fsFields.id]];
            if (_PaySingleFSReward) {
                useCount = _PaySingleFSReward[PaySingleFSRewardFields.useCount];//已领数量
            }
            let condition = shuju[pay_single_fsFields.count];
            let param = condition - useCount;
            let str = `${param}/${condition}`;
            this.CanBuyHTML.visible = (condition > 1);
            if (param > 0) {
                this.CanBuyHTML.innerHTML = `活动次数:<span style='color:#16ba17'>${str}</span>`;
            } else {
                this.CanBuyHTML.innerHTML = `活动次数:<span style='color:#FF3e3e'>${str}</span>`;
            }
        }

        public setBtnSure() {
            let shuju = this._Datas;
            let state = 0;
            let _PaySingleFSReward = SoaringSinglePayModel.instance.rewardList[shuju[pay_single_fsFields.id]];
            if (_PaySingleFSReward) {
                state = SoaringSinglePayModel.instance.getState(_PaySingleFSReward);
            }
            let endFlag = SoaringSinglePayModel.instance.endFlag;
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
