/** 竞技场*/


namespace modules.arena {
    import ArenaTimes = Protocols.ArenaTimes;
    import ArenaObj = Protocols.ArenaObj;
    import ArenaRank = Protocols.ArenaRank;
    import ChallengeRecord = Protocols.ChallengeRecord;
    import ArenaJudgeAward = Protocols.ArenaJudgeAward;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ArenaTimesFields = Protocols.ArenaTimesFields;

    export class ArenaModel {
        private static _instance: ArenaModel;
        public static get instance(): ArenaModel {
            return this._instance = this._instance || new ArenaModel();
        }

        // 竞技场次数
        private _arenaTimes: ArenaTimes;
        // 竞技场挑战对象
        private _objs: Array<ArenaObj>;
        // 竞技场排行列表
        private _ranks: Array<ArenaRank>;
        // 竞技场挑战记录
        private _records: Array<ChallengeRecord>;
        // 竞技场结算
        public arenaJudgeAward: ArenaJudgeAward;

        constructor() {

        }

        // 竞技场次数
        public get arenaTimes(): ArenaTimes {
            return this._arenaTimes;
        }

        public set arenaTimes(value: ArenaTimes) {
            this._arenaTimes = value;
            RedPointCtrl.instance.setRPProperty("arenaRP",value[ArenaTimesFields.remainTimes]>0);
            GlobalData.dispatcher.event(CommonEventType.ARENA_TIMES_UPDATE);
        }

        // 竞技场挑战对象
        public get objs(): Array<ArenaObj> {
            return this._objs;
        }

        public set objs(value: Array<ArenaObj>) {
            this._objs = value;
            GlobalData.dispatcher.event(CommonEventType.ARENA_OBJS_UPDATE);
        }

        // 竞技场排行列表
        public get ranks(): Array<ArenaRank> {
            return this._ranks;
        }

        public set ranks(value: Array<ArenaRank>) {
            this._ranks = value;
            GlobalData.dispatcher.event(CommonEventType.ARENA_RANKS_UPDATE);
        }

        // 竞技场挑战记录
        public get records(): Array<ChallengeRecord> {
            return this._records;
        }

        public set records(value: Array<ChallengeRecord>) {
            this._records = value;
           this._records.reverse();
            GlobalData.dispatcher.event(CommonEventType.ARENA_RECORDS_UPDATE);
        }
    }
}
