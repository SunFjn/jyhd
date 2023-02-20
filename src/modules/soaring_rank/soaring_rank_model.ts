/////<reference path="../$.ts"/>
///<reference path="../config/soaring_rank_cfg.ts"/>
/** 开服冲榜 */
namespace modules.soaring_rank {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FeishengRankInfo = Protocols.FeishengRankInfo;
    import FeishengRankInfoFields = Protocols.FeishengRankInfoFields;
    /*返回数据*/
    import GetFeishengRankAllInfoReply = Protocols.GetFeishengRankAllInfoReply;
    import GetFeishengRankAllInfoReplyFields = Protocols.GetFeishengRankAllInfoReplyFields;
    /*返回标签数据*/
    import GetFeishengRankBaseInfoReply = Protocols.GetFeishengRankBaseInfoReply;
    import GetFeishengRankBaseInfoReplyFields = Protocols.GetFeishengRankBaseInfoReplyFields;
    /*更新基本数据(只更新简单信息)*/
    import UpdateFeishengRankBaseInfo = Protocols.UpdateFeishengRankBaseInfo;
    import UpdateFeishengRankBaseInfoFields = Protocols.UpdateFeishengRankBaseInfoFields;
    /*返回积分数据*/
    import GetFeishengRankTaskInfoReply = Protocols.GetFeishengRankTaskInfoReply;
    import GetFeishengRankTaskInfoReplyFields = Protocols.GetFeishengRankTaskInfoReplyFields;
    /*更新积分数据*/
    import UpdateFeishengRankTaskInfo = Protocols.UpdateFeishengRankTaskInfo;
    import UpdateFeishengRankTaskInfoFields = Protocols.UpdateFeishengRankTaskInfoFields;
    /*历史记录返回数据*/
    import GetFeishengRankBeforeReply = Protocols.GetFeishengRankBeforeReply;
    import GetFeishengRankBeforeReplyFields = Protocols.GetFeishengRankBeforeReplyFields;

    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SoaringRankCfg = modules.config.SoaringRankCfg;
    import feisheng_rankFields = Configuration.feisheng_rankFields;
    import SoaringRankTaskCfg = modules.config.SoaringRankTaskCfg;
    import feisheng_rank_task = Configuration.feisheng_rank_task;
    import feisheng_rank_taskFields = Configuration.feisheng_rank_taskFields;
    export class SoaringRankModel {
        private static _instance: SoaringRankModel;
        public static get instance(): SoaringRankModel {
            return this._instance = this._instance || new SoaringRankModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _openState: number;
        /*当前活动类型*/
        private _cuyType: number;
        /*剩余时间*/
        private _restTm: number;
        /*榜首名字*/
        private _firstName: string;
        /*排行列表*/
        private _nodeList: Array<FeishengRankInfo>;
        /*排行列表 key为角色ID*/
        private _nodeListByObjId: Array<FeishengRankInfo>;
        /*标记(0未开启 1进行中 2已结束)*/
        private _endFlag: number;

        /*当前任务id*/
        private _taskId: number;
        /*领取状态*/
        private _state: number;
        /*参数*/
        private _param: number;
        /**
         *历史排行数据 
         */
        public _LiShiNodeListByObjRank: Array<FeishengRankInfo>;
        public _LiShiNodeListByObjid: Array<FeishengRankInfo>;
        /*历史排行参数*/
        public _LiShiparam: number;
        public _LiShiparamTime: number;


        public _IsShouCi: boolean;
        public _biJiaoMC: number;//比较的名次

        public _biLiNum: number;//（1/2）/1  比例


        public _IsShouCiLiShiPaiHang: boolean;
        private constructor() {
            this._openState = 0;
            this._cuyType = 1;
            this._restTm = 0;
            this._firstName = "";
            this._nodeList = new Array<FeishengRankInfo>();
            this._nodeListByObjId = new Array<FeishengRankInfo>();
            this._LiShiNodeListByObjRank = new Array<FeishengRankInfo>();
            this._LiShiNodeListByObjid = new Array<FeishengRankInfo>();
            this._taskId = 1001;
            this._state = 2;
            this._param = 0;
            this._LiShiparam = 0;
            this._LiShiparamTime = 0;
            this._IsShouCi = false;
            this._IsShouCiLiShiPaiHang = false;
            this._biJiaoMC = 0;
            this._biLiNum = modules.config.BlendCfg.instance.getCfgById(56007)[Configuration.blendFields.intParam][1];
        }

        //返回数据
        public getInfo(tuple: GetFeishengRankAllInfoReply) {
            // this._openState = tuple[GetFeishengRankAllInfoReplyFields.openState];

            this._cuyType = tuple[GetFeishengRankAllInfoReplyFields.curType];
            this._restTm = tuple[GetFeishengRankAllInfoReplyFields.restTm] + GlobalData.serverTime;
            // console.log("结束时间戳：  " + this._restTm);
            this._firstName = tuple[GetFeishengRankAllInfoReplyFields.firstName];
            this._endFlag = tuple[GetFeishengRankAllInfoReplyFields.endFlag];
            // if (!this._IsShouCiLiShiPaiHang) {
            //     this._IsShouCiLiShiPaiHang = true;
            //     SoaringRankCtrl.instance.funOpenSetSprintTypeRely();
            // }
            let _nodeList = tuple[GetFeishengRankAllInfoReplyFields.nodeList];
            if (_nodeList) {
                for (var index = 0; index < _nodeList.length; index++) {
                    var element: FeishengRankInfo = _nodeList[index];
                    let rank = element[FeishengRankInfoFields.rank];
                    let objId = element[FeishengRankInfoFields.objId];
                    let param = element[FeishengRankInfoFields.param];
                    if (this._IsShouCi) {
                        let isGaiBian = false;
                        if (objId == modules.player.PlayerModel.instance.actorId) {
                            if (this._nodeListByObjId[modules.player.PlayerModel.instance.actorId]) {
                                if (this._nodeListByObjId[modules.player.PlayerModel.instance.actorId][FeishengRankInfoFields.param] != param) {
                                    if (!this.myOne()) {
                                        isGaiBian = true;
                                    }
                                }
                            }
                        }
                        if (this._biJiaoMC != 0) {
                            if (rank == this._biJiaoMC) {
                                if (this._nodeList[this._biJiaoMC]) {
                                    let laoFen = this._nodeList[this._biJiaoMC][FeishengRankInfoFields.param];
                                    if (laoFen) {
                                        if (laoFen != param) {
                                            if (this.myOne()) {
                                                let oneInf = this._nodeList[1];
                                                let bili = ((oneInf[FeishengRankInfoFields.param] - laoFen) / oneInf[FeishengRankInfoFields.param]);
                                                if (bili <= this._biLiNum) {
                                                    isGaiBian = true;
                                                    break;
                                                }
                                            }
                                            else if (this.MyTwo()) {
                                                isGaiBian = true;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (rank == this._biJiaoMC) {
                                        if (this.myOne()) {
                                            isGaiBian = true;
                                        }
                                        else if (this.MyTwo()) {
                                            isGaiBian = true;

                                        }
                                    }
                                }
                            }
                        }
                        if (isGaiBian) {
                            GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_CHANG);
                        }
                    }
                }



                this._nodeList.length = 0;
                this._nodeListByObjId.length = 0;
                this._nodeList = new Array<FeishengRankInfo>();
                this._nodeListByObjId = new Array<FeishengRankInfo>();
                for (var index = 0; index < _nodeList.length; index++) {
                    var element: FeishengRankInfo = _nodeList[index];
                    let rank = element[FeishengRankInfoFields.rank];
                    let objId = element[FeishengRankInfoFields.objId];
                    let param = element[FeishengRankInfoFields.param];
                    this._nodeList[rank] = element;
                    this._nodeListByObjId[objId] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_UPDATE);
            this.setRP();
            this._IsShouCi = true;
        }


        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: UpdateFeishengRankBaseInfo) {
            // this._openState = tuple[UpdateFeishengRankBaseInfoFields.openState];
            if (this._cuyType != tuple[GetFeishengRankAllInfoReplyFields.curType]) {
                GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_HUODONG_CHANG);
            }
            this._cuyType = tuple[UpdateFeishengRankBaseInfoFields.type];
            this._restTm = tuple[UpdateFeishengRankBaseInfoFields.restTm] + GlobalData.serverTime;
            this._firstName = tuple[UpdateFeishengRankBaseInfoFields.firstName];
            GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_ITEM_UPDATE);
            this.setRP();
        }

        //返回标签数据
        public getInfo2(tuple: GetFeishengRankBaseInfoReply) {
            // this._openState = tuple[GetFeishengRankBaseInfoReplyFields.openState];
            this._cuyType = tuple[GetFeishengRankBaseInfoReplyFields.type];
            this._restTm = tuple[GetFeishengRankBaseInfoReplyFields.restTm] + GlobalData.serverTime;
            this._firstName = tuple[GetFeishengRankBaseInfoReplyFields.firstName];
            GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_ITEM_UPDATE);
            this.setRP();
        }

