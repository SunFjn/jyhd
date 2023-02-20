/** 获取途径配置*/


namespace modules.config {
    import tips = Configuration.tips;
    import tipsFields = Configuration.tipsFields;

    export class TipCfg {
        private static _instance: TipCfg;
        public static get instance(): TipCfg {
            return this._instance = this._instance || new TipCfg();
        }

        private _table: Array<tips>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = new Array<tips>();
            let shuju: Array<tips> = GlobalData.getConfig("tips");
            for (var index = 0; index < shuju.length; index++) {
                let element: tips = shuju[index];
                let type = element[tipsFields.type];
                this._table[type] = element;
            }
        }

        // 根据ID获取配置
        public getCfgByType(type: int): tips {
            return this._table[type];
        }
    }
}