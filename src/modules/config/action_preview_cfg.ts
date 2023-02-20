/** 通用配置*/


namespace modules.config {
    import action_preview = Configuration.action_preview;
    import action_previewFields = Configuration.action_previewFields;
    import Dictionary = Laya.Dictionary;

    export class AcitonPreviewCfg {
        private static _instance: AcitonPreviewCfg;
        public static get instance(): AcitonPreviewCfg {
            return this._instance = this._instance || new AcitonPreviewCfg();
        }

        private _dic: Dictionary;
        private _arr: Array<action_preview>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            this._arr = new Array<action_preview>();
            this._arr = GlobalData.getConfig("action_preview");
            for (let i: int = 0, len = this._arr.length; i < len; i++) {
                this._dic.set(this._arr[i][action_previewFields.id], this._arr[i]);
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): action_preview {
            return this._dic.get(id);
        }

        public get_arr(): Array<action_preview> {
            return this._arr;
        }
    }
}