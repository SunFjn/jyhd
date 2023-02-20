namespace modules.config {
    import scene_copy_rune = Configuration.scene_copy_rune;
    import scene_copy_runeFields = Configuration.scene_copy_runeFields;

    export class SceneCopyRuneCfg {
        private static _instance: SceneCopyRuneCfg;
        public static get instance(): SceneCopyRuneCfg {
            return this._instance = this._instance || new SceneCopyRuneCfg();
        }

        private _tab: Table<scene_copy_rune>;
        private _keysArr: number[];
        private _maxLv: number;

        constructor() {
            this.init();
        }


        private init(): void {

            this._tab = {};
            this._keysArr = [];
            this._maxLv = 0;

            let arr = GlobalData.getConfig("scene_copy_rune");

            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][scene_copy_runeFields.level]] = arr[i];
                this._keysArr.push(arr[i][scene_copy_runeFields.level]);
                this._maxLv = arr[i][scene_copy_runeFields.level];
            }

        }

        public get maxLv(): number {
            return this._maxLv;
        }

        //根据层数取配置
        public getCfgByLv(lv: number): scene_copy_rune {
            return this._tab[lv];
        }

        //根据当前层数获取下一个奖励配置
        public getAwardCfgByCurrLv(currLv: number): scene_copy_rune {
            for (let i: int = currLv, len: int = this._keysArr.length; i <= len; i++) {
                let value: scene_copy_rune = this._tab[i];
                if (value[scene_copy_runeFields.bigAward].length || value[scene_copy_runeFields.slotId] || value[scene_copy_runeFields.childId]) {
                    return value;
                }
            }
        }
    }

}