/////<reference path="../consume_reward2_cfg.ts"/>
///<reference path="../day_consume_reward/day_consume_reward_model.ts"/>
///<reference path="../day_consume_reward/day_consume_reward_ctrl.ts"/>
/** 消费赠礼  每日*/
namespace modules.day_consume_reward {

    import DayConsumeRewardItemUI = ui.DayConsumeRewardItemUI;
    import Items = Configuration.Items;
    import consume_reward2 = Configuration.consume_reward2;
    import consume_reward2Fields = Configuration.consume_reward2Fields;
    import CustomClip = modules.common.CustomClip;
    import ItemsFields = Configuration.ItemsFields;
    import ConsumerewardReward = Protocols.ConsumerewardReward;
    import ConsumerewardRewardFields = Protocols.ConsumerewardRewardFields;
    import Event = Laya.Event;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import BaseItem = modules.bag.BaseItem;
    import DayConsumeRewardModel = modules.day_consume_reward.DayConsumeRewardModel;
    import DayConsumeRewardCtrl = modules.day_consume_reward.DayConsumeRewardCtrl;
    import LayaEvent = modules.common.LayaEvent;

    export class DayConsumeRewardItem extends DayConsumeRewardItemUI {
        private _cfg: consume_reward2;
        private getState: number = 0;
        private _info: consume_reward2;
        private _btnClip: CustomClip;
        private _itemId: number;
        private _itemIdAr: number[];
        private _stateMoney: number;
        private _cumuMoney: number;
        private _items: Array<BaseItem>;

        // private _reward: pay_reward_reward;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._items) {
                for (let index = 0; index < this._items.length; index++) {
                    let element = this._items[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._items.length = 0;
                this._items = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.creatEffect();
            this.consumeText.color = "#b15315";
            this.consumeText.style.fontFamily = "SimHei";
            this.consumeText.style.fontSize = 26;
            this._items = new Array<BaseItem>();
            this._items = [this.cumulateBase1, this.cumulateBase2, this.cumulateBase3, this.cumulateBase4];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_CONSUME_REWARD_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            this.showReward();
            this.setMoney();
            this.setBtnSure();
        }

        private updateView(): void {
            this.setMoney();
            this.setBtnSure();
        }

        protected setData(value: consume_reward2): void {
            super.setData(value);
            this._cfg = value;
            this._cumuMoney = this._cfg[consume_reward2Fields.gold];
            this._itemId = this._cfg[consume_reward2Fields.id];
        }

        private sureBtnHandler(): void {
            if (this.getState == 0) {
                SystemNoticeManager.instance.addNotice("消耗代币券数量不足", true);
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[consume_reward2Fields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    DayConsumeRewardCtrl.instance.GetConsumeReward2Reward([this._itemId]);
                }
            }
        }

        private setBtnSure(): void {
            this.getState = 0;
            let rewarTable: Array<ConsumerewardReward> = DayConsumeRewardModel.instance.rewarTable;
            let value = rewarTable[this._itemId];
            if (!value) {
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;
            } else {
                this.getState = value[ConsumerewardRewardFields.state];
                if (this.getState !== 0) {
                    if (this.getState == 1) {
                        this.sureBtn.visible = true;
                        this.receivedImg.visible = false;
                        this._btnClip.play();
                        this._btnClip.visible = true;
                    } else {
                        this.sureBtn.visible = false;
                        this.receivedImg.visible = true;
                        this._btnClip.stop();
                        this._btnClip.visible = false;
                    }
                }
            }
        }

        public showReward() {
            for (var index = 0; index < this._items.length; index++) {
                var element = this._items[index];
                element.visible = false;
            }
            let rewardItems: Array<Items> = this._cfg[consume_reward2Fields.reward];
            if (rewardItems) {
                for (let i: int = 0, len = rewardItems.length; i < len; i++) {
                    let itemId: number = rewardItems[i][ItemsFields.itemId];
                    let count: number = rewardItems[i][ItemsFields.count];
                    let bagItem: BaseItem = this._items[i];
                    if (bagItem) {
                        bagItem.dataSource = [itemId, count, 0, null];
                        bagItem.visible = true;
                    }
                }
            }
        }

        private setMoney(): void {
            this._stateMoney = DayConsumeRewardModel.instance.totalGold;
            this.consumeText.innerHTML = `${this._cfg[consume_reward2Fields.gold]}代币券<span style='color:#585858'>&nbsp;,可领取奖励！</span>`;
            this.scheduleText.text = `(${this._stateMoney}/${this._cumuMoney})`;
            if (this._stateMoney >= this._cumuMoney) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
        }

        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-5, -10);
            this._btnClip.scale(0.8, 0.8);
            this._btnClip.visible = false;
        }

        public close(): void {
            super.close();
            this._btnClip.stop();
        }
    }
}