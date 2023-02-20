/*九霄令领取到的奖励的弹窗*/
namespace modules.jiuxiaoling {
    import JiuXiaoLingGetedAwardAlertUI = ui.JiuXiaoLingGetedAwardAlertUI;

    import CustomList = modules.common.CustomList;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import Items = Configuration.Items;

    export class JiuXiaoLingGetedAwardAlert extends JiuXiaoLingGetedAwardAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.width = 575;
            this._list.height = 190;
            this._list.spaceX = 5;
            this._list.hCount = 5;
            this._list.itemRender = BaseItem;
            this._list.x = 70;
            this._list.y = 170;
            this._list.zOrder = 10;
            this._list.selectedIndex = -1;
            this.addChildAt(this._list, 1);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateShow();
        }

        private updateShow() {
            let datas = JiuXiaoLingModel.instance.getGetedAwardList();
            this._list.datas = datas;
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, Laya.Event.CLICK, this, this.close);
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
        }
    }
}