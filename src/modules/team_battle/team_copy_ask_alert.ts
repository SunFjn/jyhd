/////<reference path="../$.ts"/>
/** 组队副本被邀请弹框 */
namespace modules.teamBattle {
    import TeamCopyAskAlertUI = ui.TeamCopyAskAlertUI;
    import TeamInvite = Protocols.TeamInvite;
    import CustomList = modules.common.CustomList;

    export class TeamCopyAskAlert extends TeamCopyAskAlertUI {

        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 51;
            this._list.y = 110;
            this._list.width = 560;
            this._list.height = 525;
            this._list.hCount = 1;
            this._list.itemRender = TeamCopyAskItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_COPY_ASK_LIST_UPDATE, this, this.updateList);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateList();
        }

        private updateList(): void {
            let list: TeamInvite[] = TeamBattleModel.Instance.askList;
            this._list.datas = list;
            this.noBox.visible = !(list.length > 0);
        }

        private btnHandler(): void {
            TeamBattleModel.Instance.clearAskList();
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}