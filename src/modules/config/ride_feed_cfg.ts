/** 精灵培养配置*/
namespace modules.config {
    import rideFeed = Configuration.rideFeed;
    import rideFeedFields = Configuration.rideFeedFields;
    import CommonUtil = modules.common.CommonUtil;

    export class RideFeedCfg {
        private static _instance: RideFeedCfg;
        public static get instance(): RideFeedCfg {
            return this._instance = this._instance || new RideFeedCfg();
        }

        // 精灵培养映射，{key:level,value:rideFeed}
        private _table: Table<rideFeed>;
        // 精灵培养技能映射，{key:skillId,value:{key:skillLevel,value:rideFeed}}
        private _skillTable: Table<Table<rideFeed>>;
        // 精灵培养技能ID数组
        private _skillIds: Array<number>;
        private _cfgs: Array<rideFeed>;
        private _lvs: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._skillTable = {};
            this._lvs = [];
            this._skillIds = new Array<number>();
            this._cfgs = GlobalData.getConfig("ride_feed");
            for (let i: int = 0; i < this._cfgs.length; i++) {
                let cfg: rideFeed = this._cfgs[i];
                let lv: number = cfg[rideFeedFields.level];
                this._lvs.push(lv);
                this._table[lv] = cfg;
                if (cfg[rideFeedFields.skill] && cfg[rideFeedFields.skill].length > 0) {
                    let skillId: number = CommonUtil.getSkillPureIdById(cfg[rideFeedFields.skill][0]);
                    let table: Table<rideFeed> = this._skillTable[skillId];
                    if (!table) {
                        table = {};
                        this._skillIds.push(skillId);
                    }
                    table[cfg[rideFeedFields.skill][1]] = cfg;
                    this._skillTable[skillId] = table;
                }
            }
        }

        public get cfgs(): Array<rideFeed> {
            return this._cfgs;
        }

        public get skillIds(): Array<int> {
            return this._skillIds;
        }

        // 根据培养等级获取对应属性
        public getPetFeedCfgByLv(level: number): rideFeed {
            let t: rideFeed = this._table[level];
            return t ? t : null;
        }

        // 根据技能ID，获取技能对应的等级table
        public getLvTableBySkillId(skillId: int): Table<rideFeed> {
            return this._skillTable[skillId];
        }

        public getNextSkillCfgByLv(lv: number): rideFeed {
            for (let i: int = lv, len: int = this._lvs.length; i < len; i++) {
                let index: number = this._lvs.indexOf(i);
                if (index == -1) {
                    return null;
                }
                let skill: number[] = this._cfgs[index][rideFeedFields.skill];
                if (skill && skill.length > 0) {
                    if (this._cfgs[index][rideFeedFields.level] == lv) continue;
                    return this.cfgs[index];
                }
            }
        }
    }
}
