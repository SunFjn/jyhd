namespace modules.config {

    import faction_boss_award = Configuration.faction_boss_award;
    import faction_boss_awardFields = Configuration.faction_boss_awardFields;

    export class FactionBossAwardCfg {
        private static _instance: FactionBossAwardCfg;
        public static get instance(): FactionBossAwardCfg {
            return this._instance = this._instance || new FactionBossAwardCfg();
        }

        private _tab: Table<faction_boss_award>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<faction_boss_award> = GlobalData.getConfig(`faction_boss_award`);
            for (let e of arr) {
                this._tab[e[faction_boss_awardFields.level]] = e;
            }
        }

        public getCfgBylv(lv: number): faction_boss_award {
            return this._tab[lv];
        }
    }
}
