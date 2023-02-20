namespace modules.config {


    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;

    export class StoreCfg {

        private static _instance: StoreCfg;

        public static get instance(): StoreCfg {
            return this._instance = this._instance || new StoreCfg();
        }

        private _mallTab: Table<mall[]>;
        private _table: Table<Configuration.mall>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._mallTab = {};
            this._table = {};
            // this._mallArr=new Array<mall>();


            let cfgs: Array<mall> = GlobalData.getConfig("mall");
            for (let i: number = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                let type = cfg[mallFields.mallType];
                if (this._mallTab[type] != null) {
                    this._mallTab[type].push(cfg);
                } else {
                    this._mallTab[type] = [cfg];
                }
                this._table[cfg[Configuration.mallFields.id]] = cfg;
                // this._typeDic.set(cfgs[i][mallFields.mallType], cfgs[i]);
            }
        }

        public getTypeStoreCfgByChildType(type: number, childType: number): Array<mall> {
            let t: Table<mall[]> = {};
            let cfgs: Array<mall> = this._mallTab[type];
            if (cfgs == null) return new Array<mall>(0);
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                let cType = cfg[mallFields.childMallType];
                if (t[cType] != null) {
                    t[cType].push(cfg);
                } else {
                    t[cType] = [cfg];
                }
            }
            return t[childType] ? t[childType] : new Array<mall>(0);
        }

        //根据道具唯一Id获取商城配置
        public getCfgByitemId(itemId: number): Configuration.mall {
            return this._table[itemId];
        }
    }
}