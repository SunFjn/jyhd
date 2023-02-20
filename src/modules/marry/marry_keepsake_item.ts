/** */

namespace modules.marry {
    import item_material = Configuration.item_material;
    export class MarryKeepsakeItem extends ui.MarryKeepsakeItemUI {

        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.item1.frameImg.visible = false;

        }
        protected addListeners(): void {
            super.addListeners();

        }
        public onOpened(): void {
            super.onOpened();

        }
        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.item1.frameImg.visible = value;
        }
        protected setData(value: any): void {
            super.setData(value);

            let itemId = value[0]
            let lv = value[1]
            let type = value[2]

            this.item1.dataSource = [itemId, 0, 0, null]
            this.item1.nameVisible = false;
            this.item1.needTip = false;
            this.item1.setClip(false);
            this.nameTxt.color = CommonUtil.getColorById(itemId)
            let itemCfg: item_material = CommonUtil.getItemCfgById(itemId) as item_material;
            this.nameTxt.text = itemCfg[1]
            if (lv == 0) {
                this.wayTxt.text = '未激活'
            } else {
                this.wayTxt.text = type == 1 ? lv + "级" : lv + "阶"

            }
            this.item1._icon.gray = lv <= 0
            this.item1._qualityBg.gray = lv <= 0
        }

        public setRP(value) {
            this.item1.rpImg.visible = value
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }

    }
}