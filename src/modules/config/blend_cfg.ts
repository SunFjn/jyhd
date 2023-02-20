/** 通用配置*/


namespace modules.config {
    import blend = Configuration.blend;
    import blendFields = Configuration.blendFields;
    import Dictionary = Laya.Dictionary;

    export class BlendCfg {
        private static _instance: BlendCfg;
        public static get instance(): BlendCfg {
            return this._instance = this._instance || new BlendCfg();
        }

        private _dic: Dictionary;
        private _strs: Array<string>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<blend> = GlobalData.getConfig("blend");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][blendFields.id], arr[i]);
            }

            this._strs = this._dic.get(26004)[blendFields.stringParam];

            for (let i: int = 0, len: int = this._strs.length; i < len; i++) {
                this._strs[i] = this._strs[i].substr(1, this._strs[i].length - 2);
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): blend {
            return this._dic.get(id);
        }

        /**
         * 获取intParam数组内的一条
         * @param id Blend ID
         * @param key intParam内的第几条
         * @returns 
         */
        public getCftBuIdParamAttr(id: int, key: number): number {
            let _cfg = this.getCfgById(id);
            if (typeof _cfg != "object") {
                return null;
            }
            return _cfg[Configuration.blendFields.intParam][key];
        }

        /**
         * 获取intParam数组内的一条
         * @param id Blend ID
         * @param key intParam内的第几条
         * @returns 
         */
        public getCftBuIdParam(id: int): Configuration.blend[Configuration.blendFields.intParam] {
            let _cfg = this.getCfgById(id);
            return _cfg[Configuration.blendFields.intParam];
        }

        //获取聊天快捷语句
        public get chatMarkedWords(): Array<string> {
            return this._strs;
        }
    }
}