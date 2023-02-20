/////<reference path="../$.ts"/>
/** 开服冲榜 */
namespace modules.sprint_rank {
    import UpdateSprintRankTaskInfo = Protocols.UpdateSprintRankTaskInfo;
    import UpdateSprintRankTaskInfoFields = Protocols.UpdateSprintRankTaskInfoFields;
    import SprintRankTaskNode = Protocols.SprintRankTaskNode;
    import SprintRankTaskNodeFields = Protocols.SprintRankTaskNodeFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class SprintRankTaskModel {
        private static _instance: SprintRankTaskModel;
        public static get instance(): SprintRankTaskModel {
            return this._instance = this._instance || new SprintRankTaskModel();
        }

        /*是不是第一次打开我要冲榜*/
        public _isFristOpen: boolean;
        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _openState: number;
        /*当前活动类型*/
        private _curType: number;
        /*任务列表*/
        private _taskList: Array<SprintRankTaskNode>;
        private sprintRankRP: string[] = [];

        private constructor() {
            this._isFristOpen = true;
            this._openState = 0;
            this._curType = 0;
            this._taskList = new Array<SprintRankTaskNode>();
            this.sprintRankRP.push("sprintRankXianQiRP", "sprintRankLingChongRP", "sprintRankShenBingRP", "sprintRankXianYiRP"
                , "sprintRankFaBaoRP", "sprintRankEquipmentRP", "sprintRankFighitingRP")
        }
        public getInfo(tuple: UpdateSprintRankTaskInfo) {
            this._openState = tuple[UpdateSprintRankTaskInfoFields.openState];
            this._curType = tuple[UpdateSprintRankTaskInfoFields.curType];
            let taskList: Array<SprintRankTaskNode> = tuple[UpdateSprintRankTaskInfoFields.taskList];
            let rankRP: boolean = false;
            this._taskList = new Array<SprintRankTaskNode>();
            if (taskList) {
                for (var index = 0; index < taskList.length; index++) {
                    // if (index != 6 && index != 4) {//测试 漏天的情况
                    //     continue;
                    // }
                    var element: SprintRankTaskNode = taskList[index];
                    let type = element[SprintRankTaskNodeFields.type];
                    this._taskList[type] = element;
                }
            }
            if (!this._taskList[this._curType])
                return;
            let state = this._taskList[this._curType][SprintRankTaskNodeFields.state];
            if (state == 1) {
                rankRP = true;
            }
            GlobalData.dispatcher.event(CommonEventType.SPRINT_RANK_TASK_UPDATE);
            RedPointCtrl.instance.setRPProperty("sprintRankRP", rankRP);
            RedPointCtrl.instance.setRPProperty("sprintRankXianQiRP", rankRP && this._curType == 1);
            RedPointCtrl.instance.setRPProperty("sprintRankLingChongRP", rankRP && this._curType == 2);
            RedPointCtrl.instance.setRPProperty("sprintRankShenBingRP", rankRP && this._curType == 3);
            RedPointCtrl.instance.setRPProperty("sprintRankXianYiRP", rankRP && this._curType == 4);
            RedPointCtrl.instance.setRPProperty("sprintRankFaBaoRP", rankRP && this._curType == 5);
            RedPointCtrl.instance.setRPProperty("sprintRankEquipmentRP", rankRP && this._curType == 6);
            RedPointCtrl.instance.setRPProperty("sprintRankFighitingRP", rankRP && this._curType == 7);
        }
        //更新
        public updateInfo(tuple: UpdateSprintRankTaskInfo) {
            this._openState = tuple[UpdateSprintRankTaskInfoFields.openState];
            if (this._curType != tuple[UpdateSprintRankTaskInfoFields.curType]) {
                GlobalData.dispatcher.event(CommonEventType.SPRINT_RANK_HUODONG_CHANG);
            }
            this._curType = tuple[UpdateSprintRankTaskInfoFields.curType];
            let taskList: Array<SprintRankTaskNode> = tuple[UpdateSprintRankTaskInfoFields.taskList];
            let rankRP: boolean = false;
            let isGaiBian = false;
            if (taskList) {
                for (var index = 0; index < taskList.length; index++) {
                    var element: SprintRankTaskNode = taskList[index];
                    let type = element[SprintRankTaskNodeFields.type];
                    if (type == modules.sprint_rank.SprintRankModel.instance.curType) {
                        if (this._taskList[modules.sprint_rank.SprintRankModel.instance.curType]) {
                            let myda = this._taskList[modules.sprint_rank.SprintRankModel.instance.curType][SprintRankTaskNodeFields.rankParam];
                            let otherda = element[SprintRankTaskNodeFields.rankParam];
                            if (myda && otherda) {
                                let isOne = false;
                                if (!modules.sprint_rank.SprintRankModel.instance.myOne()) {
                                    if (myda != otherda) {
                                        isGaiBian = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }


            this._taskList = new Array<SprintRankTaskNode>();
            if (taskList) {
                for (var index = 0; index < taskList.length; index++) {
                    // if (index != 6 && index != 4) {//测试 漏天的情况
                    //     continue;
                    // }
                    var element: SprintRankTaskNode = taskList[index];
                    let type = element[SprintRankTaskNodeFields.type];

                    this._taskList[type] = element;
                }
            }


            if (isGaiBian) {
                GlobalData.dispatcher.event(CommonEventType.SPRING_RANK_CHANG, true);
            }

            if (!this._taskList[this._curType])
                return;
            let state = this._taskList[this._curType][SprintRankTaskNodeFields.state];
            if (state == 1) {
                rankRP = true;
            }
            GlobalData.dispatcher.event(CommonEventType.SPRINT_RANK_TASK_UPDATE);
            RedPointCtrl.instance.setRPProperty("sprintRankRP", rankRP);
            RedPointCtrl.instance.setRPProperty("sprintRankXianQiRP", rankRP && this._curType == 1);
            RedPointCtrl.instance.setRPProperty("sprintRankLingChongRP", rankRP && this._curType == 2);
            RedPointCtrl.instance.setRPProperty("sprintRankShenBingRP", rankRP && this._curType == 3);
            RedPointCtrl.instance.setRPProperty("sprintRankXianYiRP", rankRP && this._curType == 4);
            RedPointCtrl.instance.setRPProperty("sprintRankFaBaoRP", rankRP && this._curType == 5);
            RedPointCtrl.instance.setRPProperty("sprintRankEquipmentRP", rankRP && this._curType == 6);
            RedPointCtrl.instance.setRPProperty("sprintRankFighitingRP", rankRP && this._curType == 7);
        }

        public get openState(): number {
            return this._openState;
        }

        public get curType(): number {
            return this._curType;
        }

        public get taskList(): Array<SprintRankTaskNode> {
            return this._taskList;
        }
    }
}