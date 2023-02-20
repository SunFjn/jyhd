/**
 * 连充活动 - 列表项
 */
namespace modules.limit {
    import xunbao_continue_pay = Configuration.xunbao_continue_pay;
    import Items = Configuration.Items;
    import xunbao_continue_payFields = Configuration.xunbao_continue_payFields;
    import ItemsFields = Configuration.ItemsFields;
    import GetFishLinkInfoReply_reward = Protocols.ContinuepayReward;
    import GetFishLinkInfoReply_rewardFields = Protocols.GetLimitLinkInfoReply_rewardFields;
    import ContinuepayProgressFields = Protocols.ContinuepayProgressFields;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import BaseItem = modules.bag.BaseItem;
    export class LimitLinkItem extends ui.LimitLinkItemUI {
        private _cfg: xunbao_continue_pay;
        private _itemDay: number;
        private _grade: number;
        private _state: number = 0;
        private _btnClip: CustomClip;
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
            this.creatEffect();
            this.continueText.color = "#E8EA44";
            this.continueText.style.fontFamily = "SimHei";
            this.continueText.style.fontSize = 19;
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;;
        }

        protected addListeners(): void {
            //负责按钮等控件的事件的监听
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
        }

        protected removeListeners(): void {
            //负责取消按钮等控件监听的事件
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            this._btnClip.play();
        }

        protected setData(value: any): void {
            this._cfg = value as xunbao_continue_pay;
            this._itemDay = this._cfg[xunbao_continue_payFields.serverDay];
            this._grade = this._cfg[xunbao_continue_payFields.grade];
            this.dayText.text = `${this._itemDay + 1}`;
            this.continueText.innerHTML = `充值${this._cfg[xunbao_continue_payFields.money]}元<span style='color:#292F4A'>，可领取奖励！</span>`;
            let reward: GetFishLinkInfoReply_reward = LimitLinkModel.instance.getRewardByGradeAndDay(this.bigtype, this._grade, this._itemDay);
            this._state = reward ? reward[GetFishLinkInfoReply_rewardFields.state] : 0;

            let items: Array<Item> = [];
            let awardArr: Array<Items> = this._cfg[xunbao_continue_payFields.reward];
            for (let i: int = 0; i < awardArr.length; i++) {
                items.push([awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null]);
            }
            let count: number = items.length;
            let baseItems: BaseItem[] = [this.continueBase1, this.continueBase2, this.continueBase3];
            for (let i: int = 0; i < baseItems.length; i++) {
                if (i < count) {
                    baseItems[i].visible = true;
                    baseItems[i].dataSource = items[i];
                } else {
                    baseItems[i].visible = false;
                }
            }
            this.updateBtnState();
            this.setDayPlan();
        }

        private creatEffect(): void {
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-4, -15);
            this._btnClip.scale(0.9, 1);
            this._btnClip.visible = false;
        }

        private sureBtnHandler(): void {
            if (this._state == 0) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                WindowManager.instance.close(WindowEnum.OPENSERVICE_CONTINUE_PAY_VIEW);
            } else if (this._state == 1) {
                let rewards: Array<Items> = this._cfg[xunbao_continue_payFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    LimitLinkCtrl.instance.getContinueReward(this.bigtype, this._grade, this._itemDay);
                }
            }
        }

        // 更新按钮状态
        private updateBtnState(): void {
            if (this._state !== 0) {
                this.sureBtn.label = "领取";
                if (this._state == 1) {
                    this._btnClip.visible = true;
                    this.sureBtn.visible = true;
                    this.receivedImg.visible = false;
                } else {
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                }
                this.sureBtn.skin = `common/btn_tongyong_23.png`;
                this.sureBtn.labelColors = `#9d5119`;

            } else {
                this.sureBtn.skin = `common/btn_tongyong_24.png`;
                this.sureBtn.labelColors = `#465460`;
                this.sureBtn.label = "前往充值";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.visible = false;
            }
        }


        private setDayPlan(): void {
            let day = this._itemDay + 1;
            let progressList = LimitLinkModel.instance.progressList(this.bigtype);

            if (progressList) {
                for (let i: number = 0; i < progressList.length; i++) {
                    if (this._grade == progressList[i][ContinuepayProgressFields.grade]) {
                        let canDay = progressList[i][ContinuepayProgressFields.day];
                        if (this._state == 0) {
                            this.scheduleText.text = `(${canDay}/${day})`;
                            this.scheduleText.color = "#FF3e3e";
                        } else {
                            this.scheduleText.text = `(${canDay}/${day})`;
                            this.scheduleText.color = "#168a17";
                        }
                    }

                }
            }
        }
    }
}