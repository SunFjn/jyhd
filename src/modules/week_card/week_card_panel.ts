///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.weekCard {
    import WeekCardViewUI = ui.WeekCardViewUI;
    import Event = laya.events.Event;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomClip = modules.common.CustomClip;
    import GetWeekFuliCardInfoReplyFields = Protocols.GetWeekFuliCardInfoReplyFields;
    import GetWeekFuliCardInfoReply = Protocols.GetWeekFuliCardInfoReply;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import WeekFuliCardPrivilege1Fields = Protocols.WeekFuliCardPrivilege1Fields;

    export class WeekCardPanel extends WeekCardViewUI {

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
            this.centerX = 0;
            this.centerY = 0;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.buyBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -16);
            this._btnClip.scale(0.98, 1);
        }

        protected addListeners(): void {
            super.addListeners();
            this.buyBtn.on(Event.CLICK, this, this.buyClickHandler);
            this.instructionsBtn.on(Event.CLICK, this, this.showInstructions);
            this.receiveBtn.on(Event.CLICK, this, this.getTheReward);
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_FULI_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_FULI_CARD_REWARD_REPLY, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyClickHandler);
            this.instructionsBtn.off(Event.CLICK, this, this.showInstructions);
            this.receiveBtn.off(Event.CLICK, this, this.getTheReward);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_FULI_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_FULI_CARD_REWARD_REPLY, this, this.update);
        }

        protected onOpened() {
            super.onOpened();
            this._btnClip.play();
            this.update();
        }

        private getTheReward() {
            // let isGotReward: GetWeekFuliCardInfoReply = WeekCardModel.instance.WeekCardInfoReply;

            // if (isGotReward[GetWeekFuliCardInfoReplyFields.privilege1][WeekFuliCardPrivilege1Fields.state] == 1) {
            //     this.receiveBtn.disabled = true;
            // } else {
            //     this.receiveBtn.disabled = false;
            // }
            WeekCardCtrl.instance.getWeekCardReward();
        }

        private showInstructions() {
            CommonUtil.alertHelp(20066);
        }

        private buyClickHandler(): void {
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(160);// 1
            PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            this.update();
        }

        private update(): void {
            let info: GetWeekFuliCardInfoReply = WeekCardModel.instance.WeekCardInfoReply;
            if (!info) return;
            let purchasedInfo = info[GetWeekFuliCardInfoReplyFields.privilege1];


            if (info[GetWeekFuliCardInfoReplyFields.flag] === 0) {     // 0未开启 1开启
                let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(160);
                this.buyBtn.label = `${cfg[rechargeFields.price]}元抢购`;
                this.buyBtn.visible = this._btnClip.visible = true;
                this.isBuy.visible = false;

                this.levelClip.value = '0';
                this.ratioTxt.text = '0';
                this.progressbar.width = 0;
                this.lb_canReceive.text = '0';
                this.lb_received.text = '0/300';
                this.lb_nextCount.text = '+0';
                this.receiveBtn.disabled = true;
                this.redPoint.visible = false;
            } else {
                this.levelClip.value = info[GetWeekFuliCardInfoReplyFields.level].toString();
                                
                if (info[GetWeekFuliCardInfoReplyFields.isMax] == 0) {
                    this.progressbar.width = (info[GetWeekFuliCardInfoReplyFields.exp] * 500) / (info[GetWeekFuliCardInfoReplyFields.nextExp]);
                    if (this.progressbar.width >= 500) {
                        this.progressbar.width = 500;
                    }
                    this.ratioTxt.text = `${info[GetWeekFuliCardInfoReplyFields.exp]}` + '/' + `${info[GetWeekFuliCardInfoReplyFields.nextExp]}`;
                } else {
                    this.progressbar.width = 500;
                    this.ratioTxt.text = `${info[GetWeekFuliCardInfoReplyFields.exp]}`;
                }
                this.lb_canReceive.text = purchasedInfo[WeekFuliCardPrivilege1Fields.restCount].toString();
                this.lb_received.text = `${purchasedInfo[WeekFuliCardPrivilege1Fields.useCount]}` + '/' + `${purchasedInfo[WeekFuliCardPrivilege1Fields.totalNum]}`;
                this.lb_nextCount.text = '+' + `${purchasedInfo[WeekFuliCardPrivilege1Fields.nextCount]}`;
                this.receiveBtn.disabled = false;
                this.redPoint.visible = true;
                let restday = new Date(info[GetWeekFuliCardInfoReplyFields.endTm]).getTime();
                let nowday = GlobalData.serverTime;
                let tipsDay = BlendCfg.instance.getCfgById(74201)[blendFields.intParam][0];// 24小时内状态变为按钮出现‘续费’
                let leftTime = Math.floor((restday - nowday) / 86400000);// 获取当前天数差
                
                if (leftTime >= tipsDay) { // info[GetWeekFuliCardInfoReplyFields.isRenew] == 0
                    // this.tipTxt.innerHTML = `剩余<span style="color:#168A17">${leftTime}天</span>`;
                    this.adTxt.text = `剩余${leftTime}天`;
                    this.buyBtn.visible = this._btnClip.visible = false;
                    this.isBuy.visible = true;

                } else {
                    // this.tipTxt.innerHTML = `剩余<span style="color:#FF3E3E">${leftDay}天</span>, <span style="color:#FF3E3E">(周卡即将到期)</span>`
                    this.adTxt.text = `剩余${leftTime}天, 周卡即将到期`;
                    this.buyBtn.visible = this._btnClip.visible = true;
                    this.isBuy.visible = false;
                    this.buyBtn.label = "续费";
                }

                // 返回的是否领取奖励若是不为0则领取失败
                if (purchasedInfo[WeekFuliCardPrivilege1Fields.state] == 1) {
                    this.receiveBtn.disabled = false;
                    this.redPoint.visible = true;
                } else {
                    this.receiveBtn.disabled = true;
                    this.redPoint.visible = false;
                }

            }

        }
    }
}