/** 挂机收益配置*/


namespace modules.config {
    import onhook_income = Configuration.onhook_income;
    import onhook_incomeFields = Configuration.onhook_incomeFields;
    import Dictionary = Laya.Dictionary;

    export class OnhookIncomeCfg {
        private static _instance: OnhookIncomeCfg;
        public static get instance(): OnhookIncomeCfg {
            return this._instance = this._instance || new OnhookIncomeCfg();
        }

        private _lvDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            let arr: Array<onhook_income> = GlobalData.getConfig("onhook_income");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let cfg: onhook_income = arr[i];
                this._lvDic.set(cfg[onhook_incomeFields.level], cfg);
            }
        }

        // 根据关卡数获取关卡收益配置
        public getIncomeCfgByLv(lv: number): onhook_income {
            return this._lvDic.get(lv);
        }
    }
}