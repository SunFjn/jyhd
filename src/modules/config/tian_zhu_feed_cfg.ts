/** 时装升级配置*/




namespace modules.config {
    import tianzhu_feed = Configuration.tianzhu_feed;
    import tianzhu_feedFields = Configuration.tianzhu_feedFields;

    export class TianZhuFeedCfg {
        private static _instance: TianZhuFeedCfg;
        public static get instance(): TianZhuFeedCfg {
            return this._instance = this._instance || new TianZhuFeedCfg();
        }

        private _cfgs: Array<tianzhu_feed>;
        // 技能纯粹ID
        private _skillPureIds: Array<number>;
        // 技能对应的等级table
        private _skillLvTable: Table<Table<tianzhu_feed>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("tianzhu_feed");
            this._skillPureIds = [];
            this._skillLvTable = {};
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let arr: Array<number> = this._cfgs[i][tianzhu_feedFields.skill];
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
        public getCfgByLevel(level: int): tianzhu_feed {
            return this._cfgs[level - 1];
        }

        // 根据等级获取下一个技能升级配置
        public getUpSkillCfgByLv(level: int): tianzhu_feed {
            for (let i: int = level, len: int = this._cfgs.length; i < len; i++) {
                let cfg: tianzhu_feed = this._cfgs[i];
                if (cfg && cfg[tianzhu_feedFields.skill].length > 0) {
                    return cfg;
                }
            }
            return null;
        }

        // 根据技能ID，获取技能对应的等级table
        public getLvTableBySkillId(skillId: number): Table<tianzhu_feed> {
            return this._skillLvTable[skillId];
        }
    }
}