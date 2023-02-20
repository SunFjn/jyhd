/** 全民狂嗨 数据*/



namespace modules.mission_party {
    import Kuanghai2TaskNode = Protocols.KuanghaiTaskNode;
    import Kuanghai2GradeNode = Protocols.Kuanghai2GradeNode;
    import GetKuanghai2InfoReplyFields = Protocols.GetKuanghai2InfoReplyFields;
    import Kuanghai2TaskNodeFields = Protocols.Kuanghai2TaskNodeFields;
    import Kuanghai2GradeNodeFields = Protocols.Kuanghai2GradeNodeFields;
    import UpdateKuanghai2Task = Protocols.UpdateKuanghai2Task;
    import GetKuanghai2InfoReply = Protocols.GetKuanghai2InfoReply;
    import kuanghai2_rise = Configuration.kuanghai2_rise;
    import kuanghai2_riseFields = Configuration.kuanghai2_riseFields;
    import MissionPartyTaskCfg = modules.config.MissionPartyTaskCfg;
    import kuanghai2_task = Configuration.kuanghai2_task;
    import WindowInfoFields = ui.WindowInfoFields;
    import WindowConfig = modules.core.WindowConfig
    export class MissionPartyModel {
        private _openState: number;/*活动状态(0关闭 1开启)*/
        private _taskList: Array<Kuanghai2TaskNode>;/*任务列表*/
        private _gradeList: Array<Kuanghai2GradeNode>;/*档次列表*/
        private _id: number;/*活动id*/
        private _exp: number;/*总嗨值*/
        private _missionName: string;/*当前活动名字*/
        private _missionLabel: string;/*当前活动标签*/
        private _missionResName: string;/*当前活动资源名字*/
        private _restTm: number;/*剩余时间*/
        public _tabclink: number = 0
        private _isBuy: number;/*是否购买 0：未购买 1：已购买*/
        private _point: number;/*活动点数*/
        public _itemCfg: kuanghai2_rise;/*子项展示使用*/
        public _itemTab = []
        public _isFinish: number;

