namespace modules.everyday_firstpay {
    import DaypayReward = Protocols.DaypayReward;
    import UpdateDaypayInfo = Protocols.UpdateDaypayInfo;
    import UpdateDaypayInfoFields = Protocols.UpdateDaypayInfoFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GetLimitXunBaoDayCumulatePayInfoReplyFields = Protocols.GetLimitXunBaoDayCumulatePayInfoReplyFields;
    import GetLimitXunBaoDayCumulatePayInfoReply = Protocols.GetLimitXunBaoDayCumulatePayInfoReply;
    import LimitDayCumulateRewardFields = Protocols.LimitDayCumulateRewardFields;
    import LimitDayCumulateReward = Protocols.LimitDayCumulateReward;
    import limitCumulateRewardFields = Protocols.limit_CumulateRewardFields;
    import limit_day_cumulateFields = Configuration.limit_day_cumulateFields;
    import CumulatepayReward = Protocols.CumulatepayReward;
    import limit_day_cumulate = Configuration.limit_day_cumulate;


    export class EverydayFirstPayModel {
        private static _instance: EverydayFirstPayModel;
        public static get instance(): EverydayFirstPayModel {
            return this._instance = this._instance || new EverydayFirstPayModel();
        }

        // /*首充通道开启状态(0未开启 1预备 2开启)*/
        // private _giveState: number;
        // //配置ID
        // private _id: number;
        // //充值金额
        // private _totalMoney: number;
        // //奖励列表
        // private _rewarList: Array<DaypayReward>;
        //充值金额
        private _totalMoney: number;

        /*开启状态(0未开启 1开启)*/
        private _giveState: number;

        private _rewarTab: Array<Table<LimitDayCumulateReward>>;

        //开服第几天

        private artState: boolean;
        private iconIsShow: boolean;
        //充值按钮的状态（0不可领取 1可领取 2是已领取）
        private _rewardState: Array<number>;

        private _awardList: Array<limit_day_cumulate>;
        constructor() {
        }

        public updateInfo(tuple: GetLimitXunBaoDayCumulatePayInfoReply) {
            console.log("tuple为空则return", tuple);
            if (!tuple) return;
            let serverDay = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.useDay];
            let rewardList = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.rewardList];
            let p_rp = false;

            let arrE = modules.limit.LimitDayCumulateCfg.instance.getCfgsByServerDay(LimitBigType.evedayPay, serverDay)
            // awardList
            this._awardList = arrE.filter((ele) => ele[limit_day_cumulateFields.id] === rewardList[btnType.arbitrariness][limitCumulateRewardFields.id] || ele[limit_day_cumulateFields.id] === rewardList[btnType.fixed][limitCumulateRewardFields.id]);

            // rewardState
            this._rewardState = new Array<number>;
            this._rewardState.push(rewardList[0][limitCumulateRewardFields.state]);
            this._rewardState.push(rewardList[1][limitCumulateRewardFields.state]);

            this.checkRP(p_rp);
            GlobalData.dispatcher.event(CommonEventType.EVERYDAY_FIRSTPAY_UPDATE);
        }

        /*返回当前的奖励挡位*/
        public get awardList(): Array<limit_day_cumulate> {
            return this._awardList;
        }

        /*充值按钮的状态（0不可领取 1可领取 2是已领取）*/
        public get rewardState(): Array<number> {
            return this._rewardState;
        }

        /*充值按钮的状态如果都领取则按钮消失*/
        public get iconShowState() {
            if (!this._rewardState) return false;
            this.iconIsShow = this._rewardState[btnType.arbitrariness] == 2 && this._rewardState[btnType.fixed] == 2;
            return this.iconIsShow;
        }


        public checkRP(isState: boolean) {
            RedPointCtrl.instance.setRPProperty("everydayFirstPayRP", isState);
        }
    }
}
