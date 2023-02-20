namespace modules.dishu {
    import di_shu_cfg = Configuration.di_shu_cfg;
    import di_shu_cfgFields = Configuration.di_shu_cfgFields;
    import di_shu_main_cfgFields = Configuration.di_shu_main_cfgFields;
    import di_shu_main_cfg = Configuration.di_shu_main_cfg;
    import di_shu_rank_cfgFields = Configuration.di_shu_rank_cfgFields;
    import di_shu_rank_cfg = Configuration.di_shu_rank_cfg;
    import di_shu_task_cfgFields = Configuration.di_shu_task_cfgFields;
    import di_shu_task_cfg = Configuration.di_shu_task_cfg;
    import Items = Configuration.Items;

    const enum rank_cfgFields {
        RankingStart = 0,    // 排行奖励开始id = 
        RankingEnd = 1,  // 排行奖励结束id = 
        TaskCondition = 2,   // 上榜条件
        RankingAwds = 3, // 排行奖励
    }
    type rank_cfg = [number, number, number, Array<Items>]

    export class DishuCfg {

        private static _instance: DishuCfg;
        public static get instance(): DishuCfg {
            return this._instance = this._instance || new DishuCfg();
        }
        constructor() {
            this.init();
        }

        private _dishu: Array<di_shu_main_cfg>   // 地鼠
        private _task: Array<Array<di_shu_task_cfg>>  // 奖励
        private _rank: Array<di_shu_rank_cfg>   // 排行

        private init(): void {
            let arr: Array<di_shu_cfg> = GlobalData.getConfig("di_shu");
            this._dishu = [];
            this._rank = [];
            let _rank = [];
            this._task = [];
            this._rank = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][di_shu_cfgFields.Level] != "") {
                    let _level = [];
                    if (arr[i][di_shu_cfgFields.Level].indexOf("#") > -1) {
                        _level = arr[i][di_shu_cfgFields.Level].split("#");
                    }
                    this._dishu.push([_level, arr[i][di_shu_cfgFields.ItemList], arr[i][di_shu_cfgFields.Row], arr[i][di_shu_cfgFields.Ultimate], arr[i][di_shu_cfgFields.OpenCount]]);
                }
                if (arr[i][di_shu_cfgFields.RankingStart] != 0) {
                    _rank.push([arr[i][di_shu_cfgFields.RankingStart], arr[i][di_shu_cfgFields.RankingEnd], arr[i][di_shu_cfgFields.TaskCondition], arr[i][di_shu_cfgFields.RankingAwds]]);
                }
                if (arr[i][di_shu_cfgFields.TaskType] != 0) {
                    if (typeof this._task[arr[i][di_shu_cfgFields.TaskType]] == "undefined") {
                        this._task[arr[i][di_shu_cfgFields.TaskType]] = [];
                    }
                    this._task[arr[i][di_shu_cfgFields.TaskType]].push([arr[i][di_shu_cfgFields.TaskType], arr[i][di_shu_cfgFields.Condition], arr[i][di_shu_cfgFields.TaskAwd]])
                }
            }

            for (let i = 0; i < _rank.length; i++) {
                if (_rank[i][rank_cfgFields.RankingStart] < _rank[i][rank_cfgFields.RankingEnd]) {
                    for (let ii = _rank[i][rank_cfgFields.RankingStart]; ii < _rank[i][rank_cfgFields.RankingEnd] + 1; ii++) {
                        this._rank.push([ii, _rank[i][rank_cfgFields.TaskCondition], _rank[i][rank_cfgFields.RankingAwds]]);
                    }
                } else {
                    this._rank.push([_rank[i][rank_cfgFields.RankingStart], _rank[i][rank_cfgFields.TaskCondition], _rank[i][rank_cfgFields.RankingAwds]]);
                }
            }
        }

        public getDishuByLevel(level: number): di_shu_main_cfg {
            for (let i = 0; i < this._dishu.length; i++) {
                if (level >= this._dishu[i][di_shu_main_cfgFields.Level][0] && level <= this._dishu[i][di_shu_main_cfgFields.Level][1]) {
                    return this._dishu[i];
                }
            }
        }

        public get task(): Array<Array<di_shu_task_cfg>> {
            return this._task;
        }

        public get rank(): Array<di_shu_rank_cfg> {
            return this._rank;
        }
    }
}