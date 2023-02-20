/**成就任务配置 */

namespace modules.config {
    import xianwei_task = Configuration.xianwei_task;
    import xianwei_taskFields = Configuration.xianwei_taskFields;
    import Dictionary = Laya.Dictionary;

    export class XianweiTaskCfg {
        private static _instance: XianweiTaskCfg;
        public static get instance(): XianweiTaskCfg {
            return this._instance = this._instance || new XianweiTaskCfg();
        }

        constructor() {
            this.init();
        }

        private _dic: Dictionary;

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<xianwei_task> = GlobalData.getConfig("xianwei_task");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][xianwei_taskFields.id], arr[i]);
            }
        }

        /**
         * 根据任务id获取对应的任务数据
         */
        public getXianweiTaskDataById(id: number) {
            return this._dic.get(id);
        }
    }
}
