
/** 逐鹿控制脚本 */
namespace modules.zhulu {
    import GetXuanhuoCopyReply = Protocols.GetXuanhuoCopyReply;
    import GetXuanhuoCopyReplyFields = Protocols.GetXuanhuoCopyReplyFields;
    import LogUtils = game.misc.LogUtils;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    import BaseCtrl = modules.core.BaseCtrl;
    import GetTeamChiefHurtReply = Protocols.GetTeamChiefHurtReply;
    import GetTeamChiefHurtReplyFields = Protocols.GetTeamChiefHurtReplyFields;

    import GetTeamChiefScoreReply = Protocols.GetTeamChiefScoreReply;
    import GetTeamChiefScoreReplyFields = Protocols.GetTeamChiefScoreReplyFields;

    import GetTeamChiefScoreAwardList = Protocols.GetTeamChiefScoreAwardList;
    import GetTeamChiefScoreAwardListFields = Protocols.GetTeamChiefScoreAwardListFields;

    import GetTeamChiefScoreAwardReply = Protocols.GetTeamChiefScoreAwardReply;
    import GetTeamChiefScoreAwardReplyFields = Protocols.GetTeamChiefScoreAwardReplyFields;


    import GetTeamChiefCopyInfoReply = Protocols.GetTeamChiefCopyInfoReply;
    import GetTeamChiefCopyInfoReplyFields = Protocols.GetTeamChiefCopyInfoReplyFields;
    import GetTeamPrepareCopyInfoReply = Protocols.GetTeamPrepareCopyInfoReply;
    import GetTeamPrepareCopyInfoReplyFields = Protocols.GetTeamPrepareCopyInfoReplyFields;
    import UpdateGatherInfoReply = Protocols.UpdateGatherInfoReply;
    import UpdateGatherInfoReplyFields = Protocols.UpdateGatherInfoReplyFields;


    import GetTeamChiefRankListReply = Protocols.GetTeamChiefRankListReply;
    import GetTeamChiefRankListReplyFields = Protocols.GetTeamChiefRankListReplyFields;

    import GetTeamBattleCopyInfoReply = Protocols.GetTeamBattleCopyInfoReply;
    import GetTeamBattleCopyInfoReplyFields = Protocols.GetTeamBattleCopyInfoReplyFields;

    import TeamBattleCopyFinishReply = Protocols.TeamBattleCopyFinishReply;
    import TeamBattleCopyFinishReplyFields = Protocols.TeamBattleCopyFinishReplyFields;

    import ChiefCopyFinishReply = Protocols.ChiefCopyFinishReply;
    import ChiefCopyFinishReplyFields = Protocols.ChiefCopyFinishReplyFields;

    import UpdateTeamBattleInfo = Protocols.UpdateTeamBattleInfo;
    import UpdateTeamBattleInfoFields = Protocols.UpdateTeamBattleInfoFields;

    import UpdateTeanBattleScore = Protocols.UpdateTeanBattleScore;
    import UpdateTeanBattleScoreFields = Protocols.UpdateTeanBattleScoreFields;

    import GetTeamChiefHurtAwardReply = Protocols.GetTeamChiefHurtAwardReply;
    import GetTeamChiefHurtAwardReplyFields = Protocols.GetTeamChiefHurtAwardReplyFields;

    import GetAchievementInfoReply = Protocols.GetAchievementInfoReply;
    import GetAchievementInfoReplyFields = Protocols.GetAchievementInfoReplyFields;

    import GetAchievementTaskAwardReply = Protocols.GetAchievementTaskAwardReply;
    import GetAchievementTaskAwardReplyFields = Protocols.GetAchievementTaskAwardReplyFields;

    import UpdateTeamBattleReborn = Protocols.UpdateTeamBattleReborn;
    import UpdateTeamBattleRebornFields = Protocols.UpdateTeamBattleRebornFields;

