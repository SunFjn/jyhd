/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import feisheng_rank_task = Configuration.feisheng_rank_task;
    import feisheng_rank_taskFields = Configuration.feisheng_rank_taskFields;

    export class SoaringRankTaskCfg {
        private static _instance: SoaringRankTaskCfg;
        public static get instance(): SoaringRankTaskCfg {
            return this._instance = this._instance || new SoaringRankTaskCfg();
        }

        private _tab: Table<feisheng_rank_task>;
        private getArr: feisheng_rank_task[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<feisheng_rank_task> = GlobalData.getConfig("feisheng_rank_task");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][feisheng_rank_taskFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): feisheng_rank_task {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): feisheng_rank_task[] {
            let gra: feisheng_rank_task[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][feisheng_rank_taskFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}