/**登录豪礼(周末狂欢)*/


namespace modules.week_login {
    import WeekLoginItemUI = ui.WeekLoginItemUI;
    import week_login = Configuration.week_login;
    import Event = Laya.Event;
    import Items = Configuration.Items;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import VipModel = modules.vip.VipModel;

    import GetWeekLoginAwardFields = Protocols.GetWeekLoginAwardFields;
    import GetWeekLoginReplyFields = Protocols.GetWeekLoginReplyFields;
    import week_loginFields = Configuration.week_loginFields;

    export class WeekLoginItem extends WeekLoginItemUI {
        private _btnClip: CustomClip;
        private _cfg: week_login;
        private VipConditionLevel: number = 0;//vip条件
        private vipLevel: number = 0;
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

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_LOGIN_UPDATE, this, this._updateView);

            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
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

            this._btnClip.pos(-5, -18);

            this._btnClip.scale(0.8, 1.1);

            this._btnClip.visible = false;
        }
        private _updateView(): void {
            //this.setBtnSure();
            if (!WeekLoginModel.instance.state) {
                this._btnClip.visible = false;

                this.sureBtn.visible = false;

                this.received.visible = false;

                this.theEnd.visible = true;
            }
        }
        protected setData(value: any): void {
            super.setData(value);

            this.vipLevel = VipModel.instance.vipLevel;

            this._cfg = value;

            let cfgId = this._cfg[GetWeekLoginAwardFields.id];

            let cfgNode = WeekLoginModel.instance.getNodeInfoById(cfgId);

            let cfgState: number = 0;

            if (cfgNode) {
                cfgState = cfgNode[1];//0是id，1是领取状态
            }

            let _cfgId = this._cfg[GetWeekLoginAwardFields.id];

            /*-------------------------今日登录可领----------------------------------*/
            if (this._cfg[week_loginFields.isTomorrow] === 0) {
                this.tomorrowIsOk.visible = false;
                this.idText.text = "今日登录可领取";
                this.idText.color = "#ffffff";
                if (WeekLoginModel.instance.state) {
                    switch (cfgState) {
                        case 0://不可领
                            this._btnClip.visible = false;

                            this.sureBtn.visible = true;

                            this.received.visible = false;
                            break;
                        case 1://可领
                            this._btnClip.visible = true;

                            this._btnClip.play();

                            this.sureBtn.visible = true;

                            this.received.visible = false;
                            break;
                        case 2://明日可领
                            // console.log("领取状态 = 2，未知错误");
                            break;
                        case 3://已领
                            this._btnClip.visible = false;

                            this.sureBtn.visible = false;

                            this.received.visible = true;
                            break;
                        default:
                            // console.log("领取状态 = default，未知错误");
                            break;
                    }
                    // console.log("this._btnClip = " + this._btnClip.visible);
                    this.VipConditionLevel = this._cfg[week_loginFields.vip];
                } else {
                    this._btnClip.visible = false;

                    this.sureBtn.visible = false;

                    this.received.visible = false;

                    this.theEnd.visible = true;
                }
            }
            /*----------------------------------------------------------------------*/

            else if (this._cfg[week_loginFields.isTomorrow] === 1) {
                this.idText.text = "明日登录可领取";

                this.received.visible = false;

                this.idText.color = "#ffffff";

                this.sureBtn.visible = false;

                this.tomorrowIsOk.visible = true;
            }

            /*-------------------------VIP------------------------------------*/
            if (this._cfg[week_loginFields.vip] != 0) {
                this.VipConditionLevel = this._cfg[week_loginFields.vip];
                this.idText.text = `SVIP${this._cfg[week_loginFields.vip]}可额外领取`;
                this.idText.color = "#ffffff";
                this.tomorrowIsOk.visible = false;
                if (WeekLoginModel.instance.state) {
                    switch (cfgState) {
                        case 0://不可领
                            this._btnClip.visible = false;

                            this.sureBtn.visible = true;

                            this.received.visible = false;
                            break;
                        case 1://可领
                            if (this.vipLevel >= this.VipConditionLevel) {
                                this._btnClip.visible = true;

                                this._btnClip.play();

                                this.sureBtn.visible = true;

                                this.received.visible = false;
                            } else {
                                this._btnClip.visible = false;
                            }

                            break;
                        case 2://明日可领
                            // console.log("领取状态 = 2，未知错误");
                            break;
                        case 3://已领
                            this._btnClip.visible = false;

                            this.sureBtn.visible = false;

                            this.received.visible = true;
                            break;
                        default:
                            // console.log("领取状态 = default，未知错误");
                            break;
                    }
                } else {
                    this._btnClip.visible = false;

                    this.sureBtn.visible = false;

                    this.received.visible = false;

                    this.theEnd.visible = true;
                }
            }
            /*------------------------------------------------------------------*/
            this._itemId = this._cfg[week_loginFields.id];
            let awardArr: Array<Items> = [];
            let showIdArr: number[] = [];
            awardArr = this._cfg[week_loginFields.award];
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            let count: number = showIdArr.length;

            let DayBase: modules.bag.BaseItem[] = [];

            DayBase.push(this.weekBase1);

            DayBase.push(this.weekBase2);

            DayBase.push(this.weekBase3);

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
        private sureBtnHandler(): void {
            this.tomorrowIsOk.visible = false;
            if (this.VipConditionLevel == 0) {
                if (this.vipLevel >= this.VipConditionLevel) {
                    let rewards: Array<Items> = this._cfg[week_loginFields.award];

                    let items: Array<Item> = [];

                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {

                        WeekLoginCtrl.instance.getWeekLoginReward(this._itemId);

                        this._btnClip.visible = false;

                        this.sureBtn.visible = false;

                        this.received.visible = true;
                    }

                }
            } else if (this.VipConditionLevel != 0) {
                if (this.vipLevel >= this.VipConditionLevel) {
                    let rewards: Array<Items> = this._cfg[week_loginFields.award];

                    let items: Array<Item> = [];

                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    if (BagUtil.canAddItemsByBagIdCount(items)) {

                        WeekLoginCtrl.instance.getWeekLoginReward(this._itemId);

                        this._btnClip.visible = false;

                        this.sureBtn.visible = false;

                        this.received.visible = true;
                    }
                } else {
                    // CommonUtil.vipLvNotEnoughAlert();
                    CommonUtil.alert('温馨提示', `领取奖励需要SVIP${this.VipConditionLevel},是否前往提升SVIP?`, [Handler.create(this, this.openRecharge)]);

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