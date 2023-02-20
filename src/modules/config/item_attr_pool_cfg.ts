/** 道具属性配置*/


namespace modules.config {
    import equip_attr_pool = Configuration.equip_attr_pool;
    import equip_attr_poolFields = Configuration.equip_attr_poolFields;

    export class ItemAttrPoolCfg {
        private static _instance: ItemAttrPoolCfg;
        public static get instance(): ItemAttrPoolCfg {
            return this._instance = this._instance || new ItemAttrPoolCfg();
        }

        private _table: Table<equip_attr_pool>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("item_attr_pool");
        }

        // 根据ID获取配置
        public getCfgById(attrId: int): equip_attr_pool {
            return this._table[attrId];
        }
    }
}