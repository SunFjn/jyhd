/**掉落狂欢-控制器*/
namespace modules.drop_carnival {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    import GetDropCarnivalInfoReply = Protocols.GetDropCarnivalInfoReply;


    export class DropCarnivalCtrl extends BaseCtrl {
        private static _instance: DropCarnivalCtrl;

        public static get instance(): DropCarnivalCtrl {
            return this._instance = this._instance || new DropCarnivalCtrl();
        }
        constructor() {
            super();
        }
        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetDropCarnivalInfoReply, this, this.GetCeremonyContinuepayInfoReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.GetDropCarnivalInfo();   
        }

        /*获取数据*/
        private GetDropCarnivalInfo() {
            Channel.instance.publish(UserFeatureOpcode.GetDropCarnivalInfo, null);
        }
        /*返回数据*/
        private GetCeremonyContinuepayInfoReply(tuple: GetDropCarnivalInfoReply) {
            DropCarnivalModel.instance.updateInfo(tuple);
        }


    }
}
