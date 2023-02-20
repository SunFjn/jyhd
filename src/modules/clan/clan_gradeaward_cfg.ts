/** 战队等级奖励配置 */
namespace modules.config {

    import clan_gradeAward = Configuration.clan_gradeAward;
    import clan_gradeAwardFields = Configuration.clan_gradeAwardFields;

    export class ClanGradeAwardCfg {
        private static _instance: ClanGradeAwardCfg;
        public static get instance(): ClanGradeAwardCfg {
            return this._instance = this._instance || new ClanGradeAwardCfg();
        }

        private _tab: Table<clan_gradeAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<clan_gradeAward> = GlobalData.getConfig("fight_team_level_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][clan_gradeAwardFields.level]] = arr[i];
            }
        }

        //获取所有数据 
        public getAllConfig(): Table<clan_gradeAward> {
            return this._tab;
        }

    }
}