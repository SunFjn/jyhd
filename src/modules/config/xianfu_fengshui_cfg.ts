/////<reference path="../$.ts"/>
/** 仙府-家园风水配置 */
namespace modules.config {
    import xianfu_fengshui = Configuration.xianfu_fengshui;
    import xianfu_fengshuiFields = Configuration.xianfu_fengshuiFields;

    export class XianfuFengShuiCfg {
        private static _instance: XianfuFengShuiCfg;
        public static get instance(): XianfuFengShuiCfg {
            return this._instance = this._instance || new XianfuFengShuiCfg();
        }

        private _tab: Table<xianfu_fengshui>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<xianfu_fengshui> = GlobalData.getConfig("xianfu_fengshui");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][xianfu_fengshuiFields.level]] = arr[i];
            }
        }

        // 根据ID获取配置
        public getCfgById(lv: int): xianfu_fengshui {
            return this._tab[lv];
        }
    }
}