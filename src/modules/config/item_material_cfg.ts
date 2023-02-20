/** 道具（材料）配置*/


namespace modules.config {
    import item_material = Configuration.item_material;
    import blendFields = Configuration.blendFields;

    export class ItemMaterialCfg {
        private static _instance: ItemMaterialCfg;
        public static get instance(): ItemMaterialCfg {
            return this._instance = this._instance || new ItemMaterialCfg();
        }

        private _table: Table<item_material>;
        private _speedItemIds: number[];  //加速卡道具

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("item_material");
            this._speedItemIds = BlendCfg.instance.getCfgById(36044)[blendFields.intParam];
        }

        // 根据道具ID获取道具配置
        public getItemCfgById(itemId: int): item_material {
            return this._table[itemId];
        }

        public get speedItemIds(): number[] {
            return this._speedItemIds;
        }
    }
}