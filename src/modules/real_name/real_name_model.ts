/** 实名认证*/

namespace modules.realName{
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class RealNameModel {
        private static _instance:RealNameModel;
        public static get instance():RealNameModel{
            return this._instance = this._instance || new RealNameModel();
        }

        // 实名认证状态
        private _status:number = -1;

        constructor(){

        }

        // 实名认证状态
        public get status():number{
            return this._status;
        }
        public set status(value:number){
            this._status = value;
            RedPointCtrl.instance.setRPProperty("realNameRP", value === 0);
            GlobalData.dispatcher.event(CommonEventType.REAL_NAME_STATUS_CHANGE);
        }
    }
}