/** 玄火任务配置 */
namespace modules.config {

    import xuanhuoGetAward = Configuration.xuanhuoGetAward;
    import xuanhuoGetAwardFields = Configuration.xuanhuoGetAwardFields;

    export class XuanHuoGetAwardCfg {
        private static _instance: XuanHuoGetAwardCfg;
        public static get instance(): XuanHuoGetAwardCfg {
            return this._instance = this._instance || new XuanHuoGetAwardCfg();
        }

        private _tab: Table<xuanhuoGetAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<xuanhuoGetAward> = GlobalData.getConfig("xuanhuo_task_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][xuanhuoGetAwardFields.taskId]] = arr[i];
            }
        }

        //获取所有数据 
        public getAllConfig(): Table<xuanhuoGetAward> {
            return this._tab;
        }

        //获取数据by任务ID
        public getConfigByTaskId(taskId: number): xuanhuoGetAward {
            return this._tab[taskId];
        }
    }
}