/**获取物品弹窗 */


namespace modules.bag {
    import CustomList = modules.common.CustomList;

    export class BoxAwardAlert extends ui.BoxAwardAlertUI {

        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.spaceY = 10;
            this._list.spaceX = 10;
            this._list.height = 300;
            this._list.width = 650;
            this._list.hCount = 6;
            this._list.itemRender = BaseItem;
            this._list.scale(0.8, 0.8);
            this._list.x = 331 - 650 * 0.8 / 2;
            this._list.y = 134;
            this.addChild(this._list);

        }

        public setOpenParam(value: any): void {
            if (!value) {
                return;
            }
            this._list.datas = value[0];
            if (value.length > 1) this.titleTxt.text = value[1];
        }

        public onClosed(): void {
            super.onClosed();

        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
    }
}