/** 战队等级奖励弹窗 */

///<reference path="../common/custom_list.ts"/>

namespace modules.clan {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ClanGradeAwardAlertUI = ui.ClanGradeAwardAlertUI;
    import CustomList = modules.common.CustomList;

    export class ClanGradeAwardAlert extends ClanGradeAwardAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 120;
            this._list.width = 582;
            this._list.height = 607;
            this._list.hCount = 1;
            this._list.itemRender = ClanGradeAwardItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_CLAN_GRADE_AWARD, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();
            ClanCtrl.instance.getClanGradeAwardRequest();
            // this.updateView();
        }

        //更新界面
        private updateView(): void {
            let datas = ClanModel.instance.gradeAwardData;
            //列表赋值
            this._list.datas = datas;
        }

    }
}