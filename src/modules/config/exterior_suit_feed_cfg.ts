namespace modules.config {
    import exterior_suit_feed = Configuration.exterior_suit_feed;
    import exterior_suit_feed_Field = Configuration.exterior_suit_feed_Field;

    export class ExteriorSuitFeedCfg {
        private static _instance: ExteriorSuitFeedCfg;
        public static get instance(): ExteriorSuitFeedCfg {
            return this._instance = this._instance || new ExteriorSuitFeedCfg();
        }

        private _tab: Table<Table<exterior_suit_feed>>;
        private _cfg: Table<exterior_suit_feed>;

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};
            this._cfg = {};
            let arr: Array<exterior_suit_feed> = GlobalData.getConfig("exterior_suit_feed");
            let curId = -1;
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][exterior_suit_feed_Field.id];
                let level: number = arr[i][exterior_suit_feed_Field.level];
                if (curId != id) {
                    curId = id;
                    this._tab[curId] = {};
                }
                this._tab[curId][level] = arr[i];
            }
        }

        /**根据id 获取配置*/
        public getCfgById(id: number): Table<exterior_suit_feed> {
            return this._tab[id];
        }
    }
}
