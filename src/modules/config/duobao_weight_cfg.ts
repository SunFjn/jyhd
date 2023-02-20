namespace modules.config {

    import duobao_weight = Configuration.duobao_weight;
    import duobao_weightFields = Configuration.duobao_weightFields;

    export class DuobaoWeightCfg {
        private static _instance: DuobaoWeightCfg;
        public static get instance(): DuobaoWeightCfg {
            return this._instance = this._instance || new DuobaoWeightCfg();
        }

        private _tab1: Table<Array<duobao_weight>>;
        private _tab2: Table<Array<duobao_weight>>;
        private _Dates: Array<duobao_weight>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._tab2 = {};
            this._Dates = new Array<duobao_weight>();
            this._Dates = GlobalData.getConfig("duobao_weight");
            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                if (element) {
                    /*类型(类型#参数 类型:0开服天数(1-7) 1封神榜(1-5))*/
                    let typeDate = element[duobao_weightFields.type];
                    let type = typeDate[0];//类型
                    let day = typeDate[1];//天数
                    if (type == 0) {
                        if (!this._tab1[type]) {
                            this._tab1[type] = new Array<duobao_weight>();
                        }
                        this._tab1[type][day] = element;
                    } else if (type == 1) {
                        if (!this._tab2[type]) {
                            this._tab2[type] = new Array<duobao_weight>();
                        }
                        this._tab2[type][day] = element;
                    }
                }

            }
        }

        public get oneMoney(): int {
            let date = this._Dates[0];
            let _money = date[duobao_weightFields.onceGold];
            return _money;
        }

        public get tenMoney(): int {
            let date = this._Dates[0];
            let _money = date[duobao_weightFields.moreGold];
            return _money;
        }

        /**
         * 获取数据
         * @param type 类型
         * @param day 天数
         */
        public getDate(type: number, day: number): duobao_weight {
            if (type == 0) {
                let dates = this._tab1[type][day];
                return dates;
            } else if (type == 1) {
                let dates = this._tab2[type][day];
                return dates;
            }
        }
    }
}
