/////<reference path="../$.ts"/>
/** 觉醒任务 */
namespace modules.config {
    import era_task = Configuration.era_task;
    import era_taskFields = Configuration.era_taskFields;

    export class EraTaskCfg{
        private static _instance: EraTaskCfg;
        public static get instance(): EraTaskCfg {
            return this._instance = this._instance || new EraTaskCfg();
        }

        private  _tab:Table<era_task>;

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};
            let arr: Array<era_task> = GlobalData.getConfig("era_task");
            for(let ele of arr){
                let id:number = ele[era_taskFields.id];
                this._tab[id] = ele;
            }
        }

        public getCfgById(id:number):era_task{
            return this._tab[id];
        }
    }
}