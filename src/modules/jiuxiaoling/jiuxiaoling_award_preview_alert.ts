/*九霄令大奖预览弹窗*/
namespace modules.jiuxiaoling {
    import JiuXiaoLingAwardPreviewAlertUI = ui.JiuXiaoLingAwardPreviewAlertUI;

    import CustomList = modules.common.CustomList;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import BaseItem = modules.bag.BaseItem;

    export class JiuXiaoLingAwardPreviewAlert extends JiuXiaoLingAwardPreviewAlertUI {
        private _list: CustomList;
        private _list222: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.width = 575;
            this._list.height = 135;
            this._list.spaceX = 5;
            this._list.hCount = 5;
            this._list.itemRender = BaseItem;
            this._list.x = 70;
            this._list.y = 140;
            this._list.zOrder = 10;
            this._list.selectedIndex = -1;
            this.addChildAt(this._list, 1);

            this._list222 = new CustomList();
            this._list222.width = 575;
            this._list222.height = 190;
            this._list222.spaceX = 5;
            this._list222.hCount = 5;
            this._list222.itemRender = BaseItem;
            this._list222.x = 70;
            this._list222.y = 375;
            this._list222.zOrder = 10;
            this._list222.selectedIndex = -1;
            this.addChildAt(this._list222, 1);

        }

        public onOpened(): void {
            super.onOpened();
            this.updateShow();
            this.btn.visible = !JiuXiaoLingModel.instance.isBuy;
        }

        private updateShow() {
            let datas = JiuXiaoLingModel.instance.getPreviewAwardList();
            this._list.datas = datas[0];
            this._list222.datas = datas[1];
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, Laya.Event.CLICK, this, this.activateHandler);
        }

        //激活
        private activateHandler(): void {
            WindowManager.instance.open(WindowEnum.JIUXIAOLING_ACTIVATE_GOLD_ALERT);
        }

        
        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._list222 = this.destroyElement(this._list222);
        }
    }
}