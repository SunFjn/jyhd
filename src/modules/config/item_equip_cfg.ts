/** 道具（装备）配置*/


namespace modules.config {
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;

    export class ItemEquipCfg {
        private static _instance: ItemEquipCfg;
        public static get instance(): ItemEquipCfg {
            return this._instance = this._instance || new ItemEquipCfg();
        }

        private _table: Table<item_equip>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("item_equip");
        }

        // 根据ID获取道具配置
        public getItemCfgById(itemId: number): item_equip {
            return this._table[itemId];
        }
    }
}