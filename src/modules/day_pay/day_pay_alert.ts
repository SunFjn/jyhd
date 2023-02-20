///<reference path="../config/day_pay_cfg.ts"/>


namespace modules.day_pay {
    import DayPayAlertUI = ui.DayPayAlertUI;

    import day_pay = Configuration.day_pay;
    import DayPayCfg = modules.config.DayPayCfg;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import day_payFields = Configuration.day_payFields;
    import Event = Laya.Event;
    import DaypayRewardFields = Protocols.DaypayRewardFields;
    import DaypayReward = Protocols.DaypayReward;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import ExteriorSk = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class DayPayPanel extends DayPayAlertUI {
        private _cfg: day_pay;
        private getState: number = 0;
        private gearsID: number = 0;
        private _btnClip: CustomClip;
        private rewards: Array<Items> = [];
        private _tipBox1Tween: TweenJS;
        private _tipBox2Tween: TweenJS;
        private _tipBox3Tween: TweenJS;
        private _modelClipTween: TweenJS;
        private _modeBaseImgTween: TweenJS;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _taskBase: Array<BaseItem>;
        private _modelClipY = 150;//模型位置
        private _qiangtiao: boolean;

        private booll1: boolean;
        private booll2: boolean;
        private booll3: boolean;
        constructor() {
            super();
            this._qiangtiao = false;
            this.booll1 = false;
            this.booll2 = false;
            this.booll3 = false;
        }


        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.DayBase1, this.DayBase2, this.DayBase3, this.DayBase4];
            this.creatEffect();

