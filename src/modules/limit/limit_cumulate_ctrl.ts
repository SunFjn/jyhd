//累充豪礼
namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetLimitXunBaoCumulatePayInfoReply = Protocols.GetLimitXunBaoCumulatePayInfoReply;

    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    import GetLimitXunBaoCumulatePayRewardReplyFields = Protocols.GetLimitXunBaoCumulatePayRewardReplyFields;
    import GetLimitXunBaoCumulatePayRewardReply = Protocols.GetLimitXunBaoCumulatePayRewardReply;

    import GetLimitXunBaoCumulatePayReward = Protocols.GetLimitXunBaoCumulatePayReward;


    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class LimitCumulateCtrl extends BaseCtrl {
        private static _instance: LimitCumulateCtrl;
        public static get instance(): LimitCumulateCtrl {
            return this._instance = this._instance || new LimitCumulateCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoCumulatePayInfoReply, this, this.GetLimitXunBaoCumulatePayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoCumulatePayRewardReply, this, this.GetLimitXunBaoCumulatePayRewardReply);

            this.requsetAllData()
        }

        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.GetLimitXunBaoCumulatePayInfo(LimitBigType.dishu);
            this.GetLimitXunBaoCumulatePayInfo(LimitBigType.fish);
            this.GetLimitXunBaoCumulatePayInfo(LimitBigType.year);
        }
        constructor() {
            super();

        }

        //获取数据
        public GetLimitXunBaoCumulatePayInfo(bigType: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoCumulatePayInfo, [bigType]);
        }
        //累充豪礼信息返回
        private GetLimitXunBaoCumulatePayInfoReply(tuple: GetLimitXunBaoCumulatePayInfoReply) {
            // console.log('vtz:tuple',tuple);
            LimitCumulateModel.instance.updateInfo(tuple);
        }

        //获取奖励返回
        private GetLimitXunBaoCumulatePayRewardReply(tuple: GetLimitXunBaoCumulatePayRewardReply) {
            if (!tuple[GetLimitXunBaoCumulatePayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public GetLimitXunBaoCumulatePayReward(tuple: GetLimitXunBaoCumulatePayReward): void {
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoCumulatePayReward, tuple);
        }

    }
}