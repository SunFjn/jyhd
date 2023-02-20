/** buff属性*/


namespace modules.config {

    import attr_buff = Configuration.attr_buff;

    export class AttrBuffCfg {
        private static _instance: AttrBuffCfg;
        public static get instance(): AttrBuffCfg {
            return this._instance = this._instance || new AttrBuffCfg();
        }

        private _table: Table<attr_buff>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("attr_buff");
        }

        // 根据属性ID获取配置
        public getCfgById(attrId: number): attr_buff {
            return this._table[attrId];
        }
    }
}