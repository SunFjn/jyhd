/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/jz_duobao_weight_cfg.ts"/>
namespace modules.rotary_table_jiuzhou {
    import JzDuobaoWeightCfg = modules.config.JzDuobaoWeightCfg;
    import PayRewardNote = Protocols.PayRewardNote;
    import PayRewardNoteFields = Protocols.PayRewardNoteFields;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_material = Configuration.item_material;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_materialFields = Configuration.item_materialFields;
    import item_equipFields = Configuration.item_equipFields;
    import PayRewardNoteSvr = Protocols.PayRewardNoteSvr;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    /*返回数据*/
    import GetJzduobaoInfoReply = Protocols.GetJzduobaoInfoReply;
    import GetJzduobaoInfoReplyFields = Protocols.GetJzduobaoInfoReplyFields;
    /*更新数据*/
    import UpdateJzduobaoInfo = Protocols.UpdateJzduobaoInfo;
    import UpdateJzduobaoInfoFields = Protocols.UpdateJzduobaoInfoFields;
    import DuobaoRankInfo = Protocols.DuobaoRankInfo;
    import DuobaoRankInfoFields = Protocols.DuobaoRankInfoFields;
    import DuobaoNode = Protocols.DuobaoNode;
    import DuobaoNodeFields = Protocols.DuobaoNodeFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class RotaryTableJiuZhouModel {
        private static _instance: RotaryTableJiuZhouModel;
        public static get instance(): RotaryTableJiuZhouModel {
            return this._instance = this._instance || new RotaryTableJiuZhouModel();
        }
        private _result: int;
        private _openState: int;/*开启状态(0未开启 1开启 2开启后关闭)*/
        private _uiState: int/*界面开启状态(0未开启 1开启)*/
        private _score: int;/*积分*/
        private _restTm: int;/*剩余时间*/
        public _jackPot: int;/*奖池代币券数量*/
        private _rewardList: Array<DuobaoNode>;//积分奖励列表
        private _svrBroadcastList: Array<PayRewardNoteSvr>;  //全服记录
        private _PayRewardNoteList: Array<PayRewardNote>; //玩家抽奖记录
        private _noteList: Array<PayRewardNote>;//档次抽奖奖励
        /*个人 排行列表*/
        public _myNodeList: Array<DuobaoRankInfo>;
        /*个人 排行列表 key为 角色ID*/
        public _myNodeListByObjId: Array<DuobaoRankInfo>;
        /*全服 排行列表*/
        public _quNodeList: Array<DuobaoRankInfo>;
        /*全服 排行列表 key为 区服ID*/
        public _quNodeListByObjId: Array<DuobaoRankInfo>;
        public _nowIndex: int;
        public _tenMoney: int;
        public _oneMoney: int;
        public _totalScore: int;//总积分
        constructor() {
            this._openState = 0;
            this._uiState = 0;
            this._score = 0;
            this._jackPot = 0;
            this._restTm = 0;
            this._totalScore = 0;
            this._rewardList = new Array<DuobaoNode>();
            this._svrBroadcastList = new Array<PayRewardNoteSvr>();
            this._PayRewardNoteList = new Array<PayRewardNote>();
            this._noteList = new Array<PayRewardNote>();
            this._myNodeList = new Array<DuobaoRankInfo>();
            this._myNodeListByObjId = new Array<DuobaoRankInfo>();
            this._quNodeList = new Array<DuobaoRankInfo>();
            this._quNodeListByObjId = new Array<DuobaoRankInfo>();
            this._tenMoney = JzDuobaoWeightCfg.instance.tenMoney;
            this._oneMoney = JzDuobaoWeightCfg.instance.oneMoney;

        }
        public get result(): number {
            return this._result;
        }
        public set result(value: number) {
            this._result = value;
        }
        public get openState(): number {
            return this._openState;
        }
        public get score(): number {
            return this._score;
        }
        public get uiState(): number {
            return this._uiState;
        }
        public get jackPot(): number {
            return this._jackPot;
        }
        //获取活动剩余时间
        public get restTm(): number {
            return this._restTm;
        }
        /**  档次抽奖奖励 */
        public get noteList(): Array<PayRewardNote> {
            return this._noteList;
        }
        public set noteList(value: Array<PayRewardNote>) {
            this._noteList = value;
        }
        /**  全服玩家记录 */
        public get svrBroadcastList(): Array<PayRewardNoteSvr> {
            return this._svrBroadcastList;
        }
        public set svrBroadcastList(value: Array<PayRewardNoteSvr>) {
            this._svrBroadcastList = value;
        }
        /**  玩家抽奖记录 */
        public get PayRewardNoteList(): Array<PayRewardNote> {
            return this._PayRewardNoteList;
        }
        public set PayRewardNoteList(value: Array<PayRewardNote>) {
            this._PayRewardNoteList = value;
            if (this._PayRewardNoteList) {
                this._PayRewardNoteList.reverse();
            }
        }
        /**  积分奖励列表 */
        public get rewardList(): Array<DuobaoNode> {
            return this._rewardList;
        }
        //返回数据
        public getInfo(tuple: GetJzduobaoInfoReply) {
            this._openState = tuple[GetJzduobaoInfoReplyFields.openState];
            this._score = tuple[GetJzduobaoInfoReplyFields.score];
            this._jackPot = tuple[GetJzduobaoInfoReplyFields.jackpot];
            this._restTm = tuple[GetJzduobaoInfoReplyFields.endTm] + GlobalData.serverTime;
            if (tuple[GetJzduobaoInfoReplyFields.rewardList]) {
                this._rewardList = tuple[GetJzduobaoInfoReplyFields.rewardList];
            }
            this._uiState = tuple[GetJzduobaoInfoReplyFields.uiState];
            //根据服务器状态 关闭，开启 活动
            this.setActionOpen();
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE);
            this.setRP();
        }
        //更新数据
        public updateInfo(tuple: UpdateJzduobaoInfo) {
            this._openState = tuple[UpdateJzduobaoInfoFields.openState];
            this._score = tuple[UpdateJzduobaoInfoFields.score];
            this._jackPot = tuple[GetJzduobaoInfoReplyFields.jackpot];
            this._restTm = tuple[UpdateJzduobaoInfoFields.endTm] + GlobalData.serverTime;
            if (tuple[UpdateJzduobaoInfoFields.rewardList]) {
                this._rewardList = tuple[UpdateJzduobaoInfoFields.rewardList];
            }
            this._uiState = tuple[GetJzduobaoInfoReplyFields.uiState];
            //根据服务器状态 关闭，开启 活动
            this.setActionOpen();
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_UPDATE);
            this.setRP();
        }
        /**
         * set
         */
        public setActionOpen() {
            let _uiState = this.uiState == 1 ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.jzduobao, _uiState);
        }
        public getInfoMyNodeList(tuple: Array<DuobaoRankInfo>) {
            let _nodeList = tuple;
            if (_nodeList) {
                this._myNodeList.length = 0;
                this._myNodeListByObjId.length = 0;
                this._myNodeList = new Array<DuobaoRankInfo>();
                this._myNodeListByObjId = new Array<DuobaoRankInfo>();
                for (var index = 0; index < _nodeList.length; index++) {
                    var element: DuobaoRankInfo = _nodeList[index];
                    let rank = element[DuobaoRankInfoFields.rank];
                    let objId = element[DuobaoRankInfoFields.objId];
                    this._myNodeList[rank] = element;
                    this._myNodeListByObjId[objId] = element;
                }
                GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_MYLIST);
            }
        }
        public getInfoQuNodeList(tuple: Array<DuobaoRankInfo>) {
            let _nodeList = tuple;
            if (_nodeList) {
                this._quNodeList.length = 0;
                this._quNodeListByObjId.length = 0;
                this._quNodeList = new Array<DuobaoRankInfo>();
                this._quNodeListByObjId = new Array<DuobaoRankInfo>();
                for (var index = 0; index < _nodeList.length; index++) {
                    var element: DuobaoRankInfo = _nodeList[index];
                    let rank = element[DuobaoRankInfoFields.rank];
                    let pgId = element[DuobaoRankInfoFields.pgId];
                    this._quNodeList[rank] = element;
                    this._quNodeListByObjId[pgId] = element;
                }
                GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_QULIST);
            }
        }
        /**
         * 财气值奖励是否有可领取的
         */
        public getgRadeRP(): boolean {
            if (this.rewardList) {
                for (var index = 0; index < this.rewardList.length; index++) {
                    let element = this.rewardList[index];
                    if (element) {
                        let stateNum = element[DuobaoNodeFields.state];
                        if (stateNum == 1) {//0不可领取1可领取2已领取                
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        public getRewardStart(groad: number): number {
            if (this.rewardList) {
                for (var index = 0; index < this.rewardList.length; index++) {
                    let element = this.rewardList[index];
                    if (element) {
                        let gradeNum = element[DuobaoNodeFields.id];
                        let stateNum = element[DuobaoNodeFields.state];
                        if (groad == gradeNum) {
                            return stateNum;
                        }
                    }
                }
                return 0;
            }
        }
        /**
         *  获取财气值奖励可领取的第一次档次 如果都领取了取最后一个档次
         */
        public getgRade(): [number, number] {
            let allLingQu = false; //用于區別是全部領取了 還是全部都沒有領取
            for (var index = 0; index < this.rewardList.length; index++) {
                let element = this.rewardList[index];
                if (element) {
                    let gradeNum = element[DuobaoNodeFields.id];
                    let stateNum = element[DuobaoNodeFields.state];
                    if (stateNum == 1) {//0不可领取1可领取2已领取                
                        return [gradeNum, stateNum];
                    } else if (stateNum == 2) {
                        allLingQu = true;
                    }
                }
            }
            //全部領取了  或者都不可以领 
            let element = this.rewardList[this.rewardList.length - 1];
            if (allLingQu) {
                for (var index = 0; index < this.rewardList.length; index++) {
                    let element = this.rewardList[index];
                    if (element) {
                        let gradeNum = element[DuobaoNodeFields.id];
                        let stateNum = element[DuobaoNodeFields.state];
                        if (stateNum == 0) {//0不可领取1可领取2已领取                
                            return [gradeNum, stateNum];
                        }
                    }
                }
            } else {
                element = this.rewardList[0];
            }
            if (element) {
                let gradeNum = element[DuobaoNodeFields.id];
                let stateNum = element[DuobaoNodeFields.state];
                return [gradeNum, stateNum];
            }
            return [1, 0];
        }
        /**
         * 获取抽奖返回的数据[itemId, count, index]
         */
        public getNoteList(): Array<any> {
            let ele = new Array<any>();
            for (var index = 0; index < this.noteList.length; index++) {
                var element = this.noteList[index];
                let itemId = element[PayRewardNoteFields.itemId];
                let count = element[PayRewardNoteFields.count];
                let index11 = element[PayRewardNoteFields.index];
                ele.push([itemId, count, index11]);
            }
            return ele;
        }
        /**
         * 筛选出属于特奖和大奖的
         */
        public getNoteListGj(): Array<number> {
            let ele = new Array<any>();
            for (var index = 0; index < this.noteList.length; index++) {
                var element = this.noteList[index];
                let itemId = element[PayRewardNoteFields.itemId];
                let count = element[PayRewardNoteFields.count];
                let index11 = element[PayRewardNoteFields.index];
                // index11 = 1;
                if (index11 == 1 || index11 == 5 || index11 == 8 || index11 == 12) {
                    ele.push(itemId);
                }
            }
            return ele;
        }
        public PayRewardRunReply() {
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_RUNREPLY);
        }
        public openMyRecord() {
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_OPENRECORD);
        }
        public updateSeverList() {
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_JIUZHOU_BROADCAST_LIST);
        }
        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.jzduobao);
            let isHave = this.getgRadeRP();
            // let ingot = PlayerModel.instance.ingot;//玩家代币券
            RedPointCtrl.instance.setRPProperty("rotaryTableJiuZhouRP", ((isHave) && bolll));
        }
    }
}