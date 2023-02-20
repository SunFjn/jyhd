/** 连充豪礼 */
namespace modules.ceremony_cash {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetCeremonyContinuepayInfoReply = Protocols.GetCeremonyContinuepayInfoReply;
    import GetCeremonyContinuepayRewardReply = Protocols.GetCeremonyContinuepayRewardReply;
    import GetCeremonyContinuepayRewardReplyFields = Protocols.GetCeremonyContinuepayRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class CeremonyContinuePayCtrl extends BaseCtrl {
        private static _instance: CeremonyContinuePayCtrl;
        public static get instance(): CeremonyContinuePayCtrl {
            return this._instance = this._instance || new CeremonyContinuePayCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetCeremonyContinuepayInfoReply, this, this.GetCeremonyContinuepayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetCeremonyContinuepayRewardReply, this, this.GetCeremonyContinuepayRewardReply);

            this.requsetAllData();
        }

        constructor() {
            super();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getContinuepayInfo();
        }

        //连充豪礼信息返回
        private GetCeremonyContinuepayInfoReply(tuple: GetCeremonyContinuepayInfoReply) {
            // console.log('vtz:连充tuple', tuple);
            CeremonyContinuePayModel.instance.updateInfo(tuple);
        }

        //连充豪礼获取奖励返回
        private GetCeremonyContinuepayRewardReply(tuple: GetCeremonyContinuepayRewardReply) {
            // console.log('vtz:连充tuple', tuple);
            if (!tuple[GetCeremonyContinuepayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getContinueReward(tuple: number, tuple1: number): void {
            // console.log('vtz:连充tuple', tuple, tuple1);
            Channel.instance.publish(UserFeatureOpcode.GetCeremonyContinuepayReward, [tuple, tuple1]);
        }

        //获取数据
        public getContinuepayInfo(): void {
            // console.log("开服活动111")
            Channel.instance.publish(UserFeatureOpcode.GetCeremonyContinuepayInfo, null);
        }
    }
}