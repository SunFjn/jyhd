/** 地鼠数据 */
namespace modules.dishu {
    import AutoSC_DiShuData = Protocols.AutoSC_DiShuData;
    import AutoSC_DiShuTask = Protocols.AutoSC_DiShuTask;
    import RankUserBaseInfoList = Protocols.RankUserBaseInfoList;
    import RankUserBaseInfoFields = Protocols.RankUserBaseInfoFields;
    import RankUserBaseInfo = Protocols.RankUserBaseInfo;
    import AutoSC_DiShuDataFields = Protocols.AutoSC_DiShuDataFields;
    import AutoSC_DiShuInfo = Protocols.AutoSC_DiShuInfo;
    import AutoSC_DiShuItem = Protocols.AutoSC_DiShuItem;
    import AutoSC_DiShuTimateList = Protocols.AutoSC_DiShuTimateList;
    import AutoSC_DiShuItemFields = Protocols.AutoSC_DiShuItemFields;
    import AutoSC_DiShuTask_list = Protocols.AutoSC_DiShuTask_list;
    import AutoSC_DiShuTask_listFields = Protocols.AutoSC_DiShuTask_listFields;
    import AutoUF_DiShuTaskAwd = Protocols.AutoUF_DiShuTaskAwd;
    import AutoUF_DiShuTaskAwdFields = Protocols.AutoUF_DiShuTaskAwdFields;
    import ContinuepayProgress = Protocols.ContinuepayProgress;


    export class DishuModel {
        private static _instance: DishuModel;
        private _atv_type: number
        private _openindex
        //充值金额
        private _totalMoney: number;
        private _endTime: number
        public static get instance(): DishuModel {
            return this._instance = this._instance || new DishuModel();
        }

        private _ctrlInfo: AutoSC_DiShuData;
        private _tabSelectIndex: number;
        private _rankInfo: Array<RankUserBaseInfo>;
        private _maozhua: number; //猫爪材料ID
        private _bj: number; //猫爪材料ID
        private _iconShow:boolean;

        private _taskList: Array<Array<AutoSC_DiShuTask_list>>;
        private _taskTypeFields: Object;
        private _taskType: Array<number>;
        //每档进度
        private _progressList: Array<ContinuepayProgress>;

        constructor() {
            this._maozhua = 16850001;
            // this._bj = 92150009;
            this._taskTypeFields = { "open": 0, "server": 1 }
            this._taskType = [1, 2]
            this._taskList = [];
            this._iconShow = false;
           
            // this.atv_type = BlendCfg.instance.getCftBuIdParam(BlenId.XunbaoContinueType)[0];
            this._openindex = 0
            this._endTime = 0;

        }

        public get taskTypeFields(): Object {
            return this._taskTypeFields;
        }

        public get taskType(): number[] {
            return this._taskType;
        }

        public get taskTypeBySelect(): number {
            return this._taskType[this.tabSelectIndex];
        }

        public get maozhua(): number {
            return this._maozhua;
        }

        public get bj(): number {
            return this._bj;
        }

        public GetInfoReply(tuple: AutoSC_DiShuData) {
            this._ctrlInfo = tuple;
            for (let v of this.taskType) {
                this.taskListInit(v)
            }
            this._iconShow = this._ctrlInfo[AutoSC_DiShuDataFields.isShow];
            GlobalData.dispatcher.event(CommonEventType.DISHU_PANEL_UPDATE);
        }

        public get iconShow():boolean{
            return this._iconShow;
        }

        // 活动开始时间
        public get openTime() {
            return this._ctrlInfo[AutoSC_DiShuDataFields.openTime];
        }

        // 活动结束时间
        public get getEndTime() {
            return this._ctrlInfo[AutoSC_DiShuDataFields.getEndTime];
        }

        // 最终大奖列表
        public get timateList(): AutoSC_DiShuTimateList[] {
            return this._ctrlInfo[AutoSC_DiShuDataFields.timateList];
        }

        // 最终大奖选取状态 道具id为0未选择
        public get ultimate(): AutoSC_DiShuItem {
            return this._ctrlInfo[AutoSC_DiShuDataFields.Ultimate];
        }
        public set ultimate(info: AutoSC_DiShuItem) {
            this._ctrlInfo[AutoSC_DiShuDataFields.Ultimate] = info;
        }

        //层数
        public get level(): number {
            return this._ctrlInfo[AutoSC_DiShuDataFields.Level]
        }
        //地鼠数据
        public get DiShuData(): AutoSC_DiShuInfo {
            return this._ctrlInfo[AutoSC_DiShuDataFields.DiShuData]
        }
        //行奖励领取标识
        public get RowAwd(): Array<number> {
            return this._ctrlInfo[AutoSC_DiShuDataFields.RowAwd]
        }

        // 设置地鼠领取状态
        public setDishuGetStatus(row: number, line: number) {
            this._ctrlInfo[AutoSC_DiShuDataFields.DiShuData][row][line][AutoSC_DiShuItemFields.Type] = 2;
        }

