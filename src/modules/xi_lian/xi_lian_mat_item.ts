/** 洗炼材料选择单元项*/


namespace modules.xiLian {
    import XiLianMatItemUI = ui.XiLianMatItemUI;
    import BagModel = modules.bag.BagModel;
    import item_material = Configuration.item_material;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;

    export class XiLianMatItem extends XiLianMatItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.item.mouseEnabled = false;
        }

        public setData(itemId: number): void {
            this.item.dataSource = [itemId, BagModel.instance.getItemCountById(itemId), 0, null];
            let cfg: item_material = ItemMaterialCfg.instance.getItemCfgById(itemId);
            this.nameTxt.text = cfg[item_materialFields.name];
            let quality: int = CommonUtil.getItemQualityById(itemId);
            this.nameTxt.color = this.qualityTxt.color = CommonUtil.getColorByQuality(quality);
            this.qualityTxt.text = quality === 4 ? "橙色" : "红色";
        }
    }
}