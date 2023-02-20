///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.weekYuanbao {
    import WeekYuanbaoViewUI = ui.WeekYuanbaoUI;
    import Event = laya.events.Event;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomClip = modules.common.CustomClip;
    import GetWeekYuanbaoCardInfoReplyFields = Protocols.GetWeekYuanbaoCardInfoReplyFields;
    import GetWeekYuanbaoCardInfoReply = Protocols.GetWeekYuanbaoCardInfoReply;
    import GetWeekYuanbaoCardRewardReply = Protocols.GetWeekYuanbaoCardRewardReply;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class WeekYuanbaoPanel extends WeekYuanbaoViewUI {

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
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.on(CommonEventType.UPDATE_WEEK_YUANBAO_CARD_INFO, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyClickHandler);
            this.instructionsBtn.off(Event.CLICK, this, this.showInstructions);
            this.receiveBtn.off(Event.CLICK, this, this.getTheReward);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.off(CommonEventType.UPDATE_WEEK_YUANBAO_CARD_INFO, this, this.update);
        }

        protected onOpened() {
            super.onOpened();
            this._btnClip.play();
            this.update();
        }

        private getTheReward() {
            WeekYuanbaoCtrl.instance.getWeekYuanbaoCardReward();// 接受返回参数后自动调用update
        }

        private showInstructions() {
            CommonUtil.alertHelp(20067);
        }

        private buyClickHandler(): void {
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(161);// 1
            PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            this.update();
        }

        private update(): void {
            let info: GetWeekYuanbaoCardInfoReply = WeekYuanbaoModel.instance.WeekCardInfoReply;
            let isGotReward: GetWeekYuanbaoCardRewardReply = WeekYuanbaoModel.instance.WeekCardRewardReply;
            // console.log('updateyuanbao', info, isGotReward);

            if (!info) return;

            if (info[GetWeekYuanbaoCardInfoReplyFields.flag] === 0) {     // 0未开启 1开启

                let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(161);
                this.buyBtn.label = `${cfg[rechargeFields.price]}元抢购`;
                this.buyBtn.visible = this._btnClip.visible = true;
                this.isBuy.visible = false;
                this.receiveBtn.visible = false;
                this.redPoint.visible = false;
            } else {
                this.receiveBtn.visible = true;
                this.redPoint.visible = true;

                let restday = new Date(info[GetWeekYuanbaoCardInfoReplyFields.endTm]).getTime();
                let nowday = GlobalData.serverTime;
                
                let tipsDay = BlendCfg.instance.getCfgById(74002)[blendFields.intParam][0];// 24小时内状态变为按钮出现‘续费’
                let leftDay = Math.floor((restday - nowday) / 86400000);// 获取当前天数差
                if (leftDay >= tipsDay) { // info[GetWeekYuanbaoCardInfoReplyFields.isRenew] == 0
                    // this.tipTxt.innerHTML = `剩余<span style="color:#168A17">${leftDay}天</span>`;
                    this.adTxt.text = `剩余${leftDay}天`;
                    this.buyBtn.visible = this._btnClip.visible = false;
                    this.isBuy.visible = true;

                } else {
                    // this.tipTxt.innerHTML = `剩余<span style="color:#FF3E3E">${leftDay}天</span>, <span style="color:#FF3E3E">(周卡即将到期)</span>`
                    this.adTxt.text = `剩余${leftDay}天, 周卡即将到期`;
                    this.buyBtn.visible = this._btnClip.visible = true;
                    this.isBuy.visible = false;
                    this.buyBtn.label = "续费";
                }

                // 返回的是否领取奖励若是不为0则领取失败
                if (info[GetWeekYuanbaoCardInfoReplyFields.isDayAward] == 2) {
                    this.receiveBtn.disabled = true;
                    this.redPoint.visible = false;
                } else {
                    this.receiveBtn.disabled = false;
                    this.redPoint.visible = true;
                }
            }
        }
    }
}