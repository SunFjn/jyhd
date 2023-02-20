///<reference path="./faction_model.ts"/>
///<reference path="../scene/scene_util.ts"/>
/** 仙盟ctrl */
namespace modules.faction {
    import FactionModel = modules.faction.FactionModel;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetFactionInfoReply = Protocols.GetFactionInfoReply;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import CreateFactionReply = Protocols.CreateFactionReply;
    import CreateFactionReplyFields = Protocols.CreateFactionReplyFields;
    import CreateFaction = Protocols.CreateFaction;
    import GetFactionListReply = Protocols.GetFactionListReply;
    import FactionInfo = Protocols.FactionInfo;
    import GetFactionListReplyFields = Protocols.GetFactionListReplyFields;
    import JoinFaction = Protocols.JoinFaction;
    import JoinFactionReply = Protocols.JoinFactionReply;
    import JoinFactionReplyFields = Protocols.JoinFactionReplyFields;
    import GetFactionJoinListReply = Protocols.GetFactionJoinListReply;
    import GetFactionJoinListReplyFields = Protocols.GetFactionJoinListReplyFields;
    import FactionJoin = Protocols.FactionJoin;
    import Examine = Protocols.Examine;
    import ExamineReply = Protocols.ExamineReply;
    import ExamineReplyFields = Protocols.ExamineReplyFields;
    import DissolutionReply = Protocols.DissolutionReply;
    import DissolutionReplyFields = Protocols.DissolutionReplyFields;
    import BroadcastRecruitReply = Protocols.BroadcastRecruitReply;
    import ExitFactionReply = Protocols.ExitFactionReply;
    import ExitFactionReplyFields = Protocols.ExitFactionReplyFields;
    import Kick = Protocols.Kick;
    import KickReply = Protocols.KickReply;
    import KickReplyFields = Protocols.KickReplyFields;
    import SetPosition = Protocols.SetPosition;
    import SetPositionReply = Protocols.SetPositionReply;
    import SetPositionReplyFields = Protocols.SetPositionReplyFields;
    import GetFactionApplyListReply = Protocols.GetFactionApplyListReply;
    import GetFactionApplyListReplyFields = Protocols.GetFactionApplyListReplyFields;
    import SetFight = Protocols.SetFight;
    import GetApplyForPosListReply = Protocols.GetApplyForPosListReply;
    import GetApplyForPosListReplyFields = Protocols.GetApplyForPosListReplyFields;
    import ApplyForPosResultReply = Protocols.ApplyForPosResultReply;
    import ApplyForPosResultReplyFields = Protocols.ApplyForPosResultReplyFields;
    import ApplyForPosResult = Protocols.ApplyForPosResult;
    import SetFightReply = Protocols.SetFightReply;
    import SetFightReplyFields = Protocols.SetFightReplyFields;
    import SetTitleReply = Protocols.SetTitleReply;
    import SetTitleReplyFields = Protocols.SetTitleReplyFields;
    import SetNoticeReply = Protocols.SetNoticeReply;
    import SetNoticeReplyFields = Protocols.SetNoticeReplyFields;
    import GetFactionRankListReply = Protocols.GetFactionRankListReply;
    import SetExamine = Protocols.SetExamine;
    import SetExamineReply = Protocols.SetExamineReply;
    import SetExamineReplyFields = Protocols.SetExamineReplyFields;
    import SetFightFields = Protocols.SetFightFields;
    import UpdateFactionJoinList = Protocols.UpdateFactionJoinList;
    import UpdateFactionJoinListFields = Protocols.UpdateFactionJoinListFields;
    import SelectPush = Protocols.SelectPush;
    import AutoInvitation = Protocols.AutoInvitation;
    import GetAssistBoxListReply = Protocols.GetAssistBoxListReply;
    import GetBoxInfoReply = Protocols.GetBoxInfoReply;
    import GetBoxListReply = Protocols.GetBoxListReply;
    import GetBoxAward = Protocols.GetBoxAward;
    import GetBoxAwardReply = Protocols.GetBoxAwardReply;
    import OpenBox = Protocols.OpenBox;
    import OpenBoxReply = Protocols.OpenBoxReply;
    import AskAssist = Protocols.AskAssist;
    import AskAssistReply = Protocols.AskAssistReply;
    import F5BoxReply = Protocols.F5BoxReply;
    import AddSpeedBoxReply = Protocols.AddSpeedBoxReply;
    import AssistOpenBox = Protocols.AssistOpenBox;
    import AssistOpenBoxReply = Protocols.AssistOpenBoxReply;
    import GetHurtAwardListReply = Protocols.GetHurtAwardListReply;
    import GetBoxListReplyFields = Protocols.GetBoxListReplyFields;
    import GetBoxAwardReplyFields = Protocols.GetBoxAwardReplyFields;
    import OpenBoxReplyFields = Protocols.OpenBoxReplyFields;
    import AskAssistReplyFields = Protocols.AskAssistReplyFields;
    import F5BoxReplyFields = Protocols.F5BoxReplyFields;
    import AddSpeedBoxReplyFields = Protocols.AddSpeedBoxReplyFields;
    import AssistOpenBoxReplyFields = Protocols.AssistOpenBoxReplyFields;
    import GetFactionCopyInfoReply = Protocols.GetFactionCopyInfoReply;
    import GetAssistBoxListReplyFields = Protocols.GetAssistBoxListReplyFields;
    import FactionBox = Protocols.FactionBox;
    import GetHurtAwardListReplyFields = Protocols.GetHurtAwardListReplyFields;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import GetFactionCopyDataReply = Protocols.GetFactionCopyDataReply;
    import GetHurtAwardReply = Protocols.GetHurtAwardReply;
    import GetHurtAwardReplyFields = Protocols.GetHurtAwardReplyFields;
    import GetFactionSkillListReply = Protocols.GetFactionSkillListReply;
    import GetFactionSkillListReplyFields = Protocols.GetFactionSkillListReplyFields;
    import ApplyForPosReply = Protocols.ApplyForPosReply;
    import ApplyForPosReplyFields = Protocols.ApplyForPosReplyFields;
    import PromoteFactionSkillReply = Protocols.PromoteFactionSkillReply;
    import PromoteFactionSkillReplyFields = Protocols.PromoteFactionSkillReplyFields;
    import GetFactionTurnReply = Protocols.GetFactionTurnReply;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetFactionTurnRecordReply = Protocols.GetFactionTurnRecordReply;
    import GetFactionTurnRecordReplyFields = Protocols.GetFactionTurnRecordReplyFields;
    import FactionTurnReply = Protocols.FactionTurnReply;
    import FactionTurnReplyFields = Protocols.FactionTurnReplyFields;
    import GetBlessAwardReply = Protocols.GetBlessAwardReply;
    import GetBlessAwardReplyFields = Protocols.GetBlessAwardReplyFields;
    import FactionReqInspire = Protocols.FactionReqInspire;
    import FactionReqInspireReply = Protocols.FactionReqInspireReply;
    import FactionReqInspireReplyFields = Protocols.FactionReqInspireReplyFields;
    import FactionAllInspireReply = Protocols.FactionAllInspireReply;
    import FactionAllInspireReplyFields = Protocols.FactionAllInspireReplyFields;
    import AddCopyTimeReply = Protocols.AddCopyTimeReply;
    import AddCopyTimeReplyFields = Protocols.AddCopyTimeReplyFields;
    import AddCopyTime = Protocols.AddCopyTime;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SceneUtil = modules.scene.SceneUtil;
    import WindowEnum = ui.WindowEnum;
    import UpdateFactionApplyList = Protocols.UpdateFactionApplyList;
    import UpdateFactionApplyListFields = Protocols.UpdateFactionApplyListFields;