            //初始化页面
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.BtnSure, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.BtnRec1, LayaEvent.CLICK, this, this.showItems, [0]);
            this.addAutoListener(this.BtnRec2, LayaEvent.CLICK, this, this.showItems, [1]);
            this.addAutoListener(this.BtnRec3, LayaEvent.CLICK, this, this.showItems, [2]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_PAY_UPDATE, this, this.updateView);
        }
        public onOpened(): void {
            super.onOpened();
            Channel.instance.publish(Protocols.UserFeatureOpcode.GetDaypayInfo, null);
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._cfg = DayPayCfg.instance.getCfgById(DayPayModel.instance.id);
            this.setTipBoxTween();
            this.setTips();
            this.showItems(0);
            this._qiangtiao = false;
            this._btnClip.play();
            if (value) {
                this._qiangtiao = true;
                this.gearsID = value;
                this.showItems(this.gearsID);
            } else {
                this.updateView();
            }
        }

        public close(): void {
            if (this._modelClipTween) {
                this._modelClipTween.stop();
                this._modelClipTween = null;
            }
            if (this._modeBaseImgTween) {
                this._modeBaseImgTween.stop();
                this._modeBaseImgTween = null;
            }
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this._tipBox1Tween = null;
            }
            if (this._tipBox2Tween) {
                this._tipBox2Tween.stop();
                this._tipBox2Tween = null;
            }
            if (this._tipBox3Tween) {
                this._tipBox3Tween.stop();
                this._tipBox3Tween = null;
            }
            super.close();
        }

        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this._tipBox1Tween = null;
            }
            if (this._tipBox2Tween) {
                this._tipBox2Tween.stop();
                this._tipBox2Tween = null;
            }
            if (this._tipBox3Tween) {
                this._tipBox3Tween.stop();
                this._tipBox3Tween = null;
            }
            if (this._modelClipTween) {
                this._modelClipTween.stop();
                this._modelClipTween = null;
            }
            if (this._modeBaseImgTween) {
                this._modeBaseImgTween.stop();
                this._modeBaseImgTween = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            super.destroy();
        }

        private updateView(): void {
            this.setState();
            this.setBtnSure(this.gearsID);
            this.setRp();
        }

        public setTipBoxTween() {
            this._tipBox1Tween = TweenJS.create(this.tipBox1).to({ y: this.tipBox1.y - 10 },
                600).start().yoyo(true).repeat(99999999);
            this._tipBox2Tween = TweenJS.create(this.tipBox2).to({ y: this.tipBox2.y - 10 },
                600).start().yoyo(true).repeat(99999999);
            this._tipBox3Tween = TweenJS.create(this.tipBox3).to({ y: this.tipBox3.y - 10 },
                600).start().yoyo(true).repeat(99999999);
        }

        public setTipBox(id: number, str: Array<string>) {
            switch (id) {
                case 0:
                    this.tipText1.text = str[1];
                    if (str[3]) {
                        this.tipText1.color = `#${str[3]}`;
                    }
                    this.tipImg1.width = this.tipText1.textWidth + 15;
                    this.booll1 = (str[1] != null);
                    break;
                case 1:
                    this.tipText2.text = str[1];
                    if (str[3]) {
                        this.tipText2.color = `#${str[3]}`;
                    }
                    this.tipImg2.width = this.tipText2.textWidth + 15;
                    this.booll2 = (str[1] != null);
                    break;
                case 2:
                    this.tipText3.text = str[1];
                    if (str[3]) {
                        this.tipText3.color = `#${str[3]}`;
                    }
                    this.tipImg3.width = this.tipText3.textWidth + 15;
                    this.booll3 = (str[1] != null);
                    break;
                default:
                    break;
            }
            if (str[2]) {
                this.tipsWithText.color = `#${str[2]}`;
            }
            if (str[0]) {
                this.tipsWithText.text = str[0];
            }
            else {
                this.tipsWithText.text = "";
            }
        }

        public setTips() {
            this._cfg = DayPayCfg.instance.getCfgById(DayPayModel.instance.id);
            let str1 = this._cfg[day_payFields.oneTips];
            let str2 = this._cfg[day_payFields.twoTips];
            let str3 = this._cfg[day_payFields.threeTips];
            this.setTipBox(0, str1);
            this.setTipBox(1, str2);
            this.setTipBox(2, str3);
        }

        public setModelAndImg(id: number) {
            this._cfg = DayPayCfg.instance.getCfgById(DayPayModel.instance.id);
            let shuju = this._cfg[day_payFields.oneShowDate];
            switch (id) {
                case 0:
                    shuju = this._cfg[day_payFields.oneShowDate];
                    break;
                case 1:
                    shuju = this._cfg[day_payFields.twoShowDate];
                    break;
                case 2:
                    shuju = this._cfg[day_payFields.threeShowDate];
                    break;
                default:
                    break;
            }
            //	/*一档次(模型ID图片ID) , 是否模型(0模型1图片), (是否 上下动  0否 1是)*/
            let imageId: number = shuju[0];
            let isModel = shuju[1];
            let imageIdmove: number = shuju[2];
            if (isModel == 1) {
                this.showImg.skin = `assets/icon/ui/day_pay/${imageId}.png`;//图片路径
                this.showTweenImg.visible = true;
                if (this._modeBaseImgTween) {
                    this._modeBaseImgTween.stop();
                }
                if (imageIdmove != 0) {
                    this.showTweenImg.y = 111;
                    this._modeBaseImgTween = TweenJS.create(this.showTweenImg).to({ y: this.showTweenImg.y - 10 },
                        1000).start().yoyo(true).repeat(99999999);
                }
                // if (this._modelClip) {
                //     this._modelClip.visible = false;
                // }
                if (this._skeletonClip) {
                    this._skeletonClip.visible = false;
                }
            } else {
                this.showTweenImg.visible = false;
                this.showModelClip(imageId, imageIdmove);

            }
        }


        /**
         * 显示入口模型
         */
        public showModelClip(_pitchId: number, imageIdmove: number) {
            let modelCfg: ExteriorSk = ExteriorSKCfg.instance.getCfgById(_pitchId);
            this._modelClipY = 150;
            let typeNum = Math.round(_pitchId / 1000);
            if (typeNum == 2) {  //宠物
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
            } else if (typeNum == 3) {//翅膀
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
            } else if (typeNum == 4) {//精灵
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
            } else if (typeNum == 5) {//幻武
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
                this._modelClipY = 340;
            } else if (typeNum == 9 || typeNum == 10) {//法阵
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
                this._modelClipY = 260;
            } else if (typeNum == 90) {//时装
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
                this._modelClipY = 330;
            } else if (typeNum == 11) {//灵珠
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
                this._modelClipY = 340;
                // if (this._modelClip) {
                //     this._modelClip.setActionType(ActionType.SHOW);
                // }
                if (this._skeletonClip) {
                    this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI)
                }
            }
            else if (_pitchId == 8021) {//Npc
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
                this._modelClipY = 340;
            }
            else {
                // this._modelClip.reset(_pitchId);
                this._skeletonClip.reset(_pitchId)
            }
            // this._modelClip.y = this._modelClipY;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] * 0.6;
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            this._skeletonClip.y = this._modelClipY;

            // if (this._modelClip) {
            //     this._modelClip.visible = true;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.visible = true;
            }
            if (this._modelClipTween) {
                this._modelClipTween.stop();
            }
            // if (imageIdmove != 0) {
            //     this._modelClipTween = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 15 },
            //         1000).start().yoyo(true).repeat(99999999);
            // }
        }

        private showItems(id: number): void {
            if (id > 2) return;
            this.gearsID = id;
            this._cfg = DayPayCfg.instance.getCfgById(DayPayModel.instance.id);
            let awardArr: Array<Items> = [];
            let showIdArr: number[] = [];
            if (id == 0) {
                this.rewards = this._cfg[day_payFields.reward_1];
                this.BtnRec1.skin = "day_pay/tab_rchl_yq_1.png";
                this.BtnRec2.skin = "day_pay/tab_rchl_yq_0.png";
                this.BtnRec3.skin = "day_pay/tab_rchl_yq_0.png";
                this.BtnRec1.labelColors = "#580505";
                this.BtnRec2.labelColors = "#ffec7c";
                this.BtnRec3.labelColors = "#ffec7c";
                let str = this._cfg[day_payFields.oneTips];
                this.tipsWithText.text = str[0] ? str[0] : "";
                this.tipBox1.visible = false;
                this.tipBox2.visible = this.booll2;
                this.tipBox3.visible = this.booll3;
            } else if (id == 1) {
                this.rewards = this._cfg[day_payFields.reward_2];
                this.BtnRec1.skin = "day_pay/tab_rchl_yq_0.png";
                this.BtnRec2.skin = "day_pay/tab_rchl_yq_1.png";
                this.BtnRec3.skin = "day_pay/tab_rchl_yq_0.png";
                this.BtnRec1.labelColors = "#ffec7c";
                this.BtnRec2.labelColors = "#580505";
                this.BtnRec3.labelColors = "#ffec7c";
                let str = this._cfg[day_payFields.twoTips];
                this.tipsWithText.text = str[0] ? str[0] : "";
                this.tipBox1.visible = this.booll1;
                this.tipBox2.visible = false;
                this.tipBox3.visible = this.booll3;

            } else if (id == 2) {
                this.rewards = this._cfg[day_payFields.reward_3];
                this.BtnRec1.skin = "day_pay/tab_rchl_yq_0.png";
                this.BtnRec2.skin = "day_pay/tab_rchl_yq_0.png";
                this.BtnRec3.skin = "day_pay/tab_rchl_yq_1.png";
                this.BtnRec1.labelColors = "#ffec7c";
                this.BtnRec2.labelColors = "#ffec7c";
                this.BtnRec3.labelColors = "#580505";
                let str = this._cfg[day_payFields.threeTips];
                this.tipsWithText.text = str[0] ? str[0] : "";
                this.tipBox1.visible = this.booll1;
                this.tipBox2.visible = this.booll2;
                this.tipBox3.visible = false;
            }

            this.setTipsByState(0);
            this.setTipsByState(1);
            this.setTipsByState(2);
            this.BtnRec1.label = `${this._cfg[day_payFields.money_1]}元`;
            this.BtnRec2.label = `${this._cfg[day_payFields.money_2]}元`;
            this.BtnRec3.label = `${this._cfg[day_payFields.money_3]}元`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let allAward = new Array<BaseItem>();
            for (var index = 0; index < this.rewards.length; index++) {
                let element = this.rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [this.rewards[index][ItemsFields.itemId], this.rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                    // _taskBase._nameTxt.color = "#b15315";
                    _taskBase._nameTxt.visible = true;
                    allAward.push(_taskBase);
                }
            }
            //居中适配 奖励
            let lengNum = allAward.length * 100 + (allAward.length - 1) * 30;
            let startPosX = (this.width - lengNum) / 2;
            for (let index = 0; index < allAward.length; index++) {
                let element = allAward[index];
                element.x = startPosX;
                startPosX += (element.width) + 30;
            }
            this.setRp();
            this.setModelAndImg(id);
            this.setBtnSure(id);
        }

        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.BtnSure.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -10);
            this._btnClip.visible = false;

            // this._modelClip = AvatarClip.create(1024, 1024, 800);
            // this.showBox.addChildAt(this._modelClip, 1);
            // this._modelClip.pos(115, this._modelClipY, true);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.visible = false;

            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(420, 310, true)
            this._skeletonClip.anchorX = 0.5;
            this._skeletonClip.anchorY = 0.5;
            this._skeletonClip.visible = false;
        }

        private sureBtnHandler(): void {
            if (this.getState == 1) {
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = this.rewards.length; i < len; i++) {
                    let item: Items = this.rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    DayPayCtrl.instance.getDaypayReward(this.gearsID);
                }
            }
            if (this.getState == 0) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                WindowManager.instance.close(WindowEnum.DAY_PAY_PANEL);
            }
        }
        private setTipsByState(id: number) {
            let rewarList: Array<DaypayReward> = DayPayModel.instance.rewarList;
            if (rewarList[id]) {
                this.getState = rewarList[id][DaypayRewardFields.state];
                if (this.getState !== 0) {
                    if (this.getState == 2) {
                        this.BtnSure.visible = false;
                        this.receivedImg.visible = true;
                        switch (id) {
                            case 0:
                                this.tipBox1.visible = false;
                                break;
                            case 1:
                                this.tipBox2.visible = false;
                                break;
                            case 2:
                                this.tipBox3.visible = false;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        private setBtnSure(id: number): void {
            let rewarList: Array<DaypayReward> = DayPayModel.instance.rewarList;
            if (rewarList[id]) {
                this.getState = rewarList[id][DaypayRewardFields.state];
                if (this.getState !== 0) {
                    this.BtnSure.label = "领取";

                    if (this.getState == 1) {
                        this._btnClip.visible = true;
                        this.BtnSure.visible = true;
                        this.receivedImg.visible = false
                    } else {
                        this.BtnSure.visible = false;
                        this.receivedImg.visible = true;
                    }
                } else {
                    this.BtnSure.label = "充点小钱";
                    this.BtnSure.visible = true;
                    this.receivedImg.visible = false;
                    this._btnClip.visible = false;
                }
            } else {
                this.BtnSure.label = "充点小钱";
                this.BtnSure.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.visible = false;
            }

        }

        private setState(): void {
            this.moneyTest.text = `已充值 ${DayPayModel.instance.getMoney} 元`;
            let rewarList: Array<DaypayReward> = DayPayModel.instance.rewarList;
            if (!this._qiangtiao) {
                for (let i: int = 0; i < rewarList.length; i++) {
                    if (rewarList[i][DaypayRewardFields.state] == 1) {
                        if (i + 1 >= rewarList.length) {
                            this.showItems(i);
                            //return;
                            i = 0;
                            break;
                        }
                        this.showItems(i);
                        return;
                    }
                }
            }
            this._qiangtiao = true;
        }

        private setRp(): void {
            let rewarList: Array<DaypayReward> = DayPayModel.instance.rewarList;
            for (let i: int = 0; i < rewarList.length; i++) {
                let flag: boolean = rewarList[i][DaypayRewardFields.state] == 1;
                if (i == 0) {
                    this.dayRP1.visible = flag;
                } else if (i == 1) {
                    this.dayRP2.visible = flag;
                } else {
                    this.dayRP3.visible = flag;
                }
            }
        }
    }
}
