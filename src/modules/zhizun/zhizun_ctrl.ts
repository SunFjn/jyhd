/////<reference path="../$.ts"/>
/** 至尊特权 */
namespace modules.zhizun {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateZhizunCardInfo = Protocols.UpdateZhizunCardInfo;
    import BuyZhizunCardReply = Protocols.BuyZhizunCardReply;
    import BuyZhizunCardReplyFields = Protocols.BuyZhizunCardReplyFields;

    export class ZhizunCtrl extends BaseCtrl {
        private static _instance: ZhizunCtrl;
        public static get instance(): ZhizunCtrl {
            return this._instance = this._instance || new ZhizunCtrl();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetZhizunCardInfoReply, this, this.zhizunCardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateZhizunCardInfo, this, this.updateZhizunCardInfo);
            Channel.instance.subscribe(SystemClientOpcode.BuyZhizunCardReply, this, this.buyZhizunCardReply);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            this.requsetAllData();
        }

        public requsetAllData() {
            this.getZhizunCardInfo();
        }

        public getZhizunCardInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetZhizunCardInfo, null);
        }

        //返回
        private zhizunCardInfoReply(tuple: UpdateZhizunCardInfo) {
            ZhizunModel.instance.updateZhizunCardInfo(tuple, false);
        }

        //更新
        private updateZhizunCardInfo(tuple: UpdateZhizunCardInfo) {
            ZhizunModel.instance.updateZhizunCardInfo(tuple, true);
        }

        //购买
        public buyZhizunCard(): void {
            Channel.instance.publish(UserFeatureOpcode.BuyZhizunCard, null);
        }
        private buyZhizunCardReply(tuple: BuyZhizunCardReply): void {
            let code: number = tuple[BuyZhizunCardReplyFields.result];
            CommonUtil.codeDispose(code, `购买成功`);
        }
    }
}