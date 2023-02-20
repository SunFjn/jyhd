namespace modules.config {
    import limit_xunbao_rank = Configuration.limit_xunbao_rank;
    import limit_xunbao_rankFields = Configuration.limit_xunbao_rankFields;
    enum activityType {
        fish = 1
    }
    enum rankType {
        own = 0,
        service = 1
    }
    export class LimitRankCfg {
        private static _instance: LimitRankCfg;
        public static get instance(): LimitRankCfg {
            return this._instance = this._instance || new LimitRankCfg();
        }
        private _rankCfg: Array<Array<Map<number, limit_xunbao_rank>>>;

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
    }
}