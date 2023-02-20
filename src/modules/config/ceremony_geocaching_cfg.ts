/** 开服活动-庆典探索榜单配置*/
namespace modules.config {
    import ceremonyGeocachingRank = Configuration.ceremonyGeocachingRank;
    import ceremonyGeocachingRankFields = Configuration.ceremonyGeocachingRankFields;
    import Items = Configuration.Items;

    export class CeremonyGeocachingRankCfg {
        private static _instance: CeremonyGeocachingRankCfg;
        public static get instance(): CeremonyGeocachingRankCfg {
            return this._instance = this._instance || new CeremonyGeocachingRankCfg();
        }

        private _table: Table<Table<ceremonyGeocachingRank>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let array: Array<ceremonyGeocachingRank> = GlobalData.getConfig("ceremony_geocaching_rank");

            for (let index = 0; index < array.length; index++) {
                const cfg: ceremonyGeocachingRank = array[index];
                const day: number = cfg[ceremonyGeocachingRankFields.days];
                const rank: number = cfg[ceremonyGeocachingRankFields.rank];

                if (this._table[day] == null) {
                    this._table[day] = {};
                }
                this._table[day][rank] = cfg;
            }

            // console.log("所有奖励：：：", this._table);

        }

        // 根据开服天数获取当前配置榜单
        public getAllItemCfgByDays(day: int) {
            let datas: Table<ceremonyGeocachingRank> = {};

            datas = this._table[day];

            if (datas == null) {
                // console.log("xxxxxxxxxxxxxxxxxx");
                return null;
            }

            // console.log("开服", day, "天奖励:", datas);

            return datas;
        }

        // 根据开服天数获取当前配置的榜首奖励
        public getLeaderAwardCfgByDays(day: int): Items {
            //拿到开服指定天的排行榜单数据
            let datas: Table<ceremonyGeocachingRank> = this.getAllItemCfgByDays(day);
            if (datas == null) return null;
            //获取第一名的第一个奖励
            for (const key in datas) {
                if (Object.prototype.hasOwnProperty.call(datas, key)) {
                    const element = datas[key];
                    if (element[ceremonyGeocachingRankFields.rank] == 1) {
                        let item: Items = element[ceremonyGeocachingRankFields.items][0];
                        // console.log("榜首奖励", item);
                        return item;
                    }
                }
            }
            // 走到这里说明配置文件有误
            return null;
        }
    }
}