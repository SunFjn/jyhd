//每日累充
namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetLimitXunBaoDayCumulatePayInfoReply = Protocols.GetLimitXunBaoDayCumulatePayInfoReply;
    import GetLimitXunBaoDayCumulatePayRewardReplyFields = Protocols.GetLimitXunBaoDayCumulatePayRewardReplyFields
    import GetLimitXunBaoDayCumulatePayRewardReply = Protocols.GetLimitXunBaoDayCumulatePayRewardReply;
    import GetLimitXunBaoDayCumulatePayInfoReplyFields = Protocols.GetLimitXunBaoDayCumulatePayInfoReplyFields;

    export class LimitDayCumulateCtrl extends BaseCtrl {
        private static _instance: LimitDayCumulateCtrl;
        public static get instance(): LimitDayCumulateCtrl {
            return this._instance = this._instance || new LimitDayCumulateCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoDayCumulatePayInfoReply, this, this.GetLimitXunBaoDayCumulatePayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoDayCumulatePayRewardReply, this, this.GetLimitXunBaoDayCumulatePayRewardReply);

            this.requsetAllData()
        }

        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.getLimitDayCumulateInfo(LimitBigType.dishu)
            this.getLimitDayCumulateInfo(LimitBigType.year)
            this.getLimitDayCumulateInfo(LimitBigType.evedayPay)
        }
        constructor() {
            super();

        }

        //获取数据
        public getLimitDayCumulateInfo(bigtype: number): void {
            // console.log("------------------------getCumulatepay2Info")
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoDayCumulatePayInfo.toString(16)}`, bigtype);
            console.log("INFOPUSH", UserFeatureOpcode.GetLimitXunBaoDayCumulatePayInfo);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoDayCumulatePayInfo, [bigtype]);
        }

        //累充豪礼信息返回
        private GetLimitXunBaoDayCumulatePayInfoReply(tuple: GetLimitXunBaoDayCumulatePayInfoReply) {
            // console.log("------------------------getCumulatepay2InfoReply", tuple)
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoDayCumulatePayInfoReply.toString(16)}:tuple`, tuple);
            
            if (tuple[GetLimitXunBaoDayCumulatePayInfoReplyFields.bigType] == LimitBigType.evedayPay) {
                modules.everyday_firstpay.EverydayFirstPayModel.instance.updateInfo(tuple);
            } else {
                LimitDayCumulateModel.instance.updateInfo(tuple);
            }
        }


        //获取奖励返回
        private GetLimitXunBaoDayCumulatePayRewardReply(tuple: GetLimitXunBaoDayCumulatePayRewardReply) {
            //console.log("------------------------getCumulatepay2RewardReply",tuple)
            if (!tuple[GetLimitXunBaoDayCumulatePayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public GetLimitXunBaoDayCumulatePayReward(tuple: GetLimitXunBaoDayCumulatePayRewardReply): void {
            //console.log("------------------------getCumulatepay2Reward",tuple)
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoDayCumulatePayReward, tuple);
        }


    }
}