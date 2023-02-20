/** 功能开启配置*/
namespace modules.config {
    import action_open = Configuration.action_open;
    import action_openFields = Configuration.action_openFields;

    export class ActionOpenCfg {
        private static _instance: ActionOpenCfg;
        public static get instance(): ActionOpenCfg {
            return this._instance = this._instance || new ActionOpenCfg();
        }

        private _table: Table<action_open>;
        private _operatorActivityArr: Array<action_open>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._operatorActivityArr = new Array<action_open>();
            let arr: Array<action_open> = GlobalData.getConfig("action_open");
            // console.log("arrarr", arr)
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][action_openFields.id]] = arr[i];
                if (arr[i][action_openFields.index]) {
                    this._operatorActivityArr.push(arr[i]);
                }
            }
        }

        //获取配置
        public getCfgById(id: int): action_open {
            return this._table[id];
        }

        //获取运营活动功能
        public getOperatorCfg(): Array<action_open> {
            return this._operatorActivityArr;
        }
    }
}