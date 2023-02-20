/** 熔炉配置*/


namespace modules.config {
    import item_smelt = Configuration.item_smelt;
    import item_smeltFields = Configuration.item_smeltFields;

    export class ItemSmeltCfg {
        private static _instance: ItemSmeltCfg;
        public static get instance(): ItemSmeltCfg {
            return this._instance = this._instance || new ItemSmeltCfg();
        }

        private _table: Table<item_smelt>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<item_smelt> = GlobalData.getConfig("item_smelt");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let material: item_smelt = arr[i];
                this._table[material[item_smeltFields.level]] = material;
            }
        }

        // 根据熔炉等级获取熔炼配置
        public getItemCfgByLevel(level: int): item_smelt {
            return this._table[level];
        }
    }
}