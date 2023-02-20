///<reference path="../fish/fish_ck_model.ts"/>
/**新春兑换 主界面*/
namespace modules.year {
    import FishCKModel = modules.fish.FishCKModel;
    import FishModel = modules.fish.FishModel;
    import FishCKCtrl = modules.fish.FishCKCtrl;
    import BagModel = modules.bag.BagModel;
    import CustomList = modules.common.CustomList;
    import TreasureModel = modules.treasure.TreasureModel;

    export class YearDhPanel extends ui.YearDhViewUI {
        private _activityTime: number = 0;
        private _list: CustomList;

        constructor() {
            super();
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }

        protected get listItemClass() {
            return YearDjItem
        }

        protected get prize(): ItemId {
            return 15650004;
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this._list = new CustomList();
            this._list.width = 600;
            this._list.height = 690;
            this._list.spaceX = 3;
            this._list.hCount = 3;
            this._list.itemRender = this.listItemClass;
            this._list.x = 60;
            this._list.y = 310;
            this._list._zOrder = 2;
            this.addChildAt(this._list, 1);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, Laya.Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_CK_UPDATE, this, this.updateView);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.XUNBAO_EXCHANGE_REPLY, this, this.refreshQuan);
        }

        public onOpened(): void {
            super.onOpened();
            // 请求数据
            FishCKCtrl.instance.getCashInfo(this.bigtype);
            FishCKCtrl.instance.getCashRemind(this.bigtype);
            // CeremonyCashCtrl.instance.getCashRemind();

            this.showQuan();
        }

        // 获取道具-每日累冲
        private getBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.YEAR_ADDUP_PAY);
        }

        // 更新视图
        private updateView(): void {
            this.setActivitiTime();
            this._list.datas = FishCKModel.instance.getCashList(this.bigtype);
            this.showQuan();
        }

        // 展示券
        private showQuan(): void {
            // 显示拥有的珍宝券
            let count: number = BagModel.instance.getItemCountById(this.prize);
            this.priceImg.skin = CommonUtil.getIconById(this.prize, true);
            this.countTxt.text = `${CommonUtil.getNameByItemId(this.prize)}：${count}`;
        }

        // 设置并开始展示倒计时
        private setActivitiTime(): void {
            if (FishModel.instance.endTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityTxt.color = "#cc0000";
                this.activityTxt.text = "活动已经结束";
            }
        }

        private activityHandler(): void {
            if (FishModel.instance.endTime == -1) {
                this.activityTxt.color = "#2ad200";
                this.activityTxt.text = "至活动结束";
            } else if (FishModel.instance.endTime > GlobalData.serverTime) {
                this.activityTxt.color = "#2ad200";
                this.activityTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(FishModel.instance.endTime)}`;
            } else {
                this.activityTxt.color = "#cc0000";
                this.activityTxt.text = "活动已经结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        public close(): void {
            super.close();
        }
    }
}