/**组队副本控制器 */


namespace modules.teamBattle {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetTeamCopyRankReply = Protocols.GetTeamCopyRankReply;
    import UpdateTeamCopyTimes = Protocols.UpdateTeamCopyTimes;
    import UpdateTeamMember = Protocols.UpdateTeamMember;
    import UpdateTeamMatchState = Protocols.UpdateTeamMatchState;
    import UpdateTeamCopyTimesFields = Protocols.UpdateTeamCopyTimesFields;
    import GetTeamCopyRankReplyFields = Protocols.GetTeamCopyRankReplyFields;
    import UpdateTeamMemberFields = Protocols.UpdateTeamMemberFields;
    import UpdateTeamMatchStateFields = Protocols.UpdateTeamMatchStateFields;
    import TeamMember = Protocols.TeamMember;
    import ReqOrganizeTeamReply = Protocols.ReqOrganizeTeamReply;
    import CancelOrganizeTeamReply = Protocols.CancelOrganizeTeamReply;
    import ReqOrganizeTeamReplyFields = Protocols.ReqOrganizeTeamReplyFields;
    import CreateTeamReply = Protocols.CreateTeamReply;
    import CreateTeamReplyFields = Protocols.CreateTeamReplyFields;
    import DestoryTeamReply = Protocols.DestoryTeamReply;
    import DestoryTeamReplyFields = Protocols.DestoryTeamReplyFields;
    import InviteJoinTeam = Protocols.InviteJoinTeam;
    import InviteJoinTeamReply = Protocols.InviteJoinTeamReply;
    import InviteJoinTeamReplyFields = Protocols.InviteJoinTeamReplyFields;
    import JoinTeamReplyFields = Protocols.JoinTeamReplyFields;
    import JoinTeamReply = Protocols.JoinTeamReply;
    import LeaveTeamReply = Protocols.LeaveTeamReply;
    import LeaveTeamReplyFields = Protocols.LeaveTeamReplyFields;
    import KickedTeamReply = Protocols.KickedTeamReply;
    import KickedTeamReplyFields = Protocols.KickedTeamReplyFields;
    import UpdateAddTeamInvite = Protocols.UpdateAddTeamInvite;
    import UpdateAddTeamInviteFields = Protocols.UpdateAddTeamInviteFields;
    import TeamInvite = Protocols.TeamInvite;
    import UpdateTeamMemberOper = Protocols.UpdateTeamMemberOper;
    import UpdateTeamMemberOperFields = Protocols.UpdateTeamMemberOperFields;
    import TeamMemberOper = Protocols.TeamMemberOper;
    import TeamMemberOperFields = Protocols.TeamMemberOperFields;
    import TeamMemberFields = Protocols.TeamMemberFields;
    import CancelOrganizeTeamReplyFields = Protocols.CancelOrganizeTeamReplyFields;

