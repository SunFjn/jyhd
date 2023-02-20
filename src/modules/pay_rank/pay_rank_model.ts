namespace modules.payRank {
    import ConsumeRank = Protocols.ConsumeRank;
    import ConsumeRankFields = Protocols.ConsumeRankFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import action_open = Configuration.action_open;
    import action_openFields = Configuration.action_openFields;
    import ConsumeRankCfg = config.ConsumeRankCfg;

    export class PayRankModel {
        private static _instance: PayRankModel;
        public static get Instance() {
            return PayRankModel._instance = PayRankModel._instance || new PayRankModel();
        }
        //总消费代币券数
        private _totalPay: number;
        //消费排行倒计时
        private _activityTime: number = 0;
        //排行数据表
        private _rankList: Array<ConsumeRank> = [];

        constructor() {
        }

        public get totalPay(): number {
            return this._totalPay;
        }

        public set totalPay(count: number) {
            this._totalPay = count;
            GlobalData.dispatcher.event(CommonEventType.PAY_RANK_UPDATE);
        }

        public get activityTime(): number {
            return this._activityTime;
        }

        public set activityTime(time: number) {
            this._activityTime = time;
        }

        public get rankList(): Array<ConsumeRank> {
            return this._rankList;
        }

        public set rankList(rankList: Array<ConsumeRank>) {
            this._rankList = rankList;
            GlobalData.dispatcher.event(CommonEventType.PAY_RANK_UPDATE);
        }
        /**
         * name
         */
        public getShuJuByMingCi(mingci: number): ConsumeRank {
            for (let i: number = 0; i < this._rankList.length; i++) {
                if (this._rankList[i]) {
                    if (this._rankList[i][ConsumeRankFields.rank] == mingci) {
                        return this._rankList[i];
                    }
                }
            }
            return null;
        }

        public actorRank(rank: Array<ConsumeRank>, acId: number): number  //判断自己是否上榜和返回排行数据
        {
            for (let i: number = 0; i < rank.length; i++) {
                if (rank[i][ConsumeRankFields.objId] === acId) {
                    return rank[i][ConsumeRankFields.rank];
                }
            }
            return -1;
        }

        public setActionOpen(): void {
            if (FuncOpenModel.instance.getFuncStateById(ActionOpenId.consumeRank) != 0) {//功能必须已经开了
                let offsetTime:number = new Date().getTimezoneOffset() * utils.Unit.minute;
                let _openState = Math.floor((this._activityTime - offsetTime)  / utils.Unit.day) === Math.floor((GlobalData.serverTime - offsetTime) / utils.Unit.day) ? ActionOpenState.open : ActionOpenState.close;
                modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.consumeRank, _openState);
            }
        }
    }
}