/// <reference path="./seven_activity_cfg.ts" />

/** 七日活动model */
namespace modules.seven_activity {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import Items = Protocols.Items;
    import ItemsFields = Protocols.ItemsFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import seven_activity = Configuration.seven_activity;
    import seven_activityFields = Configuration.seven_activityFields;
    import seven_activityItem = Configuration.seven_activityItem;
    import seven_activityItemFields = Configuration.seven_activityItemFields;
    import SevenActivityTaskCfg = modules.config.SevenActivityTaskCfg;
    import SevenActivityGetAwardReply = Protocols.SevenActivityGetAwardReply;
    import SevenActivityGetAwardReplyFields = Protocols.SevenActivityGetAwardReplyFields;
    import SevenActivityBaseDatasReply = Protocols.SevenActivityBaseDatasReply;
    import SevenActivityBaseDatasReplyFields = Protocols.SevenActivityBaseDatasReplyFields;
    import SevenActivityTasksData = Protocols.SevenActivityTasksData;
    import SevenActivityTasksDataFields = Protocols.SevenActivityTasksDataFields;

    export class SevenActivityModel {
        private static _instance: SevenActivityModel;
        public static get instance(): SevenActivityModel {
            return this._instance = this._instance || new SevenActivityModel();
        }

        private _currentDay: number = 1;
        private _completedCount: number = 0;
        private _endTime: number;
        private _dayItemRPStatus: Table<boolean>;
        private _dayItemProcess: Table<number>;
        private _taskDatas: Table<Table<SevenActivityTasksData>>;
        public showSevenActivity: boolean = true;

        private constructor() {
            this._dayItemRPStatus = {};
            this._dayItemProcess = {};
            this._taskDatas = {};
        }

        // 活动结束时间
        public get endTime(): number {
            return this._endTime;
        }

        // 当前选择的天
        public get currentDay(): number {
            return this._currentDay;
        }

        // 基础数据
        public setBaseInfo(data: SevenActivityBaseDatasReply): void {
            // 总的红点入口显示
            let totalRP: boolean = false;
            this._endTime = data[SevenActivityBaseDatasReplyFields.endTime];
            // 是否显示活动
            this.showSevenActivity = GlobalData.serverTime < this._endTime;
            // 所有的任务数据
            let list: Array<SevenActivityTasksData> = data[SevenActivityBaseDatasReplyFields.tasksData];
            this._taskDatas = {};
            this._dayItemProcess = {};
            this._dayItemRPStatus = {};
            this._completedCount = 0;
            for (let index = 1; index <= 8; index++) {
                if (!this._taskDatas[index]) this._taskDatas[index] = {};
                if (!this._dayItemProcess[index]) this._dayItemProcess[index] = 0;
                if (!this._dayItemRPStatus[index]) this._dayItemRPStatus[index] = false;
                // key为天数
                for (let i = 0; i < list.length; i++) {
                    const sa_task_data = list[i];
                    const id = list[i][SevenActivityTasksDataFields.id];

                    // 存入当天的
                    if (sa_task_data[SevenActivityTasksDataFields.day] == index) {
                        this._taskDatas[index][id] = sa_task_data;

                        // 当日已完成计数
                        if (sa_task_data[SevenActivityTasksDataFields.isAwd] == 2) {
                            this._dayItemProcess[index]++;
                            if (index != 8) this._completedCount++;
                        }

                        // 是否有可领取的,显示红点使用
                        if (sa_task_data[SevenActivityTasksDataFields.isAwd] == 1) {
                            this._dayItemRPStatus[index] = true;
                            if (index !== 8) {
                                let preDay = SevenActivityModel.instance.dayChooiceList[index - 1][4];
                                if (!totalRP && !preDay) totalRP = true;
                            } else {
                                if (!totalRP) totalRP = true;
                            }
                        }
                    }
                }
            }
            // console.log("this._taskDatas", this._taskDatas);
            // console.log("this._dayItemRPStatus", this._dayItemRPStatus);

            this.triggerRP(totalRP);
            // 派发事件，更新面板数据
            GlobalData.dispatcher.event(CommonEventType.SEVEN_ACTIVITY_UPDATE);
        }

        // 红点
        private triggerRP(status: boolean) {
            RedPointCtrl.instance.setRPProperty("sevenActivityRP", status);
        }

        // 获取任务日选项数据
        public get dayChooiceList(): any {
            let list = [];
            let openDay = PlayerModel.instance.openDay;
            // 共七日，第8日是领取的大奖的数据
            for (let index = 0; index < 7; index++) {
                let day = index + 1;
                let locked = false;
                let dayDesc = `第${day}天`;
                let alreadyCompleted = this._dayItemProcess[day];
                let rpStatus = this._dayItemRPStatus[day];
                let totalTask = SevenActivityTaskCfg.instance.getTaskCountByDay(day);
                // 进度
                let processDesc = `${alreadyCompleted > totalTask ? totalTask : alreadyCompleted}/${totalTask}`;
                // 是否解锁
                if (day > openDay) {
                    locked = true;
                    processDesc = "未解锁";
                    rpStatus = false;
                }
                list.push([day, dayDesc, processDesc, rpStatus, locked]);
            }
            return list;
        }

        // 获取某一日的任务列表
        public getSelectDayTasks(day: number): Array<seven_activityItem> {
            let tab: Table<seven_activity> = SevenActivityTaskCfg.instance.getCfgByDay(day);
            let list: Array<seven_activityItem> = new Array<seven_activityItem>();

            // 将得到的数据赋值状态并返回
            for (const key in tab) {
                const sa_data = tab[key];
                let id = sa_data[seven_activityFields.id];

                // 进度和状态需要手动赋值和获取
                let process = this._taskDatas[day] && this._taskDatas[day][id] ? this._taskDatas[day][id][SevenActivityTasksDataFields.count] : 0;
                let status = this._taskDatas[day] && this._taskDatas[day][id] ? this._taskDatas[day][id][SevenActivityTasksDataFields.isAwd] : 0;

                let total = sa_data[seven_activityFields.condition];
                let desc = sa_data[seven_activityFields.describe];
                let items = sa_data[seven_activityFields.items];
                let taskId = sa_data[seven_activityFields.taskId];

                list.push([id, process, total, desc, status, items, taskId]);
            }
            // 第8天是大奖，不在选择范围
            if (day != 8) {
                this._currentDay = day;
                this.sortList(list);
            }

            return list;
        }

        private sortList(list: Array<seven_activityItem>) {
            list.sort((a, b) => {
                if (a[seven_activityItemFields.status] == 1) return -1;
                if (b[seven_activityItemFields.status] == 1) return 1;
                if (a[seven_activityItemFields.status] == 2) return 1;
                if (b[seven_activityItemFields.status] == 2) return -1;
            })
        }

        // 获取默认那一日的的任务列表
        public getDefaultDayTasks(): any {
            return this.getSelectDayTasks(this._currentDay);
        }

        // 获取任务当前进度/总进度
        public getTotolProcess(): any {
            let alreadyCompleted: number = this._completedCount;
            let nowComleted: number = seven_activityItemFields.process;
            let total: number = SevenActivityTaskCfg.instance.taskTotalCount;

            console.log('当前进度条', alreadyCompleted, nowComleted, total);

            return [alreadyCompleted, total];
        }

        // 获取上面大奖的数据-第8天存的数据
        public getBigAwardGetedList(): any {
            return this.getSelectDayTasks(8);
        }
    }

}
