namespace modules.Offline {

    export class OfflineModel {
        private static _instance: OfflineModel;
        public static get instance(): OfflineModel {
            return this._instance = this._instance || new OfflineModel();
        }

        //玩家离线收益
        public getOutline: Protocols.GetOutlineInfoReply;

        private constructor() {

        }

        //获取离线信息
        public getOutlineInfoReply(tuple: Protocols.GetOutlineInfoReply): void {
            this.getOutline = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_OUTLINE_INFO_REPLY);
        }

    }
}