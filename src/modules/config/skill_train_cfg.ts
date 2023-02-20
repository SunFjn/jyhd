/** 技能中技能信息*/


namespace modules.config {
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import Dictionary = Laya.Dictionary;

    export class SkillTrainCfg {
        private static _instance: SkillTrainCfg;
        public static get instance(): SkillTrainCfg {
            return this._instance = this._instance || new SkillTrainCfg();
        }

        private _knowledgeDic: Table<skillTrain>;
        private _scienceDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._knowledgeDic = {};
            this._scienceDic = new Dictionary();
            let arr: Array<skillTrain> = GlobalData.getConfig("skill_train");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id = arr[i][skillTrainFields.id];
                let type = Math.floor(id / 10000000);
                if (type == 1) {
                    this._knowledgeDic[id] = arr[i];
                } else if (type == 2 || type == 4) {
                    this._scienceDic.set(id, arr[i]);
                }
            }
        }

        /**
         * 根据绝学技能ID获取对应的配置
         * @param skillID 绝学技能id
         */
        public getKnowledgeCfgById(skillID: number): skillTrain {
            return this._knowledgeDic[skillID];
        }

        /**
         * 根据秘术技能ID获取对应的配置
         * @param skillID 秘术技能id
         */
        public getScienceCfgById(skillID: number): skillTrain {
            return this._scienceDic.get(skillID);
        }

        /**
         * 获得所有秘术技能
         */
        public getScienceCfg(): Dictionary {
            return this._scienceDic;
        }
    }
}