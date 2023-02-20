/** 玄火排行配置 -个人和战队 */
namespace modules.config {

    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import xuanhuoRankAwardFields = Configuration.xuanhuoRankAwardFields;

    export class XuanHuoRankAwardCfg {
        private static _instance: XuanHuoRankAwardCfg;
        public static get instance(): XuanHuoRankAwardCfg {
            return this._instance = this._instance || new XuanHuoRankAwardCfg();
        }

        private _tab_clan: Table<xuanhuoRankAward>;
        private _tab_person: Table<xuanhuoRankAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab_clan = {};
            this._tab_person = {};
            let arr: Array<xuanhuoRankAward> = GlobalData.getConfig("xuanhuo_rank_fightteam_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab_clan[arr[i][xuanhuoRankAwardFields.rank]] = arr[i];
            }

            let arr2: Array<xuanhuoRankAward> = GlobalData.getConfig("xuanhuo_rank_person_award");
            for (let i: int = 0, len = arr2.length; i < len; i++) {
                this._tab_person[arr2[i][xuanhuoRankAwardFields.rank]] = arr2[i];
            }
        }

        //获取所有数据 - 战队
        public getAllClanConfig(): Table<xuanhuoRankAward> {
            return this._tab_clan;
        }

        //获取所有数据 - 个人
        public getAllPersonConfig(): Table<xuanhuoRankAward> {
            return this._tab_person;
        }

    }
}