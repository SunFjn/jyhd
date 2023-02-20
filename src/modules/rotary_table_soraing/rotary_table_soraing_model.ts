/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/duobao_reward_cfg.ts"/>
///<reference path="../config/duobao_weight_cfg.ts"/>
namespace modules.rotary_table_soraing {
    import DuobaoWeightCfg = modules.config.DuobaoWeightCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
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
    import GetDuobaoInfoReply = Protocols.GetDuobaoInfoReply;
    import GetDuobaoInfoReplyFields = Protocols.GetDuobaoInfoReplyFields;
    /*更新数据*/
    import UpdateDuobaoInfo = Protocols.UpdateDuobaoInfo;
    import UpdateDuobaoInfoFields = Protocols.UpdateDuobaoInfoFields;
    // /*返回个人排名*/
    // import GetDuobaoRankCharInfoReply = Protocols.GetDuobaoRankCharInfoReply;
    // import GetDuobaoRankCharInfoReplyFields = Protocols.GetDuobaoRankCharInfoReplyFields;
    // /*返回区服排名*/
    // import GetDuobaoRankServerInfoReply = Protocols.GetDuobaoRankServerInfoReply;
    // import GetDuobaoRankServerInfoReplyFields = Protocols.GetDuobaoRankServerInfoReplyFields;
    import DuobaoRankInfo = Protocols.DuobaoRankInfo;
    import DuobaoRankInfoFields = Protocols.DuobaoRankInfoFields;
    import PayRewardNode = Protocols.PayRewardNode;
    import PayRewardNodeFields = Protocols.PayRewardNodeFields;
    export class RotaryTableSoaringModel {
        private static _instance: RotaryTableSoaringModel;
        public static get instance(): RotaryTableSoaringModel {
            return this._instance = this._instance || new RotaryTableSoaringModel();
        }
        private _result: int;
        private _openState: int;/*开启状态(0未开启 1开启 2开启后关闭)*/
        private _type: int;/*榜类型*/
        private _param: int;/*参数*/
        private _score: int;/*积分*/
        private _restTm: int;/*剩余时间*/
        private _rewardList: Array<PayRewardNode>;//积分奖励列表
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
            this._type = 0;
            this._param = 1;
            this._score = 0;
            this._restTm = 0;
                this._totalScore=0;
            this._rewardList = new Array<PayRewardNode>();
            this._svrBroadcastList = new Array<PayRewardNoteSvr>();
            this._PayRewardNoteList = new Array<PayRewardNote>();
            this._noteList = new Array<PayRewardNote>();
            this._myNodeList = new Array<DuobaoRankInfo>();
            this._myNodeListByObjId = new Array<DuobaoRankInfo>();
            this._quNodeList = new Array<DuobaoRankInfo>();
            this._quNodeListByObjId = new Array<DuobaoRankInfo>();
            this._tenMoney = DuobaoWeightCfg.instance.tenMoney;
            this._oneMoney = DuobaoWeightCfg.instance.oneMoney;
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
        public get type(): number {
            return this._type;
        }
        public get param(): number {
            return this._param;
        }
        public get score(): number {
            return this._score;
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
        public get rewardList(): Array<PayRewardNode> {
            return this._rewardList;
        }
        //返回数据
        public getInfo(tuple: GetDuobaoInfoReply) {
            this._openState = tuple[GetDuobaoInfoReplyFields.openState];
            this._type = tuple[GetDuobaoInfoReplyFields.type];
            this._param = tuple[GetDuobaoInfoReplyFields.param];
            this._score = tuple[GetDuobaoInfoReplyFields.score];
            this._restTm = tuple[GetDuobaoInfoReplyFields.endTm] + GlobalData.serverTime;
            // console.log("this._restTm : " + this._restTm);
            this._rewardList = tuple[GetDuobaoInfoReplyFields.rewardList];
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_UPDATE);
            this.setRP();
        }
        //更新数据
        public updateInfo(tuple: UpdateDuobaoInfo) {
            this._openState = tuple[UpdateDuobaoInfoFields.openState];
            this._type = tuple[UpdateDuobaoInfoFields.type];
            this._param = tuple[UpdateDuobaoInfoFields.param];
            this._score = tuple[UpdateDuobaoInfoFields.score];
            this._restTm = tuple[UpdateDuobaoInfoFields.endTm] + GlobalData.serverTime;
            this._rewardList = tuple[UpdateDuobaoInfoFields.rewardList];
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_UPDATE);
            this.setRP();
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
                GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_MYLIST);
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
                GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_QULIST);
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
                        let gradeNum = element[PayRewardNodeFields.grade];
                        let stateNum = element[PayRewardNodeFields.state];
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
                        let gradeNum = element[PayRewardNodeFields.grade];
                        let stateNum = element[PayRewardNodeFields.state];
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
                    let gradeNum = element[PayRewardNodeFields.grade];
                    let stateNum = element[PayRewardNodeFields.state];
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
                        let gradeNum = element[PayRewardNodeFields.grade];
                        let stateNum = element[PayRewardNodeFields.state];
                        if (stateNum == 0) {//0不可领取1可领取2已领取                
                            return [gradeNum, stateNum];
                        }
                    }
                }
            } else {
                element = this.rewardList[0];
            }
            if (element) {
                let gradeNum = element[PayRewardNodeFields.grade];
                let stateNum = element[PayRewardNodeFields.state];
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
                if (index11 == 1 || index11 == 7) {
                    ele.push(itemId);
                }
            }
            return ele;
        }
        public PayRewardRunReply() {
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_RUNREPLY);
        }
        public openMyRecord() {
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_OPENRECORD);
        }
        public updateSeverList() {
            GlobalData.dispatcher.event(CommonEventType.ROTARYTABLE_SOARING_BROADCAST_LIST);
        }
        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.duobao);
            let isHave = this.getgRadeRP();
            // let ingot = PlayerModel.instance.ingot;//玩家代币券
            RedPointCtrl.instance.setRPProperty("rotaryTableSoaringRP", ((isHave) && bolll));
        }
    }
}