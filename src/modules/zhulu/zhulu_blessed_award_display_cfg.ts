/** 逐鹿福地挑战奖励展示 */
namespace modules.config {

    import zhuluBlessedAwardDisplay = Configuration.zhuluBlessedAwardDisplay;
    import zhuluBlessedAwardDisplayFields = Configuration.zhuluBlessedAwardDisplayFields;

    export class ZhuLuBlessedAwardDisplayCfg {
        private static _instance: ZhuLuBlessedAwardDisplayCfg;
        public static get instance(): ZhuLuBlessedAwardDisplayCfg {
            return this._instance = this._instance || new ZhuLuBlessedAwardDisplayCfg();
        }

        private _tab: Array<zhuluBlessedAwardDisplay>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = GlobalData.getConfig("zhulu_blessed_award_display");
        }

        //获取所有数据 
        public getAllConfig(): Array<zhuluBlessedAwardDisplay> {
            return this._tab;
        }
    }
}