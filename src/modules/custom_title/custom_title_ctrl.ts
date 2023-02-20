/**称号定制控制器 */
namespace modules.customtitle {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import GetCustomDesignationReply = Protocols.GetCustomDesignationReply;

    export class CustomTitleCtrl extends BaseCtrl {
        private static _instance: CustomTitleCtrl;

        public static get instance(): CustomTitleCtrl {
            return this._instance = this._instance || new CustomTitleCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            //状态返回
            Channel.instance.subscribe(SystemClientOpcode.GetCustomDesignationReply, this, this.getCustomDesignationReply);
            
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getInfo();   
        }

        private getInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.CustomDesignationRequest, null);
        }

        private getCustomDesignationReply(tuple: GetCustomDesignationReply) {
            CustomModel.instance.setStatusInfo(tuple);
        }
    }
}