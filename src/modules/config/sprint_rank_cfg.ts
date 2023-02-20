/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.sprint_rank {
    import sprint_rank = Configuration.sprint_rank;
    import sprint_rankFields = Configuration.sprint_rankFields;
    import Items = Configuration.Items;
    export class SprintRankCfg {
        private static _instance: SprintRankCfg;
        public static get instance(): SprintRankCfg {
            return this._instance = this._instance || new SprintRankCfg();
        }

        private _tab: Table<Array<sprint_rank>>;
        private _cfgs: sprint_rank[];
        private _Items: Array<number>;
        private _typeGardeMingCi: Table<Array<number>>;//对应类型的 每个档次的 最后一名
        constructor() {
            this._Items = new Array<number>();
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._typeGardeMingCi = {};
            let arr: Array<sprint_rank> = GlobalData.getConfig("sprint_rank");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: sprint_rank = arr[i];
                if (cfg) {
                    let type: number = cfg[sprint_rankFields.type];
                    let grade: number = cfg[sprint_rankFields.grade];
                    if (!this._tab[type]) {
                        this._tab[type] = [];
                    }
                    this._tab[type].push(arr[i]);
                    let min: number = cfg[sprint_rankFields.gradeScope][0];
                    let max: number = cfg[sprint_rankFields.gradeScope][1];
                    let reward: Array<Items> = cfg[sprint_rankFields.reward];
                    for (let index = min; index <= max; index++) {
                        this._Items[index] = grade;
                    }

                    if (!this._typeGardeMingCi[type]) {
                        this._typeGardeMingCi[type] = new Array<number>();
                    }
                    this._typeGardeMingCi[type][grade] = max;
                }
            }
        }

        // 根据类型获取配置数组
        public getCfgsByGrade(type: number, grade: number): sprint_rank {
            return this._tab[type][grade];
        }

        // 配置数组
        public get cfgs(): sprint_rank[] {
            return this._cfgs;
        }
        public getMaxMingCiByGrade(type: number, grade: number): number {
            return this._typeGardeMingCi[type][grade];
        }
        /**
      * 通过排名获取档次奖励
      */
        public getGradeByRank(rank: number): number {
            let grade = this._Items[rank];
            return grade;
        }
    }
}