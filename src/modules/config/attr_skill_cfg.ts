/** 技能属性*/

namespace modules.config {
    import attr_skill = Configuration.attr_skill;

    export class AttrSkillCfg {
        private static _instance: AttrSkillCfg;
        public static get instance(): AttrSkillCfg {
            return this._instance = this._instance || new AttrSkillCfg();
        }

        private _table: Table<attr_skill>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("attr_skill");
        }

        // 根据属性ID获取配置
        public getCfgById(attrId: number): attr_skill {
            return this._table[attrId];
        }
    }
}