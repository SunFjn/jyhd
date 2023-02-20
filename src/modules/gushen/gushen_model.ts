/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import GushenNote = Protocols.GushenNote;
    import UpdateGushenInfoFields = Protocols.UpdateGushenInfoFields;
    import GushenTask = Protocols.GushenTask;
    import GushenNoteFields = Protocols.GushenNoteFields;
    import UpdateGushenInfo = Protocols.UpdateGushenInfo;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GushenTaskFields = Protocols.GushenTaskFields;

    export class GuShenModel {
        private static _instance: GuShenModel;
        public static get instance(): GuShenModel {
            return this._instance = this._instance || new GuShenModel();
        }

        /*开启状态(0未开启 1开启 2待关闭 3已关闭)*/
        private _openState: number;
        //活动列表
        private _nodeList: Array<GushenNote>;
        //活动类型
        private _type: number;
        /*激活状态(0未达成 1可领取 2已领取)*/
        private _activeState: number;
        //任务列表
        private _taskList: Array<GushenTask>;

        private constructor() {

        }

        //更新
        public updateInfo(tuple: UpdateGushenInfo) {
            this._openState = tuple[UpdateGushenInfoFields.openState];
            this._nodeList = tuple[UpdateGushenInfoFields.nodeList];
            let gradeRP: boolean = false;
            let gradeRP1: boolean = false;
            let gradeRP2: boolean = false;
            let gradeRP3: boolean = false;
            let gradeRP4: boolean = false;
            let gradeRP5: boolean = false;
            for (let i: int = 0; i < this._nodeList.length; i++) {
                let node: GushenNote = this._nodeList[i];
                let activeState: number = node[GushenNoteFields.activeState];
                if (activeState == 1) {
                    gradeRP = true;
                }
                let type: number = node[GushenNoteFields.type];
                //if(!this.nodeList[type])return;
                let task: Array<GushenTask> = node[GushenNoteFields.taskList];
                if (type == 1) {
                    for (let i: int = 0; i < task.length; i++) {
                        if (task[i][GushenTaskFields.state] == 1 || node[GushenNoteFields.activeState] == 1) {
                            gradeRP1 = true;
                        }
                    }
                } else if (type == 2) {
                    for (let i: int = 0; i < task.length; i++) {
                        if (task[i][GushenTaskFields.state] == 1 || node[GushenNoteFields.activeState] == 1) {
                            gradeRP2 = true;
                        }
                    }
                } else if (type == 3) {
                    for (let i: int = 0; i < task.length; i++) {
                        if (task[i][GushenTaskFields.state] == 1 || node[GushenNoteFields.activeState] == 1) {
                            gradeRP3 = true;
                        }
                    }
                } else if (type == 4) {
                    for (let i: int = 0; i < task.length; i++) {
                        if (task[i][GushenTaskFields.state] == 1 || node[GushenNoteFields.activeState] == 1) {
                            gradeRP4 = true;
                        }
                    }
                } else if (type == 5) {
                    for (let i: int = 0; i < task.length; i++) {
                        if (task[i][GushenTaskFields.state] == 1 || node[GushenNoteFields.activeState] == 1) {
                            gradeRP5 = true;
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("guShenRP", gradeRP1 || gradeRP2 || gradeRP3 || gradeRP4 || gradeRP5 || gradeRP);
            RedPointCtrl.instance.setRPProperty("gushengrade1RP", gradeRP1);
            RedPointCtrl.instance.setRPProperty("gushengrade2RP", gradeRP2);
            RedPointCtrl.instance.setRPProperty("gushengrade3RP", gradeRP3);
            RedPointCtrl.instance.setRPProperty("gushengrade4RP", gradeRP4);
            RedPointCtrl.instance.setRPProperty("gushengrade5RP", gradeRP5);
            GlobalData.dispatcher.event(CommonEventType.GUSHEN);
        }


        //获取活动列表
        public get nodeList(): Array<GushenNote> {
            return this._nodeList;
        }
    }
}