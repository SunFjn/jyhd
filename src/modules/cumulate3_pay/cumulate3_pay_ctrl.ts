//每日累充
namespace modules.cumulate3_pay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetCumulatepay3InfoReply = Protocols.GetCumulatepay3InfoReply;
    import UpdateCumulatepay3Info = Protocols.UpdateCumulatepay3Info;
    import GetCumulatepay3Reward = Protocols.GetCumulatepay3Reward;
    import GetCumulatepay3RewardReplyFields = Protocols.GetCumulatepay3RewardReplyFields;
    import GetCumulatepay3RewardReply = Protocols.GetCumulatepay3RewardReply;

    export class Cumulate3PayCtrl extends BaseCtrl {
        private static _instance: Cumulate3PayCtrl;
        public static get instance(): Cumulate3PayCtrl {
            return this._instance = this._instance || new Cumulate3PayCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepay3InfoReply, this, this.getCumulatepay3InfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateCumulatepay3Info, this, this.updateCumulatepay3Info);
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepay3RewardReply, this, this.getCumulatepay3RewardReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepay3Info, null);
        }

        constructor() {
            super();

        }

        //累充豪礼信息返回
        private getCumulatepay3InfoReply(tuple: GetCumulatepay3InfoReply) {
            // console.log("------------------------")
            // console.log("getCumulatepay3InfoReply", tuple)
            // console.log("------------------------")
            CumulatePay3Model.instance.updateInfo(tuple);
        }

        //更新信息
        private updateCumulatepay3Info(tuple: UpdateCumulatepay3Info) {
            // console.log("------------------------")
            // console.log("updateCumulatepay3Info", tuple)
            // console.log("------------------------")
            CumulatePay3Model.instance.updateInfo(tuple);
        }

        //获取奖励返回
        private getCumulatepay3RewardReply(tuple: GetCumulatepay3RewardReply) {
            // console.log("------------------------")
            // console.log("getCumulatepay3RewardReply", tuple)
            // console.log("------------------------")
            if (!tuple[GetCumulatepay3RewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getCumulatepay3Reward(tuple: GetCumulatepay3Reward): void {
            // console.log("------------------------")
            // console.log("getCumulatepay3Reward", tuple)
            // console.log("------------------------")
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepay3Reward, tuple);
        }

        //获取数据
        public getCumulatepay3Info(): void {
            // console.log("------------------------")
            // console.log("getCumulatepay3Info")
            // console.log("------------------------")
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepay3Info, null);
        }
    }
}