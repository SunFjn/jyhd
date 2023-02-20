///<reference path="../config/login_reward_cfg.ts"/>


namespace modules.login_reward {
    import LoginRewardItemUI = ui.LoginRewardItemUI;
    import CustomClip = modules.common.CustomClip;
    import login_reward = Configuration.login_reward;
    import Event = Laya.Event;
    import Items = Configuration.Items;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import ItemsFields = Configuration.ItemsFields;
    import login_rewardFields = Configuration.login_rewardFields;
    import GetLoginRewardRewardFields = Protocols.GetLoginRewardRewardFields;
    import LoginRewardNodeFields = Protocols.LoginRewardNodeFields;
    import VipModel = modules.vip.VipModel;

    export class LoginRewardItem extends LoginRewardItemUI {
        private _btnClip: CustomClip;
        private _cfg: login_reward;

        private VipConditionLevel: number = 0;//vip条件
        private vipLevel: number = 0;
        private dayRefresh: boolean = false;//接受服务器信息更新状态
        private _itemId: number;

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
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this._updateView);

            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnClip.play();

            this._updateView();
        }

        private _updateView(): void {
            this.setBtnSure();
        }

        protected setData(value: any): void {
            super.setData(value);

            this.vipLevel = VipModel.instance.vipLevel;//VipModel.instance.vipLevel;

            this._cfg = value;

            let cfgId = this._cfg[LoginRewardNodeFields.id];

            let cfgNode = LoginRewardModel.instance.getNodeInfoById(cfgId);
            let cfgState: number = 0;
            if (cfgNode) {
                cfgState = cfgNode[LoginRewardNodeFields.state];
            }

            if (this._cfg[login_rewardFields.nextDayTips] === 0) {
                this.tomorrowIsOk.visible = false;

                this.idText.text = "今日登录可领取";

                this.idText.color = "#ffffff";
                if (LoginRewardModel.instance._nodeList.length > 0) {
                    if (cfgState == 1) {
                        this._btnClip.visible = true;

                        this.sureBtn.visible = true;

                        this.received.visible = false;
                    } else {
                        this._btnClip.visible = false;

                        this.sureBtn.visible = false;

                        this.received.visible = true;
                    }
                    this.VipConditionLevel = this._cfg[login_rewardFields.vip];
                } else {
                    this._btnClip.visible = false;

                    this.sureBtn.visible = false;

                    this.received.visible = false;

                    this.theEnd.visible = true;
                }
            } else if (this._cfg[login_rewardFields.nextDayTips] === 1) {
                this.idText.text = "明日登录可领取";

                this.received.visible = false;

                this.idText.color = "#ffffff";

                this.sureBtn.visible = false;

                this.tomorrowIsOk.visible = true;
            }

            if (this._cfg[login_rewardFields.vip] !== 0) {

                this.VipConditionLevel = this._cfg[login_rewardFields.vip];

                this.idText.text = `SVIP${this._cfg[login_rewardFields.vip]}可额外领取`;

                this.idText.color = "#ffffff";

                this.tomorrowIsOk.visible = false;

                if (LoginRewardModel.instance._nodeList.length > 0) {
                    if (cfgState == 1) {
                        if (this.vipLevel >= this.VipConditionLevel) {
                            this._btnClip.visible = true;

                            this.sureBtn.visible = true;

                            this.received.visible = false;
                        } else {
                            this._btnClip.visible = false;
                        }
                    } else if (cfgState == 0) {
                        this._btnClip.visible = false;

                        this.sureBtn.visible = true;

                        this.received.visible = false;
                    } else {
                        this._btnClip.visible = false;

                        this.sureBtn.visible = false;

                        this.received.visible = true;
                    }
                } else {
                    this._btnClip.visible = false;

                    this.sureBtn.visible = false;

                    this.received.visible = false;

                    this.theEnd.visible = true;
                }
            }


            this._itemId = this._cfg[GetLoginRewardRewardFields.id];

            let awardArr: Array<Items> = [];

            let showIdArr: number[] = [];

            awardArr = this._cfg[login_rewardFields.reward];

            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }

            let count: number = showIdArr.length;

            let DayBase: modules.bag.BaseItem[] = [];

            DayBase.push(this.loginBase1);

            DayBase.push(this.loginBase2);

            DayBase.push(this.loginBase3);

            for (let i: int = 0; i < 3; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
        }

        public close(): void {
            super.close();
            this._btnClip.stop();
        }

        private creatEffect() {
            this._btnClip = new CustomClip();

            this.sureBtn.addChild(this._btnClip);

            this._btnClip.skin = "assets/effect/btn_light.atlas";

            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];

            this._btnClip.durationFrame = 5;

            this._btnClip.play();

            this._btnClip.loop = true;

            this._btnClip.pos(-5, -16);
            this._btnClip.scale(0.8, 1);

            this._btnClip.visible = false;
        }

        private setBtnSure(): void {
            // this.sureBtn.visible  = true;
            // this.received.visible = false;
            // this.tomorrowIsOk.visible = false;
        }

        private sureBtnHandler(): void {
            this.tomorrowIsOk.visible = false;
            if (this.VipConditionLevel == 0) {
                if (this.vipLevel >= this.VipConditionLevel) {
                    let rewards: Array<Items> = this._cfg[login_rewardFields.reward];

                    let items: Array<Item> = [];

                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        LoginRewardCtrl.instance.getLoginRewardReward(this._itemId);
                        this._btnClip.visible = false;

                        this.sureBtn.visible = false;

                        this.received.visible = true;
                    }
                }
            } else if (this.VipConditionLevel != 0) {
                if (this.vipLevel >= this.VipConditionLevel) {
                    let rewards: Array<Items> = this._cfg[login_rewardFields.reward];
                    let items: Array<Item> = [];
                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        LoginRewardCtrl.instance.getLoginRewardReward(this._itemId);
                        this._btnClip.visible = false;

                        this.sureBtn.visible = false;

                        this.received.visible = true;
                    }
                } else {
                    CommonUtil.alert('温馨提示', `领取奖励需要SVIP${this.VipConditionLevel},是否前往提升SVIP?`, [Handler.create(this, this.openRecharge)]);
                    // WindowManager.instance.open(WindowEnum.LOGIN_REWARD_TIP_ALERT);
                }
            }
        }
        private openRecharge(): void {
            let intNum = 0;
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                intNum = WindowEnum.VIP_PANEL;
            }
            else {
                intNum = WindowEnum.VIP_NEW_PANEL;
            }
            WindowManager.instance.open(intNum);
        }
    }
}