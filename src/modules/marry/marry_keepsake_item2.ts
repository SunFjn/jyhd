/** */

namespace modules.marry {
    import item_material = Configuration.item_material;
    import BagModel = modules.bag.BagModel; // 背包
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;
    export class MarryKeepsake2Item extends ui.MarryKeepsakeItem2UI {

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
            // this.numTxt.text = `${BagModel.instance.getItemCountById(value[0])}/${value[1]}`

            // this.numTxt.color = BagModel.instance.getItemCountById(value[0]) < value[1] ? "#C96300" : "#ffffff"
            this.numTxt.text = ''

            let colorStr = "#ff7462";

            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let currGold = attr[ActorBaseAttrFields.gold];

            let have = BagModel.instance.getItemCountById(value[0]);
            if ((value[0] == MoneyItemId.glod) && currGold > value[1]) {
                have = value[1]
            } else if (value[0] == MoneyItemId.glod) {
                have = currGold;
            }
            if (have < value[1]) {
                this.item1.setNum(`${have}/${value[1]}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this.item1.setNum(`${have}/${value[1]}`, colorStr);
            }
        }


        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}