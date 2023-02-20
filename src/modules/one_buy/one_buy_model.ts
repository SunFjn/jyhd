/**秒杀活动*/



namespace modules.one_buy{

    import OneBuyReward = Protocols.OneBuyReward;
    import OneBuyRewardFields = Protocols.OneBuyRewardFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class OneBuyModel {
        private _awardArr: Array<any>;
        private static _instance: OneBuyModel;
        public static get instance(): OneBuyModel {
            return this._instance = this._instance || new OneBuyModel();
        }
        private constructor(){
            this._awardArr = [];
        }

        private _state:number;     //一秒激活状态
        public get state():number{
            return this._state;
        }
        public updateInfo(tuple: Protocols.GetOneBuyInfoReply) {
            this._awardArr = tuple;
            this.setPayRewardRP();
            this._state = FuncOpenModel.instance.getFuncStateById(231);
            GlobalData.dispatcher.event(CommonEventType.ONEBUY_UPDATE);
        }

        private _canActived:number;
        public get canActived():number{
            return this._canActived;
        }

        public get awardNode(): Array<any> {
            return this._awardArr;
        }

        public getAwardStateById(id:number):number{
            let tempArr = 0;
            // console.log("*******id***************** = " + id);
            // console.log("_awardNode.length = " + this._awardArr.length);
            // console.log("this._awardArr[0].length = " + this._awardArr[0].length);

            for (let i = 0;i<this._awardArr[0].length;i++){
                // console.log("this._awardArr[OneBuyRewardFields.id] = "+this._awardArr[OneBuyRewardFields.id]);
                // console.log("this._awardArr[i][i][OneBuyRewardFields.id] = "+this._awardArr[0][i][OneBuyRewardFields.id]);
                if (id==this._awardArr[0][i][OneBuyRewardFields.id]){
                    tempArr = this._awardArr[0][i][OneBuyRewardFields.state];
                }
            }
            return tempArr;
        }

        //设置红点
        public setPayRewardRP() {
            let isOneBuydRP = this.getgRadeRP();
            redPoint.RedPointCtrl.instance.setRPProperty("oneBuyRP", isOneBuydRP);
        }
        public getgRadeRP(): boolean {
            if(FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.oneBuy)){
                if (this.awardNode) {
                    for (var index = 0; index < this.awardNode[0].length; index++) {
                        let element = this.awardNode[0][index];
                        if (element) {
                            let stateNum = element[OneBuyRewardFields.state];
                            if (stateNum == 1) {//0不可领取1可领取2已领取
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        //是否购买完了
        public isBuyFinish(){
            let arr = OneBuyModel.instance.awardNode[0];
            let count = 0;
           for (const data of arr) {
                if (data[OneBuyRewardFields.state] == 2) {
                    count++;
                }
           }
           return count == 3;
        }
    }
}