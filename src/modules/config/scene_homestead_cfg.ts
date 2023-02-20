/** 仙府-家园触发事件配置*/


namespace modules.config {
    import scene_homestead = Configuration.scene_homestead;
    import scene_homesteadFields = Configuration.scene_homesteadFields;

    export class SceneHomesteadCfg {
        private static _instance: SceneHomesteadCfg;
        public static get instance(): SceneHomesteadCfg {
            return this._instance = this._instance || new SceneHomesteadCfg();
        }

        private _tab: Table<Table<scene_homestead>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<scene_homestead> = GlobalData.getConfig("scene_homestead");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let fengshuiLv: number = arr[i][scene_homesteadFields.level];
                let wheel: number = arr[i][scene_homesteadFields.wheel];
                if (!this._tab[fengshuiLv]) {
                    this._tab[fengshuiLv] = {};
                }
                this._tab[fengshuiLv][wheel] = arr[i];
            }
        }

        //根据风水等级和轮数获取配置
        public getCfgByLvAndWheel(lv: number, wheel: number): scene_homestead {
            return this._tab[lv][wheel];
        }
    }
}