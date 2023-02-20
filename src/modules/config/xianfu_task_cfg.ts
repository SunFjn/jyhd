/////<reference path="../$.ts"/>
/** 仙府-家园任务配置 */
namespace modules.xianfu {
    import xianfu_task = Configuration.xianfu_task;
    import xianfu_taskFields = Configuration.xianfu_taskFields;

    export class XianfuTaskCfg {
        private static _instance: XianfuTaskCfg;
        public static get instance(): XianfuTaskCfg {
            return this._instance = this._instance || new XianfuTaskCfg();
        }

        private _tab: Table<xianfu_task>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<xianfu_task> = GlobalData.getConfig("xianfu_task");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][xianfu_taskFields.id]] = arr[i];
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): xianfu_task {
            return this._tab[id];
        }

    }
}