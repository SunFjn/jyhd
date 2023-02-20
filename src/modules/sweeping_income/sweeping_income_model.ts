
/**挂机收益*/
namespace modules.sweeping_income{
    import GetSweepingIncomeReplyFields = Protocols.GetSweepingIncomeReplyFields;
    export class SweepingIncomeModel{
        private static _instance: SweepingIncomeModel;

        public static get instance(): SweepingIncomeModel {
            return this._instance = this._instance || new SweepingIncomeModel();
        }

        private _replyTuple : Array<any>;
        private _coinIncome:number;
        private _exeIncome:number;
        private constructor() {
            this._replyTuple = [];
            this._coinIncome = 0;
            this._exeIncome  = 0;
        }
        public updateInfo(tuple: Protocols.GetSweepingIncomeReply) {
            this._replyTuple = tuple;
            this._coinIncome = tuple[GetSweepingIncomeReplyFields.coin];
            this._exeIncome  = tuple[GetSweepingIncomeReplyFields.exp];

            GlobalData.dispatcher.event(CommonEventType.SWEEPING_INCOME);
            // console.log("updateInfo ----- tuple = " + tuple);
            // console.log("_replyTuple = " + this._replyTuple[1]);
            // console.log("_replyTuple = " + this._replyTuple[2]);
        }
        public get replyTuple():Array<any>{
            return this._replyTuple;
        }
        public get coinImcome():number{
            return this._coinIncome;
        }
        public get exeImcome():number{
            return this._exeIncome;
        }
    }
}