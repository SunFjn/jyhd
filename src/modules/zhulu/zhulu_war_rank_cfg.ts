/** 逐鹿战队排行（巅峰战 争夺战）奖励配置 */
namespace modules.config {

    import zhuluWarRankAward = Configuration.zhuluWarRankAward;
    import zhuluWarRankAwardFields = Configuration.zhuluWarRankAwardFields;

    export class ZhuLuWarRankCfg {
        private static _instance: ZhuLuWarRankCfg;
        public static get instance(): ZhuLuWarRankCfg {
            return this._instance = this._instance || new ZhuLuWarRankCfg();
        }

        private _tab: Table<zhuluWarRankAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<zhuluWarRankAward> = GlobalData.getConfig("zhulu_war_rank_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][zhuluWarRankAwardFields.id]] = arr[i];
            }
        }

        //根据类型获取f该类型的所有数据 1首领战 2巅峰战
        public getAllConfigByType(type: number): Array<zhuluWarRankAward> {

            let tab = [];

            for (const key in this._tab) {
                if (this._tab[key][zhuluWarRankAwardFields.type] == type) {
                    tab.push(this._tab[key]);
                }
            }

            return tab;
        }

    }
}