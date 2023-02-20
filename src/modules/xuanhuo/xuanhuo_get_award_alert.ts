/** 玄火场景中的玄火奖励 */

///<reference path="../common/custom_list.ts"/>

namespace modules.xuanhuo {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import XuanHuoGetAwardAlertUI = ui.XuanHuoGetAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import xuanhuoAchievementShow = Protocols.xuanhuoAchievementShow;

    export class XuanHuoGetAwardAlert extends XuanHuoGetAwardAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 103;
            this._list.width = 582;
            this._list.height = 688;
            this._list.hCount = 1;
            this._list.itemRender = XuanHuoGetAwardItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Update_XUANHUO_GET_AWARD_VIEW, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();
            //请求数据
            this.TimingRequest();
            // Laya.timer.loop(500, this, this.TimingRequest);
        }
        
        public close(): void {
            super.close();
            // Laya.timer.clear(this, this.TimingRequest);
        }

        //定时刷新数据
        private TimingRequest(): void {
            XuanHuoCtrl.instance.getGetAwardStatus();
        }

        //更新界面
        private updateView(): void {
            let datas: Array<xuanhuoAchievementShow> = XuanHuoModel.instance.xuanhuoGetAwardList;
            //列表赋值
            this._list.datas = datas;
        }

    }
}