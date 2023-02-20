/** 宠物进阶配置*/


namespace modules.config {
    import petRank = Configuration.petRank;
    import petRankFields = Configuration.petRankFields;

    export class PetRankCfg {
        private static _instance: PetRankCfg;
        public static get instance(): PetRankCfg {
            return this._instance = this._instance || new PetRankCfg();
        }

        private _table: Table<petRank>;
        private _skillTable: Table<petRank>;
        private _cfgs: Array<petRank>;
        private _table2: Table<petRank>;

        // 进阶技能ID数组
        private _skillIds: Array<int>;
        // 外面数组
        private _showIds: Array<number>;
        private _showStars: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._table2 = {};
            this._skillTable = {};
            this._skillIds = new Array<int>();
            this._cfgs = GlobalData.getConfig("pet_rank");
            this._showIds = [];
            this._showStars = [];
            for (let i: int = 0; i < this._cfgs.length; i++) {
                let cfg: petRank = this._cfgs[i];
                this._table[cfg[petRankFields.star]] = cfg;
                if (cfg[petRankFields.skill] && cfg[petRankFields.skill].length > 0) {
                    let skillId: number = cfg[petRankFields.skill][0];
                    this._skillTable[skillId] = cfg;
                    this._skillIds.push(skillId);
                }
                if (cfg[petRankFields.showId]) {
                    this._showIds.push(cfg[petRankFields.showId]);
                    this._showStars.push(cfg[petRankFields.star]);
                    this._table2[cfg[petRankFields.showId]] = this._cfgs[i + 1];
                }
            }
        }

        public get cfgs(): Array<petRank> {
            return this._cfgs;
        }

        // 进阶技能ID数组
        public get skillIds(): Array<int> {
            return this._skillIds;
        }

        // 根据进阶星级获取对应属性
        public getPetRankCfgBySt(star: number): petRank {
            let t: petRank = this._table[star];
            return t ? t : null;
        }

        // 根据技能ID获取进阶配置
        public getCfgBySkillId(skillId: int): petRank {
            return this._skillTable[skillId];
        }

        // 获取外观数组
        public get showIds(): Array<number> {
            return this._showIds;
        }

        //获取外观可显示时的星级
        public get showStars(): number[] {
            return this._showStars;
        }

        //根据外观id获取激活配置
        public getActivateCfgByShowId(showId: number): petRank {
            return this._table2[showId];
        }
    }
}