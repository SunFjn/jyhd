/** 七日活动任务配置 */
namespace modules.config {

    import hero_aura = Configuration.hero_aura;
    import hero_auraFields = Configuration.hero_auraFields;
    import heroaura_item = Configuration.hero_awardItem;

    export class HeroAuraCfg {
        private static _instance: HeroAuraCfg;
        public static get instance(): HeroAuraCfg {
            return this._instance = this._instance || new HeroAuraCfg();
        }

        // 根据档位(充值金額)和天数存取的数据
        private _newTab: Table<any>;
        private _taskCount: number;
        private _dayTaskCount: Table<number>;

        constructor() {
            this._taskCount = 0;
            this.init();
        }

        private init(): void {
            this._newTab = {};
            this._dayTaskCount = {};
            let arr: Array<hero_aura> = GlobalData.getConfig("user_halo");
            let arr2: Array<heroaura_item> = GlobalData.getConfig("heroaura_item");
        }
    }

}
