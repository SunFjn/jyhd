/** 宠物修炼配置*/
namespace modules.config {
    import petRefine = Configuration.petRefine;
    import petRefineFields = Configuration.petRefineFields;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import blendFields = Configuration.blendFields;

    export class PetRefineCfg {
        private static _instance: PetRefineCfg;
        public static get instance(): PetRefineCfg {
            return this._instance = this._instance || new PetRefineCfg();
        }

        private _typeTable: Table<Table<petRefine>>;
        private _typeLvArrTable: Table<Array<petRefine>>;
        private _cfgs: Array<petRefine>;
        private _attrIndices: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._typeTable = {};
            this._typeLvArrTable = {};
            this._attrIndices = [];
            this._cfgs = GlobalData.getConfig("pet_refine");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: petRefine = this._cfgs[i];
                let type: int = cfg[petRefineFields.type];
                if (!this._typeTable[type]) {
                    this._typeTable[type] = {};
                }
                this._typeTable[type][cfg[petRefineFields.level]] = cfg;
                if (!this._typeLvArrTable[type]) {
                    this._typeLvArrTable[type] = new Array<petRefine>();
                }
                this._typeLvArrTable[type].push(cfg);
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22005)[blendFields.intParam];
        }

        // 根据类型和等级获取配置
        public getCfgByTypeAndLv(type: int, lv: int): petRefine {
            return this._typeTable[type][lv];
        }

        // 根据类型和等级获取等级上限
        public getMaxLvByLv(type: int, lv: int): int {
            let cfg: petRefine = this.getCfgByTypeAndLv(type, lv);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[petRefineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[petRefineFields.level];
            }
            let arr: Array<petRefine> = this._typeLvArrTable[type];
            let t: petRefine;
            for (let i: int = lv + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][petRefineFields.humanLevel] !== cfg[petRefineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[petRefineFields.level];
        }

        //筛选出显示属性
        public get attrIndices(): int[] {
            return this._attrIndices;
        }
    }
}