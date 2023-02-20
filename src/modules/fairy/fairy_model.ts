/////<reference path="../$$.ts"/>
/** 仙女护送数据类 */
namespace modules.fairy {
    import BlendCfg = modules.config.BlendCfg;
    import GetFairyInfoReply = Protocols.GetFairyInfoReply;
    import GetFairyInfoReplyFields = Protocols.GetFairyInfoReplyFields;
    import FairyEscore = Protocols.FairyEscore;

    export class FairyModel {
        private static _instance: FairyModel;
        public static get instance(): FairyModel {
            return this._instance = this._instance || new FairyModel();
        }

        private _fairyId: number; //仙女id
        private _sendState: number; /*护送状态 0闲置，1护送中，2护送结束*/
        private _escort: number; //已经护送的次数
        private _intercept: number;//已拦截次数
        private _looting: number; //被拦截次数
        private _isDouble: boolean; //是否双倍
        private _endTime: number;  //护送结束时间戳
        private _per: number;  //结果百分比值
        private _escortList: Array<FairyEscore>; //玩家护送列表
        private _escortListFlags: Table<boolean>;
        private _logList: Array<Protocols.FairyLog>;  //日志列表
        private _currLookPlayerInfo: Protocols.UpdateOtherFairyInfo;

        public maxFairyNum: number;  //显示仙女上限

        private constructor() {

            this.maxFairyNum = BlendCfg.instance.getCfgById(31001)[Configuration.blendFields.intParam][0];

            this._logList = [];
            this._escortList = [];
            this._escortListFlags = {};
            this._escortList.length = this.maxFairyNum;

        }

        public getFairyInfoReply(tuple: GetFairyInfoReply): void {
            this._fairyId = tuple[GetFairyInfoReplyFields.id];
            this._sendState = tuple[GetFairyInfoReplyFields.state];
            this._escort = tuple[GetFairyInfoReplyFields.escort];
            this._intercept = tuple[GetFairyInfoReplyFields.intercept];
            this._looting = tuple[GetFairyInfoReplyFields.looting];
            this._isDouble = tuple[GetFairyInfoReplyFields.isDouble];
            this._endTime = tuple[GetFairyInfoReplyFields.endTime];
            this._per = tuple[GetFairyInfoReplyFields.per];

            GlobalData.dispatcher.event(CommonEventType.FAIRY_UPDATE);
            redPoint.RedPointCtrl.instance.setRPProperty("fairyRP", this._sendState == 2);
        }

        public getFairyLogReply(tuple: Protocols.GetFairyLogReply): void {
            this._logList = tuple[Protocols.GetFairyLogReplyFields.logList];
            GlobalData.dispatcher.event(CommonEventType.FAIRY_LOG_UPDATE);
        }

        public updateFairyLog(tuple: Protocols.UpdateFairyLog): void {
            this._logList.push(tuple[Protocols.UpdateFairyLogFields.log]);
            GlobalData.dispatcher.event(CommonEventType.FAIRY_LOG_UPDATE);
        }

        //数据下标对应显示对象下标  为空值代替
        public getFairyEscortListReply(tuple: Protocols.GetFairyEscortListReply): void {
            let list: Array<FairyEscore> = tuple[Protocols.GetFairyEscortListReplyFields.escortList];
            for (let i: int = 0, len: int = list.length; i < len; i++) {
                let playerId: number = list[i][Protocols.FairyEscoreFields.agentId];
                if (!this._escortListFlags[playerId]) { //不存在
                    this._escortListFlags[playerId] = true;
                    for (let j: int = 0; j < this._escortList.length; j++) {
                        if (this._escortList[j] == null) {
                            // console.log(`新添加的玩家为---${list[i][Protocols.FairyEscoreFields.name]}`);
                            this._escortList[j] = list[i];
                            break;
                        }
                    }
                }
            }
            GlobalData.dispatcher.event(CommonEventType.FAIRY_UPDATE);
        }

        public updateOtherFairyInfo(tuple: Protocols.UpdateOtherFairyInfo): void {
            this._currLookPlayerInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.CURR_LOOK_PLAYER_UPDATE);
        }

        public get fairyId(): number {
            if (!this._fairyId) {
                return 1;
            }
            return this._fairyId;
        }

        public get currLookPlayerInfo(): Protocols.UpdateOtherFairyInfo {
            return this._currLookPlayerInfo;
        }

        public get sendState(): number {
            return this._sendState;
        }

        public get per(): number {
            return this._per;
        }

        public get escortListFlags(): Table<boolean> {
            return this._escortListFlags;
        }

        public initeEscortListFlags(): void {
            this._escortListFlags = {};
        }

        public get escort(): number {
            return this._escort;
        }

        public get endTime(): number {
            return this._endTime;
        }

        public get intercept(): number {
            return this._intercept;
        }

        public get looting(): number {
            return this._looting;
        }

        public get isDouble(): boolean {
            return this._isDouble;
        }

        public get logList(): Array<Protocols.FairyLog> {
            return this._logList;
        }

        public initEscortList(): void {
            this._escortList = [];
            this._escortList.length = this.maxFairyNum;
        }

        public get escortList(): Array<FairyEscore> {
            return this._escortList;
        }

        public formatDate(timestamp: number): string {
            let date = new Date(timestamp);
            let month: number = date.getMonth();
            let day: number = date.getDate();
            let hour: number = date.getHours();
            let minute: number = date.getMinutes();
            let minuteStr: string;
            if (minute < 10) {
                minuteStr = `0` + minute;
            } else {
                minuteStr = minute.toString();
            }
            return `${month + 1}-${day}  ${hour}:${minuteStr}`;
        }
    }
}