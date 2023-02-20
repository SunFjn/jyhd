/** 奇遇商店面板*/


namespace modules.adventure {
    import AdventureShopViewUI = ui.AdventureShopViewUI;
    import CustomList = modules.common.CustomList;

    export class AdventureShopPanel extends AdventureShopViewUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;
            this._list = new CustomList();
            this.addChildAt(this._list, 3);
            this._list.hCount = 2;
            this._list.spaceX = 4;
            this._list.spaceY = 4;
            this._list.pos(20, 135, true);
            this._list.size(688, 920);
            this._list.itemRender = AdventureShopItem;
            this._list.datas = AdventureExchangeCfg.instance.cfgs;

            this.icon.skin = modules.common.CommonUtil.getIconById(MoneyItemId.adventurePoint, true);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_POINT_UPDATE, this, this.updatePoint);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updatePoint();
        }

        destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

        private updatePoint(): void {
            let point: number = AdventureModel.instance.point || 0;
            this.pointTxt.text = point + "";
        }
    }
}