namespace modules.config {
    import limit_cumulate = Configuration.limit_cumulate;
    import limit_cumulativeField = Configuration.limit_cumulateFields;

    export class LimitCumulatePayCfg {
        private static _instance: LimitCumulatePayCfg;
        public static get instance(): LimitCumulatePayCfg {
            return this._instance = this._instance || new LimitCumulatePayCfg();
        }

        private _tab: Table<Array<limit_cumulate>>;
        private _cfgs: limit_cumulate[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<limit_cumulate> = GlobalData.getConfig("limit_xunbao_cumulate_pay");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: limit_cumulate = arr[i];
                let type: number = cfg[limit_cumulativeField.type];
                if (!this._tab[type]) {
                    this._tab[type] = [];
                }
                this._tab[type].push(arr[i]);
            }

        }

        // 根据大类获取配置数组
        public getCfgsByType(type: number): limit_cumulate[] {
            let shuju = this._tab[type];
            return shuju;
        }

    }
}