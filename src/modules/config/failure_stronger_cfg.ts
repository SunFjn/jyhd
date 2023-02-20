namespace modules.config {


    export class FailureStrongerCfg {
        private static _instance: FailureStrongerCfg;
        public static get instance(): FailureStrongerCfg {
            return this._instance = this._instance || new FailureStrongerCfg();
        }

        private _table: Table<Configuration.failure_stronger>;
        private _arr: Array<number>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._arr = new Array<number>();
            this._table = {};
            let attrs: Array<Configuration.failure_stronger> = GlobalData.getConfig("failure_stronger");
            for (let i: number = 0, len: number = attrs.length; i < len; i++) {
                let arr: Configuration.failure_stronger = attrs[i];
                this._arr[i] = arr[Configuration.failure_strongerFields.level];
                this._table[arr[Configuration.failure_strongerFields.level]] = arr;
            }
        }

        public getCfgByLevel(level: number): Configuration.failure_stronger {
            if (this._arr.length == 0) {
                return;
            } else {
                if (this._arr.length == 1) {
                    level = this._arr[0];
                } else {
                    for (let i: number = 1; i < this._arr.length; i++) {
                        if (level <= this._arr[0]) {
                            level = this._arr[0];
                            break;
                        }

                        if (level <= this._arr[i]) {
                            if (level > this._arr[i - 1]) {
                                level = this._arr[i];
                                break;
                            }
                        }
                    }
                }
            }
            return this._table[level];
        }
    }
}