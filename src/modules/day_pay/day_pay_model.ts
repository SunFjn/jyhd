///<reference path="../config/day_pay_cfg.ts"/>
namespace modules.day_pay {
    import DaypayReward = Protocols.DaypayReward;
    import UpdateDaypayInfo = Protocols.UpdateDaypayInfo;
    import UpdateDaypayInfoFields = Protocols.UpdateDaypayInfoFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import DaypayRewardFields = Protocols.DaypayRewardFields;
    import DayPayCfg = modules.config.DayPayCfg;
    import day_payFields = Configuration.day_payFields;

    export class DayPayModel {
        private static _instance: DayPayModel;
        public static get instance(): DayPayModel {
            return this._instance = this._instance || new DayPayModel();
        }

        /*首充通道开启状态(0未开启 1预备 2开启)*/
        private _giveState: number;
        //配置ID
        private _id: number;
        //充值金额
        private _totalMoney: number;
        //奖励列表
        private _rewarList: Array<DaypayReward>;

        //充值按钮的状态（0不可领取 1可领取 2是已领取）

        constructor() {
            this._giveState = -1;
            this._id = 0;
            this._totalMoney = -1;
            this._rewarList = [];
        }

        public updateInfo(tuple: UpdateDaypayInfo): void {
            this._giveState = tuple[UpdateDaypayInfoFields.state];
            this._id = tuple[UpdateDaypayInfoFields.id];
            this._totalMoney = tuple[UpdateDaypayInfoFields.totalMoney];
            this._rewarList = tuple[UpdateDaypayInfoFields.rewardList];
            GlobalData.dispatcher.event(CommonEventType.DAY_PAY_UPDATE);
            this.daypayPRState();
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get id(): number {
            return this._id;
        }

        public get getMoney(): number {
            return this._totalMoney;
        }

        public get rewarList(): Array<DaypayReward> {
            return this._rewarList;
        }



        public getStateBydangCi(dangCi: number): boolean {
            var element: DaypayReward = this._rewarList[dangCi];
            if (element) {
                if (element[DaypayRewardFields.state] == 0) {
                    return true;
                } else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        /**
         * 是否所有奖励都已 领取完毕  领取完毕隐藏入口
         */
        public ISover(): boolean {
            let BOll = false;
            if (this._rewarList) {
                if (this._rewarList.length == 3) {
                    for (var index = 0; index < this._rewarList.length; index++) {
                        var element: DaypayReward = this._rewarList[index];
                        if (element[DaypayRewardFields.state] == 2) {
                            BOll = false;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            }
            return BOll;
        }

        /**
         * getEnterTips
         */
        public getEnterTips(): Array<string> {
            let shuju = DayPayCfg.instance.getCfgById(DayPayModel.instance.id);
            if (shuju && shuju.length > 0) {
                return shuju[day_payFields.enterTips];
            }
            return ["大量材料", "ffea9f"];
        }

        public daypayPRState(): void {
            let isState: boolean = false;
            for (let i: int = 0; i < this._rewarList.length; i++) {
                if (this._rewarList[i][DaypayRewardFields.state] === 1) {
                    isState = true;
                }
            }
            RedPointCtrl.instance.setRPProperty("daypayRP", isState);
        }
    }
}
