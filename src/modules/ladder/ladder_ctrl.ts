/** 天梯*/


namespace modules.ladder {
    import BaseCtrl = modules.core.BaseCtrl;
    import UpdateTiantiScore = Protocols.UpdateTiantiScore;
    import UpdateTiantiFeatAwardStates = Protocols.UpdateTiantiFeatAwardStates;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetTiantiReply = Protocols.GetTiantiReply;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetTiantiRankReply = Protocols.GetTiantiRankReply;
    import UpdateTiantiJoinAwardStats = Protocols.UpdateTiantiJoinAwardStats;
    import GetTiantiJoinAwardReply = Protocols.GetTiantiJoinAwardReply;
    import UpdateTiantiTimes = Protocols.UpdateTiantiTimes;
    import UpdateTiantiScoreFields = Protocols.UpdateTiantiScoreFields;
    import UpdateTiantiJoinAwardStatsFields = Protocols.UpdateTiantiJoinAwardStatsFields;
    import UpdateTiantiFeatAwardStatesFields = Protocols.UpdateTiantiFeatAwardStatesFields;
    import UpdateTiantiTimesFields = Protocols.UpdateTiantiTimesFields;
    import GetTiantiReplyFields = Protocols.GetTiantiReplyFields;
    import UpdateTiantiHonor = Protocols.UpdateTiantiHonor;
    import GetTiantiJoinAwardReplyFields = Protocols.GetTiantiJoinAwardReplyFields;
    import GetTiantiRankReplyFields = Protocols.GetTiantiRankReplyFields;
    import UpdateTiantiHonorFields = Protocols.UpdateTiantiHonorFields;
    import UpdateTiantiScoreAward = Protocols.UpdateTiantiScoreAward;
    import UpdateNotFoundEnemy = Protocols.UpdateNotFoundEnemy;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import MissionModel = modules.mission.MissionModel;

