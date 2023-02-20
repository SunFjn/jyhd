namespace modules.config {
    import era = Configuration.era;
    import eraFields = Configuration.eraFields;

    export class BornCfg {

        private static _instance: BornCfg;

        public static get instance(): BornCfg {
            return this._instance = this._instance || new BornCfg();
        }

        private _tab: Table<era>;
        public _lvs: number[];

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};
            this._lvs = [];

            let arr: Array<era> = GlobalData.getConfig("era");
            for (let ele of arr) {
                let lv: number = ele[eraFields.level];
                this._tab[lv] = ele;
                this._lvs.push(lv);
            }
        }

        //根据等级取配置 dir 方向 -1 前一个 1 下一个
        public getCfgByLv(lv: int, dir?: int): era {
            if (!dir) {
                return this._tab[lv];
            } else {
                let index: number = this._lvs.indexOf(lv);
                index = dir == 1 ? ++index : --index;
                let tempLv: number = this._lvs[index];
                return tempLv == null ? null : this._tab[tempLv];
            }
        }

        //根据当前等级取下一等级
        public getNextLv(lv: int): int {
            let index: int = this._lvs.indexOf(lv);
            if (index !== -1) {
                let nextLv: number = this._lvs[index + 1];
                return nextLv ? nextLv : null;
            }
        }

        //根据当前等级获取当前转的最后一重
        public getLastCfgByCurrLev(lv: int): int {
            for (let i: int = 0, len: int = this._lvs.length; i < len; i++) {
                if (Math.floor(this._lvs[i] / 100) > Math.floor(lv / 100))
                    return this._lvs[i - 1];
            }
        }

        //根据当前等级获取下一转
        public getBigLv(lv: int): int {
            for (let i: int = 0, len: int = this._lvs.length; i < len; i++) {
                if (Math.floor(this._lvs[i] / 100) > Math.floor(lv / 100))
                    return this._lvs[i];
            }
        }
    }
}