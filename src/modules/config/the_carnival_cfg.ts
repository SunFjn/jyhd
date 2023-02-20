/** 全民狂嗨 奖励配置*/

namespace modules.config{
    import kuanghai_rise = Configuration.kuanghai_rise;
    import kuanghai_riseFields = Configuration.kuanghai_riseFields;

    export class TheCarnivalCfg{
        private getTab: kuanghai_rise[];
        //单例
        private static _instance: TheCarnivalCfg;
        public static get instance(): TheCarnivalCfg {
            return this._instance = this._instance || new TheCarnivalCfg();
        }
        constructor() {
            this.init();
        }
        private init(): void {
            let arr: Array<kuanghai_rise> = GlobalData.getConfig("kuanghai_rise");
            this.getTab = arr;
        }
        //根据id取配置
        public getCfgById(id:number): kuanghai_rise[] {
            let gra: kuanghai_rise[] = [];
            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let idByTab : number =  this.getTab[i][kuanghai_riseFields.id];
                if (id == idByTab) {
                    gra.push(this.getTab[i]);
                }
            }
            return gra;
        }
    }
}