    export class LadderCtrl extends BaseCtrl {
        private static _instance: LadderCtrl;
        public static get instance(): LadderCtrl {
            return this._instance = this._instance || new LadderCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 更新天梯积分
            Channel.instance.subscribe(SystemClientOpcode.UpdateTiantiScore, this, this.updateTiantiScore);
            // 更新参与奖励状态
            Channel.instance.subscribe(SystemClientOpcode.UpdateTiantiJoinAwardStats, this, this.updateTiantiJoinAwardStats);
            // 更新功勋奖励状态
            Channel.instance.subscribe(SystemClientOpcode.UpdateTiantiFeatAwardStates, this, this.updateTiantiFeatAwardStates);
            // 更新天梯次数
            Channel.instance.subscribe(SystemClientOpcode.UpdateTiantiTimes, this, this.updateTiantiTimes);
            // 获取天梯信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetTiantiReply, this, this.getTiantiReply);
            // 获取天梯排行返回
            Channel.instance.subscribe(SystemClientOpcode.GetTiantiRankReply, this, this.getTiantiRankReply);
            // 领取参与奖励返回
            Channel.instance.subscribe(SystemClientOpcode.GetTiantiJoinAwardReply, this, this.getTiantiJoinAwardReply);
            // 领取功勋奖励返回
            // Channel.instance.subscribe(SystemClientOpcode.GetTiantiFeatAwardReply, this, this.getTiantiFeatAwardReply);
            // 更新天梯荣誉
            Channel.instance.subscribe(SystemClientOpcode.UpdateTiantiHonor, this, this.updateTiantiHonor);
            // 更新天梯积分奖励
            Channel.instance.subscribe(SystemClientOpcode.UpdateTiantiScoreAward, this, this.updateTiantiScoreAward);
            // 敌方未进入
            Channel.instance.subscribe(SystemClientOpcode.UpdateNotFoundEnemy, this, this.updateNotFoundEnemy);
            
            this.requsetAllData();
           
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, LadderModel.instance, LadderModel.instance.funOpenGetSprintRankInfo);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_SCENE_STATE_UPDATE, LadderModel.instance, LadderModel.instance.judgeLadderJoinAwardRP);
           
        }
        public requsetAllData() {
            this.getTianti();
        }
        // 更新天梯积分
        private updateTiantiScore(value: UpdateTiantiScore): void {
            // console.log("更新天梯积分.............." + value);
            LadderModel.instance.tiantiScore = value[UpdateTiantiScoreFields.score];
        }

        // 更新连胜奖励状态
        private updateTiantiJoinAwardStats(value: UpdateTiantiJoinAwardStats): void {
            // console.log("更新天梯参与奖励状态................" + value);
            LadderModel.instance.joinAwardStates = value[UpdateTiantiJoinAwardStatsFields.awardStates];
        }

        // 更新功勋奖励状态
        private updateTiantiFeatAwardStates(value: UpdateTiantiFeatAwardStates): void {
            // console.log("更新功勋奖励状态................." + value);
            LadderModel.instance.featAwardStates = value[UpdateTiantiFeatAwardStatesFields.awardStates];
        }

        // 更新天梯次数
        private updateTiantiTimes(value: UpdateTiantiTimes): void {
            // console.log("更新天梯次数..............." + value);
            LadderModel.instance.times = value[UpdateTiantiTimesFields.times];
        }

        // 获取天梯信息
        public getTianti(): void {
            // console.log("获取天梯信息.....................");
            Channel.instance.publish(UserFeatureOpcode.GetTianti, null);
        }

        // 获取天梯信息返回
        private getTiantiReply(value: GetTiantiReply): void {
            // console.log("获取天梯信息返回.................." + value);
            LadderModel.instance.ladderInfo = value[GetTiantiReplyFields.tianti];
        }

        // 领取参与奖励
        public getTiantiJoinAward(index: int): void {
            // console.log("领取参与奖励.............." + index);
            Channel.instance.publish(UserFeatureOpcode.GetTiantiJoinAward, [index]);
        }

        // 领取参与奖励返回
        private getTiantiJoinAwardReply(value: GetTiantiJoinAwardReply): void {
            // console.log("领取参与奖励返回................." + value);
            modules.common.CommonUtil.noticeError(value[GetTiantiJoinAwardReplyFields.result]);
        }

        // 领取功勋奖励
        // public getTiantiFeatAward(index:int):void{
        //     console.log("领取功勋奖励..................." + index);
        //     Channel.instance.publish(UserFeatureOpcode.GetTiantiFeatAward, [index]);
        // }
        // // 领取功勋奖励返回
        // private getTiantiFeatAwardReply(value:GetTiantiFeatAwardReply):void{
        //     console.log("领取功勋奖励返回................." + value);
        //     CommonUtil.noticeError(value[GetTiantiFeatAwardReplyFields.result]);
        // }

        // 获取天梯排行
        public getTiantiRank(): void {
            // console.log("获取天梯排行................");
            Channel.instance.publish(UserCenterOpcode.GetTiantiRank, null);
        }

        // 获取天梯排行返回
        private getTiantiRankReply(value: GetTiantiRankReply): void {
            // console.log("获取天梯排行返回................" + value);
            LadderModel.instance.ranks = value[GetTiantiRankReplyFields.ranks];
        }

        // 更新天梯荣誉
        private updateTiantiHonor(value: UpdateTiantiHonor): void {
            // console.log("更新天梯荣誉..............." + value);
            PlayerModel.instance.tiantiHonor = value[UpdateTiantiHonorFields.honor];
        }

        // 匹配
        public reqBeginMatch(): void {
            MissionModel.instance.auto && (MissionModel.instance.auto = false);
            TeamBattleCtrl.instance.reqBeginMatch(SCENE_ID.scene_tianti_copy);
        }

        // 请求取消匹配
        public reqCancelMatch(): void {
            TeamBattleCtrl.instance.reqCancelMatch();
        }

        // 更新天梯积分奖励
        private updateTiantiScoreAward(value: UpdateTiantiScoreAward): void {
            LadderModel.instance.tiantiScoreAward = value;
        }

        // 敌方未进入（服务器在结算的时候发送）
        private updateNotFoundEnemy(value:UpdateNotFoundEnemy):void{
            SystemNoticeManager.instance.addNotice("对方未参战，本局您获胜~");
        }
    }
}