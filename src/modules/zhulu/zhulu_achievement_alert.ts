/** 逐鹿成就奖励 */

///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuAchievementAlertUI = ui.ZhuLuAchievementAlertUI;
    import CustomList = modules.common.CustomList;
    import zhuluAchievementShow = Protocols.zhuluAchievementShow;

    export class ZhuLuAchievementAlert extends ZhuLuAchievementAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 123;
            this._list.width = 582;
            this._list.height = 688;
            this._list.hCount = 1;
            this._list.itemRender = ZhuLuAchieventmentItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_ZHULU_ACHIEVEMENT_VIEW, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();
            //请求数据
            ZhuLuCtrl.instance.GetAchievementInfo();
        }

        //更新界面
        private updateView(): void {
            let datas: Array<zhuluAchievementShow> = ZhuLuModel.instance.achievementList;
            //列表赋值
            this._list.datas = datas;
        }

    }
}