        //返回积分数据
        public getInfoIntegral(tuple: GetFeishengRankTaskInfoReply) {
            this._cuyType = tuple[GetFeishengRankTaskInfoReplyFields.curType];
            this._taskId = tuple[GetFeishengRankTaskInfoReplyFields.taskId];
            this._state = tuple[GetFeishengRankTaskInfoReplyFields.state];
            this._param = tuple[GetFeishengRankTaskInfoReplyFields.param];
            this._endFlag = tuple[GetFeishengRankTaskInfoReplyFields.endFlag];
            GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_LIONQU_UPDATE);
            this.setRP();
        }

        //更新积分数据
        public updateInfoIntegral(tuple: UpdateFeishengRankTaskInfo) {
            if (this._cuyType != tuple[GetFeishengRankAllInfoReplyFields.curType]) {
                GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_HUODONG_CHANG);
            }
            this._cuyType = tuple[UpdateFeishengRankTaskInfoFields.curType];
            this._taskId = tuple[UpdateFeishengRankTaskInfoFields.taskId];
            this._state = tuple[UpdateFeishengRankTaskInfoFields.state];

            let isGaiBian = false;
            if (!this.myOne()) {
                if (this._param != tuple[UpdateFeishengRankTaskInfoFields.param]) {
                    isGaiBian = true;
                }
            }



