/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.kuanghuan {
    import UpdateKuanghuanInfo = Protocols.UpdateKuanghuanInfo;
    import KuanghuanNote = Protocols.KuanghuanNote;
    import UpdateKuanghuanInfoFields = Protocols.UpdateKuanghuanInfoFields;
    import KuanghuanNoteFields = Protocols.KuanghuanNoteFields;
    import KuanghuanTask = Protocols.KuanghuanTask;
    import KuanghuanTaskFields = Protocols.KuanghuanTaskFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class KuangHuanModel {
        private static _instance: KuangHuanModel;
        public static get instance(): KuangHuanModel {
            return this._instance = this._instance || new KuangHuanModel();
        }

        /*开启状态(0未开启 1开启 2待关闭 3已关闭)*/
        private _openState: number;
        //活动列表
        private _nodeList: Array<KuanghuanNote>;

        private constructor() {

        }

        //更新
        public updateInfo(tuple: UpdateKuanghuanInfo) {
            this._openState = tuple[UpdateKuanghuanInfoFields.openState];
            this._nodeList = tuple[UpdateKuanghuanInfoFields.nodeList];
            GlobalData.dispatcher.event(CommonEventType.KUANGHUAN);
            let taskList: Array<KuanghuanTask>;
            let gradeRP1: boolean = false;
            let gradeRP2: boolean = false;
            let gradeRP3: boolean = false;
            for (let i: int = 0; i < this._nodeList.length; i++) {
                if (this._nodeList[i][KuanghuanNoteFields.type] == 1) {
                    taskList = this._nodeList[i][KuanghuanNoteFields.taskList];
                    for (let j: int = 0; j < taskList.length; j++) {
                        if (taskList[j][KuanghuanTaskFields.state] == 1) {
                            gradeRP2 = true;
                        }
                    }
                } else if (this._nodeList[i][KuanghuanNoteFields.type] == 9) {
                    taskList = this._nodeList[i][KuanghuanNoteFields.taskList];
                    for (let j: int = 0; j < taskList.length; j++) {
                        if (taskList[j][KuanghuanTaskFields.state] == 1) {
                            gradeRP3 = true;
                        }
                    }
                } else if (this._nodeList[i][KuanghuanNoteFields.type] == 2){
                    taskList = this._nodeList[i][KuanghuanNoteFields.taskList];
                    for (let j: int = 0; j < taskList.length; j++) {
                        if (taskList[j][KuanghuanTaskFields.state] == 1) {
                            gradeRP1 = true;
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("kuangHuanRP", gradeRP1);
            RedPointCtrl.instance.setRPProperty("kuangHuanLevelRP", gradeRP2);
            RedPointCtrl.instance.setRPProperty("kuangHuanPowarRP", gradeRP3);
        }

        //获取开启状态
        public get openState(): number {
            return this._openState;
        }

        public get nodeList(): Array<KuanghuanNote> {
            return this._nodeList;
        }

        /**
         *     获取 等级狂欢的 任务类型
         * 1 等级狂欢
         * 2 天关狂欢
         * 3 古塔狂欢
         * 4 BOSS狂欢
         * 5 组队狂欢
         * 6 金币狂欢
         * 7 魔力狂欢
         * 8 符阵狂欢
         * @param type   1是 等级狂欢 2是全民狂欢
         */
        public getType(): string {
            // let nodeList: Array<KuanghuanNote> = KuangHuanModel.instance.nodeList;
            // let typeNum = 1;
            // let str = "image_common_djkh_";
            // for (let index = 0; index < nodeList.length; index++) {
            //     let element = nodeList[index];
            //     if (element) {
            //         typeNum = element[KuanghuanNoteFields.type]
            //     }
            //     typeNum = typeNum ? typeNum : 1;
            //     if (typeNum != 1 && typeNum != 9) {
            //         break;
            //     }
            // }
            // switch (typeNum) {
            //     case 1:
            //         str = "image_common_djkh_";
            //         break;
            //     case 2:
            //         str = "image_common_tgkh_";
            //         break;
            //     case 3:
            //         str = "image_common_gtkh_";
            //         break;
            //     case 4:
            //         str = "image_common_bosskh_";
            //         break;
            //     case 5:
            //         str = "image_common_zdkh_";
            //         break;
            //     case 6:
            //         str = "image_common_jbkh_";
            //         break;
            //     case 7:
            //         str = "image_common_zqkh_";
            //         break;
            //     case 8:
            //         str = "image_common_fzkh_";
            //         break;
            //     case 9:
            //         str = "image_common_fzkh_";
            //         break;
            //     default:
            //         break;
            // }
            return "image_common_tgkh_";
        }
    }
}