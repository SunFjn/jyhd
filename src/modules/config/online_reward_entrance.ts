/** 通用配置*/


namespace modules.config {
    import online_reward_entrance = Configuration.online_reward_entrance;
    import online_reward_entranceFields = Configuration.online_reward_entranceFields;
    import Dictionary = Laya.Dictionary;

    export class OnlineRewardEntranceCfg {
        private static _instance: OnlineRewardEntranceCfg;
        public static get instance(): OnlineRewardEntranceCfg {
            return this._instance = this._instance || new OnlineRewardEntranceCfg();
        }

        private _dic: Dictionary;
        private _arr: Array<online_reward_entrance>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            this._arr = new Array<online_reward_entrance>();
            this._arr = GlobalData.getConfig("online_reward_entrance");
            for (let i: int = 0, len = this._arr.length; i < len; i++) {
                this._dic.set(this._arr[i][online_reward_entranceFields.openDay], this._arr[i]);
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): online_reward_entrance {
            return this._dic.get(id);
        }

        public get_arr(): Array<online_reward_entrance> {
            return this._arr;
        }
    }
}