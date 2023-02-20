namespace modules.config {
    import strongRise = Configuration.strongRise;
    import strongRiseFields = Configuration.strongRiseFields;
    import strongRefine = Configuration.strongRefine;
    import strongRefineFields = Configuration.strongRefineFields;

    export class IntensiveCfg {

        private static _instance: IntensiveCfg;
        public static get instance(): IntensiveCfg {
            return this._instance = this._instance || new IntensiveCfg();
        }

        private _dic1: Array<strongRise>;  //强化大师
        private _dic2: Array<strongRise>;  //强化神匠
        private _tab: Array<Array<strongRefine>>;  //装备强化属性
        private _maxLvArr: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic1 = [];
            this._dic2 = [];
            this._tab = new Array<Array<strongRefine>>(10);
            for (let i = 0, len = 10; i < len; ++i) {
                this._tab[i] = [];
            }
            this._maxLvArr = [];

            let rises: Array<strongRise> = GlobalData.getConfig("strong_rise");
            for (let i: int = 0, len: int = rises.length; i < len; i++) {
                let rise = rises[i];
                let level = rise[strongRiseFields.level];
                if (rise[strongRiseFields.type] == 0) {
                    this._dic1[level] = rise;
                } else {
                    this._dic2[level] = rise;
                    if (level == 0) {
                        this._maxLvArr[0] = rises[i - 1][strongRiseFields.level];
                    }
                }
            }
            this._maxLvArr[1] = rises[rises.length - 1][strongRiseFields.level];

            let refines: Array<strongRefine> = GlobalData.getConfig("strong_refine");
            for (let i: int = 0, len: int = refines.length; i < len; i++) {
                let refine = refines[i];
                this._tab[refine[strongRefineFields.part] - 1][refine[strongRefineFields.level]] = refines[i];
            }
        }

        public getCfgBy_DASHI_Lev(lev: int): strongRise {
            return this._dic1[lev];
        }

        public getCfgBy_SHENJIANG_Lev(lev: int): strongRise {
            return this._dic2[lev];
        }

        public getCfgByPart(part: int, lev: int): strongRefine {
            return this._tab[part - 1][lev];
        }
    }
}