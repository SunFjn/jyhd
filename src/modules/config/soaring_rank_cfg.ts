/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import feisheng_rank = Configuration.feisheng_rank;
    import feisheng_rankFields = Configuration.feisheng_rankFields;
    import Items = Configuration.Items;

    export class SoaringRankCfg {
        private static _instance: SoaringRankCfg;
        public static get instance(): SoaringRankCfg {
            return this._instance = this._instance || new SoaringRankCfg();
        }

        private _tab: Table<Array<feisheng_rank>>;
        private _cfgs: feisheng_rank[];
        private _Items: Array<number>;

        private _typeGardeMingCi: Table<Array<number>>;//对应类型的 每个档次的 最后一名
        constructor() {
            this._Items = new Array<number>();
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._typeGardeMingCi = {};
            let arr: Array<feisheng_rank> = GlobalData.getConfig("feisheng_rank");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: feisheng_rank = arr[i];
                let type: number = cfg[feisheng_rankFields.type];
                let grade: number = cfg[feisheng_rankFields.grade];
                if (!this._tab[type]) {
                    this._tab[type] = [];
                }
                this._tab[type].push(arr[i]);
                let min: number = cfg[feisheng_rankFields.gradeScope][0];
                let max: number = cfg[feisheng_rankFields.gradeScope][1];
                let reward: Array<Items> = cfg[feisheng_rankFields.reward];
                for (let index = min; index <= max; index++) {
                    this._Items[index] = grade;
                }

                if (!this._typeGardeMingCi[type]) {
                    this._typeGardeMingCi[type] = new Array<number>();
                }
                this._typeGardeMingCi[type][grade] = max;
            }
        }

        // 根据类型获取配置数组
        public getCfgsByGrade(type: number, grade: number): feisheng_rank {
            return this._tab[type][grade];
        }
        public getMaxMingCiByGrade(type: number, grade: number): number {
            return this._typeGardeMingCi[type][grade];
        }
        // 配置数组
        public get cfgs(): feisheng_rank[] {
            return this._cfgs;
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
