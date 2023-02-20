//每日累充
namespace modules.cumulate2_pay {
    import CumulatepayReward = Protocols.CumulatepayReward;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;
    import UpdateCumulatepay2InfoFields = Protocols.UpdateCumulatepay2InfoFields;
    import UpdateCumulatepay2Info = Protocols.UpdateCumulatepay2Info;

    export class CumulatePay2Model {
        private static _instance: CumulatePay2Model;
        public static get instance(): CumulatePay2Model {
            return this._instance = this._instance || new CumulatePay2Model();
        }

        /*开启状态(0未开启 1开启)*/
        private _giveState: number;
        //累充豪礼充值金额
        private _totalMoney: number;
        //累充豪礼奖励列表
        private _rewarTab: Array<CumulatepayReward>;
        //累充豪礼活动倒计时
        private _activityTime: number;
        //开服第几天
        private _serverDay: number;

        constructor() {
            this._giveState = -1;
            this._totalMoney = -1;
            this._rewarTab = new Array<CumulatepayReward>();
        }

        public updateInfo(tuple: UpdateCumulatepay2Info) {

            // console.log("每日累充返回数据",tuple)
            this._giveState = tuple[UpdateCumulatepay2InfoFields.state];
            this._totalMoney = tuple[UpdateCumulatepay2InfoFields.totalMoney];
            let rewarList = tuple[UpdateCumulatepay2InfoFields.rewardList];
            this._rewarTab = new Array<CumulatepayReward>();
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarTab[rewarList[i][CumulatepayRewardFields.id]] = rewarList[i];
            }
            this._activityTime = tuple[UpdateCumulatepay2InfoFields.restTm] + GlobalData.serverTime;
            this._serverDay = tuple[UpdateCumulatepay2InfoFields.serverDay];
            this.cumulatePayPRState();
            GlobalData.dispatcher.event(CommonEventType.CUMULATE_PAY2_UPDATE);
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        public get rewarList(): Array<CumulatepayReward> {
            return this._rewarTab;
        }

        public get activityTime(): number {
            return this._activityTime;
        }

        public get serverDay(): number {
            return this._serverDay;
        }

        public cumulatePayPRState(): void {
            let isState: boolean = false;
            for (let key in this._rewarTab) {
                if (this._rewarTab[key][CumulatepayRewardFields.state] === 1) {
                    isState = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("cumulate2RP", isState);
        }
    }
}