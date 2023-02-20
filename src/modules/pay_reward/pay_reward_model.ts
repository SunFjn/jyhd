/** */

///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.pay_reward {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import PayRewardNode = Protocols.PayRewardNode;
    import PayRewardNodeFields = Protocols.PayRewardNodeFields;
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

    export class PayRewardModel {
        private static _instance: PayRewardModel;
        public static get instance(): PayRewardModel {
            return this._instance = this._instance || new PayRewardModel();
        }

        private _rewardCount: int;//剩余抽奖次数
        private _caifu: int; //财富值
        private _rewardList: Array<PayRewardNode>;//财富值奖励列表
        private _noteList: Array<PayRewardNote>;//档次抽奖奖励
        private _PayRewardNoteList: Array<PayRewardNote>; //玩家抽奖记录
        private _result: int; //领取结果 
        private _svrBroadcastList: Array<PayRewardNoteSvr>;  //全服记录
        constructor() {
        }

        /**  剩余抽奖次数 */
        public get rewardCount(): int {
            return this._rewardCount;
        }

        public set rewardCount(value: int) {
            this._rewardCount = value;
        }

        /**  财富值 */
        public get caifu(): int {
            return this._caifu;
        }

        public set caifu(value: int) {
            this._caifu = value;
        }

        /**  财富值奖励列表 */
        public get rewardList(): Array<PayRewardNode> {
            return this._rewardList;
        }

        public set rewardList(value: Array<PayRewardNode>) {
            // value.reverse();
            this._rewardList = value;
        }

        /**  档次抽奖奖励 */
        public get noteList(): Array<PayRewardNote> {
            return this._noteList;
        }

        public set noteList(value: Array<PayRewardNote>) {
            this._noteList = value;
        }

        /**  玩家抽奖记录 */
        public get PayRewardNoteList(): Array<PayRewardNote> {
            return this._PayRewardNoteList;
        }

        public set PayRewardNoteList(value: Array<PayRewardNote>) {
            this._PayRewardNoteList = value;
            if (PayRewardModel.instance.PayRewardNoteList) {
                this._PayRewardNoteList.reverse();
            }
        }

        /**  领取结果 */
        public get result(): int {
            return this._result;
        }

        public set result(value: int) {
            this._result = value;
        }

        /**  玩家抽奖记录 */
        public get svrBroadcastList(): Array<PayRewardNoteSvr> {
            return this._svrBroadcastList;
        }

        public set svrBroadcastList(value: Array<PayRewardNoteSvr>) {
            this._svrBroadcastList = value;
        }

        /**
         * 设置红点
         */
        public setPayRewardRP() {
            let isPayRewardRP = (this._rewardCount > 0 || this.getgRadeRP());
            RedPointCtrl.instance.setRPProperty("payRewardRP", isPayRewardRP);
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


        public UpdatePayRewardInfo() {
            GlobalData.dispatcher.event(CommonEventType.PAYREWARD_UPDATE);
        }

        public PayRewardRunReply() {
            GlobalData.dispatcher.event(CommonEventType.PAYREWARD_RUNREPLY);
        }

        public openMyRecord() {
            GlobalData.dispatcher.event(CommonEventType.PAYREWARD_OPENRECORD);
        }

        public updateSeverList() {
            GlobalData.dispatcher.event(CommonEventType.PAYREWARD_BROADCAST_LIST);
        }
    }
}