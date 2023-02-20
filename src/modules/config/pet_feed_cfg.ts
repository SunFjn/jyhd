/** 宠物培养配置*/


namespace modules.config {
    import petFeed = Configuration.petFeed;
    import petFeedFields = Configuration.petFeedFields;
    import CommonUtil = modules.common.CommonUtil;

    export class PetFeedCfg {
        private static _instance: PetFeedCfg;
        public static get instance(): PetFeedCfg {
            return this._instance = this._instance || new PetFeedCfg();
        }

        private _table: Table<petFeed>;
        private _skillTable: Table<Table<petFeed>>;
        private _cfgs: Array<petFeed>;
        // 纯技能ID数组（技能ID会随着等级改变而变化，这里只计纯粹的ID，不计等级）
        private _skillIds: Array<int>;
        private _lvs: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._skillTable = {};
            this._lvs = [];
            this._skillIds = new Array<int>();
            this._cfgs = GlobalData.getConfig("pet_feed");
            for (let i: int = 0; i < this._cfgs.length; i++) {
                let cfg: petFeed = this._cfgs[i];
                let lv: number = cfg[petFeedFields.level];
                this._lvs.push(lv);
                this._table[lv] = cfg;
                if (cfg[petFeedFields.skill] && cfg[petFeedFields.skill].length > 0) {
                    let skillId: number = CommonUtil.getSkillPureIdById(cfg[petFeedFields.skill][0]);
                    let table: Table<petFeed> = this._skillTable[skillId];
                    if (!table) {
                        table = {};
                        this._skillIds.push(skillId);
                    }
                    table[cfg[petFeedFields.skill][1]] = cfg;
                    this._skillTable[skillId] = table;
                }
            }
        }

        public get cfgs(): Array<petFeed> {
            return this._cfgs;
        }

        public get skillIds(): Array<int> {
            return this._skillIds;
        }

        // 根据培养等级获取对应属性
        public getPetFeedCfgByLv(level: number): petFeed {
            let t: petFeed = this._table[level];
            return t ? t : null;
        }

        // 根据技能ID，获取技能对应的等级table
        public getLvTableBySkillId(skillId: int): Table<petFeed> {
            return this._skillTable[skillId];
        }

        public getNextSkillCfgByLv(lv: number): petFeed {
            for (let i: int = lv, len: int = this._lvs.length; i < len; i++) {
                let index: number = this._lvs.indexOf(i);
                if (index == -1) {
                    return null;
                }
                let skill: number[] = this._cfgs[index][petFeedFields.skill];
                if (skill && skill.length > 0) {
                    if (this._cfgs[index][petFeedFields.level] == lv) continue;
                    return this.cfgs[index];
                }
            }
        }
    }
}