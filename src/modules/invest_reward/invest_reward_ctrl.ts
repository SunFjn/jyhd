/////<reference path="../$.ts"/>
/** 投资返利 */
namespace modules.invest_reward {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetInvestRewardInfoReply = Protocols.GetInvestRewardInfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateInvestRewardInfo = Protocols.UpdateInvestRewardInfo;
    import GetInvestRewardRewardReply = Protocols.GetInvestRewardRewardReply;
    import GetInvestRewardRewardReplyFields = Protocols.GetInvestRewardRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetInvestRewardReward = Protocols.GetInvestRewardReward;
    import BuyInvestReward = Protocols.BuyInvestReward;
    import BuyInvestRewardReplyFields = Protocols.BuyInvestRewardReplyFields;
    import BuyInvestRewardReply = Protocols.BuyInvestRewardReply;

    export class InvestRewardCtrl extends BaseCtrl {
        private static _instance: InvestRewardCtrl;
        public static get instance(): InvestRewardCtrl {
            return this._instance = this._instance || new InvestRewardCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetInvestRewardInfoReply, this, this.getInvestRewardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateInvestRewardInfo, this, this.updateInvestRewardInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetInvestRewardRewardReply, this, this.getInvestRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.BuyInvestRewardReply, this, this.getInvestBuyRewardReply);
            this.requsetAllData()

            GlobalData.dispatcher.on(CommonEventType.VIP_UPDATE, this, this.investRewardPRState);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_MONEY, this, this.investRewardPRState);

        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetInvestRewardInfo, null);
        }

        public investRewardPRState() {
            InvestRewardModel.instance.investRewardPRState();
        }
        private getInvestRewardInfoReply(tuple: GetInvestRewardInfoReply) {
            InvestRewardModel.instance.updateInfo(tuple);
        }

        private updateInvestRewardInfo(tuple: UpdateInvestRewardInfo) {
            InvestRewardModel.instance.updateInfo(tuple);
        }

        private getInvestRewardReply(tuple: GetInvestRewardRewardReply) {
            if (!tuple[GetInvestRewardRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        private getInvestBuyRewardReply(tuple: BuyInvestRewardReply) {
            if (!tuple[BuyInvestRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("投资成功");
            }
            InvestRewardModel.instance._result = tuple[BuyInvestRewardReplyFields.result];
        }

        //领取奖励
        public getInvestReward(tuple: GetInvestRewardReward): void {
            Channel.instance.publish(UserFeatureOpcode.GetInvestRewardReward, tuple);
        }

        //投资
        public getBuyInvestReward(type: BuyInvestReward): void {
            Channel.instance.publish(UserFeatureOpcode.BuyInvestReward, type);
        }
    }
}