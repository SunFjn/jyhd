/** 绑定手机*/
namespace modules.bindPhone{
    export class BindPhoneModel{
        private static _instance:BindPhoneModel;
        public static get instance():BindPhoneModel{
            return this._instance = this._instance || new BindPhoneModel();
        }

        constructor(){

        }
    }
}