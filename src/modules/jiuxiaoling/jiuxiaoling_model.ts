
///<reference path="./jiuxiaoling_award_cfg.ts"/>
///<reference path="./jiuxiaoling_task_cfg.ts"/>
/** 九霄令数据模型层 */
namespace modules.jiuxiaoling {
    import jiuXiaoLingAward = Configuration.jiuXiaoLingAward;
    import jiuXiaoLingAwardFields = Configuration.jiuXiaoLingAwardFields;
    import JiuXiaoLingAwardCfg = modules.config.JiuXiaoLingAwardCfg;
    import JiuXiaoLingTaskCfg = modules.config.JiuXiaoLingTaskCfg;
    import ItemsFields = Configuration.ItemsFields;
    import Items = Configuration.Items;
    import jiuXiaoLingTask = Configuration.jiuXiaoLingTask;
    import jiuXiaoLingTaskFields = Configuration.jiuXiaoLingTaskFields;

    import JiuxiaoOrderInfoReply = Protocols.JiuxiaoOrderInfoReply;
    import JiuxiaoOrderDayTaskReply = Protocols.JiuxiaoOrderDayTaskReply;
    import JiuxiaoOrderSeasonTaskReply = Protocols.JiuxiaoOrderSeasonTaskReply;
    import JiuxiaoOrderGetRewardReply = Protocols.JiuxiaoOrderGetRewardReply;
    import JiuxiaoOrderGettTaskRewardReply = Protocols.JiuxiaoOrderGettTaskRewardReply;
    import JiuxiaoOrderBuyLevelReply = Protocols.JiuxiaoOrderBuyLevelReply;
    import JiuxiaoOrderTakeExpWrapReply = Protocols.JiuxiaoOrderTakeExpWrapReply;
    import JiuxiaoOrderOneTaskReply = Protocols.JiuxiaoOrderOneTaskReply;
    import JiuxiaoOrderInfoReplyFields = Protocols.JiuxiaoOrderInfoReplyFields;
    import JiuxiaoOrderDayTaskReplyFields = Protocols.JiuxiaoOrderDayTaskReplyFields;
    import JiuxiaoOrderSeasonTaskReplyFields = Protocols.JiuxiaoOrderSeasonTaskReplyFields;
    import JiuxiaoOrderGetRewardReplyFields = Protocols.JiuxiaoOrderGetRewardReplyFields;
    import JiuxiaoOrderGettTaskRewardReplyFields = Protocols.JiuxiaoOrderGettTaskRewardReplyFields;
    import JiuxiaoOrderBuyLevelReplyFields = Protocols.JiuxiaoOrderBuyLevelReplyFields;
    import JiuxiaoOrderTakeExpWrapReplyFields = Protocols.JiuxiaoOrderTakeExpWrapReplyFields;
    import JiuxiaoOrderOneTaskReplyFields = Protocols.JiuxiaoOrderOneTaskReplyFields;
    import JiuxiaoOrderGradeNodeFields = Protocols.JiuxiaoOrderGradeNodeFields;
    import JiuxiaoOrderGradeNode = Protocols.JiuxiaoOrderGradeNode;
    import JiuxiaoOrderTaskNode = Protocols.JiuxiaoOrderTaskNode;
    import JiuxiaoOrderTaskNodeFields = Protocols.JiuxiaoOrderTaskNodeFields;
    import JiuxiaoOrderExpWrapNode = Protocols.JiuxiaoOrderExpWrapNode;
    import JiuxiaoOrderExpWrapNodeFields = Protocols.JiuxiaoOrderExpWrapNodeFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class JiuXiaoLingModel {
        private static _instance: JiuXiaoLingModel;
        public static get instance(): JiuXiaoLingModel {
            return this._instance = this._instance || new JiuXiaoLingModel();
        }

        private _isBuy: boolean;
        private _exp: number;
        private _level: number;
        private _awardList: Array<jiuXiaoLingAward>;
        private _jiuxiaoOrderInfoData: JiuxiaoOrderInfoReply;
        private _dailyTaskInfo: JiuxiaoOrderDayTaskReply;
        private _dailyTaskList: Array<JiuxiaoOrderTaskNode>;
        private _seasonTaskList: Array<JiuxiaoOrderTaskNode>;
        private _seasonTaskInfo: JiuxiaoOrderSeasonTaskReply;
        private _extralExpData: JiuxiaoOrderExpWrapNode;
        private _dailyTaskRPState: boolean;
        private _seasonTaskRPState: boolean;
        private _getedAwardList: any;
        private _currentTaskView: number = 0;

        // 基础信息和奖励列表
        public set jiuxiaoOrderInfoData(tuple: JiuxiaoOrderInfoReply) {
            this._jiuxiaoOrderInfoData = tuple;


            //是否购买金令
            this._isBuy = tuple[JiuxiaoOrderInfoReplyFields.isBuy] == 1;

            //当前等级经验
            this._level = tuple[JiuxiaoOrderInfoReplyFields.level];
            this._exp = tuple[JiuxiaoOrderInfoReplyFields.exp];

            // 修改奖励列表
            this.setAwardList(tuple[JiuxiaoOrderInfoReplyFields.awardsList]);

            //数据改变派发消息,通知更新
            GlobalData.dispatcher.event(CommonEventType.UPDATE_JXL_AWARD_AND_STATUS);
        }

        // 基础信息和奖励列表
        public get jiuxiaoOrderInfoData(): JiuxiaoOrderInfoReply {
            return this._jiuxiaoOrderInfoData;
        }

        // 任务面板状态（0-阶段任务 1-赛季任务）
        public get currentTaskView(): number {
            return this._currentTaskView;
        }
        public set currentTaskView(num: number) {
            this._currentTaskView = num;
        }

        // 是否购买了金令
        public get isBuy(): boolean {
            return this._isBuy;
        }

        // 当前等级
        public get level(): number {
            return this._level;
        }
        // 当前经验
        public get exp(): number {
            return this._exp;
        }

        //设置奖励列表状态
        public setAwardList(list: Array<JiuxiaoOrderGradeNode>) {
            let datas: Array<jiuXiaoLingAward> = [];
            let object: Table<jiuXiaoLingAward> = JiuXiaoLingAwardCfg.instance.getAllConfig();
            let index: number = 0;
            let rpState: boolean = false;

            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    let element = object[key];

                    if (index <= list.length - 1) {
                        let stateA: number = list[index][JiuxiaoOrderGradeNodeFields.stateA];
                        let stateGA: number = list[index][JiuxiaoOrderGradeNodeFields.stateGA];
                        let award: Array<Items> = element[jiuXiaoLingAwardFields.award];
                        let awardG: Array<Items> = element[jiuXiaoLingAwardFields.gold_award];
                        element[jiuXiaoLingAwardFields.status] = stateA;
                        element[jiuXiaoLingAwardFields.status_G] = stateGA;

                        // 红点状态
                        if (!rpState) {
                            if ((stateA == 1 && award.length != 0) || ((stateGA == 1 && this.isBuy) && awardG.length != 0)) {
                                rpState = true;
                            }
                        }
                    } else {
                        element[jiuXiaoLingAwardFields.status] = 0;
                        element[jiuXiaoLingAwardFields.status_G] = 0;
                    }

                    datas.push(element);

                    index++;
                }
            }

