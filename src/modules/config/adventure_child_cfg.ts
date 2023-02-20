/** 奇遇子类配置*/


namespace modules.config {
    import adventure_child = Configuration.adventure_child;
    import adventure_childFields = Configuration.adventure_childFields;

    export class AdventureChildCfg {
        private static _instance: AdventureChildCfg;
        public static get instance(): AdventureChildCfg {
            return this._instance = this._instance || new AdventureChildCfg();
        }

        private _table: Table<adventure_child>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<adventure_child> = GlobalData.getConfig("adventure_child");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: adventure_child = arr[i];
                this._table[cfg[adventure_childFields.id]] = cfg;
            }
        }

        // 根据子类ID获取配置
        public getCfgById(id: number): adventure_child {
            return this._table[id];
        }
    }
}