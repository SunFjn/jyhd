/**限时一折 主界面*/
namespace modules.limit_one_discount {
    import LimitOneDiscountViewUI = ui.LimitOneDiscountViewUI;
    import CustomList = modules.common.CustomList;
    import StoreModel = modules.store.StoreModel;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;

    export class LimitOneDiscountView extends LimitOneDiscountViewUI {
        private _activityTime: number = 0;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.width = 600;
            this._list.height = 940;
            this._list.spaceX = 3;
            this._list.hCount = 3;
            this._list.itemRender = LimitOneDiscountItem;
            this._list.x = 60;
            this._list.y = 140;
            this._list._zOrder = 2;
            this.addChildAt(this._list, 1);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OS_LIMIT_ONE_DISCOUNT_UPDATE, this, this.updateView);
            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
        }

        public onOpened(): void {
            super.onOpened();
            LimitOneDiscountCtrl.instance.getTime();
        }

        private updateView() {
            this.setActivitiTime();
            let datas = LimitOneDiscountModel.instance.getGoodsList();
            this._list.datas = datas;
        }

        // 设置并开始展示倒计时
        private setActivitiTime(): void {
            // 拿到活动结束时间
            this._activityTime = LimitOneDiscountModel.instance.Time;

            if (this._activityTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            }else{
                this.activityTxt.color = "#cc0000";
                this.activityTxt.text = "活动已经结束";
            }
        }

        private activityHandler(): void {
            if (this._activityTime > GlobalData.serverTime) {
                this.activityTxt.color = "#08a434";
                this.activityTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(this._activityTime)}`;
            } else {
                this.activityTxt.color = "#cc0000";
                this.activityTxt.text = "活动已经结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private puchaseReply() {
            let result = StoreModel.instance.PurchaseReply[BuyMallItemReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                WindowManager.instance.close(WindowEnum.STORE_ALERT);
            }
        }


        public close(): void {
            super.close();
        }
    }
}