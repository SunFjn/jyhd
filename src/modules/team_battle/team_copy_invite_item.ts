/////<reference path="../$.ts"/>
/** 组队副本邀请item */
namespace modules.teamBattle {
    import TeamCopyInviteItemUI = ui.TeamCopyInviteItemUI;
    import TeamMember = Protocols.TeamMember;
    import TeamMemberFields = Protocols.TeamMemberFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;

    export enum MemberInfoFields {
        type,
        id,
        occ,
        name,
        fight,
        headImg,
    }

    export type MemberInfo = [number, number, number, string, number, number];

    export class TeamCopyInviteItem extends TeamCopyInviteItemUI {

        private _id: number;
        private _type: number;

        private _info: MemberInfo;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);
        }

        public setData(info: MemberInfo): void {
            this._info = info;
            this._type = info[MemberInfoFields.type];
            this._id = info[MemberInfoFields.id];
            let occ: number = info[MemberInfoFields.occ];
            let headImg: number = info[MemberInfoFields.headImg];
            let name: string = info[MemberInfoFields.name];
            let fight: number = info[MemberInfoFields.fight];
            this.nameTxt.text = name;
            this.fightTxt.text = `战力:${fight}`;
            this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(occ + headImg)}`;
        }

        private btnHandler(): void {
            let playerInfos: Array<TeamMember> = TeamBattleModel.Instance.playerInfos;
            for (let ele of playerInfos) {
                let tId: number = ele[TeamMemberFields.objId];
                if (tId == this._id) {
                    SystemNoticeManager.instance.addNotice(`该公会成员已加入队伍`, true);
                    GlobalData.dispatcher.event(CommonEventType.TEAM_COPY_CAN_INVITE_MEMBER_UPDATE);
                    return;
                }
            }
            TeamBattleCtrl.instance.inviteJoinTeam(this._type, this._id);
        }

        private updateName(): void {
            if (!this._info) return;
            let info: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (info && info[UpdateNameReplyFields.roleID] === this._info[MemberInfoFields.id]) {
                this.nameTxt.text = info[UpdateNameReplyFields.name];
            }
        }

        private updateOcc(): void {
            if (!this._info) return;
            let info: UpdateOccReply = RenameModel.instance.updateOccReply;
            if (info && info[UpdateOccReplyFields.roleID] === this._info[MemberInfoFields.id]) {
                this.headImg.skin = `assets/icon/head/${info[UpdateOccReplyFields.occ]}.png`;
            }
        }
    }
}