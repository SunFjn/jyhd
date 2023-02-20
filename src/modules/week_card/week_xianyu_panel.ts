///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.weekXianyu {
    import WeekXianyuViewUI = ui.WeekXianyuUI;
    import Event = laya.events.Event;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import CustomClip = modules.common.CustomClip;
    import GetWeekXianyuCardInfoReplyFields = Protocols.GetWeekXianyuCardInfoReplyFields;
    import GetWeekXianyuCardInfoReply = Protocols.GetWeekXianyuCardInfoReply;
    import GetWeekXianyuCardRewardReplyFields = Protocols.GetWeekXianyuCardRewardReplyFields;
    import GetWeekXianyuCardRewardReply = Protocols.GetWeekXianyuCardRewardReply;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class WeekXianyuPanel extends WeekXianyuViewUI {

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
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_XIANYU_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_XIANYU_CARD_REWARD_REPLY, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyClickHandler);
            this.instructionsBtn.off(Event.CLICK, this, this.showInstructions);
            this.receiveBtn.off(Event.CLICK, this, this.getTheReward);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_XIANYU_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_XIANYU_CARD_REWARD_REPLY, this, this.update);
        }

        protected onOpened() {
            super.onOpened();
            this._btnClip.play();
            this.update();
        }

        private getTheReward() {
            // let isGotReward: GetWeekXianyuCardInfoReply = WeekXianyuModel.instance.WeekCardInfoReply;
            // if (isGotReward[GetWeekXianyuCardInfoReplyFields.isDayAward] == 2) {
            //     this.receiveBtn.disabled = false;
            // } else {
            //     this.receiveBtn.disabled = true;
            // }
            WeekXianyuCtrl.instance.getWeekXianyuCardReward();
        }

        private showInstructions() {
            CommonUtil.alertHelp(20068);
        }

        private buyClickHandler(): void {
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(162);// 1
            PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            this.update();
        }

        private update(): void {
            let info: GetWeekXianyuCardInfoReply = WeekXianyuModel.instance.WeekCardInfoReply;

            if (!info) return;
            // let tCfg: privilege = PrivilegeCfg.instance.getCfgByType(101);
            // let nodes: Array<PrivilegeNode> = tCfg[privilegeFields.nodes];


            if (info[GetWeekXianyuCardInfoReplyFields.flag] === 0) {     // 0未开启 1开启

                let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(162);
                this.buyBtn.label = `${cfg[rechargeFields.price]}元抢购`;
                this.buyBtn.visible = this._btnClip.visible = true;
                this.isBuy.visible = false;
                this.receiveBtn.visible = false;
                this.redPoint.visible = false;
            } else {
                // 虽然在txt上不需要用的goldPerDay，但之后加入的领取金额中会用上，故不删除
                // let goldPerDay: number = 0;
                // for (let i: int = 0, len: int = nodes.length; i < len; i++) {
                //     if (nodes[i][PrivilegeNodeFields.type] === Privilege.goldPerDay) {
                //         goldPerDay = nodes[i][PrivilegeNodeFields.param2];
                //         break;
                //     }
                // }
                // this.buyBtn.visible = this._btnClip.visible =  false;

                this.receiveBtn.visible = true;
                this.redPoint.visible = true;

                let restday = new Date(info[GetWeekXianyuCardInfoReplyFields.endTm]).getTime();
                let nowday = GlobalData.serverTime;

                let tipsDay = BlendCfg.instance.getCfgById(74102)[blendFields.intParam][0];// 24小时内状态变为按钮出现‘续费’
                let leftTime = Math.floor((restday - nowday) / 86400000);// 获取当前天数差
                if (leftTime >= tipsDay) {
                    // this.tipTxt.innerHTML = `剩余<span style="color:#168A17">${leftDay}天</span>`;
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
                if (info[GetWeekXianyuCardInfoReplyFields.isDayAward] == 2) {
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