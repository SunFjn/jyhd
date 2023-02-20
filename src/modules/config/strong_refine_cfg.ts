namespace modules.config {

    import StrongRefine = Configuration.strongRefine;

    export class StrongRefineCfg {
        private static _instance: StrongRefineCfg;
        public static get instance(): StrongRefineCfg {
            return this._instance = this._instance || new StrongRefineCfg();
        }

        private _strongTable: Table<Table<StrongRefine>>;
        private _strongpart: Array<number>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._strongTable = {};
            this._strongpart = new Array<number>();
            let arr: Array<StrongRefine> = GlobalData.getConfig("strong_refine");
            for (let i: number = 0; i < arr.length; i++) {
                let strongcfg: StrongRefine = arr[i];
                let partTable: Table<StrongRefine> = this._strongTable[strongcfg[Configuration.strongRefineFields.part]];
                if (!partTable) {
                    partTable = {};
                    this._strongTable[strongcfg[Configuration.strongRefineFields.part]] = partTable;
                    this._strongpart.push(strongcfg[Configuration.strongRefineFields.part]);

                }
                partTable[strongcfg[Configuration.strongRefineFields.level]] = strongcfg;
            }
        }

        //根据部位和等级获取配置
        public getCfgPartAndLv(part: number, lv: number): StrongRefine {
            return this._strongTable[part][lv];
        }


    }

}