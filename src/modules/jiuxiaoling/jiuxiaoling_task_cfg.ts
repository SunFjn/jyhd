/** 九霄令任务配置 */
namespace modules.config {

    import jiuXiaoLingTask = Configuration.jiuXiaoLingTask;
    import jiuXiaoLingTaskFields = Configuration.jiuXiaoLingTaskFields;

    export class JiuXiaoLingTaskCfg {
        private static _instance: JiuXiaoLingTaskCfg;
        public static get instance(): JiuXiaoLingTaskCfg {
            return this._instance = this._instance || new JiuXiaoLingTaskCfg();
        }

        private _tab: Table<jiuXiaoLingTask>;
        private _stagetab: Table<jiuXiaoLingTask>;
        private _seasontab: Table<jiuXiaoLingTask>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._stagetab = {};
            this._seasontab = {};
            
            let arr: Array<jiuXiaoLingTask> = GlobalData.getConfig("jiuxiaoling_task");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][jiuXiaoLingTaskFields.id]] = arr[i];

                if (arr[i][jiuXiaoLingTaskFields.type] == 1) {
                    this._stagetab[arr[i][jiuXiaoLingTaskFields.id]] = arr[i];
                } else {
                    this._seasontab[arr[i][jiuXiaoLingTaskFields.id]] = arr[i];
                }
            }

        }

        //获取所有数据
        public getAllConfig(): Table<jiuXiaoLingTask> {
            return this._tab;
        }

        //获取赛任务数据
        public getSeasonConfig(): Table<jiuXiaoLingTask> {
            return this._seasontab;
        }

        //获取阶段任务数据
        public getStageConfig(): Table<jiuXiaoLingTask> {
            return this._stagetab;
        }

    }
}