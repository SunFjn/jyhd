/** 七日活动任务配置 */
namespace modules.config {

    import seven_activity = Configuration.seven_activity;
    import seven_activityFields = Configuration.seven_activityFields;
    import seven_activityItemFields = Configuration.seven_activityItemFields;
    import ItemsFields = Protocols.ItemsFields;
    export class SevenActivityTaskCfg {
        private static _instance: SevenActivityTaskCfg;
        public static get instance(): SevenActivityTaskCfg {
            return this._instance = this._instance || new SevenActivityTaskCfg();
        }

        // 根据档位(充值金額)和天数存取的数据
        private _newTab: Table<any>;
        private _taskCount: number;
        private _dayTaskCount: Table<number>;

        constructor() {
            this._taskCount = 0;
            this.init();
        }

        private init(): void {
            this._newTab = {};
            this._dayTaskCount = {};
            let arr: Array<seven_activity> = GlobalData.getConfig("weekly_tasks");

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let day = arr[i][seven_activityFields.day];
                let id = arr[i][seven_activityFields.id];
                if (!this._newTab[day]) this._newTab[day] = {};
                if (!this._dayTaskCount[day]) this._dayTaskCount[day] = 0;
                this._newTab[day][id] = arr[i];
                this._dayTaskCount[day]++;

                // 第八日的不计算再内部，第八日是顶部的大奖配置
                if (i < 7) {
                    this._taskCount += arr[i].length;
                }
            }

            // console.log("七日活动配置1：", this._newTab);
            // console.log("七日活动配置2：", this._dayTaskCount);

        }

        // 返回最后大奖的奖励id
        public getFinalReward() {
            let arr: Array<seven_activity> = GlobalData.getConfig("weekly_tasks");
            let bigId = arr.length;
            let showId = arr[bigId - 1][seven_activityItemFields.items][0][ItemsFields.ItemId];
            return showId;
        }

        // 根据天数获取奖励列表
        public getCfgByDay(day: number): Table<seven_activity> {
            let dayTab = this._newTab[day];
            return dayTab;
        }

        // 任务总数量
        public get taskTotalCount(): number {
            return this._taskCount;
        }

        // 获取某一日的任务数量
        public getTaskCountByDay(day: number): number {
            return this._dayTaskCount[day];
        }
    }

}
