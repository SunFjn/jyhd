namespace modules.fish {

    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import fishing_cfg = Configuration.fishing_cfg;
    import fishing_cfgFields = Configuration.fishing_cfgFields;
    import fishing_cfg__gradeFields = Configuration.fishing_cfg__gradeFields;

    import TableUtils = utils.TableUtils;
    import Dictionary = laya.utils.Dictionary;

    export class FishingCfg {

        private static _instance: FishingCfg;

        public static get instance(): FishingCfg {
            return this._instance = this._instance || new FishingCfg();
        }

        private _treasureW: Table<fishing_cfg[]>;
        private _typeDicW: Dictionary;
        private _luckItemId: Array<Array<number>>;

        constructor() {
            this.init();
            this._luckItemId = new Array();
        }

        private init(): void {
            this._treasureW = {};
            this._typeDicW = new Dictionary();
            let min_arr = [];
            let max_arr = [];

            let cfgs: Array<fishing_cfg> = GlobalData.getConfig("limit_xunbao_weight");
            // console.log('vtz:cfgs', cfgs);
            for (let i: number = 0, len = cfgs.length; i < len; i++) {
                let cfg = cfgs[i];
                let type = cfg[fishing_cfgFields.type];
                let min = cfg[fishing_cfgFields.grade][fishing_cfg__gradeFields.min];
                let max = cfg[fishing_cfgFields.grade][fishing_cfg__gradeFields.max];
                if (typeof min_arr[type] == "undefined" || min_arr[type] > min) {
                    min_arr[type] = min;
                }
                // console.log('vtz:max_arr[type]',max_arr[type]);
                // console.log('vtz:max',max);
                if (typeof max_arr[type] == "undefined" || max_arr[type] < max) {
                    max_arr[type] = max;
                }
            }
            for (let i: number = 0, len = cfgs.length; i < len; i++) {
                let cfg = cfgs[i];
                let type = cfg[fishing_cfgFields.type];

                if (type < 5) {
                    cfg[fishing_cfgFields.grade] = [min_arr[type], max_arr[type]];
                }
                if (this._treasureW[type] == null) {
                    this._treasureW[type] = [cfg];
                } else {
                    this._treasureW[type].push(cfg);
                }
                this._typeDicW.set(type, this._treasureW[type]);
            }
        }

        public getFishGrade() {
            let typeArr: Array<Array<number>> = new Array<Array<number>>();
            let cfgArr = TableUtils.values(this._treasureW);
            for (let i = 0; i < cfgArr.length; i++) {
                let cfgs = cfgArr[i];
                typeArr[cfgs[0][fishing_cfgFields.type]] = cfgs[0][fishing_cfgFields.grade];
            }
            return typeArr;
        }

        public getItemShow(type: number): fishing_cfg {
            let cfgs = this._typeDicW.get(type);
            return cfgs[0];
        }

        public getItemShowByTypeGrade(type: LimitWeightType, grade: number):Array<Items> {
            let cfgs = this._typeDicW.get(type);
            for (let i = 0; i < cfgs.length; i++) {
                if (cfgs[i][fishing_cfgFields.grade][fishing_cfg__gradeFields.min] <= grade && grade < cfgs[i][fishing_cfgFields.grade][fishing_cfg__gradeFields.max]) {
                    return cfgs[i][fishing_cfgFields.showItem];
                }
            }
        }

        public getItemLuck(type: number): Array<Items> {
            let cfgs = this._typeDicW.get(type);
            return cfgs[0][fishing_cfgFields.luckItem];
        }

        public getItemLuckItemId(type: number): Array<number> {
            let luck = this.getItemLuck(type);
            if (typeof this._luckItemId[type] == "undefined") {
                this._luckItemId[type] = new Array();
                for (let i = 0; i < luck.length; i++) {
                    this._luckItemId[type].push(luck[i][ItemsFields.itemId]);
                }
            }
            return this._luckItemId[type];

        }

        public getItemNomal(type: number): Array<Items> {
            let cfgs = this._typeDicW.get(type);
            return cfgs[0][fishing_cfgFields.nomalItem];
        }
    }
}