/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import consume_reward2 = Configuration.consume_reward2;
    import consume_reward2Fields = Configuration.consume_reward2Fields;

    export class DayConsumeRewardCfg {
        private static _instance: DayConsumeRewardCfg;
        public static get instance(): DayConsumeRewardCfg {
            return this._instance = this._instance || new DayConsumeRewardCfg();
        }

        private _tab: Array<Array<consume_reward2>>;
        private _cfgs: Array<consume_reward2>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = new Array<Array<consume_reward2>>();
            this._cfgs = GlobalData.getConfig("consume_reward2");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let key = this._cfgs[i][consume_reward2Fields.serverDay];
                let shuzu = this._tab[key];
                if (!shuzu) {
                    this._tab[key] = new Array<consume_reward2>();
                }
                this._tab[key].push(this._cfgs[i]);

            }
        }

        // 根据serverDay 开服天数 获取配置
        public getCfgByServerDay(serverDay: number): Array<consume_reward2> {
            let shuju = this._tab[serverDay];
            return shuju;
        }
    }
}