namespace modules.compose {
    import Event = Laya.Event;
    import CommonUtil = modules.common.CommonUtil;
    import ItemFields = Protocols.ItemFields;
    import ComposeAddItemUI = ui.ComposeAddItemUI;
    import Item = Protocols.Item;
    import Image = laya.ui.Image;
    import item_equipFields = Configuration.item_equipFields;

    export class ComposeAddItem extends ComposeAddItemUI {
        private _item: ComposeItem;
        private _itemF: Item;
        public _starArray: Array<Image>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._item = new ComposeItem();
            this._item.mouseEnabled = false;
            this._item.pos(10, 8);
            this.addChild(this._item);
        }

        protected addListeners(): void {
            this.on(Event.CLICK, this, this.inlay);
        }

        protected removeListeners(): void {
            this.off(Event.CLICK, this, this.inlay);
        }

        private inlay(): void {
            //添加
            let arr: Array<Item> = ComposeModel.instance.currEquipId;
            let pic = ComposeModel.instance.currEquipPic;
            if (arr.length <= 5) {
                //     arr.push(this._itemF);
                // }else{
                arr[pic] = this._itemF;
            }
            ComposeModel.instance.currEquipId = arr;
            GlobalData.dispatcher.event(CommonEventType.ADD_EQUIP);
        }

        //初始化数据
        protected setData(value: Item): void {
            this._itemF = value;
            let itemId = value[ItemFields.ItemId];
            this._item.setData(itemId);
            let itemCfg = CommonUtil.getItemCfgById(itemId);
            if (!itemCfg) throw new Error("不存在的道具ID：" + itemId);
            this.nameText.text = itemCfg[item_equipFields.name].toString();
        }
    }
}