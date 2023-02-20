///<reference path="../config/limit_rank_cfg.ts"/>
/**
 * 活动排行 数据
*/
namespace modules.limit {
    import LimitXunbaoRankInfoReply = Protocols.LimitXunbaoRankInfoReply;
    import LimitXunbaoRankInfoReplyFields = Protocols.LimitXunbaoRankInfoReplyFields;


    import LimitXunbaoRankInfo = Protocols.LimitXunbaoRankInfo;
    import LimitXunbaoRankInfoFields = Protocols.LimitXunbaoRankInfoFields;
    import GetLimitXunbaoInfoReply = Protocols.GetLimitXunbaoInfoReply;
    import GetLimitXunbaoInfoReplyFields = Protocols.GetLimitXunbaoInfoReplyFields;

    export class LimitRankModel {
        private _rankMax: number[];
        private _myRank: number[];
        public endTime_rank: number[];
        private _rankList: Array<LimitXunbaoRankInfo>[];

        private static _instance: LimitRankModel;
        public static get instance(): LimitRankModel {
            return this._instance = this._instance || new LimitRankModel();
        }

        constructor() {
            this._rankList = new Array<Array<LimitXunbaoRankInfo>>();
            this._rankMax = new Array()
            this._myRank = new Array()
            this.endTime_rank = new Array()
            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._rankList[LimitBigType.fish] = new Array<LimitXunbaoRankInfo>();
            this._rankMax[LimitBigType.fish] = 0;
            this._myRank[LimitBigType.fish] = -1
            this.endTime_rank[LimitBigType.fish] = 0;
        }

        public setRankInfo(tuple: LimitXunbaoRankInfoReply) {
            let bigType = tuple[LimitXunbaoRankInfoReplyFields.bigType]
            this.endTime_rank[bigType] = tuple[LimitXunbaoRankInfoReplyFields.endTime];

            let nodeList = tuple[LimitXunbaoRankInfoReplyFields.nodeList]
            let list = new Array<LimitXunbaoRankInfo>();
            for (const key in nodeList) {
                let rank = nodeList[key][LimitXunbaoRankInfoFields.rank]
                list[rank] = nodeList[key];
                if (rank > this._rankMax[bigType]) this._rankMax[bigType] = rank;
                if (nodeList[key][LimitXunbaoRankInfoFields.objId] == PlayerModel.instance.actorId) {
                    this._myRank[bigType] = rank;
                }
            }
            this._rankList[bigType] = list
            GlobalData.dispatcher.event(CommonEventType.LIMIT_RANKLIST_UPDATE);
        }

        public rankList(bigType: number): LimitXunbaoRankInfo[] {
            return this._rankList[bigType]
        }
        public rankMax(bigType: number): number {
            return this._rankMax[bigType] < 50 ? 50 : this._rankMax[bigType];
        }

        public myRank(bigType: number): number {
            return typeof this._myRank[bigType] == "undefined" ? -1 : this._myRank[bigType]
        }

    }
}