/** 消费赠礼 */
///<reference path="consume_reward_model.ts"/>
namespace modules.cousume_reward {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetConsumeRewardInfoReply = Protocols.GetConsumeRewardInfoReply;
    import GetConsumeRewardRewardReply = Protocols.GetConsumeRewardRewardReply;
    import GetConsumeRewardRewardReplyFields = Protocols.GetConsumeRewardRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UpdateConsumeRewardInfo = Protocols.UpdateConsumeRewardInfo;
    import GetConsumeRewardReward = Protocols.GetConsumeRewardReward;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class ConsumeRewardCtrl extends BaseCtrl {
        private static _instance: ConsumeRewardCtrl;
        public static get instance(): ConsumeRewardCtrl {
            return this._instance = this._instance || new ConsumeRewardCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeRewardInfoReply, this, this.getConsumeRewardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateConsumeRewardInfo, this, this.updateConsumeRewardInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeRewardRewardReply, this, this.getConsumeRewardReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetConsumeRewardInfo, null);
        }

        constructor() {
            super();

        }

        //消费赠礼信息返回
        private getConsumeRewardInfoReply(tuple: GetConsumeRewardInfoReply) {
            // console.log('vtz消费赠礼:tuple',tuple);
            ConsumeRewardModel.instance.updateInfo(tuple);
        }

        //消费赠礼更新信息
        private updateConsumeRewardInfo(tuple: UpdateConsumeRewardInfo) {
            ConsumeRewardModel.instance.updateInfo(tuple);
        }

        //消费赠礼获取奖励返回
        private getConsumeRewardReply(tuple: GetConsumeRewardRewardReply) {
            if (!tuple[GetConsumeRewardRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //消费赠礼领取奖励
        public getConsumeReward(tuple: GetConsumeRewardReward): void {
            Channel.instance.publish(UserFeatureOpcode.GetConsumeRewardReward, tuple);
        }

        //消费赠礼获取数据
        public getConsumeRewardInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetConsumeRewardInfo, null);
        }
    }
}