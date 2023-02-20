/** 逐鹿排行【首领战、巅峰战】奖励 */

///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuWarRankAwardAlertUI = ui.ZhuLuWarRankAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import zhuluWarRankAward = Configuration.zhuluWarRankAward;
    import zhuluWarRankAwardFields = Configuration.zhuluWarRankAwardFields;

    export class ZhuLuWarRankAwardAlert extends ZhuLuWarRankAwardAlertUI {
        private _list: CustomList;
        private _list_peak: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 160;
            this._list.width = 582;
            this._list.height = 800;
            this._list.hCount = 1;
            this._list.itemRender = ZhuLuWarRankAwardItem;
            this._list.spaceY = 0;
            this.addChild(this._list);

            this._list_peak = new CustomList();
            this._list_peak.scrollDir = 1;
            this._list_peak.x = 45;
            this._list_peak.y = 100;
            this._list_peak.width = 640;
            this._list_peak.height = 775;
            this._list_peak.hCount = 1;
            this._list_peak.itemRender = ZhuLuWarRankAwardItem2;
            this._list_peak.spaceY = -70;
            this.addChild(this._list_peak);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.peakBtn, common.LayaEvent.CLICK, this, this.peakBtnHandler);
            this.addAutoListener(this.headerWarBtn, common.LayaEvent.CLICK, this, this.headerWarBtnHandler);
        }

        onOpened(): void {
            super.onOpened();
            //获取数据
            this.headerWarBtnHandler();
        }

        //更新界面
        private updateView(type: number): void {
            let isHeaderWar = type == 1;
            this.peakBtn.selected = !isHeaderWar;
            this.headerWarBtn.selected = isHeaderWar;
            this.titleTxt.text = isHeaderWar ? "首领战" : "巅峰战";
            this.settlementTimeTxt.text = isHeaderWar ? "周二22:00根据战队排名结算奖励" : "周三21:10战队逐鹿结算时发放奖励以及相应福地";

            //获取数据
            let datas: Array<zhuluWarRankAward> = ZhuLuModel.instance.getWarRankAwardByType(type);
            //列表赋值
            if (isHeaderWar) {
                this._list.datas = datas;
            } else {
                this._list_peak.datas = datas;
            }
        }

        //巅峰战排行奖励
        private peakBtnHandler(): void {
            this.headerBox.visible = false;
            this._list.visible = false;
            this._list_peak.visible = true;
            this.updateView(2);
        }

        //首领战排行奖励
        private headerWarBtnHandler(): void {
            this.headerBox.visible = true;
            this._list.visible = true;
            this._list_peak.visible = false;
            this.updateView(1);
        }

    }
}