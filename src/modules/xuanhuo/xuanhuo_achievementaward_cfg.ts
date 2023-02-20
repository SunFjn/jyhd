/** 玄火成就(任务)配置 */
namespace modules.config {

    import xuanhuoAchievement = Configuration.xuanhuoAchievement;
    import xuanhuoAchievementFields = Configuration.xuanhuoAchievementFields;

    export class XuanHuoAchievementCfg {
        private static _instance: XuanHuoAchievementCfg;
        public static get instance(): XuanHuoAchievementCfg {
            return this._instance = this._instance || new XuanHuoAchievementCfg();
        }

        private _tab: Table<xuanhuoAchievement>;
        private _typeArr: Array<number>;
        private _typeFirstTab: Table<xuanhuoAchievement>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._typeArr = [];
            let arr: Array<xuanhuoAchievement> = GlobalData.getConfig("xuanhuo_achievement_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][xuanhuoAchievementFields.taskId]] = arr[i];

                if (this._typeArr.indexOf(arr[i][xuanhuoAchievementFields.type]) <= -1) {
                    this._typeArr.push(arr[i][xuanhuoAchievementFields.type]);
                }
            }

            //每一类任务的第一个
            this._typeFirstTab = {};
            for (const key in this._tab) {
                const element = this._tab[key];
                let curData = this._typeFirstTab[element[xuanhuoAchievementFields.type]];
                if (curData == null || element[xuanhuoAchievementFields.taskId] <= curData[xuanhuoAchievementFields.taskId]) {
                    this._typeFirstTab[element[xuanhuoAchievementFields.type]] = element;
                }
            }
        }

        //获取数据by任务ID
        public getConfigByTaskId(taskId: number): xuanhuoAchievement {
            return this._tab[taskId];
        }

        //获取任务总分类的数组
        public getConfigByTotalTypes(): Array<number> {
            return [...this._typeArr];
        }

        //获取当前类的下一条数据(最后一条则返回自身)
        public getCurrentTypeNextData(taskId: number): any {
            let curData = this.getConfigByTaskId(taskId);
            let type = curData[xuanhuoAchievementFields.type];
            let isLast = this.checkIsLastData(taskId, type);

            if (isLast) {
                return { isLast, nextTaskId: taskId };
            }

            let nextTaskId: number;
            for (const key in this._tab) {
                const element = this._tab[key];
                if (element[xuanhuoAchievementFields.type] == type) {
                    if (taskId < element[xuanhuoAchievementFields.taskId]) {
                        nextTaskId = element[xuanhuoAchievementFields.taskId];
                        break;
                    }
                }
            }
            return { isLast, nextTaskId };
        }

        //检测是否为最后一条数据
        public checkIsLastData(taskId: number, type: number): boolean {
            let lastId = -1;
            for (const key in this._tab) {
                const element = this._tab[key];
                if (element[xuanhuoAchievementFields.type] == type) {
                    if (element[xuanhuoAchievementFields.taskId] >= lastId) {
                        lastId = element[xuanhuoAchievementFields.taskId];
                    }
                }
            }
            return lastId == taskId;
        }

        //获取所有任务的第一项
        public getAllTypesTabAtFirstData(): Table<xuanhuoAchievement> {
            return { ...this._typeFirstTab };
        }
    }
}