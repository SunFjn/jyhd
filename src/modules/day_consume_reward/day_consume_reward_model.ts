/////<reference path="../$.ts"/>
/** 消费赠礼  每日*/
namespace modules.day_consume_reward {
    import ConsumerewardReward = Protocols.ConsumerewardReward;

    import GetConsumeReward2InfoReplyFields = Protocols.GetConsumeReward2InfoReplyFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ConsumerewardRewardFields = Protocols.ConsumerewardRewardFields;

    export class DayConsumeRewardModel {
        private static _instance: DayConsumeRewardModel;
        public static get instance(): DayConsumeRewardModel {
            return this._instance = this._instance || new DayConsumeRewardModel();
        }

        private _giveState: number;
        //消费代币券数
        private _totalGold: number;
        //奖励列表
        private _rewarTable: Array<ConsumerewardReward>;
        //活动倒计时
        private _activityTime: number;
        //开服第几天
        private _serverDay: number;

        private constructor() {
            this._giveState = 0;
            this._totalGold = 0;
            this._rewarTable = new Array<ConsumerewardReward>();
            this._activityTime = 0;
            this._serverDay = 0;
        }

        //更新
        public updateInfo(tuple: Protocols.UpdateConsumeReward2Info) {
            // console.log("消费赠礼2 数据：     ", tuple);
            if (tuple) {
                this._giveState = tuple[GetConsumeReward2InfoReplyFields.state];
                this._totalGold = tuple[GetConsumeReward2InfoReplyFields.totalGold];
                this._serverDay = tuple[GetConsumeReward2InfoReplyFields.serverDay];
                this._activityTime = tuple[GetConsumeReward2InfoReplyFields.restTm] + GlobalData.serverTime;
                let rewarList = tuple[GetConsumeReward2InfoReplyFields.rewardList];
                let isState: boolean = false;
                for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                    this._rewarTable[rewarList[i][ConsumerewardRewardFields.id]] = rewarList[i];
                    if (rewarList[i][ConsumerewardRewardFields.state] === 1) {
                        isState = true;
                    }
                }
                RedPointCtrl.instance.setRPProperty("dayconsumeRP", isState);
                GlobalData.dispatcher.event(CommonEventType.DAY_CONSUME_REWARD_UPDATE);
            }
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get totalGold(): number {
            return this._totalGold;
        }

        public get serverDay(): number {
            return this._serverDay;
        }

        public get rewarTable(): Array<ConsumerewardReward> {
            return this._rewarTable;
        }

        public get activityTime(): number {
            return this._activityTime;
        }
    }
}