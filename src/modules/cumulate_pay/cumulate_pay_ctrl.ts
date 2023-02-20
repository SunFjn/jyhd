//累充豪礼
namespace modules.cumulate_pay {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetCumulatepayInfoReply = Protocols.GetCumulatepayInfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateCumulatepayInfo = Protocols.UpdateCumulatepayInfo;
    import GetCumulatepayRewardReplyFields = Protocols.GetCumulatepayRewardReplyFields;
    import GetCumulatepayRewardReply = Protocols.GetCumulatepayRewardReply;
    import GetCumulatepayReward = Protocols.GetCumulatepayReward;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class CumulatePayModelCtrl extends BaseCtrl {
        private static _instance: CumulatePayModelCtrl;
        public static get instance(): CumulatePayModelCtrl {
            return this._instance = this._instance || new CumulatePayModelCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepayInfoReply, this, this.getCumulatepayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateCumulatepayInfo, this, this.updateCumulatepayInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepayRewardReply, this, this.getCumulatepayRewardReply);

            this.requsetAllData()
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepayInfo, null);
        }

        constructor() {
            super();

        }

        //累充豪礼信息返回
        private getCumulatepayInfoReply(tuple: GetCumulatepayInfoReply) {
            // console.log('vtz:tuple',tuple);
            CumulatePayModel.instance.updateInfo(tuple);
        }

        //更新信息
        private updateCumulatepayInfo(tuple: UpdateCumulatepayInfo) {
            CumulatePayModel.instance.updateInfo(tuple);
        }

        //获取奖励返回
        private getCumulatepayRewardReply(tuple: GetCumulatepayRewardReply) {
            if (!tuple[GetCumulatepayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getCumulatepayReward(tuple: GetCumulatepayReward): void {
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepayReward, tuple);
        }

        //获取数据
        public getCumulatepayInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepayInfo, null);
        }
    }
}