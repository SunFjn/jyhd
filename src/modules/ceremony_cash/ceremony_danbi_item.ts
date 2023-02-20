///<reference path="../config/soaring_single_pay_fs.ts"/>
/**
 * 庆典兑换 单笔充值 单项
 */
namespace modules.ceremony_cash {
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import ceremony_danbi = Configuration.ceremony_danbi;
    import ceremony_danbiFields = Configuration.ceremony_danbiFields;
    import CeremonyDanbiRewardFields = Protocols.CeremonyDanbiRewardFields;

    export class CeremonyDanbiItem extends ui.SoaringItemUI {
        private _taskBase: Array<BaseItem>;
        private _btnClip: CustomClip;//按钮特效
        private _Datas: ceremony_danbi;

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

            this.CanBuyHTML.color = "#ffebc1";
            this.CanBuyHTML.style.fontFamily = "SimHei";
            this.CanBuyHTML.style.fontSize = 22;
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

        protected setData(value: ceremony_danbi): void {
            super.setData(value);
            this._Datas = value;
            this.showUI();
        }

        public sureBtnHandler() {
            let shuju = this._Datas;
            let state = 0;
            let _PaySingleFSReward = CeremonyDanbiModel.instance.rewardList[shuju[ceremony_danbiFields.id]];
            if (_PaySingleFSReward) {
                state = CeremonyDanbiModel.instance.getState(_PaySingleFSReward);
            }
            switch (state) {
                case 0:
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                    this.close();
                    break;
                case 1:
                    let items: Array<Item> = [];
                    let rewards = shuju[ceremony_danbiFields.reward];
                    if (rewards) {
                        for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                            let item: Items = rewards[i];
                            items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                        }
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            CeremonyDanbiCtrl.instance.GetPaySingleFSReward(this._Datas[ceremony_danbiFields.id]);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        public showUI() {
            let shuju = this._Datas;
            let money = shuju[ceremony_danbiFields.money];
            let rewards = shuju[ceremony_danbiFields.reward];
            this.StatementHTML.innerHTML = `单笔充值<span style='color:#e0b75f'>${money}元</span>,可领取奖励`;
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
            let _PaySingleFSReward = CeremonyDanbiModel.instance.rewardList[shuju[ceremony_danbiFields.id]];
            if (_PaySingleFSReward) {
                state = CeremonyDanbiModel.instance.getState(_PaySingleFSReward);
            }
            let param = (state != 0) ? 1 : 0;
            let condition = 1;
            let str = `(${param}/${condition})`;
            this.scheduleText.text = str;
        }

        /**
         * 显示可领取次数 进度
         */
        public showCanBuyHTML() {
            let shuju = this._Datas;
            let state = 0;
            let useCount = 0;
            let _PaySingleFSReward = CeremonyDanbiModel.instance.rewardList[shuju[ceremony_danbiFields.id]];
            if (_PaySingleFSReward) {
                useCount = _PaySingleFSReward[CeremonyDanbiRewardFields.useCount];//已领数量
            }
            let condition = shuju[ceremony_danbiFields.count];
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
            let _PaySingleFSReward = CeremonyDanbiModel.instance.rewardList[shuju[ceremony_danbiFields.id]];
            if (_PaySingleFSReward) {
                state = CeremonyDanbiModel.instance.getState(_PaySingleFSReward);
            }
            if (state == 0) {
                // this.sureBtn.skin = "common/btn_tongyong_24.png";
                // this.sureBtn.labelColors = "#465460,#465460,#465460,#465460";
                this.sureBtn.label = "前往充值";
                this.sureBtn.visible = true;
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.receivedImg.visible = false;
                this.overImg.visible = false;
            } else if (state == 1) {
                // this.sureBtn.skin = "common/btn_tongyong_23.png";
                // this.sureBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
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
            this._btnClip.pos(-6, -18, true);
            this._btnClip.scale(0.81, 1.1);
            this._btnClip.visible = false;
        }
    }
}
