namespace modules.compose {

    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import item_composeFields = Configuration.item_composeFields;
    import item_compose = Configuration.item_compose;


    export class ComposeAddAlert extends ui.ComposeAddAlertUI {

        private _list: CustomList;
        private _showIds: Array<Item>;
        private _cfg: item_compose;

        protected initialize(): void {

            super.initialize();
            this._showIds = new Array<Item>();
            this._list = new CustomList();
            this._list.scale(0.7, 0.7);
            this._list.scrollDir = 1;
            this._list.itemRender = ComposeAddItem;
            this._list.spaceY = 3;
            this._list.width = 300;
            this._list.height = 300;
            this._list.hCount = 1;
            this._list.x = 25;
            this._list.y = 95;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.ADD_EQUIP, this, this.close);
            Laya.stage.on(Event.MOUSE_DOWN, this, this.stageClickHandler);
            this.deleteBtn.on(Event.MOUSE_DOWN, this, this.unloadHandler);
        }

        protected removeListeners(): void {
            GlobalData.dispatcher.off(CommonEventType.ADD_EQUIP, this, this.close);
            Laya.stage.off(Event.MOUSE_DOWN, this, this.stageClickHandler);
            this.deleteBtn.off(Event.MOUSE_DOWN, this, this.unloadHandler);
        }

        private unloadHandler(): void {
            let arr: Array<Item> = ComposeModel.instance.currEquipId;
            let pic = ComposeModel.instance.currEquipPic;
            arr[pic] = null;
            ComposeModel.instance.currEquipId = arr;
            GlobalData.dispatcher.event(CommonEventType.ADD_EQUIP);
        }

        private stageClickHandler(e: Event): void {
            if (!(e.target instanceof ComposeAddItem) && e.target !== this._list && e.target !== this) {
                this.close();
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value[0] == 0 || value[0] == 2 || value[0] == 3)
                this.pos(300, 383);
            else
                this.pos(105, 383);
            ComposeModel.instance.currEquipPic = value[0];
            this._cfg = value[1] as item_compose;
            this.updataBagValue(this._cfg);
        }

        public updataBagValue(cfg: item_compose): void {
            this._showIds = ComposeModel.instance.getEquip(cfg);
            if (this._showIds.length > 0) {
                this.updateText(false, cfg[item_composeFields.tips])
            } else {
                this.updateText(true, cfg[item_composeFields.tips])
            }
            this._list.datas = this._showIds;
        }

        private updateText(bool: boolean, tips: string): void {
            let html: string = "<span style='color:#fdfdff;font-size: 20px'>背包中缺少</span>";
            html += `<span style='color:#c96300;font-size: 20px'>${tips}</span>`;
            this.tipsText.innerHTML = html;
            this.tipsText.visible = bool;
        }

        public set showDelBtn(bool:boolean){
            this.deleteBtn.visible = bool;
            this.height = this.bgImg.height = bool? 401 : 325;
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}