namespace modules.compose {

    import item_compose = Configuration.item_compose;
    import item_composeFields = Configuration.item_composeFields;


    export class ComposeEquipItem extends ui.ComposeEquipItemUI {
        private _nameArray: Array<string>;
        // private _item: ComposeItem;
        private _itemId: number;

        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();
            this.itemBtn.selected = true;
            this._nameArray = ["幻武", "头肩", "上衣", "下装", "鞋子", "腰带", "项链", "手镯", "戒指", "魔法石"];
            // this._item = new ComposeItem();
            // this._item.needTip = false;
            // this._item.scale(0.8, 0.8);
            // this._item.pos(5, 5);
            // this.addChild(this._item);
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg = value as item_compose;
            this._itemId = cfg[item_composeFields.itemId];
            // this._item.setData(this._itemId);
            let type = (this._itemId * 0.1 >> 0) % 100;
            this.typeLabel.text = this._nameArray[type - 1];

            let needId = cfg[item_composeFields.needItemId][0][0];
            let needNum = cfg[item_composeFields.needItemId][0][1];
            let count = ComposeModel.instance.setNum(needId);
            if (count >= needNum) {
                this.redDot.visible = true;
            } else {
                this.redDot.visible = false;
            }
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.itemBtn.selected = !value;
        }

        public close(): void {
            super.close();
        }
    }
}