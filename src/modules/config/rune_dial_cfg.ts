namespace modules.config {
    import rune_dial = Configuration.rune_dial;
    import rune_dialFields = Configuration.rune_dialFields;

    export class RuneDialCfg {
        private static _instance: RuneDialCfg;
        public static get instance(): RuneDialCfg {
            return this._instance = this._instance || new RuneDialCfg();
        }

        private _tab: Table<rune_dial>;

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};

            let arr: Array<rune_dial> = GlobalData.getConfig("rune_dial");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._tab[arr[i][rune_dialFields.round]] = arr[i];
            }
        }


        public getCfgByRound(round: number): rune_dial {
            if (!this._tab[round]) {
                return this.getCfgByRound(--round);
            } else {
                return this._tab[round];
            }
        }
    }
}