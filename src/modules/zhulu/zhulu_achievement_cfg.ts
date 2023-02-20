/** 逐鹿成就配置 */
namespace modules.config {

    import zhuluAchievementAward = Configuration.zhuluAchievementAward;
    import zhuluAchievementAwardFields = Configuration.zhuluAchievementAwardFields;

    export class ZhuLuAchievementCfg {
        private static _instance: ZhuLuAchievementCfg;
        public static get instance(): ZhuLuAchievementCfg {
            return this._instance = this._instance || new ZhuLuAchievementCfg();
        }

        private _tab: Table<zhuluAchievementAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<zhuluAchievementAward> = GlobalData.getConfig("zhulu_achievement_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][zhuluAchievementAwardFields.taskId]] = arr[i];
            }
        }

        //获取所有数据 
        public getAllConfig(): Table<zhuluAchievementAward> {
            return this._tab;
        }

        //获取数据by任务ID
        public getConfigByTaskId(taskId: number): zhuluAchievementAward {
            return this._tab[taskId];
        }
    }
}