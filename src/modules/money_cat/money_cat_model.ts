namespace modules.money_cat{
    import UpdateMoneyCatState = Protocols.UpdateMoneyCatState;
    import UpdateMoneyCatStateFields = Protocols.UpdateMoneyCatStateFields;
    import GetMoneyCatInfoReply = Protocols.GetMoneyCatInfoReply;
    import GetMoneyCatInfoReplyFields = Protocols.GetMoneyCatInfoReplyFields;
    import ActiveMoneyCatReply = Protocols.ActiveMoneyCatReply;
    import ActiveMoneyCatReplyFields = Protocols.ActiveMoneyCatReplyFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class MoneyCatModel{
        constructor(){}

        private static _instance: MoneyCatModel;
        public static get instance(): MoneyCatModel {
            return this._instance = this._instance || new MoneyCatModel();
        }

        private _state:boolean;     //护符激活状态
        public get state():boolean{
            return this._state;
        }

        private _actived:number;        //未激活将返回-1
        public get actived():number{
            return this._actived;
        }

        private _canActived:number;
        public get canActived():number{
            return this._canActived;
        }

        //仙猫状态更新
        public updateMoneyCatState(state:boolean):void{
            this._state=state;
            GlobalData.dispatcher.event(CommonEventType.MONEY_CAT_UPDATE);
            // console.log("猫状态更新: ",this._state);
        }

        //仙猫信息返回
        public getMoneyCatInfoReply(value:GetMoneyCatInfoReply):void{
            this._actived=value[GetMoneyCatInfoReplyFields.activated_era];
            this._canActived=value[GetMoneyCatInfoReplyFields.unactive_era];
            //红点
            if(this._actived!=-1 && this._actived<this._canActived){
                RedPointCtrl.instance.setRPProperty("moneyCatRP", true);
            }
            else{RedPointCtrl.instance.setRPProperty("moneyCatRP", false);}
            if(MoneyCatModel.instance.state && this._actived==-1){
                RedPointCtrl.instance.setRPProperty("moneyCatBuyRP", true);
            }
            else{
                RedPointCtrl.instance.setRPProperty("moneyCatBuyRP", false);
            }
            GlobalData.dispatcher.event(CommonEventType.MONEY_CAT_UPDATE);
            //调试输出
            // console.log("已激活的猫: ",this._actived);
            // console.log("未激活的猫: ",this._canActived);
        }
    }
}