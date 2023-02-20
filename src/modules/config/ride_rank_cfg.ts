/** 精灵升阶配置*/


namespace modules.config {
    import rideRank = Configuration.rideRank;
    import rideRankFields = Configuration.rideRankFields;

    export class RideRankCfg {
        private static _instance: RideRankCfg;
        public static get instance(): RideRankCfg {
            return this._instance = this._instance || new RideRankCfg();
        }

        private _table: Table<rideRank>;
        private _skillTable: Table<rideRank>;
        private _cfgs: Array<rideRank>;
        private _table2: Table<rideRank>;

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
            this._showIds = [];
            this._showStars = [];
            this._cfgs = GlobalData.getConfig("ride_rank");
            for (let i: int = 0; i < this._cfgs.length; i++) {
                let cfg: rideRank = this._cfgs[i];
                this._table[cfg[rideRankFields.star]] = cfg;
                if (cfg[rideRankFields.skill] && cfg[rideRankFields.skill].length > 0) {
                    let skillId: number = cfg[rideRankFields.skill][0];
                    this._skillTable[skillId] = cfg;
                    this._skillIds.push(skillId);
                }
                if (cfg[rideRankFields.showId]) {
                    this._showIds.push(cfg[rideRankFields.showId]);
                    this._showStars.push(cfg[rideRankFields.star]);
                    this._table2[cfg[rideRankFields.showId]] = this._cfgs[i + 1];
                }
            }
        }

        public get cfgs(): Array<rideRank> {
            return this._cfgs;
        }

        // 进阶技能ID数组
        public get skillIds(): Array<int> {
            return this._skillIds;
        }

        // 根据进阶星级获取对应属性
        public getPetRankCfgBySt(star: number): rideRank {
            let t: rideRank = this._table[star];
            return t ? t : null;
        }

        // 根据技能ID获取进阶配置
        public getCfgBySkillId(skillId: int): rideRank {
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
        public getActivateCfgByShowId(showId: number): rideRank {
            return this._table2[showId];
        }
    }
}