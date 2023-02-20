/** 红包数据层 - 3个红点检测可优化 */
namespace modules.redpack {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class RedPackModel {
        private static _instance: RedPackModel;
        public static get instance(): RedPackModel {
            return this._instance = this._instance || new RedPackModel();
        }

        private _player_recharge_money: number;
        private _create_time: number;
        private _super_redpack_duration_day: number = 30;

        private _super_redpack_canget_get_tab: Table<number> = {};
        private _level_redpack_canget_get_tab: Table<number> = {};
        private _level_bonus_canget_get_tab: Table<number> = {};
        private _api_completed_count: number = 0;
        private _showGetedTipsAlert: boolean = true;

        constructor() {
     
        }

        /** 用户充值金额 */
        public get player_recharge_money(): number {
            return this._player_recharge_money;
        }
        public set player_recharge_money(val: number) {
            this._player_recharge_money = val;
        }

        /** 是否显示红包获取提示面板 */
        public set showGetedTipsAlert(val: boolean) {
            this._showGetedTipsAlert = val;
        }

        /** 超级红包创建时间 */
        public set create_time(val: number) {
            this._create_time = val;
        }

        /** 超级红包剩余时间 */
        public get remain_time(): number {
            let endTime = (this._create_time + this._super_redpack_duration_day * 24 * 60 * 60) * 1000;
            let nowTime = new Date().getTime();

            if (nowTime >= endTime) return 0;

            return endTime - nowTime;
        }

        /** 超级红包剩余天数 */
        public get remain_day(): number {
            return this.remain_time / 1000 / 60 / 60 / 24;
        }

        /**
         * 只初始化检测红点 3个接口返回后进行的操作
         */
        private needInitCheckRP() {
            this._api_completed_count++;
            if (this._api_completed_count % 3 == 0) {
                console.log("chekck redpack redpoint!");
                this.checkRP(true, -1);
            }
        }

        /**
         * 检测红点 1等级分红 2等级红包 3超级红包 
         * @param show_alert 是否需要展示提示面板
         * @param checkIndex 检测的索引 -1为都检测
         */
        public checkRP(show_alert: boolean = false, checkIndex: number = -1) {
            // 测试服不走这个逻辑
            if (window["dawSDK"].current_platform == 1) {
                return;
            }
            let super_rp: boolean = false;
            let bonus_rp: boolean = false;
            let level_rp: boolean = false;

            if (checkIndex == 3 || checkIndex == -1) {
                super_rp = this.triggerSuperRedPackRP();
            }

            if (checkIndex == 2 || checkIndex == -1) {
                level_rp = this.triggerLevelRedPackRP();
            }

            if (checkIndex == 1 || checkIndex == -1) {
                bonus_rp = this.triggerLevelBonusRP();
            }



            if (!show_alert || !this._showGetedTipsAlert) return;
            if (super_rp) {
                if (WindowManager.instance.isOpened(WindowEnum.SUPRER_REDPACK_PANEL)) return;
                WindowManager.instance.open(WindowEnum.REDPACK_GET_TIPS_ALERT, 3);
            } else if (level_rp) {
                if (WindowManager.instance.isOpened(WindowEnum.REDPACK_LEVEL_PANEL)) return;
                WindowManager.instance.open(WindowEnum.REDPACK_GET_TIPS_ALERT, 2);
            } else if (bonus_rp) {
                if (WindowManager.instance.isOpened(WindowEnum.REDPACK_LEVEL_BONUS_PANEL)) return;
                WindowManager.instance.open(WindowEnum.REDPACK_GET_TIPS_ALERT, 1);
            }
        }

        /**
         * 超级红包可领取状态初始化
         */
        public set superRedPackRPInit(res: any) {
            // 充值的金额
            this.player_recharge_money = +res.data.player_recharge_money;
            // 遍历赋值初始状态
            for (let index = 0; index < res.data.red_bags.length; index++) {
                const bag_data = res.data.red_bags[index];
                this._super_redpack_canget_get_tab[bag_data.level] = bag_data.status;
            }

            // console.log(this._super_redpack_canget_get_tab);
            // 初始化
            if (!res.notNeedInitCheck) {
                this.needInitCheckRP();
            }
            // 调用接口刷新数据后需要触发红点
            else {
                this.triggerSuperRedPackRP();
            }
        }

        /**
         * 等级红包可领取状态初始化
         */
        public set levelRedPackRPInit(res: any) {

            // 遍历赋值初始状态
            for (let index = 0; index < res.data.red_bags.length; index++) {
                const bag_data = res.data.red_bags[index];
                this._level_redpack_canget_get_tab[bag_data.level] = bag_data.status;
            }

            // console.log(this._level_redpack_canget_get_tab);
            this.needInitCheckRP();
        }

