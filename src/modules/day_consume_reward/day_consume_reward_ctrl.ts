/** 消费赠礼 每日 */
///<reference path="../day_consume_reward/day_consume_reward_model.ts"/>
namespace modules.day_consume_reward {
    import BaseCtrl = modules.core.BaseCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    /*领取奖励*/
    import GetConsumeReward2Reward = Protocols.GetConsumeReward2Reward;
    /*返回数据*/
    import GetConsumeReward2InfoReply = Protocols.GetConsumeReward2InfoReply;
    /*更新数据*/
    import UpdateConsumeReward2Info = Protocols.UpdateConsumeReward2Info;
    /*领取奖励返回*/
    import GetConsumeReward2RewardReply = Protocols.GetConsumeReward2RewardReply;
    import GetConsumeReward2RewardReplyFields = Protocols.GetConsumeReward2RewardReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import DayConsumeRewardModel = modules.day_consume_reward.DayConsumeRewardModel;

    export class DayConsumeRewardCtrl extends BaseCtrl {
        private static _instance: DayConsumeRewardCtrl;
        public static get instance(): DayConsumeRewardCtrl {
            return this._instance = this._instance || new DayConsumeRewardCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeReward2InfoReply, this, this.GetConsumeReward2InfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateConsumeReward2Info, this, this.UpdateConsumeReward2Info);
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeReward2RewardReply, this, this.GetConsumeReward2RewardReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.GetConsumeReward2Info();
        }

        constructor() {
            super();

        }

        //消费赠2礼获取数据
        public GetConsumeReward2Info(): void {
            // console.log("消费赠礼获取数据");
            Channel.instance.publish(UserFeatureOpcode.GetConsumeReward2Info, null);
        }

        //消费赠礼2领取奖励
        public GetConsumeReward2Reward(tuple: GetConsumeReward2Reward): void {
            // console.log("消费赠礼领取奖励");
            Channel.instance.publish(UserFeatureOpcode.GetConsumeReward2Reward, tuple);
        }

        //消费赠礼2信息返回
        private GetConsumeReward2InfoReply(tuple: GetConsumeReward2InfoReply) {
            DayConsumeRewardModel.instance.updateInfo(tuple);
        }

        //消费赠礼2更新信息
        private UpdateConsumeReward2Info(tuple: UpdateConsumeReward2Info) {
            DayConsumeRewardModel.instance.updateInfo(tuple);
        }

        //消费赠礼2获取奖励返回
        private GetConsumeReward2RewardReply(tuple: GetConsumeReward2RewardReply) {
            if (!tuple[GetConsumeReward2RewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }
    }
}