/** 仙石配置*/


namespace modules.config {
    import item_stone = Configuration.item_stone;
    import item_stoneFields = Configuration.item_stoneFields;

    export class ItemStoneCfg {
        private static _instance: ItemStoneCfg;
        public static get instance(): ItemStoneCfg {
            return this._instance = this._instance || new ItemStoneCfg();
        }

        private _table: Table<item_stone>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("item_stone");
        }

        // 根据道具ID获取道具配置
        public getItemCfgById(itemId: number): item_stone {
            return this._table[itemId];
        }
    }
}