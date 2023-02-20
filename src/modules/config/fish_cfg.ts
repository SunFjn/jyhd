namespace modules.fish {
    import limit_xunbao_rank = Configuration.limit_xunbao_rank;
    import limit_xunbao_rankFields = Configuration.limit_xunbao_rankFields;

    enum activityType {
        fish = 1
    }
    enum rankType {
        own = 0,
        service = 1
    }

    export class FishCfg {

        //活动类型 1钓鱼
        //排行类型(0个人 1区服)


        //第一层活动类型
        //第二层 个人 区服
        //第三层 排名索引 详细数据
        private _rankCfg: Array<Array<Map<number, limit_xunbao_rank>>>;


        private static _instance: FishCfg;
        public static get instance(): FishCfg {
            return this._instance = this._instance || new FishCfg();
        }
        constructor() {
            this.init();
        }

        private init(): void {
            this._rankCfg = [];
            let arr: Array<limit_xunbao_rank> = GlobalData.getConfig("limit_xunbao_rank");
            for (let e of arr) {
                let type = e[limit_xunbao_rankFields.type];
                let rankType = e[limit_xunbao_rankFields.rankType];
                let rank = e[limit_xunbao_rankFields.rank];
                if (!this._rankCfg[type]) this._rankCfg[type] = new Array<Map<number, limit_xunbao_rank>>();
                if (!this._rankCfg[type][rankType]) this._rankCfg[type][rankType] = new Map<number, limit_xunbao_rank>();
                this._rankCfg[type][rankType].set(rank, e);
            }
        }

        public getFishRankCfg(rank: number): limit_xunbao_rank {
            return this._rankCfg[activityType.fish][rankType.own].get(rank) || null;
        }
        public getFishRankSize(): number {
            return this._rankCfg[activityType.fish][rankType.own].size || 0;
        }

    }
}