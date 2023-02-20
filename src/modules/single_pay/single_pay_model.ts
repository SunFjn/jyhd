///<reference path="../config/week_single_pay_cfg.ts"/>
/** --- */
namespace modules.singlePay {
    import GlobalData = modules.common.GlobalData;
    import GetWeekSinglePayReply = Protocols.GetWeekSinglePayReply;
    import GetWeekSinglePayReplyFields = Protocols.GetWeekSinglePayReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import week_single_pay = Configuration.week_single_pay;
    import WeekSinglePayCfg = modules.config.WeekSinglePayCfg;
    import week_single_payFields = Configuration.week_single_payFields;

    export class SinglePayModel {
        private static _instance: SinglePayModel;
        public static get instance(): SinglePayModel {
            return this._instance = this._instance || new SinglePayModel();
        }

        public state: boolean;
        public time: number;
        public list: Array<Protocols.ThreeNumber>;

        constructor() {

        }

        public getWeekSinglePayReply(tuple: GetWeekSinglePayReply): void {
            if (!tuple) return;

            this.state = tuple[GetWeekSinglePayReplyFields.state];
            this.time = tuple[GetWeekSinglePayReplyFields.time];
            this.list = tuple[GetWeekSinglePayReplyFields.countList];

            this.checkRP();
            this.setFuncState();
            GlobalData.dispatcher.event(CommonEventType.WEEK_SINGLE_PAY_UPDATE);
        }

        public checkRP(): void {
            for (let e of this.list) {
                let count: number = e[Protocols.PairFields.second];
                if (count > 0) {
                    redPoint.RedPointCtrl.instance.setRPProperty("weekSinglePayRP", true);
                    return;
                }
            }
            redPoint.RedPointCtrl.instance.setRPProperty("weekSinglePayRP", false);
        }

        public judgeState(id: number, count: number, num: number): operaState {
            if (count > 0) {
                return operaState.can;
            } else { //不能领
                let cfg: week_single_pay = WeekSinglePayCfg.instance.getCfgById(id);
                let maxCount: number = cfg[week_single_payFields.count];
                if (num == maxCount) {
                    return operaState.gone;
                } else {
                    return operaState.cant;
                }
            }
        }

        public setFuncState(): void {
            FuncOpenModel.instance.setActionOpen(ActionOpenId.weekSinglePay, this.state ? ActionOpenState.open : ActionOpenState.close);
        }
    }
}