namespace modules.dailyDemon {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import updateXiangyaoDataReply = Protocols.updateXiangyaoDataReply;
    import getXiangyaoRewardReply = Protocols.getXiangyaoRewardReply;
    import GetXiangyaoReward = Protocols.GetXiangyaoReward;
    import getXiangyaoRewardReplyFields = Protocols.getXiangyaoRewardReplyFields;

    export class DailyDemonCtrl extends BaseCtrl {
        private static _instance: DailyDemonCtrl;
        public static get instance(): DailyDemonCtrl {
            return this._instance = this._instance || new DailyDemonCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.updateXiangyaoDataReply, this, this.updateXiangyaoDataReply);
            Channel.instance.subscribe(SystemClientOpcode.getXiangyaoRewardReply, this, this.getXiangyaoRewardReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXiangyaoState, null);
        }

        /*更新降妖怪数据*/
        private updateXiangyaoDataReply(tuple: updateXiangyaoDataReply): void {
            if (!tuple) return;
            DailyDemonModel.instance.saveData(tuple);
        }

        /*领取降妖奖励*/
        public getXiangyaoReward(tuple: GetXiangyaoReward): void {
            Channel.instance.publish(UserFeatureOpcode.GetXiangyaoReward, tuple);
        }

        /*领取降妖奖励返回*/
        private getXiangyaoRewardReply(tuple: getXiangyaoRewardReply): void {
            modules.common.CommonUtil.noticeError(tuple[getXiangyaoRewardReplyFields.result]);
        }
    }
}