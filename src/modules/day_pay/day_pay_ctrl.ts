namespace modules.day_pay {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetDaypayInfoReply = Protocols.GetDaypayInfoReply;
    import UpdateDaypayInfo = Protocols.UpdateDaypayInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetDaypayRewardReply = Protocols.GetDaypayRewardReply;
    import GetDaypayRewardReplyFields = Protocols.GetDaypayRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class DayPayCtrl extends BaseCtrl {
        private static _instance: DayPayCtrl;
        public static get instance(): DayPayCtrl {
            return this._instance = this._instance || new DayPayCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetDaypayInfoReply, this, this.getDaypayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDaypayInfo, this, this.updateDaypayInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetDaypayRewardReply, this, this.getDaypayRewardReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetDaypayInfo, null);
        }

        constructor() {
            super();

        }

        //信息返回
        private getDaypayInfoReply(tuple: GetDaypayInfoReply) {
            DayPayModel.instance.updateInfo(tuple);
        }

        //更新信息
        private updateDaypayInfo(tuple: UpdateDaypayInfo) {
            // console.log(" 日充更新信息:   ", tuple);
            DayPayModel.instance.updateInfo(tuple);
        }

        //获取奖励返回
        private getDaypayRewardReply(tuple: GetDaypayRewardReply) {
            if (!tuple[GetDaypayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getDaypayReward(tuple: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetDaypayReward, [tuple]);
        }


    }
}