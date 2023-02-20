/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.consume_reward {
    import consume_reward = Configuration.consume_reward;
    import consume_rewardFields = Configuration.consume_rewardFields;

    export class ConsumeRewardCfg {
        private static _instance: ConsumeRewardCfg;
        public static get instance(): ConsumeRewardCfg {
            return this._instance = this._instance || new ConsumeRewardCfg();
        }

        private _tab: Table<consume_reward>;
        private _cfgs: consume_reward[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._cfgs = GlobalData.getConfig("consume_reward");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                this._tab[this._cfgs[i][consume_rewardFields.id]] = this._cfgs[i];
            }
        }

        // 根据ID获取配置
        public getCfgById(id: number): consume_reward {
            return this._tab[id];
        }

        public getCfg(): Table<consume_reward> {
            return this._tab;
        }

        // 获取配置数组
        public get cfgs(): Array<consume_reward> {
            return this._cfgs;
        }
    }
}