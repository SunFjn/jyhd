//累充豪礼
namespace modules.cumulate_pay {
    import UpdateCumulatepayInfoFields = Protocols.UpdateCumulatepayInfoFields;
    import UpdateCumulatepayInfo = Protocols.UpdateCumulatepayInfo;
    import CumulatepayReward = Protocols.CumulatepayReward;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;

    export class CumulatePayModel {
        private static _instance: CumulatePayModel;
        public static get instance(): CumulatePayModel {
            return this._instance = this._instance || new CumulatePayModel();
        }

        /*开启状态(0未开启 1开启)*/
        private _giveState: number;
        //累充豪礼充值金额
        private _totalMoney: number;
        //累充豪礼奖励列表
        private _rewarList: Table<CumulatepayReward>;
        //累充豪礼活动倒计时
        private _activityTime: number;

        constructor() {
            this._giveState = -1;
            this._totalMoney = -1;
            this._rewarList = {};
        }

        public updateInfo(tuple: UpdateCumulatepayInfo) {
            this._giveState = tuple[UpdateCumulatepayInfoFields.state];
            this._totalMoney = tuple[UpdateCumulatepayInfoFields.totalMoney];
            let rewarList = tuple[UpdateCumulatepayInfoFields.rewardList];
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarList[rewarList[i][CumulatepayRewardFields.id]] = rewarList[i];
            }
            this._activityTime = tuple[UpdateCumulatepayInfoFields.endTime];
            GlobalData.dispatcher.event(CommonEventType.CUMULATE_PAY_UPDATE);
            this.cumulatePayPRState();
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        public get rewarList(): Table<CumulatepayReward> {
            return this._rewarList;
        }

        public get activityTime(): number {
            return this._activityTime;
        }

        public cumulatePayPRState(): void {
            let isState: boolean = false;
            for (let key in this._rewarList) {
                if (this._rewarList[key][CumulatepayRewardFields.state] === 1) {
                    // console.log('vtz:this._rewarList',this._rewarList[key]);
                    isState = true;
                }
            }
            RedPointCtrl.instance.setRPProperty("cumulateRP", isState);
        }
    }
}