namespace modules.config {
    import guanghuan_feed = Configuration.guanghuan_feed;
    import guanghuan_feedFields = Configuration.guanghuan_feedFields;

    export class GuangHuanFeedCfg {
        private static _instance: GuangHuanFeedCfg;
        public static get instance(): GuangHuanFeedCfg {
            return this._instance = this._instance || new GuangHuanFeedCfg();
        }

        private _cfgs: Array<guanghuan_feed>;
        // 技能纯粹ID
        private _skillPureIds: Array<number>;
        // 技能对应的等级table
        private _skillLvTable: Table<Table<guanghuan_feed>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("guanghuan_feed");
            this._skillPureIds = [];
            this._skillLvTable = {};
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let arr: Array<number> = this._cfgs[i][guanghuan_feedFields.skill];
                if (arr.length > 0) {
                    let pureId: number = Math.floor(arr[0] * 0.0001);
                    if (arr[1] === 1) this._skillPureIds.push(pureId);       // 1级技能存入纯粹ID中
                    if (!this._skillLvTable[pureId]) {
                        this._skillLvTable[pureId] = {};
                    }
                    this._skillLvTable[pureId][arr[1]] = this._cfgs[i];
                }
            }
        }

        public get skillPureIds(): Array<number> {
            return this._skillPureIds;
        }

        // 根据等级获取配置
        public getCfgByLevel(level: int): guanghuan_feed {
            return this._cfgs[level - 1];
        }

        // 根据等级获取下一个技能升级配置
        public getUpSkillCfgByLv(level: int): guanghuan_feed {
            for (let i: int = level, len: int = this._cfgs.length; i < len; i++) {
                let cfg: guanghuan_feed = this._cfgs[i];
                if (cfg && cfg[guanghuan_feedFields.skill].length > 0) {
                    return cfg;
                }
            }
            return null;
        }

        // 根据技能ID，获取技能对应的等级table
        public getLvTableBySkillId(skillId: number): Table<guanghuan_feed> {
            return this._skillLvTable[skillId];
        }
    }
}