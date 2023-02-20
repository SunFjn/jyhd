namespace modules.demonOrderGift {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class DemonOrderGiftCtrl extends BaseCtrl {
        private static _instance: DemonOrderGiftCtrl;
        public static get instance(): DemonOrderGiftCtrl {
            return this._instance = this._instance || new DemonOrderGiftCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetDemonOrderGiftInfoReply, this, this.getDemonOrderGiftInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetDemonOrderGiftRewardReply, this, this.getDemonOrderGiftRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetDemonOrderGiftExtraRewardReply, this, this.getDemonOrderGiftExtraRewardReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetDemonOrderGiftInfo, null);      
        }

        private getDemonOrderGiftInfoReply(tuple: Protocols.GetDemonOrderGiftInfoReply): void {
            DemonOrderGiftModel.instance.getDemonOrderGiftInfoReply(tuple);

        }

        private getDemonOrderGiftRewardReply(tuple: Protocols.GetDemonOrderGiftRewardReply): void {
            DemonOrderGiftModel.instance.getDemonOrderGiftRewardReply(tuple);
        }

        private getDemonOrderGiftExtraRewardReply(tuple: Protocols.GetDemonOrderGiftExtraRewardReply) {
            DemonOrderGiftModel.instance.getDemonOrderGiftExtraRewardReply(tuple)
        }
        // private updateDemonOrderGiftInfo(tuple: Protocols.GetDemonOrderGiftInfoReply): void {
        //     DemonOrderGiftModel.instance.updateDemonOrderGiftInfo(tuple);

        // }

        // 请求领取奖励
        public getDemonOrderGiftReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetDemonOrderGiftReward, null);
        }

    }
}