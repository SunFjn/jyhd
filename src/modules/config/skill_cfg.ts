/** 技能配置*/


namespace modules.config {
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;

    export class SkillCfg {
        private static _instance: SkillCfg;
        public static get instance(): SkillCfg {
            return this._instance = this._instance || new SkillCfg();
        }

        private _dic: Table<skill>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = {};
            let arr: Array<skill> = GlobalData.getConfig("skill");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic[arr[i][skillFields.id]] = arr[i];
             
            }
        }

        // 根据技能ID获取配置
        public getCfgById(skillID: number): skill {
            return this._dic[skillID];
        }

    }
}