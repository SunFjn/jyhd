/** 垂钓反利 */
namespace modules.limit {
    import GetLimitXunBaoCumulativeTaskInfoReplyFields = Protocols.GetLimitXunBaoCumulativeTaskInfoReplyFields;
    import LimitXunBaoCumulativeTaskReward = Protocols.LimitXunBaoCumulativeTaskReward;
    import LimitXunBaoCumulativeTaskRewardFields = Protocols.LimitXunBaoCumulativeTaskRewardFields;
    import limit_xunbao_cumulative_task_cfg = Configuration.limit_xunbao_cumulative_task_cfg;
    import limit_xunbao_cumulative_task_cfgField = Configuration.limit_xunbao_cumulative_task_cfgField;

    export class LimitReapModel {
        private static _instance: LimitReapModel;
        public static get instance(): LimitReapModel {
            return this._instance = this._instance || new LimitReapModel();
        }

        //活动倒计时
        private _activityTime: number[];
        //奖励列表
        private _rewarTable: Array<Table<LimitXunBaoCumulativeTaskReward>>;
        //充值金额
        private _totalValue: number[];

        constructor() {
            this._activityTime = new Array<number>();
            this._totalValue = new Array<number>();
            this._rewarTable = new Array();
            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._activityTime[LimitBigType.fish] = 0;
            this._rewarTable[LimitBigType.fish] = {};
            this._totalValue[LimitBigType.fish] = -1;
            // 地鼠
            this._activityTime[LimitBigType.dishu] = 0;
            this._rewarTable[LimitBigType.dishu] = {};
            this._totalValue[LimitBigType.dishu] = -1;
            // 连续登陆
            this._activityTime[LimitTaskSmallType.day] = 0;
            this._rewarTable[LimitTaskSmallType.day] = {};
            this._totalValue[LimitTaskSmallType.day] = -1;
            // 消费赠礼
            this._activityTime[LimitTaskSmallType.money] = 0;
            this._rewarTable[LimitTaskSmallType.money] = {};
            this._totalValue[LimitTaskSmallType.money] = -1;
        }

        public updateInfo(tuple: Protocols.GetLimitXunBaoCumulativeTaskInfoReply) {
            let bigType: number = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.bigType];
            let smallType: number = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.smallType];
            let rewarList = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.rewardList];
            // let isState: boolean = false;
            let p_rp = false;
            this._rewarTable[bigType] = {};
            this._rewarTable[smallType] = {};
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                if (smallType == LimitTaskSmallType.null) {
                    this._rewarTable[bigType][rewarList[i][LimitXunBaoCumulativeTaskRewardFields.id]] = rewarList[i];
                    if (rewarList[i][LimitXunBaoCumulativeTaskRewardFields.state] === 1) {
                        p_rp = true;
                    }

                    switch (bigType) {
                        case LimitBigType.dishu: redPoint.RedPointCtrl.instance.setRPProperty("dishuReapRP", p_rp);
                            break;
                        case LimitBigType.fish: redPoint.RedPointCtrl.instance.setRPProperty("fishReapRP", p_rp);
                            break;
                    }
                } else {
                    this._rewarTable[smallType][rewarList[i][LimitXunBaoCumulativeTaskRewardFields.id]] = rewarList[i];
                    if (rewarList[i][LimitXunBaoCumulativeTaskRewardFields.state] === 1) {
                        p_rp = true;
                    }
                    switch (smallType) {
                        case LimitTaskSmallType.day: redPoint.RedPointCtrl.instance.setRPProperty("YearLoginRP", p_rp);
                            break;
                        case LimitTaskSmallType.money: redPoint.RedPointCtrl.instance.setRPProperty("YearReapRP", p_rp);
                            break;
                    }
                }
            }


            if (smallType == LimitTaskSmallType.null) {
                this._activityTime[bigType] = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.endTime];
                this._totalValue[bigType] = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.totalValue];

            } else {
                this._activityTime[smallType] = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.endTime];
                this._totalValue[smallType] = tuple[GetLimitXunBaoCumulativeTaskInfoReplyFields.totalValue];

            }
            GlobalData.dispatcher.event(CommonEventType.LIMIT_REAP_UPDATE);
        }

        public activityTime(bigType: number, smallType: number): number {
            if (smallType == 0) {
                return this._activityTime[bigType];
            }
            return this._activityTime[smallType];

        }

        // 小类为0读大类，
        public rewarTable(bigType: number, smallType: number): Table<LimitXunBaoCumulativeTaskReward> {
            if (smallType == 0) {
                return this._rewarTable[bigType];
            }
            return this._rewarTable[smallType];
        }

        public totalValue(bigType: number, smallType: number): number {
            if (smallType == 0) {
                return this._totalValue[bigType];
            }
            return this._totalValue[smallType];
        }

        // 获取最低档id
        public getLeastId(bigType: number, smallType: number): number {
            let arr: Table<LimitXunBaoCumulativeTaskReward> = this.rewarTable(bigType, smallType);
            let cfg_arr: limit_xunbao_cumulative_task_cfg[] = LimitReapCfg.instance.getCfgsByType(bigType, smallType);
            // console.log('vtz:arr', arr);
            // let id = 0;
            // console.log('vtz:arr && arr.length', (arr && arr.length),!!!arr);
            if (arr) {
                for (let key in cfg_arr) {
                    if (arr[cfg_arr[key][limit_xunbao_cumulative_task_cfgField.id]] && arr[cfg_arr[key][limit_xunbao_cumulative_task_cfgField.id]][LimitXunBaoCumulativeTaskRewardFields.state] < 2) {
                        return cfg_arr[key][limit_xunbao_cumulative_task_cfgField.id];
                    }
                    // id = arr[key][LimitXunBaoCumulativeTaskRewardFields.id];
                    // if (arr[key][LimitXunBaoCumulativeTaskRewardFields.state] < 2) {
                    //     // continue
                    //     return id;
                    // }
                }
            }
            // console.log('vtz:id', id);
            return 0;
        }

        // 获取最低档需求
        public getLeastCode(bigType: number, smallType: number): number {
            let id = this.getLeastId(bigType, smallType);
            return LimitReapCfg.instance.getCondition(bigType, smallType, id);
        }
    }
}