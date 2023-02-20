/////<reference path="../$.ts"/>
/** 投资返利 */
namespace modules.invest_reward {
    import InvestItemUI = ui.InvestItemUI;
    import invest_reward = Configuration.invest_reward;
    import invest_rewardFields = Configuration.invest_rewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import InvestrewardReward = Protocols.InvestrewardReward;
    import InvestrewardRewardFields = Protocols.InvestrewardRewardFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Event = Laya.Event;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;

    export class InvestRewardItem extends InvestItemUI {
        private _cfg: invest_reward;
        private _itemTaskId: number;
        private getState: number = 0;
        private _btnClip: CustomClip;
        private _type: number = 0;

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
            this.investText.color = "#814106";
            this.investText.style.fontFamily = "SimHei";
            this.investText.style.fontSize = 22;
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            GlobalData.dispatcher.on(CommonEventType.INVEST_REWARD_UPDATE, this, this.updateView);
            //this.addAutoListener();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
            GlobalData.dispatcher.off(CommonEventType.INVEST_REWARD_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this.updateView();
        }

        private updateView(): void {
            this.setBtnState();
            this.setType();
        }

        protected setData(value: any): void {
            this._cfg = value as invest_reward;
            let awardArr: Array<Items> = [];
            this._itemTaskId = this._cfg[invest_rewardFields.taskId];

            //this._itemTaskIdAr.push(this._cfg[invest_rewardFields.taskId]);
            let showIdArr: number[] = [];
            let typeId = this._cfg[invest_rewardFields.type];
            if (typeId == 0) {
                this._type = InvestRewardModel.instance.loginCount;
                this.investText.innerHTML = `累计登录<span style='color:#eaff00'>&nbsp;${this._cfg[invest_rewardFields.condition]}</span> 天,可领取奖励！`;
            } else if (typeId == 1) {
                this._type = InvestRewardModel.instance.tianguanLevel;
                this.investText.innerHTML = `通过天关<span style='color:#eaff00'>&nbsp;${this._cfg[invest_rewardFields.condition]}</span> 关,可领取奖励！`;
            } else {
                this._type = InvestRewardModel.instance.actorLevel;
                this.investText.innerHTML = `累计达到<span style='color:#eaff00'>&nbsp;${this._cfg[invest_rewardFields.condition]}</span> 级,可领取奖励！`;
            }
            this.setType();
            awardArr = this._cfg[invest_rewardFields.reward];
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            let count: number = showIdArr.length;
            let DayBase: modules.bag.BaseItem[] = [];
            DayBase.push(this.investBase1);
            DayBase.push(this.investBase2);
            DayBase.push(this.investBase3);
            DayBase.push(this.investBase4);
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
            this.setBtnState();
        }

        public close(): void {
            super.close();
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
            this._btnClip.pos(-6, -16);
            this._btnClip.scale(0.94,0.92);
            this._btnClip.visible = false;
        }

        private setBtnState(): void {
            let rewarList: Table<InvestrewardReward> = InvestRewardModel.instance.rewardList;
            let value = rewarList[this._itemTaskId];
            if (!value) {  //没有状态
                this._btnClip.visible = false;
                if (this._type < this._cfg[invest_rewardFields.condition]) {
                    // this.notAchieved.visible = true;
                    // this.notAchieved.skin = "common/txt_commmon_wdc.png";
                    this.notAchieved.visible = true;
                    this.sureBtn.visible = false;
                    this.sureBtn.mouseEnabled = false;
                    this.receiveTrueImg.visible = false;
                } else {
                    this.notAchieved.visible = false;
                    this.sureBtn.visible = true;
                    this.sureBtn.mouseEnabled = true;
                    this.receiveTrueImg.visible = false;
                }
            } else {
                this.getState = value[InvestrewardRewardFields.state];
                if (this.getState !== 0) {
                    if (this.getState == 1) {  //可领取
                        this._btnClip.visible = true;
                        this.sureBtn.visible = true;
                        this.notAchieved.visible = false;
                        // this.sureBtn.skin = `common/btn_common_an03.png`;
                        this.sureBtn.mouseEnabled = true;
                        this.receiveTrueImg.visible = false;
                        this.sureBtn.label = "可领取";
                        this.sureBtn.pos(482, 64, true);
                    } else {   // 已领取
                        this._btnClip.visible = false;
                        this.sureBtn.visible = false;
                        this.notAchieved.visible = false;
                        this.receiveTrueImg.visible = true;
                        // this.notAchieved.skin = `common/txt_commmon_ylq.png`;
                        // this.notAchieved.mouseEnabled = false;
                        // this.notAchieved.visible = true;

                        // this.sureBtn.label = ``;
                        // this.sureBtn.pos(505, 64, true);
                    }
                }
            }
        }

        private sureBtnHandler(): void {
            let rewarList: Table<InvestrewardReward> = InvestRewardModel.instance.rewardList;
            let value = rewarList[this._itemTaskId];
            let gia = InvestRewardCfg.instance.getCfgById(this._itemTaskId);
            if (!value) {
                this.getState = 0;
            }
            let type = gia[invest_rewardFields.type];
            let stateList = InvestRewardModel.instance.stateList;
            if (stateList[type]) {
                if (this.getState == 0) {
                    if (type == 0) {
                        SystemNoticeManager.instance.addNotice("未到达登录天数！", true);
                    } else if (type == 1) {
                        SystemNoticeManager.instance.addNotice("当前通过的天关数不足！", true);
                    } else {
                        SystemNoticeManager.instance.addNotice("当前等级不足！", true);
                    }
                }
                if (this.getState == 1) {
                    let rewards: Array<Items> = this._cfg[invest_rewardFields.reward];
                    let items: Array<Item> = [];
                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        InvestRewardCtrl.instance.getInvestReward([this._itemTaskId]);
                    }
                }
            } else {
                SystemNoticeManager.instance.addNotice("尚未投资，投资后可领取！", true);
            }
        }

        public investRewardPRState(): void {
            let _rewardList = InvestRewardModel.instance.rewardList;
            let loginState: boolean = false;
            let recruitState: boolean = false;
            let growthState: boolean = false;

            for (let key in _rewardList) {
                if (_rewardList[key][InvestrewardRewardFields.state] == 1) {
                    let gia = InvestRewardCfg.instance.getCfgById(_rewardList[key][InvestrewardRewardFields.taskId]);
                    let type = gia[invest_rewardFields.type];
                    if (type == 0) {
                        loginState = true;
                    } else if (type == 1) {
                        recruitState = true;
                    } else if (type == 2) {
                        growthState = true;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("investLoginRP", loginState);
            RedPointCtrl.instance.setRPProperty("investRecruitRP", recruitState);
            RedPointCtrl.instance.setRPProperty("investGrowthRP", growthState);
        }

        private setType(): void {
            let typeId = this._cfg[invest_rewardFields.type];
            if (typeId == 0) {
                this._type = InvestRewardModel.instance.loginCount;
            } else if (typeId == 1) {
                this._type = InvestRewardModel.instance.tianguanLevel;
            } else {
                this._type = InvestRewardModel.instance.actorLevel;
            }
            this.scheduleText.text = `(${this._type}/${this._cfg[invest_rewardFields.condition]})`;
            if (!this.scheduleText.color) return;
            if (this._type >= this._cfg[invest_rewardFields.condition]) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
        }
    }
}