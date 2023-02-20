///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../../../libs/generate/configuration.d.ts"/>
/** 挂机扫荡配置 */
namespace modules.config {

    import onhook_drop = Configuration.onhook_drop;
    import onhook_dropFields = Configuration.onhook_dropFields;
    import Dictionary = Laya.Dictionary;

    export class OnhookDropCfg {
        private static _instance: OnhookDropCfg;
        public static get instance(): OnhookDropCfg {
            return this._instance = this._instance || new OnhookDropCfg();
        }

        private _dic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<onhook_drop> = GlobalData.getConfig("onhook_drop");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][onhook_dropFields.promoteLevel], arr[i]);
            }
        }

        // 根据等级获取配置
        public getCfgByLv(lv: int): onhook_drop {
            for (let i: int = 0, len: int = this._dic.keys.length; i < len; i++) {
                let key: number = this._dic.keys[i];
                if (lv < key) {
                    return this._dic.get(key);
                }
            }
            return this._dic.get(this._dic.keys[this._dic.keys.length - 1]);
        }
    }
}