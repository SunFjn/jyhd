//累充豪礼
namespace modules.limit {
    import CumulatepayReward = Protocols.CumulatepayReward;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;
    import GetLimitXunBaoCumulatePayInfoReply = Protocols.GetLimitXunBaoCumulatePayInfoReply;
    import GetLimitXunBaoCumulatePayInfoReplyFields = Protocols.GetLimitXunBaoCumulatePayInfoReplyFields;

    export class LimitCumulateModel {
        private static _instance: LimitCumulateModel;
        public static get instance(): LimitCumulateModel {
            return this._instance = this._instance || new LimitCumulateModel();
        }
        //充值金额
        private _totalMoney: number[];
        private _rewarTab: Array<Table<CumulatepayReward>>;
        //开服第几天
        private _serverDay: number;
        //累充豪礼活动倒计时
        private _activityTime: number[];


        constructor() {
            this._activityTime = new Array<number>();
            this._totalMoney = new Array<number>();
            this._rewarTab = new Array();

            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._activityTime[LimitBigType.fish] = 0;
            this._totalMoney[LimitBigType.fish] = -1;
            this._rewarTab[LimitBigType.fish] = {}
            // 地鼠
            this._activityTime[LimitBigType.dishu] = 0;
            this._totalMoney[LimitBigType.dishu] = -1;
            this._rewarTab[LimitBigType.dishu] = {}
            // 新年
            this._activityTime[LimitBigType.year] = 0;
            this._totalMoney[LimitBigType.year] = -1;
            this._rewarTab[LimitBigType.year] = {}

        }

        public updateInfo(tuple: GetLimitXunBaoCumulatePayInfoReply) {
            let bigType: number = tuple[GetLimitXunBaoCumulatePayInfoReplyFields.bigType];

            this._totalMoney[bigType] = tuple[GetLimitXunBaoCumulatePayInfoReplyFields.totalMoney];
            this._activityTime[bigType] = tuple[GetLimitXunBaoCumulatePayInfoReplyFields.endTime]

            let rewarList = tuple[GetLimitXunBaoCumulatePayInfoReplyFields.rewardList];
            let p_rp = false;
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarTab[bigType][rewarList[i][CumulatepayRewardFields.id]] = rewarList[i];
                if (rewarList[i][CumulatepayRewardFields.state] === 1) {
                    p_rp = true;
                }
            }
            switch (bigType) {
                case LimitBigType.dishu: redPoint.RedPointCtrl.instance.setRPProperty("dishuCumulateRP", p_rp)
                    break;
                case LimitBigType.fish: redPoint.RedPointCtrl.instance.setRPProperty("fishCumulateRP", p_rp)
                    break;
                case LimitBigType.year: redPoint.RedPointCtrl.instance.setRPProperty("YearCumulateRP", p_rp)
                    break;

            }

            this._activityTime[bigType] = tuple[GetLimitXunBaoCumulatePayInfoReplyFields.endTime];
            GlobalData.dispatcher.event(CommonEventType.LIMIT_CUMULATE_UPDATE);

        }

        public totalMoney(bigType: number): number {
            return this._totalMoney[bigType];
        }

        public activityTime(bigType: number): number {
            return this._activityTime[bigType];
        }
        public get serverDay(): number {
            return this._serverDay;
        }

        public rewarTable(bigType: number): Table<CumulatepayReward> {
            return this._rewarTab[bigType];
        }

        // 根据档位获取奖励
        public getRewardById(bigType: number, id: int): CumulatepayReward {
            return this._rewarTab[bigType] ? this._rewarTab[bigType][id] : null;
        }
    }
}