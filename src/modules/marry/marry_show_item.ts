/** */

namespace modules.marry {
    import item_material = Configuration.item_material;
    import BagModel = modules.bag.BagModel; // 背包
    export class MarryShowItem extends ui.MarryKeepsakeItem2UI {

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
            //this.item1.frameImg.visible = value;
        }
        protected setData(value: any): void {
            super.setData(value);
            this.item1.dataSource = [value[0], 0, 0, null]
            this.item1.nameVisible = false;
            // this.item1.needTip = false;
            //this.item1.setClip(false);
            this.numTxt.text = ``
            // this.numTxt.text = `${BagModel.instance.getItemCountById(value[0])}/${value[1]}`
            // this.numTxt.color = Number(value[0]) < Number(value[1]) ? "#ff0400" : "#ffffff"
        }


        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}