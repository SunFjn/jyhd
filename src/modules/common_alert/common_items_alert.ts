/** 通用道具弹框*/


namespace modules.commonAlert {
    import CommonItemsAlertUI = ui.CommonItemsAlertUI;
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import BagItem = modules.bag.BagItem;
    import ItemFields = Protocols.ItemFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import PackageCfg = modules.config.PackageCfg;
    import packageFields = Configuration.packageFields;
    import weightItem = Configuration.weightItem;
    import weightItemFields = Configuration.weightItemFields;
    import LayaEvent = modules.common.LayaEvent;

    export class CommonItemsAlert extends CommonItemsAlertUI {
        public _list: CustomList;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.spaceX = 20;
            this._list.vCount = 1;
            this._list.itemRender = BagItem;
            this._list.scrollDir = 2;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
        }

        public setOpenParam(value: [Array<Item>, string, boolean, string, boolean]): void {
            if (!value) {
                return;
            }
            let items: Array<Item> = [];
            let isShow: boolean = value[2];  //是否不展示具体礼包  不传值为null 展示
            let thisItems: Array<Item> = value[0] as Array<Item>;
            for (let i: int = 0, len: int = thisItems.length; i < len; i++) {
                let itemId: number = thisItems[i][ItemFields.ItemId];
                let itemType: int = CommonUtil.getItemTypeById(itemId);
                if (itemType == ItemMType.Giftbag && !isShow) {
                    let ids: number[] = ItemMaterialCfg.instance.getItemCfgById(itemId)[item_materialFields.fixGiftbag];
                    tag: for (let id of ids) {
                        let gifts: Array<weightItem> = PackageCfg.instance.getCfgById(id)[packageFields.items];
                        for (let data of gifts) {
                            let giftItemId: number = data[weightItemFields.itemId];
                            let itemCfg = CommonUtil.getItemCfgById(giftItemId);
                            if (!itemCfg) {
                                //此情况配的模糊id 要展示礼包
                                items.push([itemId, thisItems[i][ItemFields.count], 0, null]);
                                break tag;
                            }
                            items.push([giftItemId, data[weightItemFields.count], 0, null]);
                        }
                    }
                } else {
                    items.push([itemId, thisItems[i][ItemFields.count], 0, null]);
                }
            }

            this._list.size(items.length <= 4 ? items.length * 120 - 20 : 511, 140);
            this._list.pos(78 + (511 - this._list.width) * 0.5, 186, true);
            this._list.datas = items;
            if (value.length > 1) this.titleTxt.text = value[1];

            this.tipsText.text = value[3];
            this.tipsText.visible = !!value[3];
            this.sureBtn.visible = value[4];
        }
        //设置列表样式
        // public setList(type:number){//type == 0为激活码弹框
        //     if(type == 0){
        //         this._list.scrollDir = 1;
        //         this._list.hCount = 4;
        //         this._list.vCount = 3;
        //     }
        // }
        //设置文本样式
        // public setTipsText(show:boolean,text?:string){
        //     if(show){
        //         this.tipsText.visible = true;
        //         this.tipsText.text  = text;
        //     }else{
        //         this.tipsText.visible = false;
        //     }
        // }
        //设置按钮样式
        // public setSureBtn(show:boolean,text?:string){
        //     if(show){
        //         this.sureBtn.visible = true;
        //         this.sureBtn.label  = text;
        //     }else{
        //         this.sureBtn.visible = false;
        //     }
        // }
        //按钮点击回调
        private sureBtnHandler() {
            super.close();
        }
    }
}