/** 竞技场*/


namespace modules.arena {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetArenaRankReply = Protocols.GetArenaRankReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetArenaReply = Protocols.GetArenaReply;
    import GetArenaChallengeRecordReply = Protocols.GetArenaChallengeRecordReply;
    import UpdateArenaChallengeRecord = Protocols.UpdateArenaChallengeRecord;
    import UpdateArenaTime = Protocols.UpdateArenaTime;
    import UpdateArenaObjs = Protocols.UpdateArenaObjs;
    import FlushArenaReply = Protocols.FlushArenaReply;
    import ResetEnterCDReply = Protocols.ResetEnterCDReply;
    import GetArenaReplyFields = Protocols.GetArenaReplyFields;
    import GetArenaRankReplyFields = Protocols.GetArenaRankReplyFields;
    import GetArenaChallengeRecordReplyFields = Protocols.GetArenaChallengeRecordReplyFields;
    import UpdateArenaChallengeRecordFields = Protocols.UpdateArenaChallengeRecordFields;
    import UpdateArenaTimeFields = Protocols.UpdateArenaTimeFields;
    import UpdateArenaObjsFields = Protocols.UpdateArenaObjsFields;
    import FlushArenaReplyFields = Protocols.FlushArenaReplyFields;
    import ResetEnterCDReplyFields = Protocols.ResetEnterCDReplyFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import ArenaJudgeAward = Protocols.ArenaJudgeAward;
    import ArenaJudgeAwardFields = Protocols.ArenaJudgeAwardFields;

    export class ArenaCtrl extends BaseCtrl {
        private static _instance: ArenaCtrl;
        public static get instance(): ArenaCtrl {
            return this._instance = this._instance || new ArenaCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 获取竞技场信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetArenaReply, this, this.getArenaReply);
            // 获取竞技排行返回
            Channel.instance.subscribe(SystemClientOpcode.GetArenaRankReply, this, this.getArenaRankReply);
            // 获取竞技场挑战记录返回
            Channel.instance.subscribe(SystemClientOpcode.GetArenaChallengeRecordReply, this, this.getArenaChallengeRecordReply);
            // 更新竞技场挑战记录
            Channel.instance.subscribe(SystemClientOpcode.UpdateArenaChallengeRecord, this, this.updateArenaChallengeRecord);
            // 更新竞技场次数
            Channel.instance.subscribe(SystemClientOpcode.UpdateArenaTime, this, this.updateArenaTime);
            // 更新竞技场挑战对象
            Channel.instance.subscribe(SystemClientOpcode.UpdateArenaObjs, this, this.updateArenaObjs);
            // 刷新竞技场挑战对象返回
            Channel.instance.subscribe(SystemClientOpcode.FlushArenaReply, this, this.flushArenaReply);
            // 重置入场CD返回
            Channel.instance.subscribe(SystemClientOpcode.ResetEnterCDReply, this, this.resetEnterCDReply);
            // 竞技场结算
            Channel.instance.subscribe(SystemClientOpcode.ArenaJudgeAward, this, this.arenaJudgeAward);

            this.requsetAllData();

           
        }

        public requsetAllData() {
            this.getArena();
            this.getArenaChallengeRecord();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.arenaCopy, UserFeatureOpcode.GetArena);
        }

        // 获取竞技场信息
        public getArena(): void {
            // console.log("获取竞技场信息.............");
            Channel.instance.publish(UserFeatureOpcode.GetArena, null);
        }

        // 获取竞技场信息返回
        private getArenaReply(value: GetArenaReply): void {
            // console.log("获取竞技场信息返回...................." + value);
            ArenaModel.instance.arenaTimes = value[GetArenaReplyFields.times];
            ArenaModel.instance.objs = value[GetArenaReplyFields.objs];
        }

        // 获取竞技排行
        public getArenaRank(): void {
            // console.log("获取竞技场排行................");
            Channel.instance.publish(UserCenterOpcode.GetArenaRank, null);
        }

        // 获取竞技场排行返回
        private getArenaRankReply(value: GetArenaRankReply): void {
            // console.log("获取竞技场排行返回....................." + value);
            ArenaModel.instance.ranks = value[GetArenaRankReplyFields.ranks];
        }

        // 获取竞技场挑战记录
        public getArenaChallengeRecord(): void {
            // console.log("获取竞技场挑战记录................");
            Channel.instance.publish(UserCenterOpcode.GetArenaChallengeRecord, null);
        }

        // 获取竞技场挑战记录返回
        private getArenaChallengeRecordReply(value: GetArenaChallengeRecordReply): void {
            // console.log("获取竞技场挑战记录返回...................." + value);
            ArenaModel.instance.records = value[GetArenaChallengeRecordReplyFields.records];
        }

        // 更新竞技场挑战记录
        private updateArenaChallengeRecord(value: UpdateArenaChallengeRecord): void {
            // console.log("更新竞技场挑战记录................." + value);
            ArenaModel.instance.records = value[UpdateArenaChallengeRecordFields.records];
        }

        // 更新竞技场次数
        private updateArenaTime(value: UpdateArenaTime): void {
            // console.log("更新竞技场次数...................." + value);
            ArenaModel.instance.arenaTimes = value[UpdateArenaTimeFields.times];
        }

        // 更新竞技场挑战对象
        private updateArenaObjs(value: UpdateArenaObjs): void {
            // console.log("更新竞技场挑战对象.................." + value);
            ArenaModel.instance.objs = value[UpdateArenaObjsFields.objs];
        }

        // 刷新竞技场挑战对象
        public flushArena(): void {
            // console.log("刷新竞技场挑战对象..............");
            Channel.instance.publish(UserFeatureOpcode.FlushArena, null);
        }

        // 刷新竞技场挑战对象返回
        private flushArenaReply(value: FlushArenaReply): void {
            // console.log("刷新竞技场挑战对象返回......................." + value);
            CommonUtil.noticeError(value[FlushArenaReplyFields.result]);
        }

        // 挑战竞技场
        public challengeArena(objId: number): void {
            // console.log("挑战竞技场................");
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_arena_copy, 1, [objId]);
        }

        // 重置入场CD
        public resetEnterCD(): void {
            // console.log("重置入场CD..................");
            Channel.instance.publish(UserFeatureOpcode.ResetEnterCD, [SCENE_ID.scene_arena_copy, 1]);
        }

        // 重置入场CD返回
        private resetEnterCDReply(value: ResetEnterCDReply): void {
            // console.log("重置入场CD返回.............." + value);
            CommonUtil.noticeError(value[ResetEnterCDReplyFields.result]);
        }

        // 竞技场结算
        private arenaJudgeAward(value: ArenaJudgeAward): void {
            // console.log("竞技场结算.............." + value);
            ArenaModel.instance.arenaJudgeAward = value;
            if (value[ArenaJudgeAwardFields.success]) {
                WindowManager.instance.open(WindowEnum.ARENA_WIN_ALERT);
            } else {
                WindowManager.instance.open(WindowEnum.ARENA_LOSE_ALERT);
            }
        }
    }
}
