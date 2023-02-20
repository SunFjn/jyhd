///<reference path="./clan_model.ts"/>

/** 战队ctrl */
namespace modules.clan {
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CreateClan = Protocols.CreateClan;
    import ClanKickPerson = Protocols.ClanKickPerson;
    import ClanDissolve = Protocols.ClanDissolve;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import ClanJoioAuditStatus = Protocols.ClanJoioAuditStatus;
    import ClanJoinLimitSet = Protocols.ClanJoinLimitSet;
    import GetMyClanInfoReply = Protocols.GetMyClanInfoReply;
    import ClanCodeHandleReply = Protocols.ClanCodeHandleReply;
    import ClanApplyListReplyFields = Protocols.ClanApplyListReplyFields;
    import ClanAudit = Protocols.ClanAudit;
    import ClanApplyListReply = Protocols.ClanApplyListReply;
    import ApplyJoinClan = Protocols.ApplyJoinClan;
    import AllClanList = Protocols.AllClanListReply;
    import ClanCodeHandleReplyFields = Protocols.ClanCodeHandleReplyFields;
    import ClanRename = Protocols.ClanRename;
    import ClanHaloRefreshReplyFields = Protocols.ClanHaloRefreshReplyFields;
    import ClanHaloRefresh = Protocols.ClanHaloRefresh;
    import ClanBuildData = Protocols.ClanBuildData;
    import ClanGetLevelReward = Protocols.ClanGetLevelReward;
    import ClanApplyListChangeReplyFields = Protocols.ClanApplyListChangeReplyFields;
    import ClanApplyListChangeReply = Protocols.ClanApplyListChangeReply;
    import AppliedClanList = Protocols.AppliedClanList;
    import UpdateClanAppliedListReply = Protocols.UpdateClanAppliedListReply;
    import UpdateClanAppliedListReplyFields = Protocols.UpdateClanAppliedListReplyFields;
    import ClanModel = modules.clan.ClanModel;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import ClanGradeLevelList = Protocols.ClanGradeLevelList;
    import ClanUpdateFightTeamCoin = Protocols.ClanUpdateFightTeamCoin;
    import ClanBuildList = Protocols.ClanBuildList;
    import ClanBuildAndHalRefresh = Protocols.ClanBuildAndHalRefresh;
    import ClanBuildAndHalRefreshFiedls = Protocols.ClanBuildAndHalRefreshFiedls;


    export class ClanCtrl extends BaseCtrl {
        private static _instance: ClanCtrl;
        public static get instance(): ClanCtrl {
            return this._instance = this._instance || new ClanCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetMyClanInfoReply, this, this.handerGetMyClanInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.SetClanJoinLimitReply, this, this.setClanJoinLimitReply);
            Channel.instance.subscribe(SystemClientOpcode.CreateClanReply, this, this.createClanReply);
            Channel.instance.subscribe(SystemClientOpcode.SetClanAuditStatusReply, this, this.setClanAuditStatusReply);
            Channel.instance.subscribe(SystemClientOpcode.GetClanApplyListReply, this, this.getClanApplyListReply);
            Channel.instance.subscribe(SystemClientOpcode.GetAllClanListReply, this, this.getAllClanListReply);
            Channel.instance.subscribe(SystemClientOpcode.ApplyJoinClanReply, this, this.applyJoinClanReply);
            Channel.instance.subscribe(SystemClientOpcode.DissolveClanReply, this, this.dissolveClanReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanKickMemberReply, this, this.clanKickMemberReply);
            Channel.instance.subscribe(SystemClientOpcode.ExitClanReply, this, this.exitClanReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanAuditJoinReply, this, this.clanAuditJoinReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateClanAppliedListReply, this, this.updateClanAppliedListReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateClanAppliedListReply2, this, this.updateClanAppliedListReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanApplyListChangeReply, this, this.clanApplyListChangeReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanBuildReply, this, this.clanBuildReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanRefreshHaloReply, this, this.clanRefreshHaloReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanGetLevelRewardReply, this, this.clanGetLevelRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanBuildListReply, this, this.clanBuildListReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanBuildAndHalRefreshReply, this, this.clanBuildAndHalRefreshReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanGradeLevelListReply, this, this.clanGradeLevelListReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanHaloRefreshComfirmReply, this, this.clanHaloRefreshComfirmReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanUpdateFightTeamCoinReply, this, this.clanUpdateFightTeamCoinReply);
            Channel.instance.subscribe(SystemClientOpcode.ClanRenameReply, this, this.clanRenameReply);

