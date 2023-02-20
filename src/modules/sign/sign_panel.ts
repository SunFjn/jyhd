/**签到面板*/



///<reference path="../bag/base_item.ts"/>
///<reference path="../config/sign_reward_cfg.ts"/>

namespace modules.sign {
    import sign_items = Configuration.sign_items;
    import sign_itemsFields = Configuration.sign_itemsFields;
    import sign_reward = Configuration.sign_reward;
    import sign_rewardFields = Configuration.sign_rewardFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;


    import Event = Laya.Event;
    import Image = Laya.Image;


    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import SignViewUI = ui.SignViewUI;

    import SignRewardCfg = modules.config.SignRewardCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import MonthCardModel = modules.monthCard.MonthCardModel;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;


    const enum RewardStatus {
        disable = 0,
        highlight = 1,
        receive = 2,
        none = 3,
    }

    class RewardItem extends ui.SignItemUI {
        private _status: RewardStatus;

        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();
            this.addChild(this.item);
        }

        protected setData(value: any): void {
            super.setData(value);
            this.item.dataSource = value[0];
            this.dayNum.text = `第${value[2]}天`;
            this.status = value[1];
        }


        set status(value: RewardStatus) {
            console.log("item状态", value)
            if (this._status == value) {
                return;
            }
            this._status = value;
            switch (this._status) {
                case RewardStatus.disable: {
                    this.not.visible = false;
                    this.chooice.visible = true;
                    this.signed.visible = false;
                    this.sgin_now.visible = false;
                    this.grayMask.visible = false;
                    break;
                }
                case RewardStatus.highlight: {
                    this.not.visible = false;
                    this.chooice.visible = true;
                    this.signed.visible = false;
                    this.sgin_now.visible = false;
                    this.grayMask.visible = false;
                    break;
                }
                case RewardStatus.receive: {
                    this.not.visible = true;
                    this.chooice.visible = false;
                    this.signed.visible = true;
                    this.sgin_now.visible = false;
                    this.grayMask.visible = true;
                    break;
                }
                default:
                    this.not.visible = true;
                    this.chooice.visible = false;
                    this.signed.visible = false;
                    this.sgin_now.visible = false;
                    this.grayMask.visible = false;
                    break;
            }
        }
    }

    export class SignPanel extends SignViewUI {


        private _addCountArr: Array<sign_reward>;
        private _addItemArray: Array<SignAwardItem>;
        private _SignBtnClip: CustomClip;

        private _tween: TweenJS;

        private _htmlTxt: string;
        private _htmlTxt1: string;
        private _list: CustomList;
        private _showIds: Array<any>;

        constructor() {
            super();

        }

        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._addCountArr = SignRewardCfg.instance.getCfgByReward(SignModel.instance.eraLevel);

            this.centerX = 0;
            this.centerY = 0;

            this._addItemArray = [this.addItem0, this.addItem1, this.addItem2, this.addItem3, this.addItem4];

            this._list = new CustomList();
            this._list.itemRender = RewardItem;
            this._list.hCount = 5;
            this._list.spaceX = 4;
            this._list.spaceY = 4;
            this._list.width = 715;
            this._list.height = 470;
            this._list.x = 5;
            this._list.y = 408;
            this.addChild(this._list);

            // // this.signb=true;
            // this._tween = TweenJS
            //     .create(this.addSignBtn)
            //     .to({rotation: this.addSignBtn.rotation - 10}, 150)
            //     .chain(
            //         TweenJS
            //             .create(this.addSignBtn)
            //             .to({rotation: 0}, 0),
            //         TweenJS
            //             .create(this.addSignBtn)
            //             .delay(1000).onComplete(() => {
            //             if (this._tween != null) {
            //                 this._tween.start();
            //             }
            //         })
            //     ).repeat(4);

            var html: string = "<span style='color:#2d2d2d;font-size: 24px'>签到状态每日凌晨</span>";
            html += "<span style='color:#168a17;font-size: 24px'>5</span>";
            html += "<span style='color:#2d2d2d;font-size: 24px'>点重置</span><br/>";
            html += "<span style='color:#2d2d2d;font-size: 24px'>激活</span>";
            html += "<span style='color:#b15315;font-size: 24px;'>月卡</span>";
            html += "<span style='color:#2d2d2d;font-size: 24px;'>领取</span>";
            html += "<span style='color:#b15315;font-size:36px'>双倍</span>";
            html += "<span style='color:#2d2d2d;font-size: 24px'>签到奖励</span>";

            this._htmlTxt = this._htmlTxt1 = html;
            this._htmlTxt1 += "<span style='color:#168a17;font-size: 24px'>(已激活)</span>";


            this._SignBtnClip = new CustomClip();
            this.signBtn.addChildAt(this._SignBtnClip, 0);
            this._SignBtnClip.pos(-5, -16, true);
            this._SignBtnClip.scale(1.23, 1.2);
            this._SignBtnClip.skin = "assets/effect/btn_light.atlas";
            this._SignBtnClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._SignBtnClip.durationFrame = 5;
            this._SignBtnClip.play();
            this._SignBtnClip.visible = true;

        }

        private updateItem() {
            let eralevel = SignModel.instance.eraLevel;
            let signNumber = SignModel.instance.signCount;
            let dayNumber = SignModel.instance.dayNumber;
            this._showIds.length = 0;
            let cfgs = SignRewardCfg.instance.getCfgByLevel(eralevel);
            for (let i = 0; i < 31; i++) {
                if (i < dayNumber) {
                    let itemInfo: Array<sign_items> = cfgs[i][sign_rewardFields.tipsAward];
                    let item: Protocols.Item = [itemInfo[0][sign_itemsFields.itemId], itemInfo[0][sign_itemsFields.count], 0, null];
                    let state: RewardStatus;
                    if (i < signNumber) {
                        state = RewardStatus.receive;
                        this._showIds.push([item, state, (i + 1)]);
                    } else if (i == signNumber && signNumber <= dayNumber) {
                        if (SignModel.instance.signBool == true || signNumber == 0) {
                            state = RewardStatus.highlight;
                            this._showIds.push([item, state, (i + 1)]);
                        } else {
                            state = RewardStatus.disable;
                            this._showIds.push([item, state, (i + 1)]);
                        }
                    } else {
                        state = RewardStatus.none;
                        this._showIds.push([item, state, (i + 1)]);
                    }
                }
            }
            this._list.datas = this._showIds;
            if (signNumber <= dayNumber) {
                if (SignModel.instance.signBool == true || signNumber == 0) {
                    this.signBtn.visible = true;
                    this._SignBtnClip.visible = true;
                } else {
                    this.signBtn.visible = false;
                    this._SignBtnClip.visible = false;
                }
            }
        }

        private updateHtml() {
            let flag = MonthCardModel.instance.flag;
            if (flag === 1) {
                // this.HTMLtext.innerHTML = this._htmlTxt1;
                this.getMonthBtn.visible = false;
            } else {
                // this.HTMLtext.innerHTML = this._htmlTxt;
                this.getMonthBtn.visible = true;
            }
        }

        private signReply(): void {
            let result = SignModel.instance.SignReply;
            switch (result) {
                case ErrorCode.SignNotOpen: {
                    SystemNoticeManager.instance.addNotice("签到未开启", true);
                }
                    break;
                case 0: {
                    SystemNoticeManager.instance.addNotice("签到成功", false);
                }
                    break;
            }
        }

        private updateAddReward() {
            let signNumber = SignModel.instance.signCount;
            let addNumber: Array<number> = SignModel.instance.addCount;
            this.proAddSign.width = (signNumber / this._addCountArr[4][sign_rewardFields.count]) * 575;
            this.dayNum.text = signNumber.toString();

            for (let i = 0; i < this._addItemArray.length; i++) {
                let cfg = this._addCountArr[i];
                let needNum = cfg[sign_rewardFields.count];
                let state: number;//0未签，1可签，2已签
                if (signNumber >= needNum) {
                    if (addNumber.indexOf(i) == -1) {
                        state = 1;
                    } else {
                        state = 2;
                    }
                } else {
                    state = 0;
                }
                this._addItemArray[i].data = [cfg, state, i];
            }
        }

        private stopTween(): void {
            this._tween.stop();
            this._tween.stopChainedTweens();
        }

        private updateSign(): void {
            this.updateHtml();
            // let today = new Date(GlobalData.serverTime);
            // let year = today.getFullYear();
            // let month = today.getMonth();
            // // this.sever.text = year.toString() + "-" + (month + 1).toString();
            this.updateItem();
            this.updateAddReward();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.signBtn, LayaEvent.CLICK, this, this.SignBtnHandler);
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.TipsHandler);
            this.addAutoListener(this.getMonthBtn, LayaEvent.CLICK, this, this.getMonthCardHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SIGN_REPLY, this, this.signReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_SIGN, this, this.updateSign);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_MONTH_CARD_INFO, this, this.showUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
        }

        private SignBtnHandler(): void {
            let signBool1 = SignModel.instance.signBool;
            if (signBool1 == true) {
                Channel.instance.publish(UserFeatureOpcode.Sign, null);
            }
        }


        private TipsHandler(): void {
            CommonUtil.alertHelp(20005);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateSign();
            this._SignBtnClip.play();
            this.showUI();
        }
        public showUI() {

        }
        public okBtnHandler() {
            //战力护符 自尊  招财猫
            WindowManager.instance.open(WindowEnum.MONTH_CARD_PANEL);
            // if (!modules.fight_talisman.FightTalismanModel.instance.state) {
            //     WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            // }
            // else if (modules.zhizun.ZhizunModel.instance.state == 0) {
            //     WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            // }
            // else if (!modules.money_cat.MoneyCatModel.instance.state) {
            //     WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            // }
        }
        public close(): void {
            super.close();
            // this.stopTween();
            this._SignBtnClip.stop();
        }

        private getMonthCardHandler() {
            WindowManager.instance.open(WindowEnum.MONTH_CARD_PANEL);
        }
    }
}