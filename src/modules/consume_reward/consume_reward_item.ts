/////<reference path="../consume_reward_cfg.ts"/>
/** 消费赠礼 */
namespace modules.cousume_reward {

    import ConsumeRewardItemUI = ui.ConsumeRewardItemUI;
    import Items = Configuration.Items;
    import consume_reward = Configuration.consume_reward;
    import consume_rewardFields = Configuration.consume_rewardFields;
    import CustomClip = modules.common.CustomClip;
    import ItemsFields = Configuration.ItemsFields;
    import ConsumerewardReward = Protocols.ConsumerewardReward;
    import ConsumerewardRewardFields = Protocols.ConsumerewardRewardFields;
    import Event = Laya.Event;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class ConsumeRewardItem extends ConsumeRewardItemUI {
        private _cfg: consume_reward;
        private getState: number = 0;
        private _info: consume_reward;
        private _btnClip: CustomClip;
        private _itemId: number;
        private _itemIdAr: number[];
        private _stateMoney: number;
        private _cumuMoney: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            //用于设置消费赠礼控件属性 或者创建新控件
            this._itemId = 0;
            this._itemIdAr = [];
            this.consumeText.color = "#b15315";
            this.consumeText.style.fontFamily = "SimHei";
            this.consumeText.style.fontSize = 26;

            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CONSUME_REWARD_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this.updateView();
        }

        private updateView(): void {
            //更新面板状态 和消费赠礼事件绑定
            this.setBtnSure();
            this.setMoney();
        }

        protected setData(value: any): void {
            this._cfg = value as consume_reward;
            let awardArr: Array<Items> = [];
            //this._stateMoney=CumulatePayModel.instance.getMoney;
            this._cumuMoney = this._cfg[consume_rewardFields.gold];
            this._itemId = this._cfg[consume_rewardFields.id];
            this._itemIdAr.push(this._cfg[consume_rewardFields.id]);
            let showIdArr: number[] = [];
            awardArr = this._cfg[consume_rewardFields.reward];


            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            this.setMoney();
            let count: number = showIdArr.length;
            let DayBase: modules.bag.BaseItem[] = [];
            DayBase.push(this.cumulateBase1);
            DayBase.push(this.cumulateBase2);
            DayBase.push(this.cumulateBase3);
            DayBase.push(this.cumulateBase4);
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            this.setBtnSure();
        }

        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.play();
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -18, true);
            this._btnClip.scale(0.81, 1.1);
            this._btnClip.visible = false;
        }

        private sureBtnHandler(): void {
            if (this.getState == 0) {
                SystemNoticeManager.instance.addNotice("消耗代币券数量不足", true);
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[consume_rewardFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    ConsumeRewardCtrl.instance.getConsumeReward([this._itemId]);
                }
            }
        }

        private setBtnSure(): void {
            let rewarTable: Table<ConsumerewardReward> = ConsumeRewardModel.instance.rewarTable;
            let value = rewarTable[this._itemId];
            if (!value) {
                this.sureBtn.label = "领取";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.visible = false;
            } else {
                this.getState = value[ConsumerewardRewardFields.state];
                if (this.getState !== 0) {
                    this.sureBtn.label = "可领取";
                    if (this.getState == 1) {
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

        public close(): void {
            super.close();
        }

        private setMoney(): void {
            this._stateMoney = ConsumeRewardModel.instance.totalMoney;
            this.consumeText.innerHTML = `${this._cfg[consume_rewardFields.gold]}代币券<span style='color:#2f2f2f'>&nbsp;,可领取奖励！</span>`;
            this.scheduleText.text = `(${this._stateMoney}/${this._cumuMoney})`;
            if (this._stateMoney >= this._cumuMoney) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
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
    }
}