namespace modules.exercise {

    import GetLilianInfoReply = Protocols.GetLilianInfoReply;
    import LilianTaskNode = Protocols.LilianTaskNode;
    import GetLilianInfoReplyFields = Protocols.GetLilianInfoReplyFields;
    import LilianTaskNodeFields = Protocols.LilianTaskNodeFields;
    import UpdateLilianTask = Protocols.UpdateLilianTask;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class ExerciseModel {

        private static _instance: ExerciseModel;
        public static get instance(): ExerciseModel {
            return this._instance = this._instance || new ExerciseModel();
        }

        private _tasks: Array<LilianTaskNode>; //任务列表
        private _currLev: number;
        private _tab2: Table<number>;
        /*1日累计活跃值*/
        /*2日累计档次*/
        /*3日累计状态 0未达成 1可领取 2已领取*/
        /*4升阶等级*/

        /*5升阶经验*/

        private constructor() {
            this._tab2 = {};
            this._tasks = [];
            this._currLev = 101;
        }

        public get currLev(): number {
            return this._currLev;
        }

        public setDotDis(): void {
            // if (this._tab2[GetLilianInfoReplyFields.dayState] === 1) {
            //     RedPointCtrl.instance.setRPProperty("exerciseRP", true);
            //     return;
            // }

            for (let i: int = 0, len: int = this._tasks.length; i < len; i++) {
                if (this._tasks[i][LilianTaskNodeFields.state] === 1) {
                    RedPointCtrl.instance.setRPProperty("exerciseRP", true);
                    return;
                }
            }
            RedPointCtrl.instance.setRPProperty("exerciseRP", false);
        }

        public saveData(tuple: GetLilianInfoReply): void {

            this._tab2 = {};
            this._tasks.length = 0;

            this._tab2[1] = tuple[GetLilianInfoReplyFields.dayExp];
            this._tab2[2] = tuple[GetLilianInfoReplyFields.dayGrade];
            this._tab2[3] = tuple[GetLilianInfoReplyFields.dayState];
            this._tab2[4] = tuple[GetLilianInfoReplyFields.riseLevel];
            this._tab2[5] = tuple[GetLilianInfoReplyFields.riseExp];

            this._tasks = tuple[GetLilianInfoReplyFields.list];
            this._tasks = this._tasks.sort(this.sortFunc.bind(this));

            if (this._tab2[4] > this._currLev) //已经升级
            {
                GlobalData.dispatcher.event(CommonEventType.LILIAN_UPGRADE);
                this._currLev = this._tab2[4];
            }

            // 领取日活跃值后查询是否有活跃节点奖励 有的话自动领取
            if (ExerciseModel.instance.getOtherValue(3) == 1) {
                ExerciseCrtl.instance.getLiLianDayAward();
            }

            GlobalData.dispatcher.event(CommonEventType.LILIAN_UPDATA);

            this.setDotDis();
        }
        public saveTaskData(tuple: UpdateLilianTask): void {
            let task: LilianTaskNode = tuple[Protocols.UpdateLilianTaskFields.task];
            this.searchTaskElement(task);
            GlobalData.dispatcher.event(CommonEventType.LILIAN_UPDATA_TASK_LIST);
            this.setDotDis();
        }

        public searchTaskElement(task: LilianTaskNode): void {
            let taskId: number = task[LilianTaskNodeFields.id];
            for (let i: int = 0, len: int = this._tasks.length; i < len; i++) {
                let id: number = this._tasks[i][LilianTaskNodeFields.id];
                if (id == taskId) {
                    this._tasks[i] = task;
                    this._tasks = this._tasks.sort(this.sortFunc.bind(this));
                    return;
                }
            }
            this._tasks.push(task);
            this._tasks = this._tasks.sort(this.sortFunc.bind(this));
        }

        public getOtherValue(index: int): number {
            return this._tab2[index];
        }
        public get tasks(): LilianTaskNode[] {
            return this._tasks;
        }

        private sortFunc(a: LilianTaskNode, b: LilianTaskNode): number {
            let aId: number = a[LilianTaskNodeFields.id];
            let bId: number = b[LilianTaskNodeFields.id];
            let aState: number = a[LilianTaskNodeFields.state];
            let bState: number = b[LilianTaskNodeFields.state];

            //排序顺序 ---可领取 未达成 已领取
            if (aState == bState) {
                if (aId > bId) {
                    return 1;
                } else if (aId < bId) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (aState == 1) {
                    return -1;
                } else if (bState == 1) {
                    return 1;
                } else {
                    if (aState == 0) {
                        return -1;
                    } else if (bState == 0) {
                        return 1;
                    } else {
                        if (aId > bId) {
                            return 1;
                        } else if (aId < bId) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        }

    }

}