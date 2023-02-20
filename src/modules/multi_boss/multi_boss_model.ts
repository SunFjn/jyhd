///<reference path="../notice/boss_revive_manager.ts"/>


/** 多人BOSS*/


namespace modules.multiBoss {


    export class MultiBossModel {
        private static _instance: MultiBossModel;
        public static get instance(): MultiBossModel {
            return this._instance = this._instance || new MultiBossModel();
        }

        constructor() {
        }
    }
}