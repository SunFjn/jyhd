/**称号定制数据 */
namespace modules.customtitle {

    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import PrivilegeData = Protocols.PrivilegeData;

    import GetCustomDesignationReply = Protocols.GetCustomDesignationReply;
    import GetCustomDesignationReplyFields = Protocols.GetCustomDesignationReplyFields;

    export class CustomModel {

        private static _instance: CustomModel;
        public static get instance(): CustomModel {
            return this._instance = this._instance || new CustomModel();
        }

        private _statusInfo: GetCustomDesignationReply;

        constructor() {

        }


        public getStatusInfo(): GetCustomDesignationReply {

            return this._statusInfo;
        }

        public setStatusInfo(tuple: GetCustomDesignationReply): void {
            this._statusInfo = tuple;
            this.checkAchievementRP();
            GlobalData.dispatcher.event(CommonEventType.CUSTOM_TITILE_UPDATE);
        }

        //检测红点
        private checkAchievementRP(): void {
            RedPointCtrl.instance.setRPProperty("customTitleRP", this._statusInfo[GetCustomDesignationReplyFields.getState] == 1);
        }
    }
}
