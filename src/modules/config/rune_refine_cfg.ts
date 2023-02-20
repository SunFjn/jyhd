namespace modules.config {
    import runeRefine = Configuration.runeRefine;
    import runeRefineFields = Configuration.runeRefineFields;

    export class RuneRefineCfg {
        private static _instance: RuneRefineCfg;
        public static get instance(): RuneRefineCfg {
            return this._instance = this._instance || new RuneRefineCfg();
        }

        private _tab: Table<runeRefine>;
        public yang: ItemId = 79860001;
        public yin: ItemId = 79960001;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<runeRefine> = GlobalData.getConfig("rune_refine");

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._tab[arr[i][runeRefineFields.id]] = arr[i];
            }
        }

        public getCfgById(id: number): runeRefine {
            return this._tab[id];
        }
    }
}