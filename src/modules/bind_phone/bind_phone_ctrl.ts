/** 绑定手机*/
namespace modules.bindPhone{
    export class BindPhoneCtrl extends BaseCtrl{
        private static _instance:BindPhoneCtrl;
        public static get instance():BindPhoneCtrl{
            return this._instance = this._instance || new BindPhoneCtrl();
        }

        constructor(){
            super();
        }

        setup(): void {
        }
    }
}