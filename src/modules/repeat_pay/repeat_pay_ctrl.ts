/////<reference path="../$.ts"/>
/** 累计充值(周末狂欢) */
namespace modules.repeatPay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetWeekAccumulateReply = Protocols.GetWeekAccumulateReply;
    import GetWeekAccumulateAwardReply = Protocols.GetWeekAccumulateAwardReply;
    import GetWeekAccumulateAwardReplyFields = Protocols.GetWeekAccumulateAwardReplyFields;
    import CommonTxtAlertUI = ui.CommonTxtAlertUI;

    export class RepeatPayCtrl extends BaseCtrl {
        private static _instance: RepeatPayCtrl;
        public static get instance(): RepeatPayCtrl {
            return this._instance = this._instance || new RepeatPayCtrl();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetWeekAccumulateReply, this, this.getWeekAccumulateReply);
            Channel.instance.subscribe(SystemClientOpcode.GetWeekAccumulateAwardReply, this, this.getWeekAccumulateAwardReply);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.setFuncState);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.getWeekAccumulate();
        }

        private getWeekAccumulate(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekAccumulate, null);
        }

        public getWeekAccumulateReply(tuple: GetWeekAccumulateReply): void {
            // console.log("周末狂欢更新",tuple)
            RepeatPayModel.instance.getWeekAccumulateReply(tuple);
        }

        public getWeekAccumulateAward(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekAccumulateAward, [id]);
        }

        public getWeekAccumulateAwardReply(tuple: GetWeekAccumulateAwardReply): void {
            let code: number = tuple[GetWeekAccumulateAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }

        public setFuncState(ids: Array<number>) {
            for(let id of ids){
                if(id === ActionOpenId.weekAccumulate){
                    RepeatPayModel.instance.setFuncState();
                    return;
                }
            }
        }

    }
}