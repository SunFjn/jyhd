namespace modules.config {
    import limit_xunbao_exchange_cfg = Configuration.limit_xunbao_exchange_cfg;
    import limit_xunbao_exchange_cfgFields = Configuration.limit_xunbao_exchange_cfgFields;
    import Dictionary = laya.utils.Dictionary;
    import TableUtils = utils.TableUtils;

    export class FishCkCfg {
        private static _instance: FishCkCfg;
        public static get instance(): FishCkCfg {
            return this._instance = this._instance || new FishCkCfg();
        }
        private _exchangeTab: Table<limit_xunbao_exchange_cfg[]>;
        private _exchangeCfgTab: Dictionary;

        constructor() {
            this.init();
        }
        private init(): void {
            this._exchangeTab = {};
            this._exchangeCfgTab = new Dictionary();

            let cfgs: Array<limit_xunbao_exchange_cfg> = GlobalData.getConfig("limit_xunbao_exchange");
            for (let i = 0; i < cfgs.length; i++) {
                let exchangeCfg = cfgs[i];
                let type = exchangeCfg[limit_xunbao_exchange_cfgFields.type];
                if (this._exchangeTab[type] != null) {
                    this._exchangeTab[type].push(exchangeCfg);
                } else {
                    this._exchangeTab[type] = [exchangeCfg]
                }
                this._exchangeCfgTab.set(exchangeCfg[limit_xunbao_exchange_cfgFields.id], exchangeCfg);
            }

        }

        //根据道具唯一Id获取兑换配置
        public getCfgByitemId(itemId: number): limit_xunbao_exchange_cfg {
            return this._exchangeCfgTab.get(itemId);
        }

        //根据类型获取兑换配置;
        public getCfgsByType(type: number): Array<limit_xunbao_exchange_cfg> {
            let shuju: Array<limit_xunbao_exchange_cfg> = this._exchangeTab[type];
            if (shuju) {
                shuju.sort(this.shortWeightCfgs);
            }
            return shuju;
        }

        /**
         * short
         */
        public shortWeightCfgs(A: limit_xunbao_exchange_cfg, B: limit_xunbao_exchange_cfg): number {
            let indexA = A[limit_xunbao_exchange_cfgFields.sort];
            let indexB = B[limit_xunbao_exchange_cfgFields.sort];
            let returnNum = 1;
            indexA > indexB ? returnNum = -1 : returnNum = 1;
            return returnNum;
        }

        //获取兑换的所有类型
        public getExchangeType() {
            let typeArr: Array<number> = new Array<number>();
            let cfgArr = TableUtils.values(this._exchangeTab);
            for (let i = 0; i < cfgArr.length; i++) {
                let cfgs = cfgArr[i];
                let type = cfgs[0][limit_xunbao_exchange_cfgFields.type];
                typeArr.push(type);
            }
            return typeArr;
        }

    }
}