            this._param = tuple[UpdateFeishengRankTaskInfoFields.param];
            this._endFlag = tuple[UpdateFeishengRankTaskInfoFields.endFlag];
            GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_LIONQU_UPDATE);


            if (isGaiBian) {
                this.getTipsInfo();
                GlobalData.dispatcher.event(CommonEventType.SOARING_RANK_CHANG, true);
                // SoaringRankCtrl.instance.getFeishengRankAllInfo();
            }

            this.setRP();
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank);
            RedPointCtrl.instance.setRPProperty("soaringRankRP", this._state == 1 && bolll && SoaringRankModel.instance.endFlag == 0);
        }

        /**
         * 封神榜冲榜历史排行数据返回
         * @param tuple 
         */
        public GetFeishengRankBeforeReply(tuple: GetFeishengRankBeforeReply) {
            let _states = tuple[GetFeishengRankBeforeReplyFields.state];
            let _nodeList = tuple[GetFeishengRankBeforeReplyFields.rankList];
            this._LiShiparam = tuple[GetFeishengRankBeforeReplyFields.type];
            this._LiShiparamTime = tuple[GetFeishengRankBeforeReplyFields.tm];
            if (_nodeList) {
                if (_nodeList.length > 0) {
                    this._LiShiNodeListByObjRank.length = 0;
                    this._LiShiNodeListByObjRank = new Array<FeishengRankInfo>();
                    this._LiShiNodeListByObjid.length = 0;
                    this._LiShiNodeListByObjid = new Array<FeishengRankInfo>();
                    for (var index = 0; index < _nodeList.length; index++) {
                        var element: FeishengRankInfo = _nodeList[index];
                        let rank = element[FeishengRankInfoFields.rank];
                        let objId = element[FeishengRankInfoFields.objId];
                        this._LiShiNodeListByObjRank[rank] = element;
                        this._LiShiNodeListByObjid[objId] = element;
                    }
                    WindowManager.instance.open(WindowEnum.ROTARYTABLE_SOARING_RANK_JIEZHI_ALERT, 1);
                }
            }
        }


        /**
             * 我是不是第一名
             */
        public myOne(): boolean {
            let myInfo: FeishengRankInfo = this._nodeListByObjId[modules.player.PlayerModel.instance.actorId];
            if (myInfo) {
                let grade = myInfo[FeishengRankInfoFields.grade];
                let rank = myInfo[FeishengRankInfoFields.rank];
                let param = myInfo[FeishengRankInfoFields.param];
                if (rank == 1) {
                    return true;
                }
            }
            return false;
        }
        public MyTwo(): boolean {
            let myInfo: FeishengRankInfo = this._nodeListByObjId[modules.player.PlayerModel.instance.actorId];
            if (myInfo) {
                let grade = myInfo[FeishengRankInfoFields.grade];
                let rank = myInfo[FeishengRankInfoFields.rank];
                let param = myInfo[FeishengRankInfoFields.param];
                if (rank == 2) {
                    return true;
                }
            }
            return false;
        }
        public isTwo(): boolean {
            let myInfo: FeishengRankInfo = this._nodeList[2];
            if (myInfo) {
                return true;
            }
            return false;
        }
        public getTipsInfo(): Array<string> {
            let myInfo: FeishengRankInfo = this._nodeListByObjId[modules.player.PlayerModel.instance.actorId];
            let str = ``;
            let str1 = ``;
            if (myInfo) {
                let grade = myInfo[FeishengRankInfoFields.grade];
                let rank = myInfo[FeishengRankInfoFields.rank];
                let param = myInfo[FeishengRankInfoFields.param];
                if (rank == 1) {
                    let maxMingci = 2;
                    let jifenCha = 0;//积分差
                    if (maxMingci) {
                        let otherInfo: FeishengRankInfo = this._nodeList[maxMingci];
                        if (otherInfo) {//如果这个档次最后一名有玩家
                            let otherParam = otherInfo[FeishengRankInfoFields.param];
                            jifenCha = this._param - otherParam;
                            jifenCha = jifenCha < 0 ? 0 : jifenCha + 1;
                        }
                        else {
                            let upGrade = SoaringRankCfg.instance.getGradeByRank(maxMingci);
                            let shuju = SoaringRankCfg.instance.getCfgsByGrade(this._cuyType, upGrade);
                            if (shuju) {
                                let otherParam = shuju[feisheng_rankFields.condition];
                                jifenCha = this._param - otherParam;
                            }
                        }
                    }
                    maxMingci = maxMingci ? maxMingci : 0;
                    this._biJiaoMC = maxMingci;
                    jifenCha = jifenCha < 0 ? 0 : jifenCha;
                    str = `第二名还差<span style='color:#ff3e3e'>${jifenCha}</span>积分将超过你`;
                }
                else {
                    let upGrade = grade - 1;
                    let maxMingci = SoaringRankCfg.instance.getMaxMingCiByGrade(this._cuyType, upGrade);
                    let jifenCha = 0;//积分差
                    if (maxMingci) {
                        let shuju = SoaringRankCfg.instance.getCfgsByGrade(this._cuyType, upGrade);
                        let otherInfo: FeishengRankInfo = this._nodeList[maxMingci];
                        if (otherInfo) {//如果这个档次最后一名有玩家
                            let otherParam = otherInfo[FeishengRankInfoFields.param];
                            jifenCha = otherParam - this._param;
                            jifenCha = jifenCha < 0 ? 0 : jifenCha + 1;
                        }
                        else {
                            if (shuju) {
                                let otherParam = shuju[feisheng_rankFields.condition];
                                jifenCha = otherParam - this._param;
                            }
                        }
                        if (shuju) {
                            let tipsStr = shuju[feisheng_rankFields.tipsStr];
                            str1 = tipsStr;
                        }
                    }
                    maxMingci = maxMingci ? maxMingci : 0;
                    this._biJiaoMC = maxMingci;
                    jifenCha = jifenCha < 0 ? 0 : jifenCha;
                    str = `您还差<span style='color:#168a17'>${jifenCha}</span>积分超过第<span style='color:#168a17'>${maxMingci}</span>名`;
                }
            }
            else {//未上榜
                // this._param
                let maxMingci = 50;
                let jifenCha = 0;//积分差
                if (maxMingci) {
                    let upGrade = SoaringRankCfg.instance.getGradeByRank(maxMingci);
                    let shuju = SoaringRankCfg.instance.getCfgsByGrade(this._cuyType, upGrade);
                    let otherInfo: FeishengRankInfo = this._nodeList[maxMingci];
                    if (shuju) {
                        let otherParam1 = shuju[feisheng_rankFields.condition];
                        if (this._param < otherParam1) {
                            if (shuju) {
                                jifenCha = otherParam1 - this._param;
                            }
                        }
                        else {
                            if (otherInfo) {//如果这个档次最后一名有玩家
                                let otherParam = otherInfo[FeishengRankInfoFields.param];
                                jifenCha = otherParam - this._param;
                                jifenCha = jifenCha < 0 ? 0 : jifenCha + 1;
                            }
                            else {
                                if (shuju) {
                                    jifenCha = otherParam1 - this._param;
                                }
                            }
                        }
                        let tipsStr = shuju[feisheng_rankFields.tipsStr];
                        str1 = tipsStr;
                    }
                }
                maxMingci = maxMingci ? maxMingci : 0;
                this._biJiaoMC = maxMingci;

                jifenCha = jifenCha < 0 ? 0 : jifenCha;

                str = `您还差<span style='color:#168a17'>${jifenCha}</span>积分超过第<span style='color:#168a17'>${maxMingci}</span>名`;
            }
            return [str, str1];
        }

        //获取活动开启状态
        public get openState(): number {
            return this._openState;
        }

        //获取当前活动类型
        public get curType(): number {
            return this._cuyType;
        }

        //获取活动剩余时间
        public get restTm(): number {
            return this._restTm;
        }

        //获取榜首名字
        public get firstName(): string {
            return this._firstName;
        }

        //获取排行列表
        // rank = 0,			/*排名*/
        // name = 1,			/*角色名*/
        // param = 2,			/*排行参数*/
        // objId = 3,			/*角色id*/
        public get nodeList(): Array<FeishengRankInfo> {
            return this._nodeList;
        }

        public get nodeListByObjId(): Array<FeishengRankInfo> {
            return this._nodeListByObjId;
        }

        //获取标记
        public get endFlag(): number {
            return this._endFlag;
        }

        //当前任务id
        public get taskId(): number {
            return this._taskId;
        }

        //领取状态
        /**
         * 领取状态  0不可领取 1可领取 2 已领取
         */
        public get state(): number {
            return this._state;
        }

        //参数
        public get param(): number {
            return this._param;
        }
    }
}