    export class FactionCtrl extends BaseCtrl {
        private static _instance: FactionCtrl;
        public static get instance(): FactionCtrl {
            return this._instance = this._instance || new FactionCtrl();
        }

        private _requestFlag: boolean = false;

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetFactionInfoReply, this, this.getFactionInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.CreateFactionReply, this, this.createFactionReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionListReply, this, this.getFactionListReply);
            Channel.instance.subscribe(SystemClientOpcode.JoinFactionReply, this, this.joinFactionReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionJoinListReply, this, this.getFactionJoinListReply);
            Channel.instance.subscribe(SystemClientOpcode.ExamineReply, this, this.examineReply);
            Channel.instance.subscribe(SystemClientOpcode.DissolutionReply, this, this.dissolutionReply);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastRecruitReply, this, this.broadcastRecruitReply);
            Channel.instance.subscribe(SystemClientOpcode.ExitFactionReply, this, this.exitFactionReply);
            Channel.instance.subscribe(SystemClientOpcode.KickReply, this, this.kickReply);
            Channel.instance.subscribe(SystemClientOpcode.SetPositionReply, this, this.setPositionReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionApplyListReply, this, this.getFactionApplyListReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFactionApplyList, this, this.updateFactionApplyList);
            Channel.instance.subscribe(SystemClientOpcode.GetApplyForPosListReply, this, this.getApplyForPosListReply);
            Channel.instance.subscribe(SystemClientOpcode.ApplyForPosResultReply, this, this.applyForPosResultReply);
            Channel.instance.subscribe(SystemClientOpcode.SetFightReply, this, this.setFightReply);
            Channel.instance.subscribe(SystemClientOpcode.SetTitleReply, this, this.setTitleReply);
            Channel.instance.subscribe(SystemClientOpcode.SetNoticeReply, this, this.setNoticeReply);
            Channel.instance.subscribe(SystemClientOpcode.KickNotify, this, this.kickNotify);
            Channel.instance.subscribe(SystemClientOpcode.SetExamineReply, this, this.setExamineReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFactionJoinList, this, this.updateFactionJoinList);
            Channel.instance.subscribe(SystemClientOpcode.AutoInvitation, this, this.autoInvitation);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionRankListReply, this, this.getFactionRankListReply);
            Channel.instance.subscribe(SystemClientOpcode.GetAssistBoxListReply, this, this.getAssistBoxListReply);
            Channel.instance.subscribe(SystemClientOpcode.GetBoxInfoReply, this, this.getBoxInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionCopyDataReply, this, this.getFactionCopyDataReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionCopyInfoReply, this, this.getFactionCopyInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetHurtAwardReply, this, this.getHurtAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionSkillListReply, this, this.getFactionSkillListReply);
            Channel.instance.subscribe(SystemClientOpcode.ApplyForPosReply, this, this.applyForPosReply);
            Channel.instance.subscribe(SystemClientOpcode.GetBoxListReply, this, this.getBoxListReply);
            Channel.instance.subscribe(SystemClientOpcode.PromoteFactionSkillReply, this, this.promoteFactionSkillReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionTurnReply, this, this.getFactionTurnReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFactionTurnRecordReply, this, this.getFactionTurnRecordReply);
            Channel.instance.subscribe(SystemClientOpcode.OpenBoxReply, this, this.openBoxReply);
            Channel.instance.subscribe(SystemClientOpcode.AskAssistReply, this, this.askAssistReply);
            Channel.instance.subscribe(SystemClientOpcode.FactionTurnReply, this, this.factionTurnReply);
            Channel.instance.subscribe(SystemClientOpcode.GetBlessAwardReply, this, this.getBlessAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetHurtAwardListReply, this, this.getHurtAwardListReply);
            Channel.instance.subscribe(SystemClientOpcode.AssistOpenBoxReply, this, this.assistOpenBoxReply);
            Channel.instance.subscribe(SystemClientOpcode.FactionReqInspireReply, this, this.factionReqInspireReply);
            Channel.instance.subscribe(SystemClientOpcode.FactionAllInspireReply, this, this.factionAllInspireReply);
            Channel.instance.subscribe(SystemClientOpcode.AddCopyTimeReply, this, this.addCopyTimeReply);
            Channel.instance.subscribe(SystemClientOpcode.AddSpeedBoxReply, this, this.addSpeedBoxReply);
            Channel.instance.subscribe(SystemClientOpcode.F5BoxReply, this, this.f5BoxReply);
            Channel.instance.subscribe(SystemClientOpcode.GetBoxAwardReply, this, this.getBoxAwardReply);

            GlobalData.dispatcher.on(CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            GlobalData.dispatcher.on(CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, FactionModel.instance, FactionModel.instance.checkDialRP);

            this.requsetAllData();
            //功能开启注册 仿写
            // FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
        }

        public requsetAllData() {
            this.getFactionInfo();
        }

        private delayRequest(): void {
            if (!FactionModel.instance.factionId) return;

            let post: FactionPosition = FactionModel.instance.post;
            let value: number[] = BlendCfg.instance.getCfgById(36003)[blendFields.intParam];
            if ((value[post] >> FactionPower.examine) & 1) {
                this.getFactionJoinList();
            }
            if (((value[post] >> FactionPower.huFa) & 1) || ((value[post] >> FactionPower.deputyLeader) & 1)) {
                this.getApplyForPosList();
            }
            this.getBoxList();
            this.getAssistBoxList();
            this.getHurtAwardList();
            this.getFactionTurn();
            this.getFactionSkillList();
        }

        /** 获取仙盟信息*/
        public getFactionInfo(): void {
            Channel.instance.publish(UserCenterOpcode.GetFactionInfo, null);
        }

        public getFactionInfoReply(tuple: GetFactionInfoReply): void {
            FactionModel.instance.getFactionInfoReply(tuple);
            if (!this._requestFlag) {
                this._requestFlag = true;
                this.delayRequest();
            }
        }

        /** 获取已申请加入的仙盟列表*/
        public getFactionApplyList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFactionApplyList, null);
        }

        public getFactionApplyListReply(tuple: GetFactionApplyListReply): void {
            let list: string[] = tuple[GetFactionApplyListReplyFields.list];
            FactionModel.instance.setYetRequestList(list);
        }

        //更新已申请加入的仙盟列表
        public updateFactionApplyList(tuple: UpdateFactionApplyList): void {
            let list: string[] = tuple[UpdateFactionApplyListFields.list];
            FactionModel.instance.updateYetRequestList(list);
            GlobalData.dispatcher.event(CommonEventType.FACTION_REQUEST_LIST_UPDATE);
        }

        /** 获取仙盟列表*/
        public getFactionList(): void {
            Channel.instance.publish(UserCenterOpcode.GetFactionList, null);
        }

        public getFactionListReply(tuple: GetFactionListReply): void {
            let list: Array<FactionInfo> = tuple[GetFactionListReplyFields.list];
            FactionModel.instance.factionList = list;
        }

        /** 创建仙盟*/
        public createFaction(name: CreateFaction): void {
            Channel.instance.publish(UserCenterOpcode.CreateFaction, name);
        }

        public createFactionReply(tuple: CreateFactionReply): void {
            let code: number = tuple[CreateFactionReplyFields.result];
            if (!code) {
                WindowManager.instance.open(WindowEnum.FACTION_PANEL);
            }
            CommonUtil.codeDispose(code, `创建成功`);
        }

        /** 加入仙盟*/
        public joinFaction(uUid: JoinFaction): void {
            Channel.instance.publish(UserCenterOpcode.JoinFaction, uUid);
        }

        public joinFactionReply(tuple: JoinFactionReply): void {
            let code: number = tuple[JoinFactionReplyFields.result];
            if (code == 0) {
                SystemNoticeManager.instance.addNotice(`申请成功`);
            } else if (code == ErrorCode.FactionJoinSuccess) {
                SystemNoticeManager.instance.addNotice(`恭喜您加入公会`);
                WindowManager.instance.open(WindowEnum.FACTION_PANEL);
                // ChatCtrl.instance.getFactionChat();
            } else {
                CommonUtil.noticeError(code);
                if (code == ErrorCode.FactionNotExist || code == ErrorCode.FactionJoinConditionNotEnough) {
                    this.getFactionList();
                }
            }
        }

        /** 获取仙盟申请加入列表*/
        public getFactionJoinList(): void {
            Channel.instance.publish(UserCenterOpcode.GetFactionJoinList, null);
        }

        public getFactionJoinListReply(tuple: GetFactionJoinListReply): void {
            let code: number = tuple[GetFactionJoinListReplyFields.code];
            if (!code) {
                let list: Array<FactionJoin> = tuple[GetFactionJoinListReplyFields.list];
                FactionModel.instance.requestJoinList = list;
            } else {
                CommonUtil.noticeError(code);
            }
        }

        public updateFactionJoinList(tuple: UpdateFactionJoinList): void {
            FactionModel.instance.requestJoinList = tuple[UpdateFactionJoinListFields.list];
        }

        /** 审批*/
        public examine(tuple: Examine): void {
            Channel.instance.publish(UserCenterOpcode.Examine, tuple);
        }

        public examineReply(tuple: ExamineReply): void {
            let code: number = tuple[ExamineReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }

        /** 设置加入仙盟审批状态*/
        public setExamine(state: SetExamine): void {
            Channel.instance.publish(UserCenterOpcode.SetExamine, state);
        }

        public setExamineReply(tuple: SetExamineReply): void {
            let code: number = tuple[SetExamineReplyFields.result];
            CommonUtil.codeDispose(code, `设置成功`);
        }

        /** 解散仙盟*/
        public dissolution(): void {
            Channel.instance.publish(UserCenterOpcode.Dissolution, null);
        }

        public dissolutionReply(tuple: DissolutionReply): void {
            let code: number = tuple[DissolutionReplyFields.result];
            CommonUtil.codeDispose(code, `解散成功`);
        }

        /** 广播招人*/
        public broadcastRecruit(): void {
            Channel.instance.publish(UserCenterOpcode.BroadcastRecruit, null);
        }

        public broadcastRecruitReply(tuple: BroadcastRecruitReply): void {
            let code: number = tuple[DissolutionReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }

        /** 退出仙盟*/
        public exitFaction(): void {
            Channel.instance.publish(UserCenterOpcode.ExitFaction, null);
        }

        public exitFactionReply(tuple: ExitFactionReply): void {
            let code: number = tuple[ExitFactionReplyFields.result];
            CommonUtil.codeDispose(code, `退出成功`);
        }

        /** 踢人*/
        public kick(agentId: Kick): void {
            Channel.instance.publish(UserCenterOpcode.Kick, agentId);
        }

        public kickReply(tuple: KickReply): void {
            let code: number = tuple[KickReplyFields.result];
            CommonUtil.codeDispose(code, `踢出成功`);
        }

        /** 任职*/
        public SetPosition(tuple: SetPosition): void {
            Channel.instance.publish(UserCenterOpcode.SetPosition, tuple);
        }

        public setPositionReply(tuple: SetPositionReply): void {
            let code: number = tuple[SetPositionReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }

        /** 职位申请 */
        public applyForPos(post: number): void {
            Channel.instance.publish(UserCenterOpcode.ApplyForPos, [post]);
        }

        public applyForPosReply(tuple: ApplyForPosReply): void {
            let code: number = tuple[ApplyForPosReplyFields.result];
            CommonUtil.codeDispose(code, `申请成功`);
        }

        /** 获取申请职位列表 */
        public getApplyForPosList(): void {
            Channel.instance.publish(UserCenterOpcode.GetApplyForPosList, null);
        }

        public getApplyForPosListReply(tuple: GetApplyForPosListReply): void {
            let list: Array<Protocols.Pair> = tuple[GetApplyForPosListReplyFields.list];
            FactionModel.instance.applyForPosList = list ? list : [];
        }

        /** 获取职位审批结果 */
        public applyForPosResult(tuple: ApplyForPosResult): void {
            Channel.instance.publish(UserCenterOpcode.ApplyForPosResult, tuple);
        }

        public applyForPosResultReply(tuple: ApplyForPosResultReply): void {
            let code: number = tuple[ApplyForPosResultReplyFields.result];
            CommonUtil.codeDispose(code, `审批成功`);
        }

        /** 设置战力条件*/
        public setFight(value: SetFight): void {
            value = [value[SetFightFields.fight] * 10000];
            Channel.instance.publish(UserCenterOpcode.SetFight, value);
        }

        public setFightReply(tuple: SetFightReply): void {
            let code: number = tuple[SetFightReplyFields.result];
            CommonUtil.codeDispose(code, `设置成功`);
        }

        /** 设置招人标题*/
        public setTitle(value: string): void {
            Channel.instance.publish(UserCenterOpcode.SetTitle, [value]);
        }

        public setTitleReply(tuple: SetTitleReply): void {
            let code: number = tuple[SetTitleReplyFields.result];
            CommonUtil.codeDispose(code, `设置成功`);
        }

        /** 设置公告*/
        public setNotice(value: string): void {
            Channel.instance.publish(UserCenterOpcode.SetNotice, [value]);
        }

        public setNoticeReply(tuple: SetNoticeReply): void {
            let code: number = tuple[SetNoticeReplyFields.result];
            CommonUtil.codeDispose(code, `设置成功`);
        }

        /** 获取排行榜*/
        public getFactionRankList(): void {
            Channel.instance.publish(UserCenterOpcode.GetFactionRankList, null);
        }

        public getFactionRankListReply(tuple: GetFactionRankListReply): void {
            FactionModel.instance.rankList = tuple;
        }

        /**被踢了通知*/
        public kickNotify(): void {
            let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [WindowEnum.FACTION_JOIN_PANEL]);
            CommonUtil.alert(`温馨提示`, `你已被移出工会,请另选其他公会加入~`, [handler]);
        }

        /** 自动邀请*/
        private autoInvitation(tuple: AutoInvitation): void {
            if (SceneUtil.isCommonScene && !WindowManager.instance.isOpened(WindowEnum.FACTION_AUTO_INVITE_PANEL)) {
                WindowManager.instance.open(WindowEnum.FACTION_AUTO_INVITE_PANEL, tuple);
            }
        }

        /** 勾选今日邀请不再推送 true今日不再推送，false推送*/
        public selectPush(tuple: SelectPush): void {
            Channel.instance.publish(UserFeatureOpcode.SelectPush, tuple);
        }

        /** 获取宝箱相关信息*/
        public getBoxInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetBoxInfo, null);
        }

        public getBoxInfoReply(tuple: GetBoxInfoReply): void {
            FactionModel.instance.boxInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.BAOZANG_INFO_UPDATE);
        }

        /** 获取宝箱list*/
        public getBoxList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetBoxList, null);
        }

        public getBoxListReply(tuple: GetBoxListReply): void {
            let list: Array<FactionBox> = tuple[GetBoxListReplyFields.list];
            FactionModel.instance.boxList = list;
            FactionModel.instance.mineBoxList = list;
            GlobalData.dispatcher.event(CommonEventType.BAOZANG_LIST_UPDATE);
        }

        /**领取宝箱奖励*/
        public getBoxAward(tuple: GetBoxAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetBoxAward, tuple);
        }

        public getBoxAwardReply(tuple: GetBoxAwardReply): void {
            let code: number = tuple[GetBoxAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }

        /**挖宝箱*/
        public openBox(tuple: OpenBox): void {
            Channel.instance.publish(UserFeatureOpcode.OpenBox, tuple);
        }

        public openBoxReply(tuple: OpenBoxReply): void {
            let code: number = tuple[OpenBoxReplyFields.result];
            CommonUtil.codeDispose(code, `挖宝箱成功`);
        }

        /**请求协助*/
        public askAssist(tuple: AskAssist): void {
            Channel.instance.publish(UserFeatureOpcode.AskAssist, tuple);
        }

        public askAssistReply(tuple: AskAssistReply): void {
            let code: number = tuple[AskAssistReplyFields.result];
            CommonUtil.codeDispose(code, `求助成功`);
        }

        /**刷新宝箱*/
        public f5Box(): void {
            Channel.instance.publish(UserFeatureOpcode.F5Box, null);
        }

        public f5BoxReply(tuple: F5BoxReply): void {
            let code: number = tuple[F5BoxReplyFields.result];
            if (code == ErrorCode.goldNotEnough) { //
                CommonUtil.goldNotEnoughAlert();
            } else {
                CommonUtil.codeDispose(code, `刷新成功`);
            }
        }

        /**加速宝箱*/
        public addSpeedBox(boxId: string, itemId: ItemId): void {
            if (DEBUG) {
                if (typeof boxId != "string" || typeof itemId != "number") {
                    throw new Error(`addSpeedBox(${boxId}, ${itemId})`);
                }
            }
            Channel.instance.publish(UserFeatureOpcode.AddSpeedBox, [boxId, itemId]);
        }

        public addSpeedBoxReply(tuple: AddSpeedBoxReply): void {
            let code: number = tuple[AddSpeedBoxReplyFields.result];
            CommonUtil.codeDispose(code, `加速成功`);
        }

        /** 获取需要协助的宝箱*/
        public getAssistBoxList(): void {
            Channel.instance.publish(UserCenterOpcode.GetAssistBoxList, null);
        }

        public getAssistBoxListReply(tuple: GetAssistBoxListReply): void {
            FactionModel.instance.boxHelpList = tuple[GetAssistBoxListReplyFields.list];
            FactionModel.instance.boxListF5Time = tuple[GetAssistBoxListReplyFields.time];
            GlobalData.dispatcher.event(CommonEventType.BAOZANG_HELP_LIST_UPDATE);
        }

        /**协助别人开宝箱*/
        public assistOpenBox(tuple: AssistOpenBox): void {
            Channel.instance.publish(UserFeatureOpcode.AssistOpenBox, tuple);
        }

        public assistOpenBoxReply(tuple: AssistOpenBoxReply): void {
            let code: number = tuple[AssistOpenBoxReplyFields.result];
            CommonUtil.codeDispose(code, `协助成功`);
        }

        /**获取仙盟副本信息*/
        public getFactionCopyInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFactionCopyInfo, null);
        }

        public getFactionCopyInfoReply(tuple: GetFactionCopyInfoReply): void {
            FactionModel.instance.copyInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.FACTION_COPY_INFO);
        }

        /**获取伤害奖励列表*/
        public getHurtAwardList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetHurtAwardList, null);
        }

        public getHurtAwardListReply(tuple: GetHurtAwardListReply): void {
            FactionModel.instance.hurt = tuple[GetHurtAwardListReplyFields.hurt];
            FactionModel.instance.hurtAwardList = tuple[GetHurtAwardListReplyFields.list];
            GlobalData.dispatcher.event(CommonEventType.FACTION_HURT_INFO);
        }

        /**获取仙盟副本内数据返回*/
        public getFactionCopyData(): void {
            Channel.instance.publish(UserMapOpcode.GetFactionCopyData, null);
        }

        public getFactionCopyDataReply(tuple: GetFactionCopyDataReply): void {
            FactionModel.instance.copyData = tuple;
            GlobalData.dispatcher.event(CommonEventType.FACTION_COPY_DATA);
        }

        /**领取伤害奖励*/
        public getHurtAward(index: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetHurtAward, [index]);
        }

        public getHurtAwardReply(tuple: GetHurtAwardReply): void {
            let code: number = tuple[GetHurtAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }

        /**获取仙盟技能*/
        public getFactionSkillList(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFactionSkillList, null);
        }

        public getFactionSkillListReply(tuple: GetFactionSkillListReply): void {
            FactionModel.instance.skillList = tuple[GetFactionSkillListReplyFields.skillList];
        }

        /**提升或激活仙盟技能*/
        public promoteFactionSkill(skillId: number): void {
            Channel.instance.publish(UserFeatureOpcode.PromoteFactionSkill, [skillId]);
        }

        public promoteFactionSkillReply(tuple: PromoteFactionSkillReply): void {
            let code: number = tuple[PromoteFactionSkillReplyFields.result];
            CommonUtil.codeDispose(code, `升级成功`);
        }

        /** 获取转盘信息*/
        public getFactionTurn(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFactionTurn, null);
        }

        public getFactionTurnReply(tuple: GetFactionTurnReply): void {
            if (!tuple) return;
            FactionModel.instance.dialInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.FACTION_WEAL_UPDATE);
        }

        /**获取仙盟转盘记录*/
        public getFactionTurnRecord(): void {
            Channel.instance.publish(UserCenterOpcode.GetFactionTurnRecord, null);
        }

        public getFactionTurnRecordReply(tuple: GetFactionTurnRecordReply): void {
            FactionModel.instance.turnList = tuple[GetFactionTurnRecordReplyFields.list];
            GlobalData.dispatcher.event(CommonEventType.FACTION_TURN_LIST);
        }

        /** 转转*/
        public factionTurn(time: number): void {
            Channel.instance.publish(UserFeatureOpcode.FactionTurn, [time]);
        }

        public factionTurnReply(tuple: FactionTurnReply): void {
            let result: number = tuple[FactionTurnReplyFields.result];
            if (!result) {
                FactionModel.instance.turnResult = tuple[FactionTurnReplyFields.list];
                GlobalData.dispatcher.event(CommonEventType.FACTION_TURN_RESULT);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        /**领取幸运值奖励*/
        public getBlessAward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetBlessAward, null);
        }

        public getBlessAwardReply(tuple: GetBlessAwardReply): void {
            let code: number = tuple[GetBlessAwardReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }

        /** 鼓舞 */
        public factionReqInspire(tuple: FactionReqInspire): void {
            Channel.instance.publish(UserFeatureOpcode.FactionReqInspire, tuple);
        }

        public factionReqInspireReply(tuple: FactionReqInspireReply): void {
            let code: number = tuple[FactionReqInspireReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }

        /**全员鼓舞 */
        public factionAllInspire(): void {
            Channel.instance.publish(UserMapOpcode.FactionAllInspire, null);
        }

        public factionAllInspireReply(tuple: FactionAllInspireReply): void {
            let code: number = tuple[FactionAllInspireReplyFields.result];
            CommonUtil.codeDispose(code, `操作成功`);
        }

        /** 使用诛仙令 */
        public addCopyTime(tuple: AddCopyTime): void {
            Channel.instance.publish(UserFeatureOpcode.AddCopyTime, tuple);
        }

        public addCopyTimeReply(tuple: AddCopyTimeReply): void {
            let code: number = tuple[AddCopyTimeReplyFields.result];
            CommonUtil.codeDispose(code, `增加挑战时长成功`);
        }

        // 更新名字
        private updateName(): void {
            FactionModel.instance.updateName();
        }

        // 更新职业
        private updateOcc(): void {
            FactionModel.instance.updateOcc();
        }
    }
}
