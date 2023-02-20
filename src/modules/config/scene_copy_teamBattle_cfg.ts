/** 争夺战宝箱配置*/


namespace modules.config {
    import scene_copy_teamBattle = Configuration.scene_copy_teamBattle;
    import scene_copy_teamBattleFields = Configuration.scene_copy_teamBattleFields;

    export class SceneCopyTeamBattleCfg {
        private static _instance: SceneCopyTeamBattleCfg;
        public static get instance(): SceneCopyTeamBattleCfg {
            return this._instance = this._instance || new SceneCopyTeamBattleCfg();
        }

        private _table: Table<scene_copy_teamBattle>;
        private _cfgs: Array<scene_copy_teamBattle>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._cfgs = GlobalData.getConfig("scene_copy_teamBattle");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: scene_copy_teamBattle = this._cfgs[i];
                this._table[cfg[scene_copy_teamBattleFields.index]] = cfg;
            }
        }
        public get cfgs(): Array<scene_copy_teamBattle> {
            return this._cfgs;
        }

        public getCfgByIndex(index: int): scene_copy_teamBattle {
            return this._table[index];
        }
        public getAllCfg() {
            return this._cfgs;
        }

    }
}