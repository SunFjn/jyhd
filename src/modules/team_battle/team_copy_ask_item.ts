/////<reference path="../$.ts"/>
/** 组队副本被邀请item */
namespace modules.teamBattle {
    import TeamCopyAskItemUI = ui.TeamCopyAskItemUI;
    import TeamInvite = Protocols.TeamInvite;
    import TeamInviteFields = Protocols.TeamInviteFields;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;

    export class TeamCopyAskItem extends TeamCopyAskItemUI {

        private _teamId: number;
        private _info: TeamInvite;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.txt.color = "#2d2d2d"; //
            this.txt.style.fontFamily = "SimHei";
            this.txt.style.fontSize = 24;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.canBtn, common.LayaEvent.CLICK, this, this.canBtnHandler);
            this.addAutoListener(this.cantBtn, common.LayaEvent.CLICK, this, this.cantBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);
        }

        public setData(info: TeamInvite): void {
            this._info = info;
            this._teamId = info[TeamInviteFields.teamId];
            let occ: number = info[TeamInviteFields.occ];
            this.headImg.skin = `assets/icon/head/${occ}.png`;
            let name: string = info[TeamInviteFields.name];
            //盟友S1234.玩家名六个字邀您挑战幽冥鬼境，是否接受？
            let str: string = `公会成员${CommonUtil.formatHtmlStrByColor(`#b15315`, `${name}`)}邀您挑战${CommonUtil.formatHtmlStrByColor(`#b15315`, `幽冥鬼镜`)},是否接受?`
            this.txt.innerHTML = str;
        }

        //接受
        private canBtnHandler(): void {
            TeamBattleCtrl.instance.joinTeam(this._teamId, SCENE_ID.scene_team_copy);
            teamBattle.TeamBattleModel.Instance.tempSelectTeam = this._info;
        }

        //拒绝
        private cantBtnHandler(): void {
            TeamBattleModel.Instance.delAskList(this._info);
        }

        private updateName():void{
            if(!this._info) return;
            let info:UpdateNameReply = RenameModel.instance.updateNameReply;
            if(info && info[UpdateNameReplyFields.roleID] === this._info[TeamInviteFields.objId]){
                this.txt.innerHTML = `公会成员${CommonUtil.formatHtmlStrByColor(`#b15315`, `${info[UpdateNameReplyFields.name]}`)}邀您挑战${CommonUtil.formatHtmlStrByColor(`#b15315`, `幽冥鬼镜`)},是否接受?`;
            }
        }

        private updateOcc():void{
            if(!this._info) return;
            let info:UpdateOccReply = RenameModel.instance.updateOccReply;
            if(info && info[UpdateOccReplyFields.roleID] === this._info[TeamInviteFields.objId]){
                this.headImg.skin = `assets/icon/head/${info[UpdateOccReplyFields.occ]}.png`;
            }
        }
    }
}