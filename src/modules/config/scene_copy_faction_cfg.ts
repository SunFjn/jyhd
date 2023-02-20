namespace modules.config {
    import scene_copy_faction = Configuration.scene_copy_faction;
    import scene_copy_factionFields = Configuration.scene_copy_factionFields;

    export class SceneCopyFactionCfg {
        private static _instance: SceneCopyFactionCfg;
        public static get instance(): SceneCopyFactionCfg {
            return this._instance = this._instance || new SceneCopyFactionCfg();
        }

        private _tab: Table<scene_copy_faction>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<scene_copy_faction> = GlobalData.getConfig(`scene_copy_faction`);
            for (let e of arr) {
                this._tab[e[scene_copy_factionFields.index]] = e;
            }
        }

        public getCfgByIndex(index: number): scene_copy_faction {
            return this._tab[index];
        }
    }
}
