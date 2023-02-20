/** 天梯配置*/


namespace modules.config {

    import tianti = Configuration.tianti;
    import tiantiFields = Configuration.tiantiFields;

    export class TiantiCfg {
        private static _instance: TiantiCfg;
        public static get instance(): TiantiCfg {
            return this._instance = this._instance || new TiantiCfg();
        }

        private _cfgs: Array<tianti>;
        private _table: Table<tianti>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("tianti");
            this._table = {};
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                this._table[this._cfgs[i][tiantiFields.id]] = this._cfgs[i];
            }
        }

        // 根据ID获取配置
        public getCfgById(id: number): tianti {

            return this._table[id];
        }

        //获取最高段位积分
        public getCfgMaxSocre(): number {
            this._cfgs = GlobalData.getConfig("tianti");
            let last = this._cfgs[this._cfgs.length - 1];

            return last[tiantiFields.totalScore];
        }

        public getCfgMaxId(): number {
            this._cfgs = GlobalData.getConfig("tianti");
            let last = this._cfgs[this._cfgs.length - 1];

            return last[tiantiFields.id];
        }

        // 获取配置数组
        public get cfgs(): Array<tianti> {
            return this._cfgs;
        }
    }
}