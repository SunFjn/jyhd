/** 战队建设弹窗 */

///<reference path="../common/custom_list.ts"/>

namespace modules.clan {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ClanBuildAlertUI = ui.ClanBuildAlertUI;
    import CustomList = modules.common.CustomList;

    export class ClanBuildAlert extends ClanBuildAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 181;
            this._list.width = 582;
            this._list.height = 590;
            this._list.hCount = 1;
            this._list.itemRender = ClanBuildItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_CLAN_BUILD_REMAIN, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();

            // this.updateView();
            ClanCtrl.instance.getClanBuildListRequest();
        }

        //更新界面
        private updateView(): void {
            let datas: Array<any> = ClanModel.instance.clanBuildInfo;
            //列表赋值
            this._list.datas = datas;
        }


    }
}