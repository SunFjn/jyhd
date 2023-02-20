//每日累充
namespace modules.limit {
    import LimitDayCumulateReward = Protocols.LimitDayCumulateReward;
    import LimitDayCumulateRewardFields = Protocols.LimitDayCumulateRewardFields;

    import GetLimitXunBaoDayCumulatePayInfoReplyFields = Protocols.GetLimitXunBaoDayCumulatePayInfoReplyFields;
    import GetLimitXunBaoDayCumulatePayInfoReply = Protocols.GetLimitXunBaoDayCumulatePayInfoReply;
    export class LimitDayCumulateModel {
        private static _instance: LimitDayCumulateModel;
        public static get instance(): LimitDayCumulateModel {
            return this._instance = this._instance || new LimitDayCumulateModel();
        }
        //累充豪礼活动倒计时
        private _activityTime: number[];
        //充值金额
        private _totalMoney: number[];
 
        /*开启状态(0未开启 1开启)*/
        private _giveState: number;

        private _rewarTab: Array<Table<LimitDayCumulateReward>>;

        //开服第几天
        private _serverDay: number[];

        constructor() {
            this._activityTime = new Array<number>();
            this._totalMoney = new Array<number>();
            this._serverDay = new Array<number>();
            this._rewarTab = new Array();

            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._activityTime[LimitBigType.fish] = 0;
            this._totalMoney[LimitBigType.fish] = -1;
            this._serverDay[LimitBigType.fish] = 1;
            this._rewarTab[LimitBigType.fish] = {}
            // 地鼠
            this._activityTime[LimitBigType.dishu] = 0;
            this._totalMoney[LimitBigType.dishu] = -1;
            this._serverDay[LimitBigType.dishu] = 1;
            this._rewarTab[LimitBigType.dishu] = {}
            // 新春
            this._activityTime[LimitBigType.year] = 0;
            this._totalMoney[LimitBigType.year] = -1;
            this._serverDay[LimitBigType.year] = 1;
            this._rewarTab[LimitBigType.year] = {}

        }

        public updateInfo(tuple: GetLimitXunBaoDayCumulatePayInfoReply) {

            let bigType: number = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.bigType];
            this._activityTime[bigType] = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.endTime]
            this._totalMoney[bigType] = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.totalMoney];
            this._serverDay[bigType] = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.useDay]||1;
            let rewarList = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.rewardList];
            let isState: boolean = false;
            let p_rp = false;
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarTab[bigType][rewarList[i][LimitDayCumulateRewardFields.id]] = rewarList[i];
                if (rewarList[i][LimitDayCumulateRewardFields.state] === 1) {
                    p_rp = true;
                    isState = true;
                }
            }
            switch (bigType) {
                case LimitBigType.fish: redPoint.RedPointCtrl.instance.setRPProperty("fishDayCumulateRP", p_rp)
                    break;

                case LimitBigType.dishu: redPoint.RedPointCtrl.instance.setRPProperty("dishuDayCumulateRP", p_rp)
                    break;

                case LimitBigType.year: redPoint.RedPointCtrl.instance.setRPProperty("YearDayCumulateRP", p_rp)
                    break;

            }

            this._activityTime[bigType] = tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.endTime];
            GlobalData.dispatcher.event(CommonEventType.LIMIT_DAY_CUMULATE_UPDATE);
        }

        public get giveState(): number {
            return this._giveState;
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

        public rewarTable(bigType: number): Table<LimitDayCumulateReward> {
            return this._rewarTab[bigType];
        }

        public getRewardById(bigType: number, id: int): LimitDayCumulateReward {
            return this._rewarTab[bigType] ? this._rewarTab[bigType][id] : null
        }
    }
}