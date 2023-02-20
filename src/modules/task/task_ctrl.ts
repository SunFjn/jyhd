///<reference path="../effect/success_effect_ctrl.ts"/>


/** 任务*/


namespace modules.task {
    import BaseCtrl = modules.core.BaseCtrl;
    import SingleTask = Protocols.SingleTask;
    import TaskOper = Protocols.TaskOper;
    import TaskOperFields = Protocols.TaskOperFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import TaskCfg = modules.config.TaskCfg;
    import taskFields = Configuration.taskFields;
    import Items = Configuration.Items;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import ItemsFields = Configuration.ItemsFields;

    export class TaskCtrl extends BaseCtrl {
        private static _instance: TaskCtrl;
        public static get instance(): TaskCtrl {
            return this._instance = this._instance || new TaskCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetTaskReply, this, this.getTaskReply);
            Channel.instance.subscribe(SystemClientOpcode.GetTaskAwardReply, this, this.getTaskAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTask, this, this.updateTask);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.getTask();
        }

        // 获取任务
        public getTask(): void {
            Channel.instance.publish(UserFeatureOpcode.GetTask, null);
        }

        // 获取任务返回
        private getTaskReply(tuple: Protocols.GetTaskReply): void {
            // console.log("获取任务返回..........." + tuple);
            let tasks: Array<SingleTask> = tuple[Protocols.GetTaskReplyFields.tasks];
            // 应该只有一个任务
            TaskModel.instance.updateTaskInfo(tasks[0]);
        }

        // 更新任务
        private updateTask(tuple: Protocols.UpdateTask): void {
            let taskOpers: Array<TaskOper> = tuple[Protocols.UpdateTaskFields.taskOpers];
            let taskInfo: SingleTask;
            for (let i: int = 0, len = taskOpers.length; i < len; i++) {
                let taskOper: TaskOper = taskOpers[i];
                if (taskOper[TaskOperFields.oper] === 2) {

                } else taskInfo = taskOper[TaskOperFields.task];
            }
            if (!taskInfo) return;
            TaskModel.instance.updateTaskInfo(taskInfo);
        }

        // 领取任务奖励
        public getTaskAward(taskId: string): void {

            let itemsArr: Array<Items> = TaskCfg.instance.getTaskCfgById(taskId)[taskFields.items];
            let items: Array<Item> = new Array<Item>();
            for (let i: int = 0, len: int = itemsArr.length; i < len; i++) {
                items.push([itemsArr[i][ItemsFields.itemId], itemsArr[i][ItemsFields.count], 0, null]);
            }

            let result: boolean = BagUtil.canAddItemsByBagIdCount(items);
            if (result)
                Channel.instance.publish(UserFeatureOpcode.GetTaskAward, [taskId]);
        }

        // 领取任务奖励返回
        private getTaskAwardReply(tuple: Protocols.GetTaskAwardReply): void {
            let code: int = tuple[Protocols.GetTaskAwardReplyFields.reuslt];
            if (code === 0) {
                // let taskId:int = tuple[Protocols.GetTaskAwardReplyFields.taskId];
                //console.log("领取任务奖励成功");
                // 任务完成特效
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong6.png");
            } else {
                //console.log("getTaskAwardReply......." + code);
            }

        }
    }
}