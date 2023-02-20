namespace modules.everyday_firstpay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetLimitXunBaoDayCumulatePayRewardReplyFields = Protocols.GetLimitXunBaoDayCumulatePayRewardReplyFields
    import GetLimitXunBaoDayCumulatePayRewardReply = Protocols.GetLimitXunBaoDayCumulatePayRewardReply;
    import GetLimitXunBaoDayCumulatePayInfoReply = Protocols.GetLimitXunBaoDayCumulatePayInfoReply;
    export class EverydayFirstPayCtrl extends BaseCtrl {
        private static _instance: EverydayFirstPayCtrl;
        public static get instance(): EverydayFirstPayCtrl {
            return this._instance = this._instance || new EverydayFirstPayCtrl();
        }

        public setup(): void {
        }
      

        constructor() {
            super();
        }

        // //信息返回
        // private getEverydayFirstPayInfoReply(tuple: GetLimitXunBaoDayCumulatePayInfoReply) {
        //     console.log("INFOUPDATE", tuple);
            
        //     EverydayFirstPayModel.instance.updateInfo(tuple);
        // }

        // //更新信息
        // private updateEverydayFirstPayInfo(tuple: GetLimitXunBaoDayCumulatePayInfoReply) {
        //     // console.log(" 日充更新信息:   ", tuple);
        //     EverydayFirstPayModel.instance.updateInfo(tuple);
        // }

        // //获取奖励返回
        // private GetLimitXunBaoDayCumulatePayRewardReply(tuple: GetLimitXunBaoDayCumulatePayRewardReply) {
        //     if (!tuple[GetLimitXunBaoDayCumulatePayRewardReplyFields.result]) {
        //         SystemNoticeManager.instance.addNotice("领取成功");
        //     }
        // }

        // 领取奖励
        // public GetEverydayFirstPayReward(tuple: GetLimitXunBaoDayCumulatePayRewardReply): void {
        //     //console.log("------------------------getCumulatepay2Reward",tuple)
        //     Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoDayCumulatePayReward, tuple);
        // }


    }
}