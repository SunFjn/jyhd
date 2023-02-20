//每日累充
namespace modules.limit {
    import daySinglePayReward = Protocols.daySinglePayReward;
    import daySinglePayRewardFields = Protocols.daySinglePayRewardFields;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;

    import GetLimitXunBaoDaySinglePayInfoReplyFields = Protocols.GetLimitXunBaoDaySinglePayInfoReplyFields;
    import GetLimitXunBaoDaySinglePayInfoReply = Protocols.GetLimitXunBaoDaySinglePayInfoReply;
    export class LimitDaySingleModel {
        private static _instance: LimitDaySingleModel;
        public static get instance(): LimitDaySingleModel {
            return this._instance = this._instance || new LimitDaySingleModel();
        }
        //累充豪礼活动倒计时
        private _activityTime: number[];
        //充值金额
        private _totalMoney: number[];

        private _rewarTab: Array<Table<daySinglePayReward>>;

        //开服第几天
        private _serverDay: number[];

        constructor() {
            this._activityTime = new Array<number>();
            this._serverDay = new Array<number>();
            this._rewarTab = new Array();

            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._activityTime[LimitBigType.fish] = 0;
            this._serverDay[LimitBigType.fish] = 1;
            this._rewarTab[LimitBigType.fish] = {}
            // 地鼠
            this._activityTime[LimitBigType.dishu] = 0;
            this._serverDay[LimitBigType.dishu] = 1;
            this._rewarTab[LimitBigType.dishu] = {}
            // 地鼠
            this._activityTime[LimitBigType.year] = 0;
            this._serverDay[LimitBigType.year] = 1;
            this._rewarTab[LimitBigType.year] = {}

        }

        public updateInfo(tuple: GetLimitXunBaoDaySinglePayInfoReply) {

            // console.log("每日单笔返回数据", tuple)
            let bigType: number = tuple[GetLimitXunBaoDaySinglePayInfoReplyFields.bigType];
            this._activityTime[bigType] = tuple[GetLimitXunBaoDaySinglePayInfoReplyFields.endTime]
            this._serverDay[bigType] = tuple[GetLimitXunBaoDaySinglePayInfoReplyFields.useDay] || 1;
            let rewarList = tuple[GetLimitXunBaoDaySinglePayInfoReplyFields.rewardList];
            let p_rp = false;
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarTab[bigType][rewarList[i][CumulatepayRewardFields.id]] = rewarList[i];

                if (rewarList[i][daySinglePayRewardFields.restCount] > 0) {
                    p_rp = true;
                }
            }
            switch (bigType) {
                case LimitBigType.fish: redPoint.RedPointCtrl.instance.setRPProperty("fishDaySingleRP", p_rp)
                    break;
                case LimitBigType.dishu: redPoint.RedPointCtrl.instance.setRPProperty("dishuDaySingleRP", p_rp)
                    break;
                case LimitBigType.year: redPoint.RedPointCtrl.instance.setRPProperty("YearDaySingleRP", p_rp)
                    break;

            }

            this._activityTime[bigType] = tuple[GetLimitXunBaoDaySinglePayInfoReplyFields.endTime];
            GlobalData.dispatcher.event(CommonEventType.LIMIT_DAY_SINGLE_UPDATE);
        }

        public totalMoney(bigType: number): number {
            return this._totalMoney[bigType];
        }

        public activityTime(bigType: number): number {
            return this._activityTime[bigType];
        }
        public serverDay(bigType: number): number {
            return this._serverDay[bigType];
        }

        public rewarTable(bigType: number,): Table<daySinglePayReward> {
            return this._rewarTab[bigType];
        }

        public getRewardById(bigType: number, id: number): daySinglePayReward {
            return this._rewarTab[bigType] ? this._rewarTab[bigType][id] : null
        }
    }
}