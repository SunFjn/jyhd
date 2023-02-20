namespace modules.lineClearOut {
    import GetSweepingStateReply = Protocols.GetSweepingStateReply;
    import UpdateSweepingBaseInfo = Protocols.UpdateSweepingBaseInfo;
    import UpdateSweepingBaseInfoFields = Protocols.UpdateSweepingBaseInfoFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class LineClearOutModel {
        private static _instance: LineClearOutModel;
        public static get instance(): LineClearOutModel {
            return this._instance = this._instance || new LineClearOutModel();
        }

        public clearTime: number;  //已经扫荡次数
        public availableTimes: number;  //可扫荡次数
        public getSweepingState: GetSweepingStateReply;

        constructor() {

        }

        public getSweepingStateReply(tuple: GetSweepingStateReply): void {
            this.getSweepingState = tuple;
            GlobalData.dispatcher.event(CommonEventType.SWEEPING_UPDATE);
        }

        public updateSweepingBaseInfo(tuple: UpdateSweepingBaseInfo): void {
            this.availableTimes = tuple[UpdateSweepingBaseInfoFields.availableTimes];
            this.clearTime = tuple[UpdateSweepingBaseInfoFields.haveSweepingTimes];
            GlobalData.dispatcher.event(CommonEventType.SWEEPING_UPDATE);
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sweepingEnter)) {
                RedPointCtrl.instance.setRPProperty("lineClearOut", this.clearTime == 0);
            }

        }
    }
}