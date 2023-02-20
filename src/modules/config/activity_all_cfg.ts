/** 通用配置*/


namespace modules.config {
    import activity_all = Configuration.activity_all;
    import activity_allFields = Configuration.activity_allFields;
    import Dictionary = Laya.Dictionary;

    export class ActivityAllCfg {
        private static _instance: ActivityAllCfg;
        public static get instance(): ActivityAllCfg {
            return this._instance = this._instance || new ActivityAllCfg();
        }

        private _dic: Dictionary;
        private _arr: Array<activity_all>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            this._arr = new Array<activity_all>();
            this._arr = GlobalData.getConfig("activity_all");
            for (let i: int = 0, len = this._arr.length; i < len; i++) {
                this._dic.set(this._arr[i][activity_allFields.actionOpenId], this._arr[i]);
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): activity_all {
            return this._dic.get(id);
        }

        public get_arr(): Array<activity_all> {
            return this._arr;
        }
    }
}