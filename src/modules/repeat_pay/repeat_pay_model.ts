/////<reference path="../$.ts"/>
/** --- */
namespace modules.repeatPay {
    import GlobalData = modules.common.GlobalData;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetWeekAccumulateReply = Protocols.GetWeekAccumulateReply;
    import GetWeekAccumulateReplyFields = Protocols.GetWeekAccumulateReplyFields;

    export class RepeatPayModel {
        private static _instance: RepeatPayModel;
        public static get instance(): RepeatPayModel {
            return this._instance = this._instance || new RepeatPayModel();
        }

        public state: boolean;
        public time: number;
        public list: Array<Protocols.Pair>;
        public money: number;

        constructor() {

        }

        public getWeekAccumulateReply(tuple: GetWeekAccumulateReply): void {
            if (!tuple) return;

            this.state = tuple[GetWeekAccumulateReplyFields.state];
            this.time = tuple[GetWeekAccumulateReplyFields.time];
            this.list = tuple[GetWeekAccumulateReplyFields.stateList];
            this.money = tuple[GetWeekAccumulateReplyFields.money];

            this.checkRP();
            this.setFuncState();
            GlobalData.dispatcher.event(CommonEventType.WEEK_REPEAT_PAY_UPDATE);
        }

        public setFuncState(): void {
            FuncOpenModel.instance.setActionOpen(ActionOpenId.weekAccumulate, this.state ? ActionOpenState.open : ActionOpenState.close);
        }

        public checkRP(): void {
            for (let e of this.list) {
                let state: operaState = e[Protocols.ThreeNumberFields.v2];
                if (state == operaState.can) {
                    redPoint.RedPointCtrl.instance.setRPProperty("weekRepeatPayRP", true);
                    return;
                }
            }
            redPoint.RedPointCtrl.instance.setRPProperty("weekRepeatPayRP", false);
        }
    }
}