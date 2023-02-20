namespace modules.config {

    import jzduobao_weight = Configuration.jzduobao_weight;
    import jzduobao_weightFields = Configuration.jzduobao_weightFields;
    import JzduobaoNode = Configuration.JzduobaoNode;
    import JzduobaoNodeFields = Configuration.JzduobaoNodeFields;
    import Items = Configuration.Items;
    import blendFields = Configuration.blendFields;
    export class JzDuobaoWeightCfg {
        private static _instance: JzDuobaoWeightCfg;
        public static get instance(): JzDuobaoWeightCfg {
            return this._instance = this._instance || new JzDuobaoWeightCfg();
        }

        private _tab1: Table<Array<JzduobaoNode>>;
        private _Dates: Array<jzduobao_weight>;
        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._Dates = new Array<jzduobao_weight>();
            this._Dates = GlobalData.getConfig("jzduobao_weight");
            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                if (element) {
                    let min: number = element[jzduobao_weightFields.grade][0];
                    let max: number = element[jzduobao_weightFields.grade][1];
                    let weights = element[jzduobao_weightFields.weights];
                    let showItem = element[jzduobao_weightFields.showItem];
                    for (let index1 = min; index1 <= max; index1++) {
                        if (!this._tab1[index1]) {
                            this._tab1[index1] = new Array<JzduobaoNode>();
                        }
                        this._tab1[index1] = weights;
                    }
                }

            }
        }

        public get oneMoney(): int {
            let _money = BlendCfg.instance.getCfgById(41003)[blendFields.intParam][0];
            return _money;
        }

        public get tenMoney(): int {
            let _money = BlendCfg.instance.getCfgById(41003)[blendFields.intParam][1];
            return _money;
        }
        /**
         *根据次数 去取对应档次的奖励
         * @param cishu 
         */
        public getDate(cishu: number): Array<JzduobaoNode> {
            let dates = this._tab1[cishu];
            return dates;
        }
    }
}
