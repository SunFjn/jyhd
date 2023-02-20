/** 奇遇兑换配置*/


namespace modules.adventure {
    import adventure_exchange = Configuration.adventure_exchange;
    import adventure_exchangeFields = Configuration.adventure_exchangeFields;

    export class AdventureExchangeCfg {
        private static _instance: AdventureExchangeCfg;
        public static get instance(): AdventureExchangeCfg {
            return this._instance = this._instance || new AdventureExchangeCfg();
        }

        private _cfgs: Array<adventure_exchange>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("adventure_exchange");
            this._cfgs.sort(this.sortFunc);
        }

        public get cfgs(): Array<adventure_exchange> {
            return this._cfgs;
        }

        private sortFunc(a: adventure_exchange, b: adventure_exchange): number {
            return a[adventure_exchangeFields.condition][1] - b[adventure_exchangeFields.condition][1];
        }
    }
}