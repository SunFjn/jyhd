/** 时装附魂配置*/



namespace modules.config {
    import AttrUtil = modules.common.AttrUtil;
    import blendFields = Configuration.blendFields;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import tianzhu_refine = Configuration.tianzhu_refine;
    import tianzhu_refineFields = Configuration.tianzhu_refineFields;

    export class TianZhuRefineCfg {
        private static _instance: TianZhuRefineCfg;
        public static get instance(): TianZhuRefineCfg {
            return this._instance = this._instance || new TianZhuRefineCfg();
        }

        private _table: Table<Table<tianzhu_refine>>;

        // 属性索引数组
        private _attrIndices: Array<int>;
        private _typeLvArrTable: Table<Array<tianzhu_refine>>;
        // 类型数组
        private _typeArr: Array<int>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._typeLvArrTable = {};
            this._typeArr = [];
            let arr: Array<tianzhu_refine> = GlobalData.getConfig("tianzhu_refine");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: tianzhu_refine = arr[i];
                let type: number = cfg[tianzhu_refineFields.type];
                if (!this._table[type]) {
                    this._table[type] = {};
                    this._typeLvArrTable[type] = [];
                    this._typeArr.push(type);
                }
                this._table[type][cfg[tianzhu_refineFields.level]] = cfg;
                this._typeLvArrTable[type].push(cfg);
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22015)[blendFields.intParam];
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
        public getCfgByTypeAndLv(type: number, level: number): tianzhu_refine {
            return this._table[type] ? this._table[type][level] : null;
        }

        // 根据类型和等级获取等级上限
        public getMaxFuhunLvByTypeAndLev(type: int, lv: int): int {
            let cfg: tianzhu_refine = this.getCfgByTypeAndLv(type, lv);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[tianzhu_refineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[tianzhu_refineFields.level];
            }
            let arr: Array<tianzhu_refine> = this._typeLvArrTable[type];
            let t: tianzhu_refine;
            for (let i: int = lv + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][tianzhu_refineFields.humanLevel] !== cfg[tianzhu_refineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[tianzhu_refineFields.level];
        }

        

    }
}