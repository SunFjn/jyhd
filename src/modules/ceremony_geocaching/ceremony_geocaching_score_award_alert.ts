namespace modules.ceremony_geocaching {
    import CustomList = modules.common.CustomList;

    export class CeremonyGeocachingScoreAwardAlert extends ui.CeremonyGeocachingScoreAwardAlertUI {
        protected _list: CustomList;

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
            this._list.width = 589;
            this._list.height = 725;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.itemRender = CeremonyGeocachingScoreAwardItem;
            this._list.x = 45;
            this._list.y = 120;
            this.addChild(this._list);
        }
        public onOpened(): void {
            super.onOpened();
            this.updateView();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_MYLIST, this, this.updateView);
        }

        protected updateView() {
            this._list.datas = CeremonyGeocachingModel.instance.getScoreAwardList();
        }

    }
}