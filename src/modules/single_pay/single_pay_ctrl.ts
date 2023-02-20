/////<reference path="../$.ts"/>
/** 单笔充值(周末狂欢) */
namespace modules.singlePay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetWeekSinglePayReply = Protocols.GetWeekSinglePayReply;
    import GetWeekSinglePayAward = Protocols.GetWeekSinglePayAward;
    import GetWeekSinglePayAwardReply = Protocols.GetWeekSinglePayAwardReply;
    import GetWeekSinglePayAwardReplyFields = Protocols.GetWeekSinglePayAwardReplyFields;

    export class SinglePayCtrl extends BaseCtrl {
        private static _instance: SinglePayCtrl;
        public static get instance(): SinglePayCtrl {
            return this._instance = this._instance || new SinglePayCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetWeekSinglePayReply, this, this.getWeekSinglePayReply);
            Channel.instance.subscribe(SystemClientOpcode.GetWeekSinglePayAwardReply, this, this.getWeekSinglePayAwardReply);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.setFuncState);

            this.requsetAllData();
        }

        public requsetAllData() {
            this.getWeekSinglePay();
        }

        private getWeekSinglePay(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekSinglePay, null);
        }

        public getWeekSinglePayReply(tuple: GetWeekSinglePayReply): void {
            SinglePayModel.instance.getWeekSinglePayReply(tuple);
        }

        public getWeekSinglePayAward(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekSinglePayAward, [id]);
        }

        public getWeekSinglePayAwardReply(tuple: GetWeekSinglePayAwardReply): void {
            let code: number = tuple[GetWeekSinglePayAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }

        public setFuncState(ids: Array<number>) {
            for (let id of ids) {
                if (id === ActionOpenId.weekSinglePay) {
                    SinglePayModel.instance.setFuncState();
                    return;
                }
            }
        }
    }
}