            this.setAwardRPStatus(rpState);
            this._awardList = datas;
        }

        // 设置奖励红点状态
        private setAwardRPStatus(avtive: boolean) {
            RedPointCtrl.instance.setRPProperty("JiuXiaoLingAwardRP", avtive);
        }
        // 设置阶段任务红点状态
        private setTaskRPStatus(avtive: boolean) {
            RedPointCtrl.instance.setRPProperty("JiuXiaoLingTaskRP", avtive);
        }
        // 设置额外经验包红点状态
        private setExtralExpRPStatus(avtive: boolean) {
            RedPointCtrl.instance.setRPProperty("JiuXiaoLingExtralExpRP", avtive);
        }

        //获取奖励列表
        public getAwardList(): Array<jiuXiaoLingAward> {
            return this._awardList;
        }

        //获取大奖预览奖励列表
        public getPreviewAwardList(): any {

            let data_jxl = [];                      //九霄令   
            let data_jxjl = [];                     //九霄金令

            let object: Table<jiuXiaoLingAward> = JiuXiaoLingAwardCfg.instance.getAllConfig();
            let final_award: Items = JiuXiaoLingAwardCfg.instance.getFinalAward();

            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    let element = object[key];
                    let awards = element[jiuXiaoLingAwardFields.award];
                    let gold_award = element[jiuXiaoLingAwardFields.gold_award];

                    if (awards.length != 0) {
                        data_jxl.push([awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null]);
                    }

                    if (gold_award.length != 0) {
                        data_jxjl.push([gold_award[0][ItemsFields.itemId], gold_award[0][ItemsFields.count], 0, null]);
                    }
                }
            }
            let datas = [this.distinctArrayByCustom(data_jxl), this.distinctArrayByCustom(data_jxjl)]

            // 最终大奖
            datas[1].push([final_award[ItemsFields.itemId], final_award[ItemsFields.count], 0, null]);

            return datas
        }

        // item去重，重复的数量相加
        private distinctArrayByCustom(arrayList) {
            // 解构去掉引用关系，相当于复制了一份
            // arrayList = [arrayList];

            let tab = {};
            let arr = [];
            for (let index = 0; index < arrayList.length; index++) {
                const element = arrayList[index];
                const key = element[0];
                if (tab.hasOwnProperty(key)) {
                    tab[key][1] = tab[key][1] + element[1];
                } else {
                    tab[key] = element;
                }
            }

            for (const key in tab) {
                if (Object.prototype.hasOwnProperty.call(tab, key)) {
                    const element = tab[key];
                    arr.push(element);
                }
            }

            return arr;
        }

        //获取指定区间的奖励 0-九霄令 1-九霄金令
        public getTargetAreaAwardList(type: number, start: number, end: number): any {
            let datas = [];
            let object: Table<jiuXiaoLingAward> = JiuXiaoLingAwardCfg.instance.getAllConfig();
            let final_award: Items = JiuXiaoLingAwardCfg.instance.getFinalAward();

            for (const level in object) {
                if (Object.prototype.hasOwnProperty.call(object, level)) {
                    let element = object[level];
                    let awards: Array<Items>;
                    if (type == 0) {
                        awards = element[jiuXiaoLingAwardFields.award];
                    } else {
                        awards = element[jiuXiaoLingAwardFields.gold_award];
                    }

                    if ((parseInt(level) >= start + 1) && (parseInt(level) <= end) && awards.length != 0) {
                        datas.push([awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null]);
                    }
                }
            }

            let ret_datas = this.distinctArrayByCustom(datas);
            // 追加最终大奖
            if (type == 1 && end == JiuXiaoLingAwardCfg.instance.level) {
                ret_datas.push([final_award[ItemsFields.itemId], final_award[ItemsFields.count], 0, null]);
            }
            return ret_datas;
        }

        // 九霄令日常任务数据设置
        public set dailyTaskInfo(tuple: JiuxiaoOrderDayTaskReply) {
            this._dailyTaskInfo = tuple;

            this._exp = tuple[JiuxiaoOrderDayTaskReplyFields.exp];
            //经验包
            this._extralExpData = tuple[JiuxiaoOrderDayTaskReplyFields.expWrap];
            this.setExtralExpRPStatus(this._extralExpData[JiuxiaoOrderExpWrapNodeFields.state] == 1);

            //配置阶段任务列表
            let list: Array<JiuxiaoOrderTaskNode> = tuple[JiuxiaoOrderDayTaskReplyFields.taskList];
            let object: Table<jiuXiaoLingTask> = JiuXiaoLingTaskCfg.instance.getStageConfig();

            this._dailyTaskRPState = false;
            this._dailyTaskList = new Array<JiuxiaoOrderTaskNode>();

            for (let index = 0, len = list.length; index < len; index++) {
                let item = list[index];
                let id = item[JiuxiaoOrderTaskNodeFields.id];
                let taskItem = object[id];
                item[JiuxiaoOrderTaskNodeFields.totalNum] = taskItem[jiuXiaoLingTaskFields.task_counts];
                item[JiuxiaoOrderTaskNodeFields.totalProgress] = taskItem[jiuXiaoLingTaskFields.condition];
                item[JiuxiaoOrderTaskNodeFields.taskType] = 1;
                item[JiuxiaoOrderTaskNodeFields.name] = taskItem[jiuXiaoLingTaskFields.name];
                item[JiuxiaoOrderTaskNodeFields.desc] = taskItem[jiuXiaoLingTaskFields.describe];
                item[JiuxiaoOrderTaskNodeFields.exp] = taskItem[jiuXiaoLingTaskFields.award_exp];
                item[JiuxiaoOrderTaskNodeFields.skipId] = taskItem[jiuXiaoLingTaskFields.skipId];
                this._dailyTaskList.push(item);

                // 红点状态
                let state: number = list[index][JiuxiaoOrderTaskNodeFields.state];
                if (!this._dailyTaskRPState && state == 1) {
                    this._dailyTaskRPState = true;
                }
            }

            // 设置红点状态
            this.setTaskRPStatus(this._dailyTaskRPState || this._seasonTaskRPState);

            this._dailyTaskList.sort((a, b) => {
                if (a[JiuxiaoOrderTaskNodeFields.state] == 1 || b[JiuxiaoOrderTaskNodeFields.state] == 2) return -1;
                if (a[JiuxiaoOrderTaskNodeFields.state] == 2 || b[JiuxiaoOrderTaskNodeFields.state] == 1) return 1;
                return (b[JiuxiaoOrderTaskNodeFields.state] - a[JiuxiaoOrderTaskNodeFields.state]);
            });

            //数据改变派发消息,通知更新
            GlobalData.dispatcher.event(CommonEventType.UPDATE_JXL_DAILY_TASK_INFO);
        }

        public get dailyTaskInfo(): JiuxiaoOrderDayTaskReply {
            return this._dailyTaskInfo;
        }

        // 获取经验包数据
        public get extralExpData(): JiuxiaoOrderExpWrapNode {
            return this._extralExpData;
        }

        // 九霄令赛季任务数据设置
        public set seasonTaskInfo(tuple: JiuxiaoOrderSeasonTaskReply) {
            this._seasonTaskInfo = tuple;

            this._exp = tuple[JiuxiaoOrderSeasonTaskReplyFields.exp];
            //配置赛季任务列表
            let list: Array<JiuxiaoOrderTaskNode> = tuple[JiuxiaoOrderSeasonTaskReplyFields.taskList];
            let object: Table<jiuXiaoLingTask> = JiuXiaoLingTaskCfg.instance.getSeasonConfig();

            this._seasonTaskRPState = false;
            this._seasonTaskList = new Array<JiuxiaoOrderTaskNode>();

            for (let index = 0, len = list.length; index < len; index++) {
                let item = list[index];
                let id = item[JiuxiaoOrderTaskNodeFields.id];

                let taskItem = object[id];
                item[JiuxiaoOrderTaskNodeFields.totalNum] = taskItem[jiuXiaoLingTaskFields.task_counts];
                item[JiuxiaoOrderTaskNodeFields.totalProgress] = taskItem[jiuXiaoLingTaskFields.condition];
                item[JiuxiaoOrderTaskNodeFields.taskType] = 2;
                item[JiuxiaoOrderTaskNodeFields.name] = taskItem[jiuXiaoLingTaskFields.name];
                item[JiuxiaoOrderTaskNodeFields.desc] = taskItem[jiuXiaoLingTaskFields.describe];
                item[JiuxiaoOrderTaskNodeFields.exp] = taskItem[jiuXiaoLingTaskFields.award_exp];
                item[JiuxiaoOrderTaskNodeFields.skipId] = taskItem[jiuXiaoLingTaskFields.skipId];
                this._seasonTaskList.push(item);

                // 红点状态
                let state: number = list[index][JiuxiaoOrderTaskNodeFields.state];
                if (!this._seasonTaskRPState && state == 1) {
                    this._seasonTaskRPState = true;
                }
            }

            // 设置红点状态
            this.setTaskRPStatus(this._dailyTaskRPState || this._seasonTaskRPState);


            this._seasonTaskList.sort((a, b) => {
                if (a[JiuxiaoOrderTaskNodeFields.state] == 1 || b[JiuxiaoOrderTaskNodeFields.state] == 2) return -1;
                if (a[JiuxiaoOrderTaskNodeFields.state] == 2 || b[JiuxiaoOrderTaskNodeFields.state] == 1) return 1;
                return (b[JiuxiaoOrderTaskNodeFields.state] - a[JiuxiaoOrderTaskNodeFields.state]);
            });

            //数据改变派发消息,通知更新
            GlobalData.dispatcher.event(CommonEventType.UPDATE_JXL_SEASON_TASK_INFO);
        }

        public get seasonTaskInfo(): JiuxiaoOrderSeasonTaskReply {
            return this._seasonTaskInfo;
        }

        //获取阶段任务列表
        public getStageTaskList(): Array<JiuxiaoOrderTaskNode> {
            return this._dailyTaskList;
        }

        //获取赛季任务列表
        public getSeasonTaskList(): Array<JiuxiaoOrderTaskNode> {
            return this._seasonTaskList;
        }

        //设置领取的等级奖励列表
        public set getedAwardList(array: Array<Items>) {
            this._getedAwardList = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                this._getedAwardList.push([element[ItemsFields.itemId], element[ItemsFields.count], 0, null])
            }
        }

        //获取领取的等级奖励列表
        public getGetedAwardList(): any {
            return this.distinctArrayByCustom(this._getedAwardList);
        }
    }
}