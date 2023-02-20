///<reference path="../notice/score_notice_manager.ts"/>

/** 九天之巅数据*/


namespace modules.nine {
    import NineRank = Protocols.NineRank;
    import NineCopy = Protocols.NineCopy;
    import ReqSearchObjReply = Protocols.ReqSearchObjReply;
    import ScenePromote = Protocols.ScenePromote;
    import BroadcastDead = Protocols.BroadcastDead;
    import UpdateScoreFields = Protocols.UpdateScoreFields;
    import UpdateScore = Protocols.UpdateScore;
    import ScoreNoticeManager = modules.notice.ScoreNoticeManager;
    import ScoreNoticeType = ui.ScoreNoticeType;

    export class NineModel {
        private static _instance: NineModel;
        public static get instance(): NineModel {
            return this._instance = this._instance || new NineModel();
        }

        // 九天排名
        private _ranks: Array<NineRank>;
        // 九天之巅个人数据
        private _nineCopy: NineCopy;
        // 搜索对象
        private _searchObj: ReqSearchObjReply;
        // 积分
        private _score: UpdateScore;
        // 九天之巅晋级信息
        private _scenePromote: ScenePromote;
        // 击败信息
        private _defeatInfo: BroadcastDead;

        constructor() {

        }

        // 九天排名
        public get ranks(): Array<NineRank> {
            return this._ranks;
        }

        public set ranks(value: Array<NineRank>) {
            this._ranks = value;
            GlobalData.dispatcher.event(CommonEventType.NINE_RANKS_UPDATE);
        }

        // 九天之巅个人数据
        public get nineCopy(): NineCopy {
            return this._nineCopy;
        }

        public set nineCopy(value: NineCopy) {
            this._nineCopy = value;
            GlobalData.dispatcher.event(CommonEventType.NINE_COPY_INFO_UPDATE);
        }

        // 搜索对象
        public get searchObj(): ReqSearchObjReply {
            return this._searchObj;
        }

        public set searchObj(value: ReqSearchObjReply) {
            this._searchObj = value;
            GlobalData.dispatcher.event(CommonEventType.NINE_SEARCH_OBJ_UPDATE);
        }

        // 积分
        public get score(): UpdateScore {
            return this._score;
        }

        public set score(value: UpdateScore) {
            if (value[UpdateScoreFields.addScore]) {
                // SystemNoticeManager.instance.addNotice(`本层积分+${value[UpdateScoreFields.addScore]}`);
                ScoreNoticeManager.instance.addNotice(ScoreNoticeType.nineScore, value[UpdateScoreFields.addScore]);
            }
            this._score = value;
            GlobalData.dispatcher.event(CommonEventType.NINE_SCORE_UPDATE);
        }

        // 九天之巅晋级信息
        public get scenePromote(): ScenePromote {
            return this._scenePromote;
        }

        public set scenePromote(value: ScenePromote) {
            this._scenePromote = value;
        }

        // 击败信息
        public get defeatInfo(): BroadcastDead {
            return this._defeatInfo;
        }

        public set defeatInfo(value: BroadcastDead) {
            this._defeatInfo = value;
            GlobalData.dispatcher.event(CommonEventType.NINE_DEFEAT_UPDATE);
        }
    }
}