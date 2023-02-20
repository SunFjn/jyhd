/** 时装升级配置*/


namespace modules.config {
    import fashion_feed = Configuration.fashion_feed;
    import fashion_feedFields = Configuration.fashion_feedFields;

    export class FashionFeedCfg {
        private static _instance: FashionFeedCfg;
        public static get instance(): FashionFeedCfg {
            return this._instance = this._instance || new FashionFeedCfg();
        }

        private _cfgs: Array<fashion_feed>;
        // 技能纯粹ID
        private _skillPureIds: Array<number>;
        // 技能对应的等级table
        private _skillLvTable: Table<Table<fashion_feed>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("fashion_feed");
            this._skillPureIds = [];
            this._skillLvTable = {};
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let arr: Array<number> = this._cfgs[i][fashion_feedFields.skill];
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
        public getCfgByLevel(level: int): fashion_feed {
            return this._cfgs[level - 1];
        }

        // 根据等级获取下一个技能升级配置
        public getUpSkillCfgByLv(level: int): fashion_feed {
            for (let i: int = level, len: int = this._cfgs.length; i < len; i++) {
                let cfg: fashion_feed = this._cfgs[i];
                if (cfg && cfg[fashion_feedFields.skill].length > 0) {
                    return cfg;
                }
            }
            return null;
        }

        // 根据技能ID，获取技能对应的等级table
        public getLvTableBySkillId(skillId: number): Table<fashion_feed> {
            return this._skillLvTable[skillId];
        }
    }
}