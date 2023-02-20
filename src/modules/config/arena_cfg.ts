/** 竞技场配置*/


namespace modules.arena {
    import arena = Configuration.arena;
    import arenaFields = Configuration.arenaFields;

    export class ArenaCfg {
        private static _instance: ArenaCfg;
        public static get instance(): ArenaCfg {
            return this._instance = this._instance || new ArenaCfg();
        }

        private _cfgs: Array<arena>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("arena");
        }

        // 根据排名获取对应排名段的配置
        public getCfgByRank(rank: int): arena {
            let cfg: arena;
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                cfg = this._cfgs[i];
                let rankArr: Array<number> = cfg[arenaFields.rank];
                if (rankArr.length === 1) {
                    if (rankArr[0] === rank) {
                        break;
                    }
                } else if (rankArr.length === 2) {
                    if (rank >= rankArr[0] && rank <= rankArr[1]) {
                        break;
                    }
                }
            }
            return cfg;
        }
    }
}
