/*掉落狂欢数据模型*/
namespace modules.drop_carnival {

    import OneBuyReward = Protocols.OneBuyReward;
    import OneBuyRewardFields = Protocols.OneBuyRewardFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetDropCarnivalInfoReply = Protocols.GetDropCarnivalInfoReply;
    import GetDropCarnivalInfoReplyFields = Protocols.GetDropCarnivalInfoReplyFields;

    export class DropCarnivalModel {
        private _endTim: number;
        private static _instance: DropCarnivalModel;
        public static get instance(): DropCarnivalModel {
            return this._instance = this._instance || new DropCarnivalModel();
        }
        private constructor() {
            this._endTim = 0;
        }

        private _state: number;     //一秒激活状态
        public get state(): number {
            return this._state;
        }

        public updateInfo(tuple: GetDropCarnivalInfoReply) {
            this._endTim = tuple[GetDropCarnivalInfoReplyFields.endTm];
            // console.log("倒计时：", this._endTim);

            GlobalData.dispatcher.event(CommonEventType.OS_DOUBLE_DROP_ENDTIME_UPDATE);
        }


        public get endTim(): number {
            return this._endTim;
        }
    }
}