/** 防骗问卷*/


namespace modules.config {
    import prevent_fool = Configuration.prevent_fool;
    import preventFoolFields = Configuration.prevent_foolFields;

    export class PreventFoolCfg {
        private static _instance: PreventFoolCfg;
        public static get instance(): PreventFoolCfg {
            return this._instance = this._instance || new PreventFoolCfg();
        }

        private _cfgs: Array<prevent_fool>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("prevent_fool");
        }

        // 根据id获取配置
        public getCfgById(id: number): prevent_fool {
            let t: prevent_fool;
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: prevent_fool = this._cfgs[i];
                if (id === cfg[preventFoolFields.id]) {
                    t = cfg;
                    break;
                }
            }
            if (!t) {
                // throw new Error(`答题配置取不到  id--->${id}`);
            }
            return t;
        }

        public get maxLen(): int {
            return this._cfgs.length;
        }
    }
}