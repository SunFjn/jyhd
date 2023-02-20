/** 逐鹿福地奖励展示 */

///<reference path="../common/custom_list.ts"/>
///<reference path="./zhulu_blessed_award_display_cfg.ts"/>

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuBlessedAwardDisplayAlertUI = ui.ZhuLuBlessedAwardDisplayAlertUI;
    import CustomList = modules.common.CustomList;
    import ZhuLuBlessedAwardDisplayCfg = config.ZhuLuBlessedAwardDisplayCfg;
    import zhuluBlessedAwardDisplay = Configuration.zhuluBlessedAwardDisplay;
    import zhuluBlessedAwardDisplayFields = Configuration.zhuluBlessedAwardDisplayFields;

    export class ZhuLuBlessedAwardDisplayAlert extends ZhuLuBlessedAwardDisplayAlertUI {
        private _list: CustomList;
        private _list_peak: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 37;
            this._list.y = 103;
            this._list.width = 582;
            this._list.height = 410;
            this._list.hCount = 1;
            this._list.itemRender = ZhuLuBlessedAwardDisplayItem;
            this._list.spaceY = 10;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
        }
        onOpened(): void {
            super.onOpened();
            this.blessedTxt.text = this.openParam;
            this.updateView();
        }
        //更新界面
        private updateView(): void {
            //获取数据
            let datas: Array<zhuluBlessedAwardDisplay> = ZhuLuBlessedAwardDisplayCfg.instance.getAllConfig();
            //列表赋值
            this._list.datas = datas;
        }
    }
}