           this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            //获取战队信息和已经申请过的战队的列表
            this.getMyClanInfo();
            this.GetAppliedClanList();
            this.getClanBuildListRequest();
            this.getClanGradeAwardRequest(); 
        }

        /*获取战队等级奖励列表返回*/
        public clanGradeLevelListReply(data: ClanGradeLevelList): void {
            ClanModel.instance.updateClanGradeAwardData(data);
        }
        /*获取战队等级奖励列表*/
        public getClanGradeAwardRequest(): void {
            Channel.instance.publish(UserFeatureOpcode.GetClanGradeAwardRequest, null);
        }
        /*战队建设捐献返回*/
        public clanBuildReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `捐献成功`);
            if (code == 0) {
                this.getClanBuildListRequest();
                this.getClanGradeAwardRequest();
            }
        }
        /*获取战队建设可捐献列表*/
        public getClanBuildListRequest(): void {
            Channel.instance.publish(UserFeatureOpcode.GetClanBuildListRequest, null);
        }
        /*获取战队建设可捐献列表返回*/
        public clanBuildListReply(data: ClanBuildList): void {
            ClanModel.instance.uodateClanBuildInfo(data);
        }
        /*战队建设和光环刷新返回*/
        public clanBuildAndHalRefreshReply(data: ClanBuildAndHalRefresh): void {
            ClanModel.instance.buildListAndHalresfresh = data;
        }
        /*战队等级奖励获取*/
        public getClanGradeLevelRequset(data: ClanGetLevelReward): void {
            Channel.instance.publish(UserFeatureOpcode.ClanGetLevelRewardRequest, data);
        }
        /*战队光环刷新请求*/
        public clanRefreshHaloRequset(): void {
            Channel.instance.publish(UserFeatureOpcode.ClanRefreshHaloRequest, null);
        }
        /*战队建设捐献请求*/
        public clanDonateReqest(data: ClanBuildData): void {
            Channel.instance.publish(UserFeatureOpcode.ClanBuildRequset, data);
        }
        /*审批玩家加入战队*/
        public auditMemberJoinClan(data: ClanAudit): void {
            Channel.instance.publish(UserFeatureOpcode.ClanAuditRequset, data);
        }
        /*申请加入战队*/
        public applyJoinClan(data: ApplyJoinClan): void {
            Channel.instance.publish(UserFeatureOpcode.JoinClanApplyRequset, data);
        }
        /*战队申请列表返回*/
        public getClanApplyListReply(data: ClanApplyListReply): void {
            let code: number = data[ClanApplyListReplyFields.code]
            if (code == 0) {
                ClanModel.instance.setSlanApplyList(data);
            } else {
                CommonUtil.codeDispose(code, "");
            }
        }
        /*请求已经申请过的战队列表*/
        public GetAppliedClanList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetAppliedClanListRequset, null);
        }
        /*更新已经申请过的战队列表返回*/
        public updateClanAppliedListReply(data: UpdateClanAppliedListReply): void {
            ClanModel.instance.myAppliedList = data[UpdateClanAppliedListReplyFields.list];
        }
        /*战队申请列表改变返回*/
        public clanApplyListChangeReply(data: ClanApplyListChangeReply): void {
            ClanModel.instance.setSlanApplyList([0, data[ClanApplyListChangeReplyFields.list]]);
        }
        /*战队是否自动审批修改*/
        public changeAuditState(data: ClanJoioAuditStatus): void {
            Channel.instance.publish(UserFeatureOpcode.SetJoinClanAuditStatusRequset, data);
        }
        /*设置战队加入的最低战力*/
        public setJoinClanLimit(data: ClanJoinLimitSet): void {
            Channel.instance.publish(UserFeatureOpcode.SetJoinClanLimitRequset, data);
        }
        /*战队信息请求*/
        public getMyClanInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetMyClanInfoRequset, null);
        }
        /*获取所有战队列表*/
        public getAllClanList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetAllClanListRequset, null);
        }
        /*获取所有战队列表返回*/
        public getAllClanListReply(data: AllClanList): void {
            ClanModel.instance.setAllClanList(data);
        }

        /*战队申请列表数据请求*/
        public getAllClanApplyList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetAllClanApplyListRequset, null);
        }
        /*获取到我的战队信息返回*/
        public handerGetMyClanInfoReply(data: GetMyClanInfoReply): void {
            ClanModel.instance.myClanInfo = data;
        }
        /*战队币返回*/
        public clanUpdateFightTeamCoinReply(data: ClanUpdateFightTeamCoin): void {
            PlayerModel.instance.clanCoin = data[0];
        }
        /*战队光环确认替换请求*/
        public clanHaloConfirmReplace(): void {
            Channel.instance.publish(UserFeatureOpcode.ClanHaloReplaceRequest, null);
        }
        /*战队替换光环返回*/
        public clanHaloRefreshComfirmReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanHaloRefreshReplyFields.code];
            CommonUtil.codeDispose(code, `光环替换成功`);
            if (code == 0) {
                WindowManager.instance.close(WindowEnum.CLAN_HALO_CONFIRM_ALERT);
            }
        }
        /*战队光环刷新返回*/
        public clanRefreshHaloReply(data: ClanHaloRefresh): void {
            let code: number = data[ClanHaloRefreshReplyFields.code];
            CommonUtil.codeDispose(code, `刷新成功`);
            if (code == 0) {
                ClanModel.instance.haloStagingId = data[ClanHaloRefreshReplyFields.haloId];
                WindowManager.instance.close(WindowEnum.CLAN_HALO_REFRESH_ALERT);
                WindowManager.instance.open(WindowEnum.CLAN_HALO_CONFIRM_ALERT);
            }
        }
        /*战队等级奖励获取*/
        public clanGetLevelRewardReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
            this.getClanGradeAwardRequest();
        }
        /*申请加入战队返回*/
        public applyJoinClanReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `申请成功`);
            if (code == 43022) {
                WindowManager.instance.close(WindowEnum.CLAN_LIST_PANEL);
                BottomTabCtrl.instance.openTabByFunc(ActionOpenId.ClanEntry);
            }
        }
        /*设置战队最低加入战力返回*/
        public setClanJoinLimitReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `设置成功`);
            if (code == 0) WindowManager.instance.close(WindowEnum.CLAN_JOIN_LIMIT_ALERT);
        }
        /*创建战队返回*/
        public createClanReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `创建成功`);
            if (code == 0) {
                WindowManager.instance.close(WindowEnum.CLAN_CREATE_ALERT);
                BottomTabCtrl.instance.openTabByFunc(ActionOpenId.ClanEntry);
            }
        }
        /*设置是否需要审批状态返回*/
        public setClanAuditStatusReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `修改成功`);
        }
        /*审批玩家返回*/
        public clanAuditJoinReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }
        /*战队踢人返回*/
        public clanKickMemberReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `已经踢出了该玩家`);
        }
        /*退出战队返回*/
        public exitClanReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `退出成功`);
            if (code == 0) {
                WindowManager.instance.close(WindowEnum.CLAN_INDEX_PANEL);
            }
        }

        /*解散战队返回*/
        public dissolveClanReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `解散成功`);
            if (code == 0) {
                WindowManager.instance.close(WindowEnum.CLAN_INDEX_PANEL);
            }
        }
        /*战队改名返回*/
        public clanRenameReply(data: ClanCodeHandleReply): void {
            let code: number = data[ClanCodeHandleReplyFields.result];
            CommonUtil.codeDispose(code, `修改成功`);
            if (code == 0) {
                WindowManager.instance.close(WindowEnum.CLAN_CREATE_ALERT);
            }
        }
        /*踢人*/
        public kickMember(data: ClanKickPerson): void {
            Channel.instance.publish(UserFeatureOpcode.ClanKickPersonRequset, data);
        }
        /*退出战队*/
        public exitClan(): void {
            Channel.instance.publish(UserFeatureOpcode.ExitClanRequset, null);
        }
        /*解散战队*/
        public dissolveClan(data: ClanDissolve): void {
            Channel.instance.publish(UserFeatureOpcode.ClanDissolveRequset, data);
        }
        /*创建战队*/
        public createClan(data: CreateClan): void {
            Channel.instance.publish(UserFeatureOpcode.CreateClanRequest, data);
        }
        /*修改战队信息*/
        public ChangeClanName(data: ClanRename): void {
            Channel.instance.publish(UserFeatureOpcode.ClanRenameRequest, data);
        }
    }
}
