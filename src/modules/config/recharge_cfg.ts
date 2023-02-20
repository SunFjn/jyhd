namespace modules.config {
    import recharge = Configuration.recharge;
    import rechargeFields = Configuration.rechargeFields;

    export class RechargeCfg {
        private static _instance: RechargeCfg;
        public static get instance(): RechargeCfg {
            return this._instance = this._instance || new RechargeCfg();
        }

        private _table: Table<recharge>;
        private _onSaleArr: Array<recharge>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._onSaleArr = new Array<Configuration.recharge>();
            let arrts: Array<Configuration.recharge> = GlobalData.getConfig("recharge");
            for (let i: number = 0, len: number = arrts.length; i < len; i++) {
                let cfg: Configuration.recharge = arrts[i];
                this._table[cfg[Configuration.rechargeFields.index]] = cfg;
                if (cfg[Configuration.rechargeFields.type] === 0) {
                    this._onSaleArr.push(cfg);
                }

            }

            this._onSaleArr.sort(this.sortFunc);

        }

        private sortFunc(a:recharge, b:recharge):number{
            return a[rechargeFields.sortId] - b[rechargeFields.sortId];
        }

        //根据档位获取配置信息
        public getRecharCfgByIndex(index: number): recharge {
            return this._table[index];
        }

        //获取所有的特卖档位
        public get onSaleArr(): Array<recharge> {
            return this._onSaleArr;
        }

        //

    }
}