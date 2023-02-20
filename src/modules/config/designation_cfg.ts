/** 通用配置*/


namespace modules.config {
    import designation = Configuration.designation;
    import designationFields = Configuration.designationFields;
    import Dictionary = Laya.Dictionary;

    export class DesignationCfg {
        private static _instance: DesignationCfg;
        public static get instance(): DesignationCfg {
            return this._instance = this._instance || new DesignationCfg();
        }

        private _dic: Dictionary;
        private _arr: Array<designation>;
        private _tab: Table<Array<designation>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            this._arr = new Array<designation>();
            this._tab = {};
            this._arr = GlobalData.getConfig("designation");
            for (let i: int = 0, len = this._arr.length; i < len; i++) {
                this._dic.set(this._arr[i][designationFields.id], this._arr[i]);
                let grade: number = this._arr[i][designationFields.type];
                if (!this._tab[grade]) {
                    this._tab[grade] = [];
                }
                this._tab[grade].push(this._arr[i]);
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): designation {
            return this._dic.get(id);
        }

        // 获取对应 称号类型的 所有数据
        public getCfgByType(type: int): Array<designation> {
            return this._tab[type];
        }

        public get_arr(): Array<designation> {
            return this._arr;
        }
    }
}