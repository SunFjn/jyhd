namespace modules.config {
    import limit_mall_cfg = Configuration.limit_mall_cfg;
    import limit_mall_cfgFields = Configuration.limit_mall_cfgFields;

    export class LimitMallCfg {
        private _tab: Array<Array<Array<limit_mall_cfg>>>;
        private getTab: Array<limit_mall_cfg>;
        private static _instance: LimitMallCfg;
        public static get instance(): LimitMallCfg {
            return this._instance = this._instance || new LimitMallCfg();
        }

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = [];
            let arr: Array<limit_mall_cfg> = GlobalData.getConfig("limit_xunbao_mall");
            this.getTab = arr;
            for (let e of arr) {
                let id: number = e[limit_mall_cfgFields.id];
                let type: number = e[limit_mall_cfgFields.type];
                let childMallType: number = e[limit_mall_cfgFields.childMallType];

                if (typeof this._tab[type] == "undefined") {
                    this._tab[type] = [];
                }
                if (typeof this._tab[type][childMallType] == "undefined") {
                    this._tab[type][childMallType] = [];
                }
                this._tab[type][childMallType][id] = e;
            }
        }

        public getCfgByType(type: number, childType:number): Array<limit_mall_cfg> {
            return this._tab[type][childType];
        }

        public getSortCfgByType(type: number, childType:number): Array<limit_mall_cfg> {

            let malls = this._tab[type][childType];
            let dates = new Array<limit_mall_cfg>();
            for (let index = 0; index < malls.length; index++) {
                let element = malls[index];
                if (element) {
                    dates.push(element);
                }
            }
            return dates.sort(modules.store.StoreModel.instance.sortFunc.bind(this));

        }

    }
}