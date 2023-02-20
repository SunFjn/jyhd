/** 技能特效配置*/

namespace modules.config {
    import SkillEffect = Configuration.SkillEffect;

    export class SkillEffectCfg {
        private static _instance: SkillEffectCfg;
        public static get instance(): SkillEffectCfg {
            return this._instance = this._instance || new SkillEffectCfg();
        }

        private _table: Table<SkillEffect>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("skill_effect");
        }

        // 根据技能ID获取配置
        public getCfgById(skillId: int): SkillEffect {
            return this._table[skillId];
        }
    }
}