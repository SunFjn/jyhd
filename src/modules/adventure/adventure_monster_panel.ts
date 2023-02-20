/** 奇遇探索副本面板*/


namespace modules.adventure {
    import AdventureMonsterViewUI = ui.AdventureMonsterViewUI;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;
    import ListWithArrowCtrl = modules.common.ListWithArrowCtrl;

    export class AdventureMonsterPanel extends AdventureMonsterViewUI {
        private _list: CustomList;
        private _arrowCtrl: ListWithArrowCtrl;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.bottom = 232;
            this.closeByOthers = false;

            this._list = new CustomList();
            this._list.vCount = 1;
            this._list.spaceX = 10;
            this._list.pos(92, 90, true);
            this._list.size(400, 100);
            this._list.scale(0.8, 0.8, true);
            this._list.scrollDir = 2;
            this.addChild(this._list);
            this._list.itemRender = BaseItem;

            this._arrowCtrl = new ListWithArrowCtrl(this._list, this.preBtn, this.nextBtn);
            this._arrowCtrl.scrollDis = 400;
        }

        protected addListeners(): void {
            super.addListeners();
            this._arrowCtrl.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_DROP_ITEMS_UPDATE, this, this.updateDropItems);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._arrowCtrl.removeListeners();
        }

        close(): void {
            super.close();
            this._list.datas = null;
        }

        private updateDropItems(): void {
            let dropItems: Array<Item> = AdventureModel.instance.dropItems;
            if (dropItems.length === 0) return;
            let pos: number = this._list.scrollPos;
            this._list.datas = dropItems;
            this._list.scrollPos = pos;
        }

        public destroy(destroyChild: boolean = true): void {
            this._arrowCtrl = this.destroyElement(this._arrowCtrl);
            this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }
    }
}