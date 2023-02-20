namespace modules.rune_copy {
    import UpdateRuneCopy = Protocols.UpdateRuneCopy;
    import UpdateRuneCopyFields = Protocols.UpdateRuneCopyFields;
    import LevelCopyDataFields = Protocols.LevelCopyDataFields;
    import UpdateRuneDial = Protocols.UpdateRuneDial;
    import UpdateRuneDialFields = Protocols.UpdateRuneDialFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SceneCopyRuneCfg = modules.config.SceneCopyRuneCfg;
    import scene_copy_rune = Configuration.scene_copy_rune;
    import scene_copy_runeFields = Configuration.scene_copy_runeFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class RuneCopyModel {
        private static _instance: RuneCopyModel;
        public static get instance(): RuneCopyModel {
            return this._instance = this._instance || new RuneCopyModel();
        }

        private _finishLv: number; /*已完成层数*/
        private _awardLv: number[];  /*可领奖励的层数*/
        private _bigAwardLv: number[];/*可领大奖的层数*/
        private _isGetDailyAward: boolean; //是否领取了每日奖励

        private _alreadList: number[]; 			/*已领取的奖励序号*/
        private _dialCount: number; 		/*转盘可转次数*/
        private _round: number; 	        /*当前转盘轮数*/
        private _dialResult: number;

        constructor() {
            this._finishLv = 0;
            this._alreadList = [];
            this._dialResult = 0;
        }


        public saveDate(tuple: UpdateRuneCopy): void {
            this._finishLv = tuple[UpdateRuneCopyFields.copyData][LevelCopyDataFields.finishLevel];
            this._awardLv = tuple[UpdateRuneCopyFields.copyData][LevelCopyDataFields.award];
            this._bigAwardLv = tuple[UpdateRuneCopyFields.copyData][LevelCopyDataFields.bigAward];
            this._isGetDailyAward = tuple[UpdateRuneCopyFields.isCanGetEveryDay];
            GlobalData.dispatcher.event(CommonEventType.RUNE_COPY_UPDATE);
            this.checkRP();
        }

        public updateRuneDial(tuple: UpdateRuneDial): void {
            this._alreadList = tuple[UpdateRuneDialFields.alreadList];
            this._dialCount = tuple[UpdateRuneDialFields.dialCount];
            this._round = tuple[UpdateRuneDialFields.round];
            GlobalData.dispatcher.event(CommonEventType.RUNE_COPY_UPDATE);
            this.checkRP();
        }

        public checkRP(): void {

            let fight: number = PlayerModel.instance.fight;
            let currCfg: scene_copy_rune = SceneCopyRuneCfg.instance.getCfgByLv(this.currLv);
            if (currCfg) {
                let tFight: number = currCfg[scene_copy_runeFields.recommendFighting];
                let per: number = BlendCfg.instance.getCfgById(33003)[blendFields.intParam][0];
                if (per <= fight / tFight) {
                    RedPointCtrl.instance.setRPProperty("runeCopyRP", true);
                    return;
                }
            }

            if (this._isGetDailyAward && this._finishLv > 0) {
                RedPointCtrl.instance.setRPProperty("runeCopyRP", true);
                return;
            }

            if (this._dialCount > 0) {
                RedPointCtrl.instance.setRPProperty("runeCopyRP", true);
                return;
            }

            if (this._bigAwardLv && this._bigAwardLv.length > 0) {
                RedPointCtrl.instance.setRPProperty("runeCopyRP", true);
                return;
            }
            RedPointCtrl.instance.setRPProperty("runeCopyRP", false);
        }

        public set dialResult(result: number) {
            this._dialResult = result;
            GlobalData.dispatcher.event(CommonEventType.DIAL_RESULT_UPDATE);
        }

        public get dialResult(): number {
            return this._dialResult;
        }

        public get round(): number {
            return this._round;
        }

        public get dialCount(): number {
            return this._dialCount;
        }

        public get alreadList(): number[] {
            return this._alreadList;
        }

        public get finishLv(): number {
            return this._finishLv;
        }

        public get currLv(): number {
            return this._finishLv + 1;
        }

        public get awardLv(): number[] {
            return this._awardLv;
        }

        public get bigAwardLv(): number[] {
            return this._bigAwardLv;
        }

        public get isGetDailyAward(): boolean {
            return this._isGetDailyAward;
        }

    }
}