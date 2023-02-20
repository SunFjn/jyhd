/** 连充豪礼 */
///<reference path="continue_pay_model.ts"/>
namespace modules.continue_pay {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetContinuepayInfoReply = Protocols.GetContinuepayInfoReply;
    import UpdateContinuepaInfo = Protocols.UpdateContinuepayInfo;
    import GetContinuepayRewardReply = Protocols.GetContinuepayRewardReply;
    import GetContinuepayRewardReplyFields = Protocols.GetContinuepayRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class ContinuePayCtrl extends BaseCtrl {
        private static _instance: ContinuePayCtrl;
        public static get instance(): ContinuePayCtrl {
            return this._instance = this._instance || new ContinuePayCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetContinuepayInfoReply, this, this.getContinuepayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateContinuepayInfo, this, this.updateContinuepayInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetContinuepayRewardReply, this, this.getContinuepayRewardReply);

            this.requsetAllData()
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetContinuepayInfo, null);
        }

        constructor() {
            super();
        }

        //连充豪礼信息返回
        private getContinuepayInfoReply(tuple: GetContinuepayInfoReply) {
            ContinuePayModel.instance.updateInfo(tuple);
        }

        //连充豪礼更新信息
        private updateContinuepayInfo(tuple: UpdateContinuepaInfo) {
            ContinuePayModel.instance.updateInfo(tuple);
        }

        //连充豪礼获取奖励返回
        private getContinuepayRewardReply(tuple: GetContinuepayRewardReply) {
            if (!tuple[GetContinuepayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getContinueReward(tuple: number, tuple1: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetContinuepayReward, [tuple, tuple1]);
        }

        //获取数据
        public getContinuepayInfo(): void {
            console.log("开服活动111")
            Channel.instance.publish(UserFeatureOpcode.GetContinuepayInfo, null);
        }
    }
}