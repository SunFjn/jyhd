namespace modules.config {

    import duobao_rank = Configuration.duobao_rank;
    import duobao_rankFields = Configuration.duobao_rankFields;
    import Items = Configuration.Items;

    export class DuobaoRankCfg {
        private static _instance: DuobaoRankCfg;
        public static get instance(): DuobaoRankCfg {
            return this._instance = this._instance || new DuobaoRankCfg();
        }

        private _tab1: Table<Array<duobao_rank>>;
        private _tab2: Table<Array<duobao_rank>>;
        private _Dates: Array<duobao_rank>;
        private _Items: Array<number>;
        private _Items1: Array<number>;

        constructor() {
            this._Items = new Array<number>();
            this._Items1 = new Array<number>();
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._tab2 = {};
            this._Dates = new Array<duobao_rank>();
            this._Dates = GlobalData.getConfig("duobao_rank");
            for (let index = 0; index < this._Dates.length; index++) {
                let element: duobao_rank = this._Dates[index];
                if (element) {
                    let rankType = element[duobao_rankFields.rankType];
                    if (rankType == 0) {
                        let type = element[duobao_rankFields.type];
                        let grade = element[duobao_rankFields.grade];
                        if (!this._tab1[type]) {
                            this._tab1[type] = new Array<duobao_rank>();
                        }
                        this._tab1[type][grade] = element;
                        let min: number = element[duobao_rankFields.gradeScope][0];
                        let max: number = element[duobao_rankFields.gradeScope][1];
                        let reward: Array<Items> = element[duobao_rankFields.reward];
                        for (let index = min; index <= max; index++) {
                            this._Items[index] = grade;
                        }
                    } else {
                        let type = element[duobao_rankFields.type];
                        let grade = element[duobao_rankFields.grade];
                        if (!this._tab2[type]) {
                            this._tab2[type] = new Array<duobao_rank>();
                        }
                        this._tab2[type][grade] = element;
                        let min: number = element[duobao_rankFields.gradeScope][0];
                        let max: number = element[duobao_rankFields.gradeScope][1];
                        let reward: Array<Items> = element[duobao_rankFields.reward];
                        for (let index = min; index <= max; index++) {
                            this._Items1[index] = grade;
                        }
                    }
                }


            }
        }

        /**
         * 获取最后一个档次
         */
        public getLaet(rankType: number, type: number): duobao_rank {
            if (rankType == 0) {
                let dates = this._tab1[type];
                let shuju = dates[dates.length - 1];
                return shuju;
            } else {
                let dates = this._tab2[type];
                let shuju = dates[dates.length - 1];
                return shuju;
            }

        }

        public getDate(rankType: number, type: number, grade: number): duobao_rank {
            if (rankType == 0) {
                let dates = this._tab1[type][grade];
                return dates;
            } else {
                let dates = this._tab2[type][grade];
                return dates;
            }
        }

        /**
         * 通过排名获取档次奖励
         */
        public getGradeByRank(rankType: number, rank: number): number {
            if (rankType == 0) {
                let grade = this._Items[rank];
                return grade;
            } else {
                let grade = this._Items1[rank];
                return grade;
            }

        }
    }
}
