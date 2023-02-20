/** 逐鹿首领战伤害奖励配置 */
namespace modules.config {

    import zhuluHeaderDamageAward = Configuration.zhuluHeaderDamageAward;
    import zhuluHeaderDamageAwardFields = Configuration.zhuluHeaderDamageAwardFields;

    export class ZhuLuHeaderDamageAwardCfg {
        private static _instance: ZhuLuHeaderDamageAwardCfg;
        public static get instance(): ZhuLuHeaderDamageAwardCfg {
            return this._instance = this._instance || new ZhuLuHeaderDamageAwardCfg();
        }

        private _tab: Table<zhuluHeaderDamageAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<zhuluHeaderDamageAward> = GlobalData.getConfig("zhulu_headerwar_damage_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][zhuluHeaderDamageAwardFields.taskId]] = arr[i];
            }
        }

        //获取所有数据 
        public getAllConfig(): Table<zhuluHeaderDamageAward> {
            return this._tab;
        }

        //获取数据by任务ID
        public getConfigByTaskId(taskId: number): zhuluHeaderDamageAward {
            return this._tab[taskId];
        }
    }
}