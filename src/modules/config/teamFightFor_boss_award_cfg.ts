namespace modules.config {
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import fightTeam_boss_award = Configuration.fightTeam_boss_award;
    import fightTeam_boss_awardFields = Configuration.fightTeam_boss_awardFields;

    import fightTeam_score_award = Configuration.fightTeam_score_award;
    import fightTeam_score_awardFields = Configuration.fightTeam_score_awardFields;

    export class teamFightForBossAwardCfg {
        private static _instance: teamFightForBossAwardCfg;
        public static get instance(): teamFightForBossAwardCfg {
            return this._instance = this._instance || new teamFightForBossAwardCfg();
        }

        private cfg: Array<fightTeam_boss_award>;
        constructor() {
            this.init();
        }
        private init(): void {
            this.cfg = GlobalData.getConfig(`fightTeam_boss_award`);
        }

        public getAllCfg() {
            return this.cfg
        }
        public getCfg(index) {
            return this.cfg[index]
        }
    }
    export class teamFightForScoreAwardCfg {
        private static _instance: teamFightForScoreAwardCfg;
        public static get instance(): teamFightForScoreAwardCfg {
            return this._instance = this._instance || new teamFightForScoreAwardCfg();
        }

        private cfg: Array<fightTeam_score_award>;
        constructor() {
            this.init();
        }
        private init(): void {
            this.cfg = GlobalData.getConfig(`zhulu_Integral_award`);
            console.log('研发测试_chy:测试', this.cfg);

        }

        public getAllCfg() {
            return this.cfg
        }
        public getCfg(index) {
            return this.cfg[index]
        }
    }
}
