namespace modules.redpack {
    import BaseCtrl = modules.core.BaseCtrl;
    import blendFields = Configuration.blendFields;
    import BlendCfg = modules.config.BlendCfg;

    export class RedPackCtrl extends BaseCtrl {
        private static _instance: RedPackCtrl;
        public static get instance(): RedPackCtrl {
            return this._instance = this._instance || new RedPackCtrl();
        }


        constructor() {
            super();
        }

        public setup(): void {
            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.touchSuperRedPackData();
        }

        /**
         * 访问一下这些接口，保证拿到等级信息和红包领取数据
         */
        public touchSuperRedPackData() {
            if(Main.instance.isWXChannel){
                return;
            }
            //测试服不需要请求接口
            if (window["dawSDK"].current_platform == 1) {
                console.log("测试服跳过SDK红包验证和数据请求功能!");
                return;
            }

            // 超级红包配置数据获取
            SDKNet("api/red/bag/high/level/config", {}, (res) => {
                if (res && res.data && res.code == 200) {
                    if (res.data.player_recharge_money == undefined || !res.data.red_bags || res.data.red_bags.length == 0) {
                        console.log("超级红包参数异常!", res);
                        return;
                    }
                    RedPackModel.instance.superRedPackRPInit = res;
                    return;
                }
                console.error("超级红包配置数据获取异常:", res);
            })

            // 等级红包配置数据获取
            SDKNet("api/red/bag/level/config", {}, (res) => {
                if (res && res.data && res.code == 200) {
                    if (!res.data.red_bags || res.data.red_bags.length == 0) {
                        console.log("等级红包参数异常!", res);
                        return;
                    }
                    RedPackModel.instance.levelRedPackRPInit = res;
                    return;
                }
                console.error("等级红包配置数据获取异常:", res);
            });

            // 等级分红配置数据获取
            SDKNet("api/red/bag/game/level/income", {}, (res) => {
                if (res && res.data && res.code == 200) {
                    if (!res.data.income_data || res.data.income_data.length == 0) {
                        console.log("等级分红参数异常!", res);
                        return;
                    }
                    RedPackModel.instance.levelBonusInit = res;
                    return;
                }
                console.error("等级分红配置数据获取异常:", res);
            });
        }
    }
}