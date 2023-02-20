/** 精灵修炼配置*/
namespace modules.config {
    import rideRefine = Configuration.rideRefine;
    import rideRefineFields = Configuration.rideRefineFields;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import blendFields = Configuration.blendFields;

    export class RideRefineCfg {
        private static _instance: RideRefineCfg;
        public static get instance(): RideRefineCfg {
            return this._instance = this._instance || new RideRefineCfg();
        }

        // 修炼类型映射，{key:type,value:{key:level,value:rideRefine}}
        private _typeTable: Table<Table<rideRefine>>;
        private _cfgs: Array<rideRefine>;
        private _typeLvArrTable: Table<Array<rideRefine>>;
        private _attrIndices: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._typeTable = {};
            this._typeLvArrTable = {};
            this._attrIndices = [];
            this._cfgs = GlobalData.getConfig("ride_refine");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: rideRefine = this._cfgs[i];
                let type: int = cfg[rideRefineFields.type];
                if (!this._typeTable[type]) {
                    this._typeTable[type] = {};
                }
                this._typeTable[type][cfg[rideRefineFields.level]] = cfg;
                if (!this._typeLvArrTable[type]) {
                    this._typeLvArrTable[type] = new Array<rideRefine>();
                }
                this._typeLvArrTable[type].push(cfg);
            }
            this._attrIndices = BlendCfg.instance.getCfgById(22007)[blendFields.intParam];
        }

        // 根据类型和等级获取配置
        public getCfgByTypeAndLv(type: int, lv: int): rideRefine {
            return this._typeTable[type][lv];
        }

        // 根据类型和等级获取等级上限
        public getMaxLvByLv(type: int, lv: int): int {
            let cfg: rideRefine = this.getCfgByTypeAndLv(type, lv);
            // 人物等级不够代表未突破，直接返回当前等级
            if (cfg[rideRefineFields.humanLevel] > PlayerModel.instance.level) {
                return cfg[rideRefineFields.level];
            }
            let arr: Array<rideRefine> = this._typeLvArrTable[type];
            let t: rideRefine;
            for (let i: int = lv + 1, len: int = arr.length; i < len; i++) {
                if (arr[i][rideRefineFields.humanLevel] !== cfg[rideRefineFields.humanLevel]) {
                    t = arr[i];
                    break;
                }
            }
            if (!t) t = arr[arr.length - 1];
            return t[rideRefineFields.level];
        }

        //筛选出显示属性
        public get attrIndices(): int[] {
            return this._attrIndices;
        }
    }
}