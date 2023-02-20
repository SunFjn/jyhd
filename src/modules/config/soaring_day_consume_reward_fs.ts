/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import consume_reward_fs = Configuration.consume_reward_fs;
    import consume_reward_fsFields = Configuration.consume_reward_fsFields;

    export class SoaringDayConsumeRewardCfg {
        private static _instance: SoaringDayConsumeRewardCfg;
        public static get instance(): SoaringDayConsumeRewardCfg {
            return this._instance = this._instance || new SoaringDayConsumeRewardCfg();
        }

        private _tab: Table<consume_reward_fs>;
        private getArr: consume_reward_fs[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<consume_reward_fs> = GlobalData.getConfig("consume_reward_fs");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][consume_reward_fsFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): consume_reward_fs {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): consume_reward_fs[] {
            let gra: consume_reward_fs[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][consume_reward_fsFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}