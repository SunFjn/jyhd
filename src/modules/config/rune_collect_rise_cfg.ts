namespace modules.config {
    import rune_collect_rise = Configuration.rune_collect_rise;
    import rune_collect_riseFields = Configuration.rune_collect_riseFields;

    export class RuneCollectRiseCfg {
        private static _instance: RuneCollectRiseCfg;
        public static get instance(): RuneCollectRiseCfg {
            return this._instance = this._instance || new RuneCollectRiseCfg();
        }

        private tab: Table<rune_collect_rise>;

        constructor() {
            this.init();
        }

        private init(): void {
            this.tab = {};
            let arr: Array<rune_collect_rise> = GlobalData.getConfig("rune_collect_rise");

            for (const i in arr) {
                let id: number = arr[i][rune_collect_riseFields.level];
                this.tab[id] = arr[i];
            }
        }

        public getCfgByLevel(level: number): rune_collect_rise {
            let rise = this.tab[level];
            if (rise) {
                return rise;
            }
            return null;
        }

        public getNextCfgByLevel(level: number): rune_collect_rise {
            let data = this.getCfgByLevel(level + 1);
            if (data) {
                return data;
            }
            return null;
        }

    }
}