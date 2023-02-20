///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
//
//
/** 背包道具单元项*/


namespace modules.treasure {
    import BaseItem = modules.bag.BaseItem;
    import Image = laya.ui.Image;
    import Item = Protocols.Item;

    export class TreasureItem extends BaseItem {

        public _select: boolean;
        public _itemId: number;
        private _selectImg: Image;
        public _cfg: Item;

        protected initialize(): void {
            super.initialize();

            this.needTip = false;
            this._select = false;
            this._selectImg = new Image();
            this._selectImg.skin = "common/image_common_dg.png";
            this._selectImg.pos(13, 15);

            this._selectImg.visible = true;
            this.addChild(this._selectImg);

            this.nameVisible = true;
        }

        protected setDataSource(value: Protocols.Item) {
            super.setDataSource(value);
            this._nameTxt.y = 103;
            this._nameTxt.fontSize = 15;
            this._cfg = value;
            if (this._cfg == null) {
                this._select = false;
                this._selectImg.visible = false;
            } else {
                let arr: Array<Item> = TreasureModel.instance.selectItem;
                let i = arr.indexOf(this._cfg);
                if (arr.indexOf(this._cfg) >= 0) {
                    this._select = true;
                    this._selectImg.visible = true;
                } else {
                    this._select = false;
                    this._selectImg.visible = false;
                }
            }
        }

        protected clickHandler(): void {
            super.clickHandler();
            if (this._cfg == null) return;
            let arr: Array<Item> = TreasureModel.instance.selectItem;
            if (this._select == false) {
                this._select = true;
                this._selectImg.visible = true;
                arr.push(this._cfg);
                TreasureModel.instance.selectItem = arr;
            } else {
                this._select = false;
                this._selectImg.visible = false;
                let index = arr.indexOf(this._cfg);
                arr.splice(index, 1);
                TreasureModel.instance.selectItem = arr;
            }
        }

        public destroy(): void {
            this._selectImg = this.destroyElement(this._selectImg);
            super.destroy(true);
        }
    }
}