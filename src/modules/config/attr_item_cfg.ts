/** 道具属性*/


namespace modules.config {

    import attr_item = Configuration.attr_item;

    export class AttrItemCfg {
        private static _instance: AttrItemCfg;
        public static get instance(): AttrItemCfg {
            return this._instance = this._instance || new AttrItemCfg();
        }

        private _table: Table<attr_item>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("attr_item");
        }

        // 根据属性ID获取配置
        public getCfgById(attrId: number): attr_item {
            return this._table[attrId];
        }
    }
}