namespace modules.weekCard {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class WeekCardCtrl extends BaseCtrl {
        private static _instance: WeekCardCtrl;
        public static get instance(): WeekCardCtrl {
            return this._instance = this._instance || new WeekCardCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetWeekFuliCardInfoReply, this, this.getWeekCardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetWeekFuliCardRewardReply, this, this.getWeekCardRewardReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekFuliCardInfo, null);          
        }

        private getWeekCardInfoReply(tuple: Protocols.GetWeekFuliCardInfoReply): void {
            // console.log('SystemClientOpcode.GetWeekFuliCardInfoReply', tuple);
            
            WeekCardModel.instance.getWeekCardInfoReply(tuple);

        }

        private getWeekCardRewardReply(tuple: Protocols.GetWeekFuliCardRewardReply): void {
            WeekCardModel.instance.getWeekCardRewardReply(tuple);
        }


        // 请求领取奖励
        public getWeekCardReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekFuliCardReward, null);
        }
    }
}