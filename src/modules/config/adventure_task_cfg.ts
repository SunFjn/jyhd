/** 奇遇任务配置*/


namespace modules.config {
    import adventure_task = Configuration.adventure_task;
    import adventure_taskFields = Configuration.adventure_taskFields;

    export class AdventureTaskCfg {
        private static _instance: AdventureTaskCfg;
        public static get instance(): AdventureTaskCfg {
            return this._instance = this._instance || new AdventureTaskCfg();
        }

        private _table: Table<adventure_task>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<adventure_task> = GlobalData.getConfig("adventure_task");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][adventure_taskFields.taskId]] = arr[i];
            }
        }

        // 根据任务ID获取任务配置
        public getCfgById(taskId: number): adventure_task {
            return this._table[taskId];
        }
    }
}