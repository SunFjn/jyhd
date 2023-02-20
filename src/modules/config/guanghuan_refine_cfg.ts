namespace modules.config {
    import guanghuan_refine = Configuration.guanghuan_refine;
    import guanghuan_refineFields = Configuration.guanghuan_refineFields;
    import AttrUtil = modules.common.AttrUtil;
    import blendFields = Configuration.blendFields;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;

    export class GuangHuanRefineCfg {
        private static _instance: GuangHuanRefineCfg;
        public static get instance(): GuangHuanRefineCfg {
            return this._instance = this._instance || new GuangHuanRefineCfg();
        }

        private _table: Table<Table<guanghuan_refine>>;

        // 属性索引数组
        private _attrIndices: Array<int>;
        private _typeLvArrTable: Table<Array<guanghuan_refine>>;
        // 类型数组
        private _typeArr: Array<int>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._typeLvArrTable = {};
            this._typeArr = [];
            let arr: Array<guanghuan_refine> = GlobalData.getConfig("guanghuan_refine");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: guanghuan_refine = arr[i];
                let type: number = cfg[guanghuan_refineFields.type];
                if (!this._table[type]) {
                    this._table[type] = {};
                    this._typeLvArrTable[type] = [];
                    this._typeArr.push(type);
                }
                this._table[type][cfg[guanghuan_refineFields.level]] = cfg;
                this._typeLvArrTable[type].push(cfg);
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22019)[blendFields.intParam];
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
        public getCfgByTypeAndLv(type: number, level: number): guanghuan_refine {
            return this._table[type] ? this._table[type][level] : null;
        }

        // 根据类型和等级获取等级上限
        public getMaxFuhunLvByTypeAndLev(type: int, lv: int): int {
            let cfg: guanghuan_refine = this.getCfgByTypeAndLv(type, lv);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[guanghuan_refineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[guanghuan_refineFields.level];
            }
            let arr: Array<guanghuan_refine> = this._typeLvArrTable[type];
            let t: guanghuan_refine;
            for (let i: int = lv + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][guanghuan_refineFields.humanLevel] !== cfg[guanghuan_refineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[guanghuan_refineFields.level];
        }
    }
}