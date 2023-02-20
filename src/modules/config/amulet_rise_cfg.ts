/** 圣物配置*/


namespace modules.config {
    import amuletRise = Configuration.amuletRise;
    import amuletRiseFields = Configuration.amuletRiseFields;
    import Dictionary = Laya.Dictionary;

    export class AmuletRiseCfg {
        private static _instance: AmuletRiseCfg;
        public static get instance(): AmuletRiseCfg {
            return this._instance = this._instance || new AmuletRiseCfg();
        }

        private _dic: Dictionary;
        private _maxLv: number;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            this._maxLv = 0;
            let arr: Array<amuletRise> = GlobalData.getConfig("amulet_rise");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][amuletRiseFields.level], arr[i]);
                this._maxLv = arr[i][amuletRiseFields.maxSkillLevel];
            }
        }

        // 根据等级获取配置
        public getCfgBylevel(level: int): amuletRise {
            return this._dic.get(level);
        }

        //技能最大等级
        public get maxLv(): number {
            return this._maxLv;
        }
    }
}