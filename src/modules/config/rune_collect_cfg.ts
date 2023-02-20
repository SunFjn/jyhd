namespace modules.config {
    import rune_collect_grade = Configuration.rune_collect_grade;
    import rune_collect_gradeFields = Configuration.rune_collect_gradeFields;

    export class RuneCollectCfg {
        private static _instance: RuneCollectCfg;
        public static get instance(): RuneCollectCfg {
            return this._instance = this._instance || new RuneCollectCfg();
        }

        private _category_tab: Table<Array<rune_collect_grade>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._category_tab = {};
            let arr: Array<rune_collect_grade> = GlobalData.getConfig("rune_collect_grade");

            for (const i in arr) {
                let id: number = arr[i][rune_collect_gradeFields.id];

                if (!this._category_tab[id]) {
                    this._category_tab[id] = new Array<rune_collect_grade>();
                }
                this._category_tab[id].push(arr[i]);
            }
        }

        public getCfgByIdLevel(dimID: number, level: number): rune_collect_grade {
            let category_arr = this._category_tab[dimID];
            for (let index = 0; index < category_arr.length; index++) {
                const rune = category_arr[index];
                if (rune[rune_collect_gradeFields.level] == level) {
                    return rune;
                }
            }

            return null;
        }

        public getNextCfgByIdLevel(dimID: number, level: number): rune_collect_grade {
            let data = this.getCfgByIdLevel(dimID, level + 1);
            if (data) {
                return data;
            }
            return null;
        }

    }
}