    export class TeamBattleCtrl extends BaseCtrl {
        private static _instance: TeamBattleCtrl;
        public static get instance(): TeamBattleCtrl {
            return this._instance = this._instance || new TeamBattleCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            //  //更新怪物归属
            // Channel.instance.subscribe(SystemClientOpcode.UpdateBossDropOwns,this,this.updateBossDropOwns);

            //获取组队副本次数返回
            Channel.instance.subscribe(SystemClientOpcode.GetTeamCopyTimesReply, this, this.updateTeamCopyTimes);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeamCopyTimes, this, this.updateTeamCopyTimes);
            //获取组队副本排行返回
            Channel.instance.subscribe(SystemClientOpcode.GetTeamCopyRankReply, this, this.getTeamCopyRankReply);
            //更新队伍成员
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeamMember, this, this.updateTeamMember);
            //更新匹配状态
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeamMatchState, this, this.updateTeamMatchState);
            // 组队返回
            Channel.instance.subscribe(SystemClientOpcode.ReqOrganizeTeamReply, this, this.reqOrganizeTeamReply);
            // 取消、退出组队返回
            Channel.instance.subscribe(SystemClientOpcode.CancelOrganizeTeamReply, this, this.cancelOrganizeTeamReply);
            //创建队伍返回
            Channel.instance.subscribe(SystemClientOpcode.CreateTeamReply, this, this.createTeamReply);
            //解散队伍返回
            Channel.instance.subscribe(SystemClientOpcode.DestoryTeamReply, this, this.destoryTeamReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDestoryTeam, this, this.updateDestoryTeam);
            //邀请加入队伍返回
            Channel.instance.subscribe(SystemClientOpcode.InviteJoinTeamReply, this, this.inviteJoinTeamReply);
            //接受入队 进入队伍返回
            Channel.instance.subscribe(SystemClientOpcode.JoinTeamReply, this, this.joinTeamReply);
            //离开队伍返回
            Channel.instance.subscribe(SystemClientOpcode.LeaveTeamReply, this, this.leaveTeamReply);
            //踢出队伍返回
            Channel.instance.subscribe(SystemClientOpcode.KickedTeamReply, this, this.kickedTeamReply);
            //更新添加邀请列表
            Channel.instance.subscribe(SystemClientOpcode.UpdateAddTeamInvite, this, this.updateAddTeamInvite);
            //更新成员操作
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeamMemberOper, this, this.updateTeamMemberOper);

            GlobalData.dispatcher.on(CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            GlobalData.dispatcher.on(CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetTeamCopyTimes, null);
            Channel.instance.publish(UserCenterOpcode.GetTeamCopyRank, null);
        }

        //更新组队副本次数
        private updateTeamCopyTimes(tuple: UpdateTeamCopyTimes): void {
            TeamBattleModel.Instance.setTimes(tuple[UpdateTeamCopyTimesFields.times]);
        }

        //组队副本排行返回
        private getTeamCopyRankReply(tuple: GetTeamCopyRankReply): void {
            TeamBattleModel.Instance.rankList = tuple[GetTeamCopyRankReplyFields.ranks];
            TeamBattleModel.Instance.setMaxRecordInfo(tuple[GetTeamCopyRankReplyFields.ranks][0]);
        }

        //更新队伍成员
        private updateTeamMember(tuple: UpdateTeamMember): void {
            let arr: Array<TeamMember> = tuple[UpdateTeamMemberFields.members];
            TeamBattleModel.Instance.playerInfos = arr;
        }

        //更新匹配状态
        private updateTeamMatchState(tuple: UpdateTeamMatchState): void {
            TeamBattleModel.Instance.updataMatchState(tuple[UpdateTeamMatchStateFields.state]);
        }

        //请求组队
        public reqBeginMatch(sceneId: number): void {
            TeamBattleModel.Instance.currSceneId = sceneId;
            Channel.instance.publish(UserFeatureOpcode.ReqOrganizeTeam, [sceneId]);
        }

        // 组队返回
        private reqOrganizeTeamReply(value: ReqOrganizeTeamReply): void {
            // console.log("组队返回....................." + value);
            modules.common.CommonUtil.noticeError(value[ReqOrganizeTeamReplyFields.result]);
        }

        //请求退出组队
        public reqCancelMatch(): void {
            // console.log(`请求退出组队-----`);
            Channel.instance.publish(UserFeatureOpcode.CancelOrganizeTeam, null);
        }

        // 取消、退出组队返回
        public cancelOrganizeTeamReply(value: CancelOrganizeTeamReply): void {
            // console.log("取消、退出组队返回...................." + value);
            let code: number = value[CancelOrganizeTeamReplyFields.resule];
            if (!code) {
                TeamBattleModel.Instance.playerInfos.length = 0;
            }
            CommonUtil.codeDispose(code, `操作成功`);
        }

        //创建队伍
        public createTeam(): void {
            Channel.instance.publish(UserFeatureOpcode.CreateTeam, [SCENE_ID.scene_team_copy]);
        }

        public createTeamReply(tuple: CreateTeamReply): void {
            let code: number = tuple[CreateTeamReplyFields.result];
            if (!code) {
                WindowManager.instance.open(WindowEnum.TEAM_COPY_ROOM_ALERT);
                TeamBattleModel.Instance.isHaveRoom = true;
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //解散队伍
        public destoryTeam(): void {
            Channel.instance.publish(UserFeatureOpcode.DestoryTeam, null);
        }

        public destoryTeamReply(tuple: DestoryTeamReply): void {
            let code: number = tuple[DestoryTeamReplyFields.result];
            CommonUtil.codeDispose(code, `解散成功`);
        }

        public updateDestoryTeam(): void {
            //收到此协议说明队伍解散 关闭相关面板
            let mineInfo: TeamMember = TeamBattleModel.Instance.mineInfo;
            if (!mineInfo[TeamMemberFields.leader]) {
                let bossName: string = TeamBattleModel.Instance.bossInfo[TeamMemberFields.name];
                notice.SystemNoticeManager.instance.addNotice(`队长${bossName}解散队伍`, true);
            }
            TeamBattleModel.Instance.isHaveRoom = false;
            WindowManager.instance.open(WindowEnum.TEAM_BATTLE_PANEL);
            WindowManager.instance.close(WindowEnum.TEAM_BATTLE_MATCH_ALERT);
        }

        //邀请加入队伍
        public inviteJoinTeam(type: number, objId: number): void {
            Channel.instance.publish(UserFeatureOpcode.InviteJoinTeam, [type, objId, TeamBattleModel.Instance.allMemberIds]);
        }

        public inviteJoinTeamReply(tuple: InviteJoinTeamReply): void {
            let code: number = tuple[InviteJoinTeamReplyFields.result];
            CommonUtil.codeDispose(code, `邀请成功`);
        }

        //接受入队,进入队伍
        public joinTeam(teamId: number, sceneId: number): void {
            TeamBattleModel.Instance.currSceneId = sceneId;
            Channel.instance.publish(UserFeatureOpcode.JoinTeam, [sceneId, teamId]);
        }

        public joinTeamReply(tuple: JoinTeamReply): void {
            let code: number = tuple[JoinTeamReplyFields.result];
            if (code) {
                CommonUtil.noticeError(code);
            } else {
                notice.SystemNoticeManager.instance.addNotice(`加入队伍成功`);
                TeamBattleModel.Instance.isHaveRoom = true;
                WindowManager.instance.close(WindowEnum.TEAM_COPY_ASK_ALERT);
                WindowManager.instance.open(WindowEnum.TEAM_BATTLE_PANEL);
                WindowManager.instance.open(WindowEnum.TEAM_COPY_ROOM_ALERT);
            }
            TeamBattleModel.Instance.delAskList(TeamBattleModel.Instance.tempSelectTeam);
        }

        //离开队伍
        public leaveTeam(): void {
            Channel.instance.publish(UserFeatureOpcode.LeaveTeam, null);
        }

        public leaveTeamReply(tuple: LeaveTeamReply): void {
            let code: number = tuple[LeaveTeamReplyFields.result];
            if (!code) {
                TeamBattleModel.Instance.isHaveRoom = false;
            }
            CommonUtil.codeDispose(code, `离队成功`);
        }

        //提出队伍
        public kickedTeam(objId: number): void {
            Channel.instance.publish(UserFeatureOpcode.KickedTeam, [objId]);
        }

        public kickedTeamReply(tuple: KickedTeamReply): void {
            let code: number = tuple[KickedTeamReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }

        //邀请添加队伍
        private updateAddTeamInvite(tuple: UpdateAddTeamInvite): void {
            let ele: TeamInvite = tuple[UpdateAddTeamInviteFields.invite];
            TeamBattleModel.Instance.addAskList(ele);
        }

        public startMatch(): void {
            this.reqBeginMatch(SCENE_ID.scene_team_copy);
            WindowManager.instance.openDialog(WindowEnum.TEAM_BATTLE_MATCH_ALERT);
            mission.MissionModel.instance.auto = false;
        }

        public updateTeamMemberOper(tuple: UpdateTeamMemberOper): void {
            let value: TeamMemberOper = tuple[UpdateTeamMemberOperFields.oper];
            let name: string = value[TeamMemberOperFields.name];
            let oper: TeamOper = value[TeamMemberOperFields.oper];
            if (oper == TeamOper.join) {
                notice.SystemNoticeManager.instance.addNotice(`${name}加入队伍`);
            } else if (oper == TeamOper.kicked) {
                notice.SystemNoticeManager.instance.addNotice(`您被踢出队伍`, true);
                GlobalData.dispatcher.event(CommonEventType.TEAM_COPY_MEMBER_KICKED);
                TeamBattleModel.Instance.isHaveRoom = false;
            } else if (oper == TeamOper.leave) {
                notice.SystemNoticeManager.instance.addNotice(`${name}退出队伍`, true);
            }
        }

        //队伍待机处理
        public teamWaitingHandler(): void {
            let cancelHandler: Handler = Handler.create(this, () => {
                TeamBattleCtrl.instance.leaveTeam();
                TeamBattleModel.Instance.isHaveRoom = false;
                WindowManager.instance.close(WindowEnum.TEAM_BATTLE_PANEL);
            });

            let okHandler: Handler = Handler.create(this, () => {
                TeamBattleModel.Instance.isHaveRoom = true;
                WindowManager.instance.close(WindowEnum.TEAM_BATTLE_PANEL);
            });
            let str: string = `当前为组队等待状态,进入副本需要退出当前队伍,是否退出?`;
            CommonUtil.alert(`提示`, str, [okHandler, `继续等待`], [cancelHandler, `离开队伍`]);
        }

        // 更新名字
        private updateName(): void {
            TeamBattleModel.Instance.updateName();
        }

        // 更新职业
        private updateOcc(): void {
            TeamBattleModel.Instance.updateOcc();
        }
    }
}
