/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import Dictionary = Laya.Dictionary;
    import gushenFields = Configuration.gushenFields;
    import gushen = Configuration.gushen;

    export class GuShenCfg {
        private static _instance: GuShenCfg;
        public static get instance(): GuShenCfg {
            return this._instance = this._instance || new GuShenCfg();
        }

        private _dic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<gushen> = GlobalData.getConfig("gushen");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][gushenFields.type], arr[i]);
            }
        }

        // 根据类型获取配置
        public getCfgBytype(type: int): gushen {
            return this._dic.get(type);
        }

    }
}