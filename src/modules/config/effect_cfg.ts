/** BUFF配置*/


namespace modules.config {
    import effect = Configuration.effect;
    import effectFields = Configuration.effectFields;

    export class EffectCfg {
        private static _instance: EffectCfg;
        public static get instance(): EffectCfg {
            return this._instance = this._instance || new EffectCfg();
        }

        private _table: Table<effect>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<effect> = GlobalData.getConfig("effect");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][effectFields.id]] = arr[i];
            }
        }

        // 根据ID获取配置
        public getCfgById(id: number): effect {
            return this._table[id];
        }
    }
}