        public RankReply(tuple: RankUserBaseInfoList) {
            let _rank_list: Array<RankUserBaseInfo> = tuple[0];
            let _rank_list_new: Array<RankUserBaseInfo> = [];
            if (_rank_list.length > 0) {
                for (let i = 0; i < _rank_list.length; i++) {
                    _rank_list_new[_rank_list[i][RankUserBaseInfoFields.rank]] = _rank_list[i];
                }
            }
            this._rankInfo = _rank_list_new;

            GlobalData.dispatcher.event(CommonEventType.DISHU_RANKLIST_UPDATE);
            // rank = 0,                        /*排名*/
            // name = 1,                        /*角色名*/
            // actorId = 2,                /*角色id*/
            // param = 3,                        /*排行参数*/
            // pgId = 4,                        /*服id*/
            // occ = 5,                        /*职业*/
            // vip = 6,                        /*VIP*/
            // vipF = 7,                        /*VIPF*/
        }
        public set tabSelectIndex(i: number) {
            this._tabSelectIndex = i;
        }

        public get tabSelectIndex(): number {
            return this._tabSelectIndex;
        }

        private taskListInit(type: number) {
            let has_num: Array<number> = [0, this._ctrlInfo[AutoSC_DiShuDataFields.OpenCount], this._ctrlInfo[AutoSC_DiShuDataFields.ServerCount]]
            let api_list: AutoSC_DiShuTask = this._ctrlInfo[AutoSC_DiShuDataFields.DiShuTask][type - 1];// 这里个人和全服又变成0|1了
            let cfg_list: Array<AutoSC_DiShuTask_list> = DishuCfg.instance.task[type] as any as Array<AutoSC_DiShuTask_list>;
            let r_list: Array<AutoSC_DiShuTask_list> = [];
            let r_last_list: Array<AutoSC_DiShuTask_list> = [];
            let _rp: boolean = false;
            // 排序
            for (let key in cfg_list) {
                cfg_list[key][AutoSC_DiShuTask_listFields.id] = key as any as number;
                if (typeof api_list[key] != "undefined" && api_list[key] == 1) {
                    cfg_list[key][AutoSC_DiShuTask_listFields.status] = 1;
                    // 已领取，放到最后
                    r_last_list.push(cfg_list[key]);
                } else {
                    cfg_list[key][AutoSC_DiShuTask_listFields.status] = 0;
                    r_list.push(cfg_list[key]);
                    if (has_num[type] >= cfg_list[key][AutoSC_DiShuTask_listFields.Condition]) {
                        // 开启红点
                        _rp = true;
                    }
                }
            }
            if (type == this.taskType[this.taskTypeFields["open"]]) {
                redPoint.RedPointCtrl.instance.setRPProperty("DishuTaskOpenRP", _rp);
            } else {
                redPoint.RedPointCtrl.instance.setRPProperty("DishuTaskServerRP", _rp);
            }
            r_list = r_list.concat(r_last_list);
            this._taskList[type] = r_list;
        }

        // 地鼠任务数据
        public updateTaskList(info: AutoUF_DiShuTaskAwd) {
            // 这个是从1开始的
            this._ctrlInfo[AutoSC_DiShuDataFields.DiShuTask][info[AutoUF_DiShuTaskAwdFields.type] - 1][info[AutoUF_DiShuTaskAwdFields.id]] = 1;
            this.taskListInit(info[AutoUF_DiShuTaskAwdFields.type]);
            GlobalData.dispatcher.event(CommonEventType.DISHU_TASK_UPDATE);
        }

        public getTaskList(): Array<AutoSC_DiShuTask_list> {
            return this._taskList[this.taskTypeBySelect];
        }

        // 打地鼠累积次数
        public get playCount(): number {
            if (this.tabSelectIndex == this.taskTypeFields["open"]) {
                // 个人次数
                return this._ctrlInfo[AutoSC_DiShuDataFields.OpenCount];
            } else {
                // 全服次数
                return this._ctrlInfo[AutoSC_DiShuDataFields.ServerCount];
            }
        }

        // 获取排行数据
        public get rankInfo(): Array<RankUserBaseInfo> {
            return this._rankInfo;
        }

        // 排行回调
        public _myRankObj: Object;
        public myRankObj(panel: DishuRankPanel, fun: Function) {
            this._myRankObj = { "panel": panel, "fun": fun };
        }

        public myRankCallback(index: number) {
            if (typeof this._myRankObj != "undefined") {
                this._myRankObj["fun"].apply(this._myRankObj["panel"], [index]);
            }
        }

        // 地鼠回调
        public _dishuObj: Object;
        public dishuObj(panel: DishuPanel, fun: Function) {
            this._dishuObj = { "panel": panel, "fun": fun };
        }

        public dishuCallback() {
            if (typeof this._dishuObj != "undefined") {
                this._dishuObj["fun"].apply(this._dishuObj["panel"]);
            }
        }

        // 活动type
        public get atv_type(): number {
            return this._atv_type;
        }

        public set atv_type(t: number) {
            this._atv_type = t;
        }

        public get openindex(): number {
            return this._openindex;
        }
        public get progressList(): Array<ContinuepayProgress> {
            // console.log('vtz:this._progressList', this._progressList);
            return this._progressList;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        public get endTime(): number {
            return this._endTime;
        }

    }
}