/** 云梦秘境配置*/


namespace modules.config {
    import scene_copy_cloudland = Configuration.scene_copy_cloudland;
    import scene_copy_cloudlandFields = Configuration.scene_copy_cloudlandFields;
    import Items = Configuration.Items;

    export class SceneCopyCloudlandCfg {
        private static _instance: SceneCopyCloudlandCfg;
        public static get instance(): SceneCopyCloudlandCfg {
            return this._instance = this._instance || new SceneCopyCloudlandCfg();
        }

        private _occAll: Array<number>;
        private _bossIdTable: Table<scene_copy_cloudland>;
        private _arr: Array<scene_copy_cloudland>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._bossIdTable = {};
            this._occAll = new Array<number>();
            this._arr = GlobalData.getConfig("scene_copy_cloudland");
            for (let i: int = 0, len: int = this._arr.length; i < len; i++) {
                let cfg: scene_copy_cloudland = this._arr[i];
                this._bossIdTable[cfg[scene_copy_cloudlandFields.occ]] = cfg;
                this._occAll.push(cfg[scene_copy_cloudlandFields.occ]);
            }
        }

        /**
         * 获取所有bossID
         */
        public get occAll(): Array<number> {
            return this._occAll;
        }

        /**
         * 获取奖励
         */
        public get getAwade(): Array<Items> {
            return this._arr[0][scene_copy_cloudlandFields.awardTips];
        }
    }
}