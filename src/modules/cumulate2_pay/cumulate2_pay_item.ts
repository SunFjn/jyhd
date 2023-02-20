///<reference path="../config/cumulate_pay_cfg.ts"/>
//每日累充
namespace modules.cumulate2_pay {
    import CumulateItemUI = ui.CumulateItemUI;
    import Items = Configuration.Items;
    import cumulate_payFields = Configuration.cumulate_payFields;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import CumulatepayReward = Protocols.CumulatepayReward;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;
    import Event = Laya.Event;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import cumulate_pay2 = Configuration.cumulate_pay2;
    import cumulate_pay2Fields = Configuration.cumulate_pay2Fields;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;

    export class CumulatePay2Item extends CumulateItemUI {
        private _cfg: cumulate_pay2;
        private getState: number = 0;
        private _btnClip: CustomClip;
        private _itemId: number;
        private _itemIdAr: number[];
        private _stateMoney: number;
        private _cumuMoney: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            //用于设置控件属性 或者创建新控件
            this._itemId = 0;
            this._itemIdAr = [];
            this.cumulateText.color = "#5d2606";
            this.cumulateText.style.fontFamily = "SimHei";
            this.cumulateText.style.fontSize = 26;
            this.creatEffect();
        }

        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -18, true);
            this._btnClip.scale(0.81, 1.1);
            this._btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CUMULATE_PAY2_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            this.updateView();
        }

        private updateView(): void {
            //更新累充豪礼面板状态 和累充事件绑定
            this.setBtnSure();
            this.setMoney();
        }


        protected setData(value: any): void {
            this._cfg = value as cumulate_pay2;
            let awardArr: Array<Items> = [];
            //this._stateMoney=CumulatePayModel.instance.getMoney;
            this._cumuMoney = this._cfg[cumulate_pay2Fields.money];
            this._itemId = this._cfg[cumulate_pay2Fields.id];
            this._itemIdAr.push(this._cfg[cumulate_pay2Fields.id]);
            let showIdArr: number[] = [];
            awardArr = this._cfg[cumulate_pay2Fields.reward];

            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            this.setMoney();
            let count: number = showIdArr.length;
            let DayBase: BaseItem[] = [];
            DayBase.push(this.cumulateBase1);
            DayBase.push(this.cumulateBase2);
            DayBase.push(this.cumulateBase3);
            DayBase.push(this.cumulateBase4);
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    DayBase[i].visible = true;
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            this.setBtnSure();
        }


        private sureBtnHandler(): void {
            if (this.getState == 0) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                WindowManager.instance.close(WindowEnum.CUMULATE_PAY2_UPDATE);
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[cumulate_pay2Fields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    Cumulate2PayCtrl.instance.getCumulatepay2Reward([this._itemId]);
                }
            }
        }

        private setBtnSure(): void {
            this.getState = 0;//重置
            let rewarList: Array<CumulatepayReward> = CumulatePay2Model.instance.rewarList;
            let value = rewarList[this._itemId];
            if (!value) {
                // this.sureBtn.skin = `common/btn_tongyong_24.png`;
                // this.sureBtn.labelColors = `#465460`;
                this.sureBtn.label = "前往充值";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;

            } else {
                this.getState = value[CumulatepayRewardFields.state];
                if (this.getState !== 0) {
                    this.sureBtn.label = "领取";
                    // this.sureBtn.skin = `common/btn_tongyong_23.png`;
                    // this.sureBtn.labelColors = `#9d5119`;
                    if (this.getState == 1) {
                        this._btnClip.play();
                        this._btnClip.visible = true;
                        this.sureBtn.visible = true;
                        this.receivedImg.visible = false;
                    } else {
                        this.sureBtn.visible = false;
                        this.receivedImg.visible = true;
                    }
                }
            }
        }

        private setMoney(): void {
            this._stateMoney = CumulatePay2Model.instance.totalMoney;
            //this.priceText.text = `${this._cfg[cumulate_payFields.money]}元`;
            this.cumulateText.innerHTML = `${this._cfg[cumulate_payFields.money]}元<span style='color:#ffffff'>&nbsp;,可领取奖励！</span>`;
            this.scheduleText.text = `${this._stateMoney}/${this._cumuMoney}`;
            if (this._stateMoney >= this._cumuMoney) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
        }
    }
}