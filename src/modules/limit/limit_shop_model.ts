///<reference path="../config/fish_mall_cfg.ts"/>
/** 垂钓反利 */
namespace modules.limit {
    import GetLimitXunBaoMallInfoReplyFields = Protocols.GetLimitXunBaoMallInfoReplyFields;
    import LimitXunBaoCumulativeTaskReward = Protocols.LimitXunBaoCumulativeTaskReward;
    import GetLimitXunBaoMallNode = Protocols.GetLimitXunBaoMallNode;
    import GetLimitXunBaoMallNodeFields = Protocols.GetLimitXunBaoMallNodeFields;
    import LimitMallCfg = modules.config.LimitMallCfg;
    import limit_mall_cfg = Configuration.limit_mall_cfg;


    export class LimitShopModel {
        private static _instance: LimitShopModel;
        public static get instance(): LimitShopModel {
            return this._instance = this._instance || new LimitShopModel();
        }

        //活动倒计时
        private _activityTime: number[];
        //奖励列表
        // private _rewarTable: Table<LimitXunBaoCumulativeTaskReward>[];
        //充值金额
        // private _totalMoney: number[];
        private _cfg_data: Array<limit_mall_cfg>[];
        private _listinfo: Array<number>;

        private constructor() {
            this._activityTime = new Array<number>();
            // this._totalMoney = new Array<number>();
            // this._rewarTable = new Array();
            this._listinfo = new Array();
            this._cfg_data = new Array();

            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._activityTime[LimitBigType.fish] = 0;
            this._cfg_data[LimitBigType.fish] = LimitMallCfg.instance.getSortCfgByType(LimitBigType.fish, 1);

            this._activityTime[LimitBigType.year] = 0;
            this._cfg_data[LimitBigType.year] = LimitMallCfg.instance.getSortCfgByType(LimitBigType.year, 1);

        }

        public updateInfo(tuple: Protocols.GetLimitXunBaoMallInfoReply) {
            let bigType: number = tuple[GetLimitXunBaoMallInfoReplyFields.bigType];
            this._activityTime[bigType] = tuple[GetLimitXunBaoMallInfoReplyFields.endTime];

            let arr = tuple[GetLimitXunBaoMallInfoReplyFields.listInfo];
            // console.log('vtz:arr', arr);
            if (arr) {
                this._listinfo = [];
                for (let i = 0; i < arr.length; i++) {
                    this._listinfo[arr[i][GetLimitXunBaoMallNodeFields.id]] = arr[i][GetLimitXunBaoMallNodeFields.limitCount];
                }
                // console.log('vtz:this._listinfo', this._listinfo);
            }

            GlobalData.dispatcher.event(CommonEventType.LIMIT_SHOP_UPDATE);
        }

        public activityTime(bigType: number): number {
            return this._activityTime[bigType];
        }

        // public rewarTable(bigType:number): Table<LimitXunBaoCumulativeTaskReward> {
        //     return this._rewarTable[bigType];
        // }

        // public totalMoney(bigType:number): number {
        //     return this._totalMoney[bigType];
        // }

        public cfgData(bigType: number): Array<limit_mall_cfg> {
            return this._cfg_data[bigType];
        }

        public getListinfo(id: GetLimitXunBaoMallNode[GetLimitXunBaoMallNodeFields.id]): number {
            // console.log('vtz:id', id);
            // console.log('vtz:this._listinfo', this._listinfo);
            // console.log('vtz:this._listinfo.values()', this._listinfo.values());
            return typeof this._listinfo[id] == "undefined" ? 0 : this._listinfo[id];
        }

    }
}