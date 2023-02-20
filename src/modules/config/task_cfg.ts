/** 任务配置*/

namespace modules.config {
    import task = Configuration.task;
    import taskFields = Configuration.taskFields;

    export class TaskCfg {
        private static _instance: TaskCfg;
        public static get instance(): TaskCfg {
            return this._instance = this._instance || new TaskCfg();
        }

        private _table: Table<task>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<task> = GlobalData.getConfig("task");
            let cfg: task;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                cfg = arr[i];
                this._table[cfg[taskFields.taskId]] = cfg;
            }
            // console.log("任务加载", this._table)
        }

        // 根据任务ID获取任务配置
        public getTaskCfgById(id: string): task {
            return this._table[id];
        }
    }
}