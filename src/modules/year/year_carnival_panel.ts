/**掉落狂欢 主界面*/
namespace modules.year {
    import YearCarnivalViewUI = ui.YearCarnivalViewUI;
    import fishModel = modules.fish.FishModel
    export class YearCarnivalPanel extends YearCarnivalViewUI {
        private _activityTime: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._activityTime
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OS_DOUBLE_DROP_ENDTIME_UPDATE, this, this.setActivitiTime);
        }

        public onOpened(): void {
            super.onOpened();
            this.setActivitiTime();
            // 请求数据
            // TODO
        }

        private setActivitiTime(): void {
            // 拿到活动结束时间
            this._activityTime = fishModel.instance.Endtime;
            // console.log('vtz:this._activityTime',this._activityTime);

            if (this._activityTime && this._activityTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            }else{
                this.downcountTxt.text = "活动已结束";
                this.downcountTxt.color = "#FF2727";
            }
        }

        private activityHandler(): void {
            if (this._activityTime > GlobalData.serverTime) {
                this.downcountTxt.color = "#B2F4B2";
                this.downcountTxt.text = `活动倒计时：${modules.common.CommonUtil.timeStampToDayHourMinSecond(this._activityTime)}`;
            } else {
                this.downcountTxt.text = "活动已结束";
                this.downcountTxt.color = "#FF2727";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        public close(): void {
            super.close();
        }
    }
}