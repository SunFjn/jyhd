/////<reference path="../$.ts"/>
/** 开服礼包 */
namespace modules.openAward {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateOpenReward = Protocols.UpdateOpenReward;
    import BuyOpenRewardReply = Protocols.BuyOpenRewardReply;
    import BuyOpenRewardReplyFields = Protocols.BuyOpenRewardReplyFields;

    export class OpenAwardCtrl extends BaseCtrl {
        private static _instance: OpenAwardCtrl;
        public static get instance(): OpenAwardCtrl {
            return this._instance = this._instance || new OpenAwardCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetOpenRewardReply, this, this.updateOpenReward);
            Channel.instance.subscribe(SystemClientOpcode.UpdateOpenReward, this, this.updateOpenReward);
            Channel.instance.subscribe(SystemClientOpcode.BuyOpenRewardReply, this, this.buyOpenRewardReply);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
        }

        public getOpenReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetOpenReward, null);
        }

        private updateOpenReward(tuple: UpdateOpenReward): void {
            OpenAwardModel.instance.update(tuple);
        }

        public buyOpenReward(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.BuyOpenReward, [id]);
        }

        private buyOpenRewardReply(tuple: BuyOpenRewardReply): void {
            let code: number = tuple[BuyOpenRewardReplyFields.result];
            CommonUtil.codeDispose(code, "购买成功");
        }

    }
}