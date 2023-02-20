namespace modules.limit {
    import CustomList = modules.common.CustomList;

    export class LimitShopPanel extends ui.LimitShopViewUI {

        constructor() {
            super();
        }

        public destroy(): void {
            super.destroy();
        }
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            //用于设置控件属性 或者创建新控件
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = this.listItemClass;
            this._list.hCount = 1;
            this._list.width = 684;
            this._list.height = 759;
            this.itemPanel.addChild(this._list);
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected get listItemClass() {
            return LimitShopItem
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_SHOP_UPDATE, this, this.updateView);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            LimitShopCtrl.instance.getInfo(this.bigtype)
            this.updateView();
        }

        private updateView(): void {
            let cfgData = LimitShopModel.instance.cfgData(this.bigtype);
            
            this._list.datas = cfgData;
            this.setActivitiTime();
        }

        private setActivitiTime(): void {
            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitShopModel.instance.activityTime(this.bigtype))}`;
            this.activityText.color = "#50ff28";
            if (LimitShopModel.instance.activityTime(this.bigtype) < GlobalData.serverTime) {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

    }
}