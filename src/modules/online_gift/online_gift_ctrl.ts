/**在线礼包*/


namespace modules.onlineGift {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetOnlineRewardAwardReply = Protocols.GetOnlineRewardAwardReply;
    import GetOnlineRewardAwardReplyFields = Protocols.GetOnlineRewardAwardReplyFields;
    import GetOnlineRewardReply = Protocols.GetOnlineRewardReply;
    import GetOnlineRewardReplyFields = Protocols.GetOnlineRewardReplyFields;
    import UpdateOnlineReward = Protocols.UpdateOnlineReward;
    import UpdateOnlineRewardFields = Protocols.UpdateOnlineRewardFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class OnlineGiftCtrl extends BaseCtrl {
        private static _instance: OnlineGiftCtrl;

        public static get instance(): OnlineGiftCtrl {
            return this._instance = this._instance || new OnlineGiftCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.UpdateOnlineReward, this, this.updateOnlineReward);
            Channel.instance.subscribe(SystemClientOpcode.GetOnlineRewardAwardReply, this, this.getOnlineRewadAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetOnlineRewardReply, this, this.getOnlineRewardReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetOnlineReward, null);
        }

        public updateOnlineReward(tuple: UpdateOnlineReward): void {
            OnlineGiftModel.instance.UpdateRewardReply = tuple[UpdateOnlineRewardFields.list];
            // console.log("更新奖励列表返回------------" + tuple);
        }

        public getOnlineRewadAwardReply(tuple: GetOnlineRewardAwardReply): void {
            OnlineGiftModel.instance.AwardReply = tuple[GetOnlineRewardAwardReplyFields.result];
            // console.log("获取奖励返回------------" + tuple);
        }

        public getOnlineRewardReply(tuple: GetOnlineRewardReply): void {
            OnlineGiftModel.instance.UpdateRewardReply = tuple[GetOnlineRewardReplyFields.list];
            // console.log("获取奖励列表返回------------" + tuple)
        }


    }
}