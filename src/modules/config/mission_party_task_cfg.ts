/** 任务派对（同一类型活动通用）  任务配置*/
namespace modules.config {
    import kuanghai2_task = Configuration.kuanghai2_task;
    import kuanghai2_taskFields = Configuration.kuanghai2_taskFields;

    export class MissionPartyTaskCfg {
        private getTab: kuanghai2_task[];
        //单例
        private static _instance: MissionPartyTaskCfg;
        public static get instance(): MissionPartyTaskCfg {
            return this._instance = this._instance || new MissionPartyTaskCfg();
        }
        constructor() {
            this.init();
        }
        private init(): void {
            let arr: Array<kuanghai2_task> = GlobalData.getConfig("kuanghai2_task");
            this.getTab = arr;
        }
        //根据id取配置
        public getCfgById(id: number): kuanghai2_task {
            let gra: kuanghai2_task;
            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let idByTab: number = this.getTab[i][kuanghai2_taskFields.id];
                if (id == idByTab) {
                    gra = this.getTab[i];
                }
            } if (gra) {
                // console.log("迎春派对 任务配置:", gra)
                return gra;
            } else {
                // console.log("gar == null");
            }

        }
    }
}