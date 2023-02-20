
/**挂机收益*/
namespace  modules.sweeping_income{
    import BaseCtrl = modules.core.BaseCtrl;
    import GetSweepingIncomeReply = Protocols.GetSweepingIncomeReply;

    import GetLoginRewardInfoReply = Protocols.GetLoginRewardInfoReply;
    export class SweepingIncomeCtrl extends BaseCtrl{
        private static _instance: SweepingIncomeCtrl;

        public static get instance(): SweepingIncomeCtrl {
            return this._instance = this._instance || new SweepingIncomeCtrl();
        }

        private constructor(){
            super();
        }
        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetSweepingIncomeReply, this, this.getSweepingIncomeReply);
        }//GetSweepingIncomeReply
        /*返回数据*/
        private getSweepingIncomeReply(tuple:GetSweepingIncomeReply){
            SweepingIncomeModel.instance.updateInfo(tuple);
            //console.log("SweepingIncomeReply ----- Tuple = " + tuple);
        }
    }
}