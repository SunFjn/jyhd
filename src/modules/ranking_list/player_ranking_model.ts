namespace modules.rankingList {

    import Rank = Protocols.Rank;
    import RankFields = Protocols.RankFields;
    import GetRankReplyFields = Protocols.GetRankReplyFields;
    import RankList = Protocols.RankList;
    import GetRankReply = Protocols.GetRankReply;
    import RankListFields = Protocols.RankListFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    export class PlayerRankingModel {
        private static _instance: PlayerRankingModel;
        public rankShowRely: Protocols.GetActorRankShowReply;
        public RankData: Protocols.GetActorRankDataReply;

        public static get instance(): PlayerRankingModel {
            return this._instance = this._instance || new PlayerRankingModel();
        }

        // 排行榜类型table，key：排行榜类型，value:排行数据
        private _rankTypeTable: Table<Array<Rank>>;
        // 当前选中的排行榜类型
        private _selectedRankType: RankType;

        constructor() {
        }

        public get selectedRankType(): RankType {
            return this._selectedRankType;
        }

        public set selectedRankType(value: RankType) {
            this._selectedRankType = value;
        }

        public getRankReply(tuple: GetRankReply): void {
            if (!this._rankTypeTable) this._rankTypeTable = {};
            let arr: Array<RankList> = tuple[GetRankReplyFields.RankList];
            if (!arr) return;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._rankTypeTable[arr[i][RankListFields.type]] = arr[i][RankListFields.ranks];
            }
            GlobalData.dispatcher.event(CommonEventType.RANK_UPDATE);
        }

        // 根据类型获取排行
        public getRanksByType(type: RankType): Array<Rank> {
            return this._rankTypeTable[type];
        }
        /**
         * 获取名次信息 如果空表示该名次没有玩家
         * @param type 排行类型
         * @param mingCi 名次
         */
        public getRanksByTypeAndMingCi(type: RankType, mingCi: number): Rank {
            let _date = this._rankTypeTable[type];
            for (let index = 0; index < _date.length; index++) {
                let element = _date[index];
                if (element) {
                    if (element[RankFields.rank] == mingCi) {
                        return element;
                    }
                }
            }
            return null;
        }


        public getContison(type: number): number {
            let arrCon = BlendCfg.instance.getCfgById(403)[blendFields.intParam];
            for (let index = 0; index < arrCon.length; index++) {
                let element = arrCon[index];
                let xiaBiao = Math.pow(2, index);
                if (xiaBiao == type) {
                    return element;
                }
            }
            return 0;
        }
        public getActorRankShowRely(tuple: Protocols.GetActorRankShowReply): void {
            this.rankShowRely = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_ACTOR_RANK_SHOW_REPLY);
        }

        public getActorRankDataReply(tuple: Protocols.GetActorRankDataReply): void {
            this.RankData = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_ACTOR_RANK_DATA_REPLY);
        }

        public actorrank(rank: Array<Rank>, acId: number): [number, number]  //判断自己是否上榜和返回排行数据
        {
            for (let i: number = 0; i < rank.length; i++) {
                if (rank[i][Protocols.RankFields.objId] === acId) {
                    return [rank[i][Protocols.RankFields.rank], rank[i][Protocols.RankFields.param]];
                }
            }
            return [0, 0];
        }
    }
}