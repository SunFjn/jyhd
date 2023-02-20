/////<reference path="../$.ts"/>
/** 开服冲榜 */
namespace modules.sprint_rank {
    import SprintRankNode = Protocols.SprintRankNode;
    import SprintRankNodeFields = Protocols.SprintRankNodeFields;
    import UpdateSprintRankBaseInfo = Protocols.UpdateSprintRankBaseInfo;
    import UpdateSprintRankBaseInfoFields = Protocols.UpdateSprintRankBaseInfoFields;
    import GetSprintRankAllInfoReply = Protocols.GetSprintRankAllInfoReply;
    import GetSprintRankAllInfoReplyFields = Protocols.GetSprintRankAllInfoReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SprintRankInfo = Protocols.SprintRankInfo;
    import SprintRankInfoFields = Protocols.SprintRankInfoFields;
    import sprint_rank = Configuration.sprint_rank;
    import sprint_rankFields = Configuration.sprint_rankFields;
    /*历史记录返回数据*/
    import GetSprintRankBeforeReply = Protocols.GetSprintRankBeforeReply;
    import GetSprintRankBeforeReplyFields = Protocols.GetSprintRankBeforeReplyFields;
    import SprintRankTaskNode = Protocols.SprintRankTaskNode;
    import SprintRankTaskNodeFields = Protocols.SprintRankTaskNodeFields;
    export class SprintRankModel {
        private static _instance: SprintRankModel;
        public static get instance(): SprintRankModel {
            return this._instance = this._instance || new SprintRankModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _openState: number;
        /*当前活动类型*/
        private _type: number;
        /*剩余时间*/
        private _restTm: number;
        /*榜首名字*/
        private _firstName: string;
        /*当前活动类型*/
        private _cuyType: number;
        /*排行列表*/

        public _skipId: number = 180;//暂时用来记住上次打开的面板如果活动未开启跳转上个面板提示未开启
        private _rankList: Array<SprintRankNode>;
        private _rankListByObjId: Array<SprintRankNode>;

        /**
         *历史排行数据 
         */
        public _LiShiNodeListByObjRank: Array<SprintRankInfo>;
        public _LiShiNodeListByObjid: Array<SprintRankInfo>;
        /*历史排行参数*/
        public _LiShiparam: number;
        public _LiShiparamTime: number;

        public _biJiaoMC: number;//比较的名次
        public _biLiNum: number;
        public _IsShouCiLiShiPaiHang: boolean;
        private constructor() {
            this._openState = 0;
            this._type = 0;
            this._restTm = 0;
            this._firstName = "";
            this._cuyType = 0;
            this._rankList = new Array<SprintRankNode>();
            this._rankListByObjId = new Array<SprintRankNode>();

            this._LiShiNodeListByObjRank = new Array<SprintRankInfo>();
            this._LiShiNodeListByObjid = new Array<SprintRankInfo>();
            this._LiShiparam = 0;
            this._LiShiparamTime = 0;
            this._biJiaoMC = 0;
            this._IsShouCiLiShiPaiHang = false;
            this._biLiNum = modules.config.BlendCfg.instance.getCfgById(56007)[Configuration.blendFields.intParam][0];
        }

        //返回数据
        public getInfo(tuple: GetSprintRankAllInfoReply) {
            this._openState = tuple[GetSprintRankAllInfoReplyFields.openState];
            // if (!this._IsShouCiLiShiPaiHang) {
            //     this._IsShouCiLiShiPaiHang = true;
            //     SprintRankCtrl.instance.funOpenSetSprintTypeRely();
            // }
            this._cuyType = tuple[GetSprintRankAllInfoReplyFields.curType];
            let _rankList = tuple[GetSprintRankAllInfoReplyFields.rankList];

            let isGaiBian = false;
            if (_rankList) {
                if (modules.sprint_rank.SprintRankModel.instance._biJiaoMC != 0) {
                    for (var index = 0; index < _rankList.length; index++) {
                        var element: SprintRankNode = _rankList[index];
                        if (element) {
                            let type = element[SprintRankNodeFields.type];
                            if (type == this._cuyType) {
                                let shuju = this.getInfoByRank(this._cuyType, modules.sprint_rank.SprintRankModel.instance._biJiaoMC);
                                if (shuju) {
                                    let shujuNew = this.getInfoByRankDate(this._cuyType, modules.sprint_rank.SprintRankModel.instance._biJiaoMC, element[SprintRankNodeFields.nodeList]);
                                    if (shujuNew) {
                                        if (shuju[SprintRankInfoFields.param] && shujuNew[SprintRankInfoFields.param]) {
                                            if (shuju[SprintRankInfoFields.param] != shujuNew[SprintRankInfoFields.param]) {
                                                if (this.myOne() && this.isTwo()) {
                                                    let otherInfo: SprintRankInfo = this.getInfoByRank(this._cuyType, 2);
                                                    let oneInfo: SprintRankInfo = this.getInfoByRank(this._cuyType, 1);
                                                    if (otherInfo && oneInfo) {//如果这个档次最后一名有玩家
                                                        let otherParam = otherInfo[SprintRankInfoFields.param];
                                                        let newFen = oneInfo[SprintRankInfoFields.param];

                                                        let bili = ((newFen - otherParam) / newFen);
                                                        if (bili <= this._biLiNum) {
                                                            isGaiBian = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                else if (this.MyTwo()) {
                                                    isGaiBian = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    // console.log("名次：  " + modules.sprint_rank.SprintRankModel.instance._biJiaoMC + "没人  刷新");
                                }
                            }
                        }
                    }
                }
            }



            if (_rankList) {
                for (var index = 0; index < _rankList.length; index++) {
                    // if (index != 6 && index != 4) {//测试 漏天的情况
                    //     continue;
                    // }
                    var element: SprintRankNode = _rankList[index];
                    let type = element[SprintRankNodeFields.type];
                    this._rankList[type] = element;
                }
            }



            if (isGaiBian) {
                GlobalData.dispatcher.event(CommonEventType.SPRING_RANK_CHANG);
            }

            GlobalData.dispatcher.event(CommonEventType.SPRINT_RANK_UPDATE);
            this.setSprintType(this._cuyType);
        }

        //更新数据
        public updateInfo(tuple: UpdateSprintRankBaseInfo) {
            this._openState = tuple[UpdateSprintRankBaseInfoFields.openState];
            this._cuyType = tuple[UpdateSprintRankBaseInfoFields.type];
            this._restTm = tuple[UpdateSprintRankBaseInfoFields.restTm] + GlobalData.serverTime;
            this._firstName = tuple[UpdateSprintRankBaseInfoFields.firstName];
            GlobalData.dispatcher.event(CommonEventType.SPRINT_RANK_UPDATE);
            this.setSprintType(this._cuyType);
        }
        /**
         * 开服冲榜历史排行数据返回
         * @param tuple 
         */
        public GetSprintRankBeforeReply(tuple: GetSprintRankBeforeReply) {
            let _states = tuple[GetSprintRankBeforeReplyFields.openState];
            let _nodeList = tuple[GetSprintRankBeforeReplyFields.rankList];
            this._LiShiparam = tuple[GetSprintRankBeforeReplyFields.type];
            this._LiShiparamTime = tuple[GetSprintRankBeforeReplyFields.tm];
            if (_nodeList) {
                if (_nodeList.length > 0) {
                    this._LiShiNodeListByObjRank.length = 0;
                    this._LiShiNodeListByObjRank = new Array<SprintRankInfo>();
                    this._LiShiNodeListByObjid.length = 0;
                    this._LiShiNodeListByObjid = new Array<SprintRankInfo>();
                    for (var index = 0; index < _nodeList.length; index++) {
                        var element: SprintRankInfo = _nodeList[index];
                        let rank = element[SprintRankInfoFields.rank];
                        let objId = element[SprintRankInfoFields.objId];
                        this._LiShiNodeListByObjRank[rank] = element;
                        this._LiShiNodeListByObjid[objId] = element;
                    }
                    WindowManager.instance.open(WindowEnum.SPRINT_RANK_JIEZHI_ALERT, 0);
                }
            }
        }
        //获取活动开启状态
        public get openState(): number {
            return this._openState;
        }

        //获取活动剩余时间
        public get restTm(): number {
            return this._restTm;
        }

        //获取榜首名字
        public get firstName(): string {
            return this._firstName;
        }

        //获取当前活动类型
        public get curType(): number {
            return this._cuyType;
        }

        //获取排行列表
        public get rankList(): Array<SprintRankNode> {
            return this._rankList;
        }

        public get skipId(): number {
            return this._skipId;
        }

        // 设置当前冲榜类型（更新功能开启列表）
        private _funcIds: Array<ActionOpenId> = [ActionOpenId.sprintRank, ActionOpenId.sprintRank2, ActionOpenId.sprintRank3,
        ActionOpenId.sprintRank4, ActionOpenId.sprintRank5, ActionOpenId.sprintRank6, ActionOpenId.sprintRank7];

        public setSprintType(type: number): void {
            for (let i: int = 1; i < type; i++) {
                if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.sprintRank)) {
                    FuncOpenModel.instance.setActionOpen(this._funcIds[i], ActionOpenState.open);
                }

            }
            for (let i: int = type || 1, len: int = this._funcIds.length; i < len; i++) {
                if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.sprintRank)) {
                    FuncOpenModel.instance.setActionOpen(this._funcIds[i], ActionOpenState.show);
                }
            }
        }

        // SprintRankCfg


        /**
         * 我是不是第一名
         */
        public myOne(): boolean {
            let myInfo: SprintRankInfo = this.getInfoById(this._cuyType, modules.player.PlayerModel.instance.actorId);
            if (myInfo) {
                let rank = myInfo[SprintRankInfoFields.rank];
                let param = myInfo[SprintRankInfoFields.param];
                if (rank == 1) {
                    return true;
                }
            }
            return false;
        }
        public MyTwo(): boolean {
            let myInfo: SprintRankInfo = this.getInfoById(this._cuyType, modules.player.PlayerModel.instance.actorId);
            if (myInfo) {
                let rank = myInfo[SprintRankInfoFields.rank];
                let param = myInfo[SprintRankInfoFields.param];
                if (rank == 2) {
                    return true;
                }
            }
            return false;
        }
        /**
         * 是否有第二名
         */
        public isTwo(): boolean {
            let myInfo: SprintRankInfo = this.getInfoByRank(this._cuyType, 2);
            if (myInfo) {
                return true;
            }
            return false;
        }
        public getInfoById(type: number, id: number): SprintRankInfo {
            let rankInfo = null;
            let shuju = this._rankList[type];
            if (shuju) {
                let nodeListDate = shuju[SprintRankNodeFields.nodeList];
                if (nodeListDate) {
                    for (var index = 0; index < nodeListDate.length; index++) {
                        var element = nodeListDate[index];
                        if (element) {
                            let rank = element[SprintRankInfoFields.rank];
                            let objId = element[SprintRankInfoFields.objId];
                            if (id == objId) {
                                rankInfo = element;
                                return rankInfo;
                            }
                        }
                    }
                }

            }
            return rankInfo;
        }
        public getInfoByRank(type: number, rankNum: number): SprintRankInfo {
            let rankInfo = null;
            let shuju = this._rankList[type];
            if (shuju) {
                let nodeListDate = shuju[SprintRankNodeFields.nodeList];
                if (nodeListDate) {
                    for (var index = 0; index < nodeListDate.length; index++) {
                        var element = nodeListDate[index];
                        if (element) {
                            let rank = element[SprintRankInfoFields.rank];
                            let objId = element[SprintRankInfoFields.objId];
                            if (rankNum == rank) {
                                rankInfo = element;
                                return rankInfo;
                            }
                        }
                    }
                }

            }
            return rankInfo;
        }

        public getInfoByRankDate(type: number, rankNum: number, dates: Array<SprintRankInfo>): SprintRankInfo {
            let rankInfo = null;
            let shuju = dates;
            if (shuju) {
                let nodeListDate = shuju;
                if (nodeListDate) {
                    for (var index = 0; index < nodeListDate.length; index++) {
                        var element = nodeListDate[index];
                        if (element) {
                            let rank = element[SprintRankInfoFields.rank];
                            let objId = element[SprintRankInfoFields.objId];
                            if (rankNum == rank) {
                                rankInfo = element;
                                return rankInfo;
                            }
                        }
                    }
                }

            }
            return rankInfo;
        }


        public getTipsInfo(): Array<string> {
            let myInfo: SprintRankInfo = this.getInfoById(this._cuyType, modules.player.PlayerModel.instance.actorId);
            let str = ``;
            let str1 = ``;
            if (myInfo) {
                let rankParam: number = 0;
                if (modules.sprint_rank.SprintRankTaskModel.instance.taskList[this._cuyType]) {
                    rankParam = modules.sprint_rank.SprintRankTaskModel.instance.taskList[this._cuyType][SprintRankTaskNodeFields.rankParam];
                }
                let rank = myInfo[SprintRankInfoFields.rank];
                let param = myInfo[SprintRankInfoFields.param];
                let grade = SprintRankCfg.instance.getGradeByRank(rank);
                if (rank == 1) {
                    let maxMingci = 2;
                    let jifenCha = 0;//积分差
                    if (maxMingci) {
                        let otherInfo: SprintRankInfo = this.getInfoByRank(this._cuyType, maxMingci);
                        if (otherInfo) {//如果这个档次最后一名有玩家
                            let otherParam = otherInfo[SprintRankInfoFields.param];
                            jifenCha = rankParam - otherParam;
                            jifenCha = jifenCha < 0 ? 0 : jifenCha + 1;
                        }
                        else {
                            let upGrade = SprintRankCfg.instance.getGradeByRank(maxMingci);
                            let shuju = SprintRankCfg.instance.getCfgsByGrade(this._cuyType, upGrade);
                            if (shuju) {
                                let otherParam = shuju[sprint_rankFields.condition];
                                jifenCha = rankParam - otherParam;
                            }
                        }
                    }
                    maxMingci = maxMingci ? maxMingci : 0;
                    jifenCha = jifenCha < 0 ? 0 : jifenCha;
                    this._biJiaoMC = maxMingci;
                    str = `第二名还差<span style='color:#ff3e3e'>${jifenCha}</span>战力将超过你`;
                }
                else {
                    let upGrade = grade - 1;
                    let maxMingci = SprintRankCfg.instance.getMaxMingCiByGrade(this._cuyType, upGrade);
                    let jifenCha = 0;//积分差
                    if (maxMingci) {
                        let shuju = SprintRankCfg.instance.getCfgsByGrade(this._cuyType, upGrade);
                        let otherInfo: SprintRankInfo = this.getInfoByRank(this._cuyType, maxMingci);
                        if (otherInfo) {//如果这个档次最后一名有玩家
                            let otherParam = otherInfo[SprintRankInfoFields.param];
                            jifenCha = otherParam - rankParam;
                            jifenCha = jifenCha < 0 ? 0 : jifenCha + 1;
                        }
                        else {
                            if (shuju) {
                                let otherParam = shuju[sprint_rankFields.condition];
                                jifenCha = otherParam - rankParam;
                            }
                        }
                        if (shuju) {
                            let tipsStr = shuju[sprint_rankFields.tipsStr];
                            str1 = tipsStr;
                        }
                    }
                    maxMingci = maxMingci ? maxMingci : 0;
                    jifenCha = jifenCha < 0 ? 0 : jifenCha;
                    this._biJiaoMC = maxMingci;
                    str = `您还差<span style='color:#168a17'>${jifenCha}</span>战力超过第<span style='color:#168a17'>${maxMingci}</span>名`;
                }
            }
            else {//未上榜
                // this._param
                let rankParam: number = 0;
                if (modules.sprint_rank.SprintRankTaskModel.instance.taskList[this._cuyType]) {
                    rankParam = modules.sprint_rank.SprintRankTaskModel.instance.taskList[this._cuyType][SprintRankTaskNodeFields.rankParam];
                }
                let maxMingci = 20;
                let jifenCha = 0;//积分差
                if (maxMingci) {
                    let upGrade = SprintRankCfg.instance.getGradeByRank(maxMingci);
                    let shuju = SprintRankCfg.instance.getCfgsByGrade(this._cuyType, upGrade);
                    let otherInfo: SprintRankInfo = this.getInfoByRank(this._cuyType, maxMingci);
                    let otherParam1 = shuju[sprint_rankFields.condition];
                    if (shuju) {
                        if (rankParam < otherParam1) {
                            jifenCha = otherParam1 - rankParam;
                        }
                        else {
                            if (otherInfo) {//如果这个档次最后一名有玩家
                                let otherParam = otherInfo[SprintRankInfoFields.param];
                                jifenCha = otherParam - rankParam;
                                jifenCha = jifenCha < 0 ? 0 : jifenCha + 1;
                            }
                            else {
                                jifenCha = otherParam1 - rankParam;
                            }
                        }
                        let tipsStr = shuju[sprint_rankFields.tipsStr];
                        str1 = tipsStr;
                    }
                }
                maxMingci = maxMingci ? maxMingci : 0;
                jifenCha = jifenCha < 0 ? 0 : jifenCha;
                this._biJiaoMC = maxMingci;
                str = `您还差<span style='color:#168a17'>${jifenCha}</span>战力超过第<span style='color:#168a17'>${maxMingci}</span>名`;
            }
            return [str, str1];
        }
    }
}