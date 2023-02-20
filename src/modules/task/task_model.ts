/** 任务数据*/


namespace modules.task {


    export class TaskModel {
        private static _instance: TaskModel;
        public static get instance(): TaskModel {
            return this._instance = this._instance || new TaskModel();
        }

        // 任务数据（当前只会有一个任务）
        private _taskInfo: Protocols.SingleTask;

        constructor() {

        }

        // 任务数据
        public get taskInfo(): Protocols.SingleTask {
            return this._taskInfo;
        }

        // 更新任务信息
        public updateTaskInfo(taskInfo: Protocols.SingleTask): void {
            this._taskInfo = taskInfo;
            // console.log("Update Current Task -->> " + taskInfo[Protocols.SingleTaskFields.taskId])
            // // 三种状态，1未完成、2完成未领奖、3已领奖（领奖后自动切换下个任务的话是否还需要已领奖状态？）
            // let state:int = taskInfo[Protocols.SingleTaskFields.state];
            // if (state === 0) {
            //
            // } else if (state === 1) {
            //
            // }
            GlobalData.dispatcher.event(CommonEventType.TASK_UPDATED);
        }
    }
}