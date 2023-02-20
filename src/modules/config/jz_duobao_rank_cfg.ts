namespace modules.config {

    import jzduobao_rank = Configuration.jzduobao_rank;
    import jzduobao_rankFields = Configuration.jzduobao_rankFields;
    import Items = Configuration.Items;

    export class JzDuobaoRankCfg {
        private static _instance: JzDuobaoRankCfg;
        public static get instance(): JzDuobaoRankCfg {
            return this._instance = this._instance || new JzDuobaoRankCfg();
        }

        private _tab1: Table<Array<jzduobao_rank>>;
        private _tab2: Table<Array<jzduobao_rank>>;
        private _Dates: Array<jzduobao_rank>;
        private _Items: Table<Array<number>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._Items = {};
            this._Dates = new Array<jzduobao_rank>();
            this._Dates = GlobalData.getConfig("jzduobao_rank");
            for (let index = 0; index < this._Dates.length; index++) {
                let element: jzduobao_rank = this._Dates[index];
                if (element) {
                    let type = element[jzduobao_rankFields.rankType];
                    let grade = element[jzduobao_rankFields.grade];
                    if (!this._tab1[type]) {
                        this._tab1[type] = new Array<jzduobao_rank>();
                    }
                    this._tab1[type][grade] = element;
                    let min: number = element[jzduobao_rankFields.gradeScope][0];
                    let max: number = element[jzduobao_rankFields.gradeScope][1];
                    let reward: Array<Items> = element[jzduobao_rankFields.reward];
                    for (let index = min; index <= max; index++) {
                        if (!this._Items[type]) {
                            this._Items[type] = new Array<number>();
                        }
                        this._Items[type][index] = grade;
                    }
                }
            }
        }

        public getLaet(rankType: number): jzduobao_rank {
            let dates = this._tab1[rankType];
            let shuju = dates[dates.length - 1];
            return shuju;
        }

        public getDate(type: number, grade: number): jzduobao_rank {
            let dates = this._tab1[type][grade];
            return dates;
        }

        public getGradeByRank(Type: number, rank: number): number {
            let grade = this._Items[Type][rank];
            return grade;
        }
    }
}
