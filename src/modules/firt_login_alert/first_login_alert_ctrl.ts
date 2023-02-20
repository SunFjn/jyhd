///<reference path="../vip_new/vip_new_model.ts"/>
/**首登送VIP*/
import BaseCtrl = modules.core.BaseCtrl;
namespace  modules.first_login_alert{
    import BaseCtrl = modules.core.BaseCtrl;
    import VipNewModel = modules.vip_new.VipNewModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class FirstLoginAlertCtrl extends  BaseCtrl{
        private vipLevel : number = 0;
        private static _instance: FirstLoginAlertCtrl;
        public static get instance(): FirstLoginAlertCtrl {
            return this._instance = this._instance || new FirstLoginAlertCtrl();
        }
       // private _flag:boolean = false;
        constructor(){
            super();

        }

        public setup(): void {
            // this.vipLevel = VipNewModel.instance.vipLevel;
            GlobalData.dispatcher.on( CommonEventType.VIPF_UPDATE, this, this.updata);
           // console.log("-----------------this.VipNewModel.instance.vipLevel = " + VipNewModel.instance.vipLevel);
        }

        private updata(){
            if (VipNewModel.instance.vipLevel <51) {
                WindowManager.instance.openDialog(WindowEnum.FIRST_LOGIN_ALERT);
            }
            else{
                WindowManager.instance.close(WindowEnum.FIRST_LOGIN_ALERT);
            }
        }
    }
}