    import GetTeamBattleWorshipInfoReply = Protocols.GetTeamBattleWorshipInfoReply;
    import GetTeamBattleWorshipInfoReplyFields = Protocols.GetTeamBattleWorshipInfoReplyFields;

    import GetTeamBattleWorshipReply = Protocols.GetTeamBattleWorshipReply;
    import GetTeamBattleWorshipReplyFields = Protocols.GetTeamBattleWorshipReplyFields;

    import GetTeamBattleCopyTimeReply = Protocols.GetTeamBattleCopyTimeReply;
    import GetTeamBattleCopyTimeReplyFields = Protocols.GetTeamBattleCopyTimeReplyFields;



    export class ZhuLuCtrl extends BaseCtrl {
        private static _instance: ZhuLuCtrl;
        public static get instance(): ZhuLuCtrl {
            return this._instance = this._instance || new ZhuLuCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetTeamChiefHurtReply, this, this.GetTeamChiefHurtReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamChiefCopyInfoReply, this, this.GetTeamChiefCopyInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamBattleCopyTimeReply, this, this.GetTeamBattleCopyTimeReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamPrepareCopyInfoReply, this, this.GetTeamPrepareCopyInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateGatherInfoReply, this, this.UpdataGatherInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamChiefRankListReply, this, this.GetTeamChiefRankListReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamBattleCopyInfoReply, this, this.GetTeamBattleCopyInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.TeamBattleCopyFinishReply, this, this.TeamBattleCopyFinishReply);
            Channel.instance.subscribe(SystemClientOpcode.ChiefCopyFinishReply, this, this.ChiefCopyFinishReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeamBattleInfo, this, this.UpdateTeamBattleInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeanBattleScore, this, this.UpdateTeanBattleScore);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamChiefHurtAwardReply, this, this.GetTeamChiefHurtAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetAchievementInfoReply, this, this.GetAchievementInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetAchievementTaskAwardReply, this, this.GetAchievementTaskAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTeamBattleReborn, this, this.UpdateTeamBattleReborn);

            Channel.instance.subscribe(SystemClientOpcode.GetTeamBattleWorshipReply, this, this.GetTeamBattleWorshipReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamBattleWorshipInfoReply, this, this.GetTeamBattleWorshipInfoReply);


            Channel.instance.subscribe(SystemClientOpcode.GetTeamChiefScoreReply, this, this.GetTeamChiefScoreReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTeamChiefScoreAwardReply, this, this.GetTeamChiefScoreAwardReply);

