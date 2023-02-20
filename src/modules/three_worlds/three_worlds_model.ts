/** 三界BOSS数据*/

namespace modules.threeWorlds {
    import GetBossRankRecordReply = Protocols.GetBossRankRecordReply;

    export class ThreeWorldsModel {
        private static _instance: ThreeWorldsModel;
        public static get instance(): ThreeWorldsModel {
            return this._instance = this._instance || new ThreeWorldsModel();
        }

        // BOSS排行记录
        private _bossRankRecord: GetBossRankRecordReply;

        // 地图ID、层数（记录下来结算时用，防止结算时因为切后台导致取的地图错误）
        public mapId:number;
        public mapLv:number;
        /**
         * 当前可挑战的boss id
         */
        private _canChallenge: number = 0;
        private _lastSelect: number = 0;
        public get canChallenge() {
            return this._canChallenge
        }
        public set canChallenge(canChallenge) {
            this._canChallenge = canChallenge
        }
        public get lastSelect() {
            return this._lastSelect
        }
        public set lastSelect(lastSelect) {
            this._lastSelect = lastSelect
        }
        constructor() {

        }

        // BOSS排行记录
        public get bossRankRecord(): GetBossRankRecordReply {
            return this._bossRankRecord;
        }

        public set bossRankRecord(value: GetBossRankRecordReply) {
            this._bossRankRecord = value;
            GlobalData.dispatcher.event(CommonEventType.THREE_WORLDS_UPDATE_BOSS_RANK_RECORD);
        }
    }
}