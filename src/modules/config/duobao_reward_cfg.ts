namespace modules.config {

    import duobao_reward = Configuration.duobao_reward;
    import duobao_rewardFields = Configuration.duobao_rewardFields;

    export class DuobaoRewardCfg {
        private static _instance: DuobaoRewardCfg;
        public static get instance(): DuobaoRewardCfg {
            return this._instance = this._instance || new DuobaoRewardCfg();
        }

        private _tab1: Table<Array<duobao_reward>>;
        private _tab2: Table<Array<duobao_reward>>;
        private _Dates: Array<duobao_reward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._tab2 = {};
            this._Dates = new Array<duobao_reward>();
            this._Dates = GlobalData.getConfig("duobao_reward");
            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                if (element) {
                    /*类型(类型#参数 类型:0开服天数(1-7) 1封神榜(1-5))*/
                    let typeDate = element[duobao_rewardFields.type];
                    let grade = element[duobao_rewardFields.grade];
                    let type = typeDate[0];//类型
                    let day = typeDate[1];//天数
                    if (type == 0) {
                        if (!this._tab1[day]) {
                            this._tab1[day] = new Array<duobao_reward>();
                        }
                        this._tab1[day].push(element);
                    } else if (type == 1) {
                        if (!this._tab2[day]) {
                            this._tab2[day] = new Array<duobao_reward>();
                        }
                        this._tab2[day].push(element);
                    }
                }
            }
        }

        /**
         * 获取数据
         * @param type 类型
         * @param day 天数
         * @param grade 档次
         */
        public getDate(type: number, day: number, grade: number): duobao_reward {
            if (type == 0) {
                let dates = this._tab1[day];
                let shuju = null;
                for (let index = 0; index < dates.length; index++) {
                    let element = dates[index];
                    if (element) {
                        if (element[duobao_rewardFields.id] == grade) {
                            shuju = element;
                            break;
                        }
                    }

                }
                return shuju;
            } else if (type == 1) {
                let dates = this._tab2[day];
                let shuju = null;
                for (let index = 0; index < dates.length; index++) {
                    let element = dates[index];
                    if (element) {
                        if (element[duobao_rewardFields.id] == grade) {
                            shuju = element;
                            break;
                        }
                    }

                }
                return shuju;
            }
        }

        public getDateArr(type: number, day: number): Array<duobao_reward> {
            if (type == 0) {
                let dates = this._tab1[day];
                return dates;
            } else if (type == 1) {
                let dates = this._tab2[day];
                return dates;
            }
        }
    }
}
