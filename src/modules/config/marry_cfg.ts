namespace modules.marry {
    import marry_intimacy = Configuration.marry_intimacy;
    import marry_intimacyFields = Configuration.marry_intimacyFields;

    import marry_task = Configuration.marry_task;
    import marry_taskFields = Configuration.marry_taskFields;

    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import marry_package = Configuration.marry_package;
    import marry_packageFields = Configuration.marry_packageFields;

    export class MarryCfg {
        private static _instance: MarryCfg;
        public static get instance(): MarryCfg {
            return this._instance = this._instance || new MarryCfg();
        }
        private _cfg: Table<marry_intimacy>;
        private _task: Map<number, marry_task>
        private _gift: Map<number, marry_package>
        constructor() {
            this.init();
        }

        private init(): void {
            // level = 0,			/*培养等级*/
            // exp = 1,			/*需要经验*/
            // items = 2,			/*奖励 [itemId#count]#[itemId#count]*/
            this._cfg = {};
            let arr = GlobalData.getConfig("marry_intimacy");
            for (let i = 0; i < arr.length; ++i) {
                this._cfg[arr[i][marry_intimacyFields.level]] = arr[i];
            }
            this._task = new Map<number, marry_task>();
            let task = GlobalData.getConfig("marry_task");
            for (let i = 0; i < task.length; ++i) {
                this._task.set(task[i][marry_taskFields.id], task[i])
            }
            this._gift = new Map<number, marry_package>();

            let gift = GlobalData.getConfig("marry_package");
            for (let i = 0; i < gift.length; ++i) {
                this._gift.set(gift[i][marry_packageFields.id], gift[i])
            }

        }
        //获取等级配置
        public getLevelCfg(level: number): marry_intimacy {
            return this._cfg[level];
        }
        //获取任务配置
        public getLTaskCfg(id: number): marry_task {
            return this._task.get(id) || null
        }

        //获取所有礼包
        public getGiftAll() {
            let arr = []
            this._gift.forEach((value, key) => {
                arr.push(value)
            })
            return arr
        }
    }
}