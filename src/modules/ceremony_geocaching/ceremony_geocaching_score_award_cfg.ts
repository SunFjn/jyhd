/** 开服活动-庆典探索榜积分奖励榜*/
namespace modules.config {
    import ceremonyGeocachingScoreAward = Configuration.ceremonyGeocachingScoreAward;
    import ceremonyGeocachingScoreAwardFields = Configuration.ceremonyGeocachingScoreAwardFields;
    import Items = Configuration.Items;

    export class CeremonyGeocachingScoreAwardCfg {
        private static _instance: CeremonyGeocachingScoreAwardCfg;
        public static get instance(): CeremonyGeocachingScoreAwardCfg {
            return this._instance = this._instance || new CeremonyGeocachingScoreAwardCfg();
        }

        private _table: Table<ceremonyGeocachingScoreAward>;

        constructor() {
            this.init();
        }
        private init(): void {
            this._table = {};
            let array: Array<ceremonyGeocachingScoreAward> = GlobalData.getConfig("ceremony_geocaching_score_award");

            for (let index = 0; index < array.length; index++) {
                const cfg: ceremonyGeocachingScoreAward = array[index];
                const id: number = cfg[ceremonyGeocachingScoreAwardFields.taskId];
                this._table[id] = cfg;
            }


        }

        // 根据id获取任务
        public getTaskCfgByID(id: int): ceremonyGeocachingScoreAward {
            return this._table[id];
        }

        // 根据id获取任务档次的积分
        public getTaskScoreByID(id: int): number {
            let score: number;

            score = this._table[id][ceremonyGeocachingScoreAwardFields.condition];

            return score;
        }

        // 获取下一个任务的id
        public getNextID(id: int): number {

            let cfg = this._table[++id];

            if (cfg == null) id--;

            return id;
        }

    }
}