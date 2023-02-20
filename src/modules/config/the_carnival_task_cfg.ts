/** 全民狂嗨 任务配置*/
namespace modules.config{
    import kuanghai_task = Configuration.kuanghai_task;
    import kuanghai_taskFields = Configuration.kuanghai_taskFields;

    export class TheCarnivalTaskCfg{
        private getTab: kuanghai_task[];
        //单例
        private static _instance: TheCarnivalTaskCfg;
        public static get instance(): TheCarnivalTaskCfg {
            return this._instance = this._instance || new TheCarnivalTaskCfg();
        }
        constructor() {
            this.init();
        }
        private init(): void {
            let arr: Array<kuanghai_task> = GlobalData.getConfig("kuanghai_task");
            this.getTab = arr;
        }
        //根据id取配置
        public getCfgById(id:number): kuanghai_task {
            let gra: kuanghai_task;
            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let idByTab : number =  this.getTab[i][kuanghai_taskFields.id];
                if (id == idByTab) {
                    gra=this.getTab[i];
                }
            }if(gra)
            {
                return gra;
            }else{
                console.log("gar == null");
            }

        }
    }
}