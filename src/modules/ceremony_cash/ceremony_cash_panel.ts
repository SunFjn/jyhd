/**庆典兑换 主界面*/
namespace modules.ceremony_cash {
    import CeremonyCashViewUI = ui.CeremonyCashViewUI;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import xunbao_weightFields = Configuration.xunbao_weightFields;
    import xunbao_weight = Configuration.xunbao_weight;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import item_materialFields = Configuration.item_materialFields;
    import SystemNoticeManager = notice.SystemNoticeManager;
    import BagModel = modules.bag.BagModel;
    import idCountFields = Configuration.idCountFields;
    import CustomList = modules.common.CustomList;
    import TreasureModel = modules.treasure.TreasureModel;

    export class CeremonyCashView extends CeremonyCashViewUI {
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
            this._list.height = 690;
            this._list.spaceX = 3;
            this._list.hCount = 3;
            this._list.itemRender = CeremonyCashItem;
            this._list.x = 60;
            this._list.y = 310;
            this._list._zOrder = 2;
            this.addChildAt(this._list, 1);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, Laya.Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OS_CEREMONY_CASH_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XUNBAO_EXCHANGE_REPLY, this, this.refreshQuan);
        }

        public onOpened(): void {
            super.onOpened();
            // 请求数据
            CeremonyCashCtrl.instance.getCashInfo();
            CeremonyCashCtrl.instance.getCashRemind();

            this.showQuan();
        }

        // 获取道具-每日累冲
        private getBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.CUMULATE_PAY2_UPDATE);
        }

        // 更新视图
        private updateView(): void {
            this.setActivitiTime();
            this._list.datas = CeremonyCashModel.instance.getCashList();
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
            let count: number = BagModel.instance.getItemCountById(15650002);
            this.countTxt.text = `开服-珍宝卷:${count}`;
        }

        // 设置并开始展示倒计时
        private setActivitiTime(): void {
            // 拿到活动结束时间
            this._activityTime = CeremonyCashModel.instance.restTime;

            if (this._activityTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            }else{
                this.activityTxt.color = "#cc0000";
                this.activityTxt.text = "活动已经结束";
            }
        }

        private activityHandler(): void {
            if(this._activityTime==-1){
                this.activityTxt.color = "#2ad200";
                this.activityTxt.text = "至活动结束";
            }else if (this._activityTime > GlobalData.serverTime) {
                this.activityTxt.color = "#2ad200";
                this.activityTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(this._activityTime)}`;
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