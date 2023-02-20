/** 金身修炼配置*/


namespace modules.config {
    import soulRefine = Configuration.soulRefine;
    import soulRefineFields = Configuration.soulRefineFields;

    export class GoldBodyRefineCfg {
        private static _instance: GoldBodyRefineCfg;
        public static get instance(): GoldBodyRefineCfg {
            return this._instance = this._instance || new GoldBodyRefineCfg();
        }

        private _typeArray: Array<Array<soulRefine>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._typeArray = [];
            let refines = GlobalData.getConfig("soul_refine");
            for (let i: int = 0, len: int = refines.length; i < len; i++) {
                let cfg = refines[i];
                let type = cfg[soulRefineFields.type];
                let levels = this._typeArray[type] || (this._typeArray[type] = []);
                levels[cfg[soulRefineFields.level]] = cfg;
            }
        }

        /**
         * 根据类型和等级获取金身配置
         */
        public getCfgByTypeAndLv(type: int, lv: int): soulRefine {
            return this._typeArray[type] ? this._typeArray[type][lv] : null;
        }

        /**
         * 根据类型获取金身等级上限
         */
        public getMaxLvByType(type: int): int {
            return this._typeArray[type].length;
        }
    }
}