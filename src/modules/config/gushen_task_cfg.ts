/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import Dictionary = Laya.Dictionary;
    import gushen_task = Configuration.gushen_task;
    import gushen_taskFields = Configuration.gushen_taskFields;

    export class GuShenTaskCfg {
        private static _instance: GuShenTaskCfg;
        public static get instance(): GuShenTaskCfg {
            return this._instance = this._instance || new GuShenTaskCfg();
        }

        private _dic: Dictionary;
        private getTab: gushen_task[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<gushen_task> = GlobalData.getConfig("gushen_task");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][gushen_taskFields.taskId], arr[i]);
            }
            this.getTab = arr;
        }

        //根据类型获取配置
        public getCfgBytype(type: number): gushen_task[] {
            let gra: gushen_task[] = [];
            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let grad: number = this.getTab[i][gushen_taskFields.type];
                if (type == grad) {
                    gra.push(this.getTab[i]);
                }
            }
            return gra;
        }

        // 根据ID获取配置
        public getCfgById(taskId: int): gushen_task {
            return this._dic.get(taskId);
        }

    }
}