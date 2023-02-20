/**庆典兑换 主界面*/
namespace modules.fish {
    import BagModel = modules.bag.BagModel;
    import CustomList = modules.common.CustomList;
    import TreasureModel = modules.treasure.TreasureModel;

    export class FishCkPanel extends ui.FishCKViewUI {
        private _activityTime: number = 0;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected get prizeItemId(): ItemId {
            return 16750001;
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.x = 49;
            this._list.y = 193;
            this._list.width = 634;
            this._list.height = 785;
            this._list.spaceX = 15;
            this._list.spaceY = 15;
            this._list.hCount = 2;
            this._list.itemRender = FishCKItem;
            this._list._zOrder = 2;
            this.addChildAt(this._list, 1);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_CK_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            // 请求数据
            FishCKCtrl.instance.getCashInfo(this.bigtype);
            // FishCKCtrl.instance.getCashRemind();

        }

        // 获取道具-每日累冲
        private getBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CUMULATE_PAY2_UPDATE);
        }

        // 更新视图
        private updateView(): void {
            this._list.datas = FishCKModel.instance.getCashList(this.bigtype);
            this.showQuan();
        }

        // 刷新券
        private refreshQuan(): void {
            let result: number = TreasureModel.instance.xunBaoExchangeReply;
            if (result == 0) {
                this.showQuan();
            } else {
                CommonUtil.noticeError(result);
            }
        }
        // 展示券
        private showQuan(): void {
            // 显示拥有的珍宝券
            let count: number = BagModel.instance.getItemCountById(this.prizeItemId);
            // 材料
            this.priceImg.skin = CommonUtil.getIconById(this.prizeItemId, true);
            this.countTxt.text = `${count}`;
        }

        private activityHandler(): void {
        }


        public close(): void {
            super.close();
        }
    }
}