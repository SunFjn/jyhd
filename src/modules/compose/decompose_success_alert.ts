namespace modules.compose {
    import idCountFields = Configuration.idCountFields;
    import item_resolveFields = Configuration.item_resolveFields;
    import item_resolve = Configuration.item_resolve;
    import Point = laya.maths.Point;

    export class DecomposeSuccessAlert extends ui.ComposeSuccessAlertUI {
        constructor() {
            super();
        }

        private _itemCfg: item_resolve;
        private _itemId: number;
        private _itemArray: Array<ComposeItem>;
        private _pos: Point = new Point(576, 155);
        private _wid: number = 80;

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._itemCfg = value[0];
            this._itemId = this._itemCfg[item_resolveFields.itemId];
            let arr = this._itemCfg[item_resolveFields.resolveItems];
            let len = arr.length;
            for (let i = 0; i < 4; i++) {
                let baseItem = this._itemArray[i];
                if (i < len) {
                    let itemId = arr[i][idCountFields.id];
                    baseItem.setData(itemId);
                    baseItem.setNum((value[1] * arr[i][idCountFields.count]).toString(), "#ffffff");
                    let width = this._wid * len + 13 * (len - 1);
                    baseItem.pos(this._pos.x / 2 - width / 2 + i * 93, this._pos.y);
                    baseItem.visible = true;
                } else {
                    baseItem.visible = false;
                }
            }
        }

        private createItem() {
            for (let i = 0; i < 4; i++) {
                let baseItem = new ComposeItem();
                baseItem.scale(0.8, 0.8);
                baseItem.visible = false;
                baseItem.nameVisible = true;
                this.addChild(baseItem);
                this._itemArray.push(baseItem);
            }
        }

        protected initialize(): void {
            super.initialize();
            this.dialogName.text = "分解成功";
            this._itemArray = new Array<ComposeItem>();
            this.createItem();
        }

        public close(): void {
            super.close();
        }
    }
}