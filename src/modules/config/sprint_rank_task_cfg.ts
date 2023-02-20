/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.sprint_rank {
    import sprint_rank_task = Configuration.sprint_rank_task;
    import sprint_rank_taskFields = Configuration.sprint_rank_taskFields;

    export class SprintRankTaskCfg {
        private static _instance: SprintRankTaskCfg;
        public static get instance(): SprintRankTaskCfg {
            return this._instance = this._instance || new SprintRankTaskCfg();
        }

        private _tab: Table<sprint_rank_task>;
        private getArr: sprint_rank_task[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<sprint_rank_task> = GlobalData.getConfig("sprint_rank_task");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][sprint_rank_taskFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): sprint_rank_task {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): sprint_rank_task[] {
            let gra: sprint_rank_task[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][sprint_rank_taskFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}