        //单例
        private static _instance: MissionPartyModel;
        public static get instance(): MissionPartyModel {
            return this._instance = this._instance || new MissionPartyModel();
        }
        //构造函数
        private constructor() {
            this._openState = 0;
            this._taskList = [];
            this._gradeList = [];
            this._id = 0;
            this._exp = 0;
            this._restTm = 0;
        }
        //数据更新返回
        public getdateInfo(tuple: GetKuanghai2InfoReply) {
            if (tuple) {
                // console.log("getdateInfo", tuple)
                this._openState = tuple[GetKuanghai2InfoReplyFields.openState];
                this._taskList = tuple[GetKuanghai2InfoReplyFields.taskList];
                this._gradeList = tuple[GetKuanghai2InfoReplyFields.gradeList];
                this._id = tuple[GetKuanghai2InfoReplyFields.id];
                this._exp = tuple[GetKuanghai2InfoReplyFields.exp];
                this._restTm = tuple[GetKuanghai2InfoReplyFields.restTm] + GlobalData.serverTime;
                this._isBuy = tuple[GetKuanghai2InfoReplyFields.isBuy];
                this._point = tuple[GetKuanghai2InfoReplyFields.point];
                this._point = tuple[GetKuanghai2InfoReplyFields.point];
                this._isFinish = tuple[GetKuanghai2InfoReplyFields.isFinish];
            } else { console.log("kuangHai Null Null Null Null Null Null Null ") };

            this.setFuncState();
            this.setPayRewardRP();
            GlobalData.dispatcher.event(CommonEventType.Mission_Party_UPDATE);
        }
        public get openState(): number {
            return this._openState;
        }
        public get taskList(): Array<Kuanghai2TaskNode> {
            return this._taskList;
        }
        public get gradeList(): Array<Kuanghai2GradeNode> {
            return this._gradeList;
        }
        public get id(): number {
            return this._id;
        }
        public get exp(): number {
            return this._exp;
        }
        public get restTm(): number {
            return this._restTm;
        }
        public get point(): number {
            return this._point;
        }
        public get missionName(): string {
            return this._missionName ? this._missionName : "踏春派对";
        }
        public get isBuy(): number {
            return this._isBuy;
        }
        //更新单个任务
        public singleTaskUpdate(tuple: UpdateKuanghai2Task) {
            for (let i = 0; i < this._taskList.length; i++) {
                if (this._taskList[i][Kuanghai2TaskNodeFields.id] == tuple[0][Kuanghai2TaskNodeFields.id]) {
                    this._taskList[i] = tuple[0];
                }
            }
            this.setPayRewardRP();
            GlobalData.dispatcher.event(CommonEventType.Mission_Party_UPDATE);
        }
        // 根据id获取任务奖励信息
        public getNodeInfoById(id: int): Kuanghai2TaskNode {
            let temp: Kuanghai2TaskNode = null;
            if (this._taskList) {
                for (let i: int = 0, len: int = this._taskList.length; i < len; i++) {
                    let node: Kuanghai2TaskNode = this._taskList[i];
                    if (id === node[Kuanghai2TaskNodeFields.id]) {
                        temp = node;
                        break;
                    }
                }
            }
            return temp;
        }
        // 根据id获取奖励信息
        public getRisrNodeInfoByGrade(grade: int): Kuanghai2GradeNode {
            let temp: Kuanghai2GradeNode = null;
            if (this._gradeList) {
                for (let i: int = 0, len: int = this._gradeList.length; i < len; i++) {
                    let node: Kuanghai2GradeNode = this._gradeList[i];
                    if (grade === node[Kuanghai2GradeNodeFields.grade]) {
                        temp = node;
                        break;
                    }
                }
            }
            return temp;
        }
        //设置红点
        public setPayRewardRP() {
            let isMissionPartyRP = this.getgRadeRP();
            this.getgRadeRP2();
            redPoint.RedPointCtrl.instance.setRPProperty("MissionPartyRP", isMissionPartyRP);
        }
        //狂嗨是否有可领取
        public getgRadeRP(): boolean {
            if (modules.funcOpen.FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.MissionPartyEnter)) {
                // console.log(this.taskList, this.gradeList)
                if (this.taskList != null) {
                    for (let i = 0; i < this.taskList.length; i++) {
                        if (this.taskList[i][Kuanghai2TaskNodeFields.state] == 1) {
                            return true;
                        }
                    }
                }
                if (this.gradeList != null) {
                    for (let i = 0; i < this.gradeList.length; i++) {
                        if (this.gradeList[i][Kuanghai2GradeNodeFields.state] == 1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        //狂嗨是否有可领取 Tab项
        public getgRadeRP2() {
            this._itemTab = []
            if (modules.funcOpen.FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.MissionPartyEnter)) {
                // console.log(this.taskList, this.gradeList)
                if (this.taskList != null) {
                    for (let i = 0; i < this.taskList.length; i++) {
                        if (this.taskList[i][Kuanghai2TaskNodeFields.state] == 1) {
                            let arr: kuanghai2_task = MissionPartyTaskCfg.instance.getCfgById(this.taskList[i][Kuanghai2TaskNodeFields.id])
                            this._itemTab.push(arr[11])
                        }
                    }
                }
            }
            GlobalData.dispatcher.event(CommonEventType.Mission_Party_updataListRP);
        }
        //关闭页签
        public setFuncState(): void {
            let _isOpen = this._openState == 1 ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.MissionPartyEnter, _isOpen);
        }

        /**
         * 根据服务器返回的参数判定前端展示哪个活动的UI标签
         * 获取当前任务标签
         */
        public getCurrentMissionLabel(): string {
            return this._missionLabel;
        }

        /**
         * 获取左上角派对狂欢资源图标
        */
        public getCurrentMissionIconResName(): string {
            return this._missionResName;
        }

        /**
         * 设置根据服务器返回的参数判定前端展示哪个活动的UI标签
         * 获取当前任务标签
         */
        public setCurrentMissionLabel(missionNum: number = 2): void {
            //“轮循活动配置：任务派对”目前先写死，需要哪个皮肤写哪个编号
            missionNum = 4;

            let label: string = "undifend111";
            //判断取值（主要设置显示的配置）
            switch (missionNum) {
                case 1: label = "tachun"; this._missionName = "踏春派对"; this._missionResName = "btn_mainui_pd_sctq.png"; break;
                case 2: label = "zhandui"; this._missionName = "战队派对"; this._missionResName = "btn_mainui_pd_zdpd.png"; break;
                case 3: label = "zhizun"; this._missionName = "至尊派对"; this._missionResName = "btn_mainui_pd_zzpd.png"; break;
                case 4: label = "dishu"; this._missionName = "地鼠派对"; this._missionResName = "btn_mainui_pd_dspd.png"; break;
            }

            //设置活动窗口对应的UI图集
            let arr = [88102, 88103, 88104];
            for (let index = 0; index < arr.length; index++) {
                const panelId = arr[index];
                switch (label) {
                    case "tachun":
                        WindowConfig.instance.getWindowConfigById(panelId)[WindowInfoFields.res] = ["res/atlas/mission_party.atlas", `res/atlas/mission_party/${label}.atlas`];
                        break;
                    case "zhizun":
                        WindowConfig.instance.getWindowConfigById(panelId)[WindowInfoFields.res] = ["res/atlas/mission_party.atlas", `res/atlas/mission_party/${label}.atlas`];
                        break;
                    case "dishu":
                        WindowConfig.instance.getWindowConfigById(panelId)[WindowInfoFields.res] = ["res/atlas/mission_party.atlas", `res/atlas/mission_party/${label}.atlas`];
                        break;
                    default:
                        WindowConfig.instance.getWindowConfigById(panelId)[WindowInfoFields.res] = ["res/atlas/mission_party.atlas", `res/atlas/mission_party/tachun.atlas`, `res/atlas/mission_party/${label}.atlas`];
                        break;
                }
            }


            this._missionLabel = label;
        }

    }
}