/** 公众号*/

namespace modules.officialAccount{
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class OfficialAccountModel {
        private static _instance:OfficialAccountModel;
        public static get instance():OfficialAccountModel{
            return this._instance = this._instance || new OfficialAccountModel();
        }

        // 关注状态
        private _status:number = -1;
        constructor(){

        }

        // 关注状态
        public get status():number{
            return this._status;
        }
        public set status(value:number){
            this._status = value;
            RedPointCtrl.instance.setRPProperty("officialAccountRP", value === 0);
            GlobalData.dispatcher.event(CommonEventType.OFFICAL_ACCOUNT_STATUS_CHANGE);
        }
    }
}