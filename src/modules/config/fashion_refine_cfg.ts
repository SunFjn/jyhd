/** 时装附魂配置*/



namespace modules.config {
    import fashion_refine = Configuration.fashion_refine;
    import fashion_refineFields = Configuration.fashion_refineFields;
    import AttrUtil = modules.common.AttrUtil;
    import blendFields = Configuration.blendFields;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;

    export class FashionRefineCfg {
        private static _instance: FashionRefineCfg;
        public static get instance(): FashionRefineCfg {
            return this._instance = this._instance || new FashionRefineCfg();
        }

        private _table: Table<Table<fashion_refine>>;

        // 属性索引数组
        private _attrIndices: Array<int>;
        private _typeLvArrTable: Table<Array<fashion_refine>>;
        // 类型数组
        private _typeArr: Array<int>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._typeLvArrTable = {};
            this._typeArr = [];
            let arr: Array<fashion_refine> = GlobalData.getConfig("fashion_refine");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: fashion_refine = arr[i];
                let type: number = cfg[fashion_refineFields.type];
                if (!this._table[type]) {
                    this._table[type] = {};
                    this._typeLvArrTable[type] = [];
                    this._typeArr.push(type);
                }
                this._table[type][cfg[fashion_refineFields.level]] = cfg;
                this._typeLvArrTable[type].push(cfg);
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22013)[blendFields.intParam];
        }

        // 属性索引数组
        public get attrIndices(): Array<int> {
            return this._attrIndices;
        }

        // 类型数组
        public get typeArr(): Array<int> {
            return this._typeArr;
        }

        // 根据类型和等级获取配置
        public getCfgByTypeAndLv(type: number, level: number): fashion_refine {
            return this._table[type] ? this._table[type][level] : null;
        }

        // 根据类型和等级获取等级上限
        public getMaxFuhunLvByTypeAndLev(type: int, lv: int): int {
            let cfg: fashion_refine = this.getCfgByTypeAndLv(type, lv);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[fashion_refineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[fashion_refineFields.level];
            }
            let arr: Array<fashion_refine> = this._typeLvArrTable[type];
            let t: fashion_refine;
            for (let i: int = lv + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][fashion_refineFields.humanLevel] !== cfg[fashion_refineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[fashion_refineFields.level];
        }
    }
}