            this.request();
        }

        private request(): void {
            this.GetTeamChiefCopyInfo();
            this.GetTeamPrepareCopyInfo()
            this.GetTeamChiefHurtAwardList();
            this.GetTeamChiefRankList();
            this.GetTeamBattleCopyStatus();
            this.GetAchievementInfo();
            this.GetTeamBattleWorshipInfo();
            this.GetTeamChiefScoreAwardList();
        }
        public GetTeamBattleWorship(): void {
            console.log('研发测试_chy:GetTeamBattleWorship',);
            Channel.instance.publish(UserCenterOpcode.GetTeamBattleWorship, null);
        }

        public GetTeamBattleWorshipInfo(): void {
            console.log('研发测试_chy:GetTeamBattleWorshipInfo',);
            Channel.instance.publish(UserCenterOpcode.GetTeamBattleWorshipInfo, null);
        }

        public GetTeamBattleWorshipReply(tuple: GetTeamBattleWorshipReply): void {
            console.log('研发测试_chy:GetTeamBattleWorshipReply', tuple);
            CommonUtil.codeDispose(tuple[GetTeamBattleWorshipReplyFields.result], "膜拜成功!");
            if (!tuple[GetTeamBattleWorshipReplyFields.result]) {
                this.GetTeamBattleWorshipInfo();
            }

        }

        public GetTeamBattleWorshipInfoReply(tuple: GetTeamBattleWorshipInfoReply): void {
            console.log('研发测试_chy:GetTeamBattleWorshipInfoReply 测试车市扯碎', tuple);
            ZhuLuModel.instance.WorshipInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.TeamBattle_WORSHIP_UPDATA_DATA);
        }




        private UpdateTeamBattleReborn(tuple: UpdateTeamBattleReborn) {
            GlobalData.dispatcher.event(CommonEventType.TeamBattle_REBORN_UPDATA, [tuple[UpdateTeamBattleRebornFields.time] || 0]);
        }


        // 获取首领战积分排行榜
        public getHeaderWarRankInfo(): void {
            this.GetTeamChiefRankList();
        }

        public GetAchievementTaskAward(id): void {
            console.log('研发测试_chy:GetAchievementTaskAward', id);
            Channel.instance.publish(UserFeatureOpcode.GetAchievementTaskAward, [id]);
        }

        public GetAchievementTaskAwardReply(tuple: GetAchievementTaskAwardReply): void {
            console.log('研发测试_chy:GetAchievementTaskAwardReply', tuple);
        }

        public GetAchievementInfoReply(tuple: GetAchievementInfoReply): void {
            console.log('研发测试_chy:GetAchievementInfoReply', tuple);
            ZhuLuModel.instance.achievementList = tuple
        }

        public GetTeamChiefHurtAwardReply(tuple: GetTeamChiefHurtAwardReply): void {
            console.log('研发测试_chy:GetTeamChiefHurtAwardReply', tuple);
        }

        public UpdateTeamBattleInfo(tuple: UpdateTeamBattleInfo): void {
            console.log('研发测试_chy:UpdateTeamBattleInfo', tuple);
            ZhuLuModel.instance.scoreInfo = tuple
        }


        public UpdateTeanBattleScore(tuple: UpdateTeanBattleScore): void {
            console.log('研发测试_chy:UpdateTeanBattleScore', tuple);
            ZhuLuModel.instance.addScore(tuple[UpdateTeanBattleScoreFields.addScore])
        }


        public ChiefCopyFinishReply(tuple: ChiefCopyFinishReply): void {
            console.log('研发测试_chy:ChiefCopyFinishReply', tuple);
            ZhuLuModel.instance.openChiefCopyFinish();
        }


        public TeamBattleCopyFinishReply(tuple: TeamBattleCopyFinishReply): void {
            console.log('研发测试_chy:TeamBattleCopyFinishReply', tuple);
            ZhuLuModel.instance.teamBattleCopyFinishReply = tuple
        }

        public GetTeamBattleCopyInfoReply(tuple: GetTeamBattleCopyInfoReply): void {
            console.log('研发测试_chy:GetTeamBattleCopyInfoReply', tuple);
            ZhuLuModel.instance.setBattleinfo(tuple)
        }

        public UpdataGatherInfoReply(tuple: UpdateGatherInfoReply): void {
            console.log('研发测试_chy:UpdateGatherInfoReply', tuple);
            ZhuLuModel.instance.movePos = tuple[UpdateGatherInfoReplyFields.pos];
            // GlobalData.dispatcher.event(CommonEventType.TeamBattle_Gather_UPDATA_DATA, tuple[UpdateGatherInfoReplyFields.restult]);
        }

        public GetAchievementInfo(): void {
            console.log('研发测试_chy:GetAchievementInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetAchievementInfo, null);
        }


        public GetTeamBattleCopyStatus(): void {
            console.log('研发测试_chy:GetTeamBattleCopyStatus',);
            Channel.instance.publish(UserCenterOpcode.GetTeamBattleCopyStatus, null);
        }

        public GetTeamChiefHurtAward(id: number): void {
            console.log('研发测试_chy:GetTeamChiefHurtAward',);
            Channel.instance.publish(UserFeatureOpcode.GetTeamChiefHurtAward, [id]);
        }



        public GetTeamChiefCopyInfo(): void {
            console.log('研发测试_chy:GetTeamChiefCopyInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetTeamChiefCopyInfo, null);
        }



        public GetTeamPrepareCopyInfo(): void {
            console.log('研发测试_chy:GetTeamPrepareCopyInfo',);
            Channel.instance.publish(UserFeatureOpcode.GetTeamPrepareCopyInfo, null);
        }

        public GetTeamChiefHurtAwardList(): void {
            console.log('研发测试_chy:GetTeamChiefHurtAwardList',);
            Channel.instance.publish(UserFeatureOpcode.GetTeamChiefHurtAwardList, null);
        }
        public GetTeamChiefRankList(): void {
            console.log('研发测试_chy:GetTeamChiefRankList',);
            Channel.instance.publish(UserCenterOpcode.GetTeamChiefRankList, null);
        }

        public GetTeamChiefRankListReply(tuple: GetTeamChiefRankListReply): void {
            console.log('研发测试_chy:GetTeamChiefRankListReply', tuple);
            ZhuLuModel.instance.setChiefRankList(tuple)
        }
        // 战场积分
        public GetTeamChiefScoreAwardList(): void {
            console.log('研发测试_chy:GetTeamChiefScoreAwardList',);
            Channel.instance.publish(UserFeatureOpcode.GetTeamChiefScoreAwardList, null);
        }

        public GetTeamChiefScoreAward(id: number): void {
            console.log('研发测试_chy:GetTeamChiefScoreAward',);
            Channel.instance.publish(UserFeatureOpcode.GetTeamChiefScoreAward, [id]);
        }

        public GetTeamChiefScoreAwardReply(tuple: GetTeamChiefScoreAwardReply): void {
            console.log('研发测试_chy:GetTeamChiefScoreAwardReply', tuple);
        }

        public GetTeamChiefScoreReply(tuple: GetTeamChiefScoreReply): void {
            console.log('研发测试_chy:GetTeamChiefScoreReply', tuple);
            ZhuLuModel.instance.score = tuple[GetTeamChiefScoreReplyFields.score];
            ZhuLuModel.instance.scoreAwardList = tuple[GetTeamChiefScoreReplyFields.list];
            GlobalData.dispatcher.event(CommonEventType.TeamChief_HURT_INFO);
            GlobalData.dispatcher.event(CommonEventType.ZHULU_UPDATE_HWDAMAGE_LIST);
        }






        public GetTeamChiefHurtReply(tuple: GetTeamChiefHurtReply): void {
            console.log('研发测试_chy:GetTeamChiefHurtReply', tuple);
            ZhuLuModel.instance.hurt = tuple[GetTeamChiefHurtReplyFields.hurt];
            ZhuLuModel.instance.hurtAwardList = tuple[GetTeamChiefHurtReplyFields.list];
            GlobalData.dispatcher.event(CommonEventType.TeamChief_HURT_INFO);
            GlobalData.dispatcher.event(CommonEventType.ZHULU_UPDATE_HWDAMAGE_LIST);


        }
        public GetTeamChiefCopyInfoReply(tuple: GetTeamChiefCopyInfoReply): void {
            console.log('研发测试_chy:GetTeamChiefCopyInfoReply', tuple);
            ZhuLuModel.instance.copyInfo = tuple;
        }

        public GetTeamBattleCopyTimeReply(tuple: GetTeamBattleCopyTimeReply): void {
            console.log('研发测试_chy:GetTeamBattleCopyTimeReply', tuple);
            ZhuLuModel.instance.battleInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.TeamBattle_COPY_DATA);
        }


        public GetTeamPrepareCopyInfoReply(tuple: GetTeamPrepareCopyInfoReply): void {
            console.log('研发测试_chy:GetTeamPrepareCopyInfoReply', tuple);
            ZhuLuModel.instance.prepareInfo = tuple;
            GlobalData.dispatcher.event(CommonEventType.TeamPrepare_COPY_DATA);
        }

    }
}