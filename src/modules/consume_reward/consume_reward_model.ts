/////<reference path="../$.ts"/>
/** 消费赠礼 */
namespace modules.cousume_reward {
    import ConsumerewardReward = Protocols.ConsumerewardReward;
    import GetConsumeRewardInfoReplyFields = Protocols.GetConsumeRewardInfoReplyFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ConsumerewardRewardFields = Protocols.ConsumerewardRewardFields;

    export class ConsumeRewardModel {
        private static _instance: ConsumeRewardModel;
        public static get instance(): ConsumeRewardModel {
            return this._instance = this._instance || new ConsumeRewardModel();
        }

        //0表示不可领取 1表示可领取 2表示已领取
        private _giveState: number;
        //充值金额
        private _totalMoney: number;
        //奖励列表
        private _rewarTable: Table<ConsumerewardReward>;
        //活动倒计时
        private _activityTime: number;

        private constructor() {
            this._giveState = -1;
            this._totalMoney = -1;
            this._rewarTable = {};
            this._activityTime = 0;
        }

        //更新
        public updateInfo(tuple: Protocols.UpdateConsumeRewardInfo) {
            this._giveState = tuple[GetConsumeRewardInfoReplyFields.state];
            this._totalMoney = tuple[GetConsumeRewardInfoReplyFields.totalMoney];
            let rewarList = tuple[GetConsumeRewardInfoReplyFields.rewardList];
            let isState: boolean = false;
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarTable[rewarList[i][ConsumerewardRewardFields.id]] = rewarList[i];
                if (rewarList[i][ConsumerewardRewardFields.state] === 1) {
                    isState = true;
                }
            }
            RedPointCtrl.instance.setRPProperty("consumeRP", isState);
            this._activityTime = tuple[GetConsumeRewardInfoReplyFields.endTime];
            GlobalData.dispatcher.event(CommonEventType.CONSUME_REWARD_UPDATE);
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        public get rewarTable(): Table<ConsumerewardReward> {
            return this._rewarTable;
        }

        public get activityTime(): number {
            return this._activityTime;
        }
    }
}