/** 描述 */
namespace modules.seven_activity {
    import SevenActivityDayItemUI = ui.SevenActivityDayItemUI;
    import Items = Protocols.Items;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class SevenActivityDayItem extends SevenActivityDayItemUI {

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SEVEN_ACTIVITY_UPDATE_DAY_ITEM, this, this.updateSelected);
        }


        //设置任务列表信息(0索引，1天数，2进度,3是否显示红点,4未解锁)
        protected setData(value: any): void {
            this.dayTxt.text = value[1];
            this.processTxt.text = value[2];

            // 是否有可领取任务
            this.imgrp.visible = value[3] && !value[4];

            // this.mouseEnabled = !value[4];
        }

        public updateSelected(index: number) {
            if (index == this.index) {
                this.selectbg.visible = true;
                this.dayTxt.color = "#88110f";
                this.processTxt.color = "#88110f";

            } else {
                this.selectbg.visible = false;
                this.dayTxt.color = "#ffffff";
                this.processTxt.color = "#ffffff";

            }
        }

        public close(): void {
            super.close();
        }
    }
}