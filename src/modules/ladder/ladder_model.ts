/** 天梯*/


namespace modules.ladder {
    import TiantiScore = Protocols.TiantiScore;
    import AwardState = Protocols.AwardState;
    import TiantiTimes = Protocols.TiantiTimes;
    import Tianti = Protocols.Tianti;
    import TiantiRank = Protocols.TiantiRank;
    import TiantiFields = Protocols.TiantiFields;
    import AwardStateFields = Protocols.AwardStateFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import UpdateTiantiScoreAward = Protocols.UpdateTiantiScoreAward;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import TiantiScoreFields = Protocols.TiantiScoreFields;

    export class LadderModel {
        private static _instance: LadderModel;
        public static get instance(): LadderModel {
            return this._instance = this._instance || new LadderModel();
        }

        // 天梯积分
        private _tiantiScore: TiantiScore;
        // 天梯参与奖励状态
        private _joinAwardStates: Array<AwardState>;
        // 功勋奖励状态
        private _featAwardStates: Array<AwardState>;
        // 天梯次数
        private _times: TiantiTimes;
        // 天梯信息
        private _ladderInfo: Tianti;
        // 天梯排行
        private _ranks: Array<TiantiRank>;
        // 自动匹配
        private _autoMatch: boolean = false;
        // 天梯积分奖励
        private _tiantiScoreAward: UpdateTiantiScoreAward;

        constructor() {

        }

        // 天梯积分
        public get tiantiScore(): TiantiScore {
            return this._tiantiScore;
        }

        public set tiantiScore(value: TiantiScore) {
            this._tiantiScore = value;
            GlobalData.dispatcher.event(CommonEventType.LADDER_SCORE_UPDATE);
            this.judgeLadderJoinAwardRP();
        }

        // 天梯参与奖励状态
        public get joinAwardStates(): Array<AwardState> {
            return this._joinAwardStates;
        }

        public set joinAwardStates(value: Array<AwardState>) {
            this._joinAwardStates = value;
            GlobalData.dispatcher.event(CommonEventType.LADDER_JOIN_AWARD_UPDATE);
            this.judgeLadderJoinAwardRP();
        }

        //监听功能开启
        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            if (ID) {
                for (var index = 0; index < ID.length; index++) {
                    var element = ID[index];
                    if (element == ActionOpenId.tianti) {
                        let funcState: int = FuncOpenModel.instance.getFuncStateById(ActionOpenId.tianti);
                        if (funcState === ActionOpenState.open || funcState === ActionOpenState.close) {
                            this.judgeLadderJoinAwardRP();
                            return;
                        }
                    }
                }
            }
        }

        /**
         * 判断红点
         */
        public judgeLadderJoinAwardRP() {
            let flag: boolean = false;
            if (this._joinAwardStates) {
                if (this._joinAwardStates.length > 0) {
                    for (let i: int = 0, len: int = this._joinAwardStates.length; i < len; i++) {
                        if (this._joinAwardStates[i][AwardStateFields.state] === 1) {
                            flag = true;
                            RedPointCtrl.instance.setRPProperty("ladderJoinAwardRP", flag);
                            RedPointCtrl.instance.setRPProperty("tianTiRP", flag);
                            return;
                        }
                    }
                }
            }
            if (DungeonModel.instance.sceneStates) {
                let stateNum = 4;
                let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.tiantiCopy);
                if (states) {
                    stateNum = states[CopySceneStateFields.state];
                }
                let cishu = 0;
                if (this._tiantiScore) {
                    cishu = this._tiantiScore[TiantiScoreFields.remainTimes];
                }

                if (stateNum == 2 && cishu > 0) {
                    flag = true;
                    RedPointCtrl.instance.setRPProperty("ladderJoinAwardRP", flag);
                    RedPointCtrl.instance.setRPProperty("tianTiRP", flag);
                    return;
                }
            }

            RedPointCtrl.instance.setRPProperty("ladderJoinAwardRP", flag);
            RedPointCtrl.instance.setRPProperty("tianTiRP", flag);
        }

        // 功勋奖励状态
        public get featAwardStates(): Array<AwardState> {
            return this._featAwardStates;
        }

        public set featAwardStates(value: Array<AwardState>) {
            this._featAwardStates = value;
            GlobalData.dispatcher.event(CommonEventType.LADDER_FEAT_AWARD_UPDATE);
        }

        // 天梯次数
        public get times(): TiantiTimes {
            return this._times;
        }

        public set times(value: TiantiTimes) {
            this._times = value;
            GlobalData.dispatcher.event(CommonEventType.LADDER_TIMES_UPDATE);
        }

        // 天梯信息
        public get ladderInfo(): Tianti {
            return this._ladderInfo;
        }

        public set ladderInfo(value: Tianti) {
            this._ladderInfo = value;
            this.joinAwardStates = value[TiantiFields.joinAwardStates];
            this.featAwardStates = value[TiantiFields.featAwardStates];
            this.times = value[TiantiFields.tiantiTimes];
            this.tiantiScore = value[TiantiFields.score];
            GlobalData.dispatcher.event(CommonEventType.LADDER_INFO_UPDATE);
        }

        // 天梯排行
        public get ranks(): Array<TiantiRank> {
            return this._ranks;
        }

        public set ranks(value: Array<TiantiRank>) {
            this._ranks = value;
            GlobalData.dispatcher.event(CommonEventType.LADDER_RANKS_UPDATE);
        }

        // 自动匹配
        public get autoMatch(): boolean {
            return this._autoMatch;
        }

        public set autoMatch(value: boolean) {
            this._autoMatch = value;
            GlobalData.dispatcher.event(CommonEventType.LADDER_AUTO_MATCH_UPDATE);
        }

        // 天梯积分奖励
        public get tiantiScoreAward(): UpdateTiantiScoreAward {
            return this._tiantiScoreAward;
        }

        public set tiantiScoreAward(value: UpdateTiantiScoreAward) {
            this._tiantiScoreAward = value;
        }
    }
}