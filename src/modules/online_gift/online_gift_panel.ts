/**在线礼包面板*/


///<reference path="../config/online_gift_cfg.ts"/>


namespace modules.onlineGift {
    import online_reward = Configuration.online_reward;
    import CustomList = modules.common.CustomList;
    import OnlineGiftCfg = modules.config.OnlineGiftCfg;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import OnlineReward = Protocols.OnlineReward;
    import OnlineRewardFields = Protocols.OnlineRewardFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import Event = laya.events.Event;
    import MonthCardModel = modules.monthCard.MonthCardModel;

    export class OnlineGiftPanel extends ui.OnLineGiftViewUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        private _rewardList: Array<any>;

        private _htmlTxt: string;
        private _htmlTxt1: string;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }

            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._showIds = new Array<any>();
            this._rewardList = new Array<online_reward>();
            this._list = new CustomList();
            this._list.itemRender = OnlineGiftItem;

            this._list.width = 699;
            this._list.height = 835;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 2;
            this._list.x = 15;
            this._list.zOrder = 15;
            this._list.y = 135;

            this.addChild(this._list);
            this.createList();
            var html: string = "<span style='color:#2d2d2d;font-size: 24px'>在线时间每日凌晨</span>";
            html += "<span style='color:#168a17;font-size: 24px'>5</span>";
            html += "<span style='color:#2d2d2d;font-size: 24px'>点重置</span><br/>";

            this._htmlTxt = this._htmlTxt1 = html;

            this._htmlTxt += "<span style='color:#2d2d2d;font-size: 24px'>激活</span>";
            this._htmlTxt += "<span style='color:#b15315;font-size: 24px;'>月卡</span>";
            this._htmlTxt += "<span style='color:#2d2d2d;font-size: 24px;'>领取</span>";
            this._htmlTxt += "<span style='color:#b15315;font-size:36px'>双倍</span>";
            this._htmlTxt += "<span style='color:#2d2d2d;font-size: 24px'>签到奖励</span>";

            this._htmlTxt1 = this._htmlTxt;
            this._htmlTxt1 += "<span style='color:#168a17;font-size: 24px'>(已激活)</span>";

        }

        public createList(): void {
            let cfgs: Array<online_reward> = OnlineGiftCfg.instance.getCfgsByEralv(PlayerModel.instance.eraLevel);
            for (let i = 0; i < cfgs.length; i++) {
                this._rewardList.push(cfgs[i]);
            }
        }

        public updateList(): void {
            let RewardReply: Array<OnlineReward> = OnlineGiftModel.instance.UpdateRewardReply;
            let onlineRewardDic = OnlineGiftModel.instance.getOnlineRewardDic();
            this._showIds.length = 0;
            for (let i = 0; i < RewardReply.length; i++) {
                let onlineRewardCfg = onlineRewardDic.get(RewardReply[i][OnlineRewardFields.id]);
                this._showIds.push(onlineRewardCfg);
            }
            this._showIds.sort(((l: OnlineReward, r: OnlineReward): number => {
                if (l[OnlineRewardFields.state] == r[OnlineRewardFields.state]) {
                    return l[OnlineRewardFields.id] < r[OnlineRewardFields.id] ? -1 : 1;
                }
                let stateA = 0;
                if (l[OnlineRewardFields.state] == OnlineRewardState.can) {
                    stateA = 2;
                } else if (l[OnlineRewardFields.state] == OnlineRewardState.not) {
                    stateA = 1;
                }
                let stateB = 0;
                if (r[OnlineRewardFields.state] == OnlineRewardState.can) {
                    stateB = 2;
                } else if (r[OnlineRewardFields.state] == OnlineRewardState.not) {
                    stateB = 1;
                }
                if (stateA == stateB) {
                    return 0;
                }
                return stateA > stateB ? -1 : 1;
            }));
            this._list.datas = this._showIds;
        }

        protected addListeners(): void {
            super.addListeners();
            this.getVipBtn.on(Event.CLICK, this, this.getVipHandler);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_ONLINE_REWARD_REPLY, this, this.updateList);
            GlobalData.dispatcher.on(CommonEventType.AWARD_REPLY, this, this.awardReply);

            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_MONTH_CARD_INFO, this, this.showUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            // th
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.getVipBtn.off(Event.CLICK, this, this.getVipHandler);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_ONLINE_REWARD_REPLY, this, this.updateList);
            GlobalData.dispatcher.off(CommonEventType.AWARD_REPLY, this, this.awardReply);
        }

        private getVipHandler() {
            WindowManager.instance.open(WindowEnum.MONTH_CARD_PANEL);
        }

        private updateHtml() {
            if (MonthCardModel.instance.flag === 1) {
                // this.htmlText.innerHTML = this._htmlTxt1;
                this.getVipBtn.visible = false;
            } else {
                // this.htmlText.innerHTML = this._htmlTxt;
                this.getVipBtn.visible = true;
            }
        }

        public awardReply(): void {
            let result = OnlineGiftModel.instance.AwardReply;
            if (result != 0) {
                modules.common.CommonUtil.noticeError(result);
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateHtml();
            Channel.instance.publish(UserFeatureOpcode.GetOnlineReward, null);
            this.updateList();
            this.showUI();
        }
        public showUI() {
            //战力护符 自尊  招财猫
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            // if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
            //     this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
            //     this.tipsText.text = `战力成长慢`;
            //     this.tipsImg.pos(76, 1044);
            // }
            // else 
            if (MonthCardModel.instance.flag == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_04.png`;
                // this.tipsText.text = `在线奖励翻倍？`;
                // this.tipsImg.pos(85, 1058);
            }
            // else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
            //     this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
            //     this.tipsText.text = `代币券不够花？`;
            //     this.tipsImg.pos(99, 1040);
            // }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_04.png`;
                // this.tipsText.text = `在线奖励翻倍？`;
                // this.tipsImg.pos(85, 1058);
            }
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

        }

    }
}