        /**
         * 等级分红可领取状态初始化
         */
        public set levelBonusInit(res: any) {

            // 遍历赋值初始状态
            for (let index = 0; index < res.data.income_data.length; index++) {
                const bag_data = res.data.income_data[index];
                this._level_bonus_canget_get_tab[bag_data.level] = bag_data.status;
            }

            // console.log(this._level_bonus_canget_get_tab);
            this.needInitCheckRP();
        }

        /**
         * 检测触发超级红包的红点状态
         * 
         * @returns 是否有红点
         */
        public triggerSuperRedPackRP(): boolean {
            // 玩家等级
            let player_level: number = PlayerModel.instance.level;

            // 超级红包是否有红点
            let rp_state: boolean = false;

            // 修改玩家当前等级之前的红包的可领取的状态
            for (const key in this._super_redpack_canget_get_tab) {
                let level: number = +key;
                if (player_level < level) {
                    break;
                }
                // 充值超过98元或者白虎娘状态开启了
                let moneyStatus = this.player_recharge_money >= 98 || modules.zhizun.ZhizunModel.instance.zhizhun_opened;

                if (this._super_redpack_canget_get_tab[key] == 0 && moneyStatus) {
                    this._super_redpack_canget_get_tab[key] = 1;
                }

                if (!rp_state && this._super_redpack_canget_get_tab[key] == 1) {
                    rp_state = true;
                }
            }

            // 设置超级红包红点状态
            RedPointCtrl.instance.setRPProperty("SuperRedPackRP", rp_state);

            return rp_state;
        }

        /**
        * 检测触发等级红包的红点状态
        * 
        * @returns 是否有红点
        */
        public triggerLevelRedPackRP(): boolean {
            // 玩家等级
            let player_level: number = PlayerModel.instance.level;

            // 等级红包是否有红点
            let rp_state: boolean = false;

            // 修改玩家当前等级之前的红包的可领取的状态
            for (const key in this._level_redpack_canget_get_tab) {
                let level: number = +key;
                if (player_level < level) {
                    break;
                }

                if (this._level_redpack_canget_get_tab[key] == 0) {
                    this._level_redpack_canget_get_tab[key] = 1;
                }

                if (!rp_state && this._level_redpack_canget_get_tab[key] == 1) {
                    rp_state = true;
                }
            }

            // 设置等级红包红点状态
            RedPointCtrl.instance.setRPProperty("LevelRedPackRP", rp_state);

            return rp_state;
        }

        /**
        * 检测触发等级分红的红点状态
        * 
        * @returns 是否有红点
        */
        public triggerLevelBonusRP(): boolean {
            // 玩家等级
            let player_level: number = PlayerModel.instance.level;

            // 等级分红是否有红点
            let rp_state: boolean = false;

            // 修改玩家当前等级之前的红包的可领取的状态
            for (const key in this._level_bonus_canget_get_tab) {
                let level: number = +key;
                if (player_level < level) {
                    break;
                }

                if (this._level_bonus_canget_get_tab[key] == 0) {
                    this._level_bonus_canget_get_tab[key] = 1;
                }

                if (!rp_state && this._level_bonus_canget_get_tab[key] == 1) {
                    rp_state = true;
                }
            }

            // 设置等级红包红点状态
            RedPointCtrl.instance.setRPProperty("LevelBonusRP", rp_state);

            return rp_state;
        }

        /**
         * 更新当前等级红包领取状态
         * 
         * @param level 需要更新的等级
         * @param state 更新的状态-一般都是 领取：2
         */
        public updateSingleLevelRedPackState(level: number, state: number) {
            this._level_redpack_canget_get_tab[level] = state;
            this.checkRP(false, 2);
        }

        /**
         * 更新当前超级红包领取状态
         * 
         * @param level 需要更新的等级
         * @param state 更新的状态-一般都是 领取：2
         */
        public updateSingleSuperRedPackState(level: number, state: number) {
            this._super_redpack_canget_get_tab[level] = state;
            this.checkRP(false, 3);
        }

        /**
         * 更新当前等级分红领取状态
         * 
         * @param level 需要更新的等级
         * @param state 更新的状态-一般都是 领取：2
         */
        public updateSingleLevelBonusState(level: number, state: number) {
            this._level_bonus_canget_get_tab[level] = state;
            this.checkRP(false, 1);
        }

    }
}