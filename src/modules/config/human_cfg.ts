/** 人物配置*/


namespace modules.config {
    import human = Configuration.human;
    import humanFields = Configuration.humanFields;
    import Dictionary = Laya.Dictionary;

    export class HumanCfg {
        private static _instance: HumanCfg;
        public static get instance(): HumanCfg {
            return this._instance = this._instance || new HumanCfg();
        }

        private _aiDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._aiDic = new Dictionary();
            let ais: Array<human> = GlobalData.getConfig("human");
            for (let i: int = 0, len = ais.length; i < len; i++) {
                let aiId: int = ais[i][humanFields.ai];
                if (!this._aiDic.get(aiId)) this._aiDic.set(aiId, new Dictionary());
                let levelDic: Dictionary = this._aiDic.get(aiId);
                levelDic.set(ais[i][humanFields.level], ais[i]);
            }
        }

        // 根据aiId和等级取出等级配置
        public getHumanCfgByAiIdAndLv(aiId: number, lv: number): human {
            return this._aiDic.get(aiId).get(lv);
        }

        public getMaxLvByAiId(aiId: number): number {
            let len: int = this._aiDic.get(aiId).keys.length;
            return this._aiDic.get(aiId).get(this._aiDic.get(aiId).keys[len - 1])[humanFields.level];
        }
    }
}