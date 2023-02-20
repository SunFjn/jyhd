/** 任务派对（同一类型活动通用） 奖励配置*/

namespace modules.config {
    import kuanghai2_rise = Configuration.kuanghai2_rise;
    import kuanghai2_riseFields = Configuration.kuanghai2_riseFields;

    export class MissionPartyCfg {
        private getTab: kuanghai2_rise[];
        //单例
        private static _instance: MissionPartyCfg;
        public static get instance(): MissionPartyCfg {
            return this._instance = this._instance || new MissionPartyCfg();
        }
        constructor() {
            this.init();
        }
        private init(): void {
            let arr: Array<kuanghai2_rise> = GlobalData.getConfig("kuanghai2_rise");
            this.getTab = arr;
        }
        //根据id取配置
        public getCfgById(id: number): kuanghai2_rise[] {
            let gra: kuanghai2_rise[] = [];
            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let idByTab: number = this.getTab[i][kuanghai2_riseFields.id];
                if (id == idByTab) {
                    gra.push(this.getTab[i]);
                }
            }
            // console.log("迎春派对 宝箱配置:", gra)
            return gra;
        }
    }
}