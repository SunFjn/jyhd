namespace modules.rune {
    import RuneAllViewUI = ui.RuneAllAlertUI;
    import CustomList = modules.common.CustomList;

    export class RuneAllAlert extends RuneAllViewUI {

        private _list: CustomList;

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.width = 553;
            this._list.height = 605;
            this._list.hCount = 1;
            this._list.itemRender = RuneAllListPanel;
            this._list.x = 53;
            this._list.y = 116;
            this.addChild(this._list);

            let unlockLayerArr: number[] = config.ItemRuneCfg.instance.unlockLayerArr;
            this._list.datas = unlockLayerArr;
        }
    }
}