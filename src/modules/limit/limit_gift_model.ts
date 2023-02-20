///<reference path="../config/limit_gift_cfg.ts"/>
/**
 * 活动礼包 数据
*/
namespace modules.limit {
    import GetFishGiftInfoReplyFields = Protocols.GetLimitGiftInfoReplyFields;
    import GetLimitXunBaoCashGiftInfoReply = Protocols.GetLimitXunBaoCashGiftInfoReply;
    import GetLimitXunBaoCashGiftInfoReplyFields = Protocols.GetLimitXunBaoCashGiftInfoReplyFields;
    import LimitXunBaoCashGiftReward = Protocols.LimitXunBaoCashGiftReward;
    import LimitXunBaoCashGiftRewardFields = Protocols.LimitXunBaoCashGiftRewardFields;
    import LimitGiftCfg = modules.config.LimitGiftCfg;

    export class LimitGiftModel {
        private static _instance: LimitGiftModel;
        public static get instance(): LimitGiftModel {
            return this._instance = this._instance || new LimitGiftModel();
        }

        private _id_arr: Array<Array<number>>;
        // 活动结束时间
        private _endTime: number[];
        private constructor() {
            this._id_arr = new Array();
            this._awardArr = new Array();
            this._endTime = new Array();

            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._awardArr[LimitBigType.fish] = new Array();
            this._id_arr[LimitBigType.fish] = LimitGiftCfg.instance.giftIdArrByType(LimitBigType.fish);
            this._endTime[LimitBigType.fish] = 0;
            // 地鼠
            this._awardArr[LimitBigType.dishu] = new Array();
            this._id_arr[LimitBigType.dishu] = LimitGiftCfg.instance.giftIdArrByType(LimitBigType.dishu);
            this._endTime[LimitBigType.dishu] = 0;
        }
        private _awardArr: Array<Array<LimitXunBaoCashGiftReward>>;

        public updateInfo(tuple: GetLimitXunBaoCashGiftInfoReply) {
            let bigType: number = tuple[GetLimitXunBaoCashGiftInfoReplyFields.bigType];
            this._endTime[bigType] = tuple[GetLimitXunBaoCashGiftInfoReplyFields.endTime];

            let rlist = tuple[GetLimitXunBaoCashGiftInfoReplyFields.rewardList];
            if (!rlist || !rlist.length) { return; }
            let p_rp = false;
            let g_rp_1 = false;
            let g_rp_2 = false;
            let g_rp_3 = false;
            // console.log('vtz:bigType', bigType);
            // console.log('vtz:rlist', rlist);
            for (let i = 0; i < rlist.length; i++) {
                this._awardArr[bigType][rlist[i][LimitXunBaoCashGiftRewardFields.id]] = rlist[i];
                // 设置红点
                if (rlist[i][LimitXunBaoCashGiftRewardFields.state] == 1) {
                    p_rp = true;
                    switch (i) {
                        case 0:
                            g_rp_1 = true;
                            break;
                        case 1:
                            g_rp_2 = true;
                            break;
                        case 2:
                            g_rp_3 = true;
                            break;
                    }
                }
            }
            redPoint.RedPointCtrl.instance.setRPProperty("fishGiftRP", p_rp);
            redPoint.RedPointCtrl.instance.setRPProperty("fishGiftRP_grade_1", g_rp_1);
            redPoint.RedPointCtrl.instance.setRPProperty("fishGiftRP_grade_2", g_rp_2);
            redPoint.RedPointCtrl.instance.setRPProperty("fishGiftRP_grade_3", g_rp_3);
            GlobalData.dispatcher.event(CommonEventType.LIMIT_GIFT_UPDATE);
        }

        public awardNode(bigType: number): Array<LimitXunBaoCashGiftReward> {
            // console.log('vtz:this._awardArr', this._awardArr);
            return this._awardArr[bigType];
        }

        public getState(bigType: number, gid): number {
            // console.log('vtz:gid', gid);
            // console.log('vtz:this.awardNode[gid]', this.awardNode[gid]);
            if (typeof this.awardNode(bigType)[gid] == "undefined") {
                return 0
            }
            return this.awardNode(bigType)[gid][LimitXunBaoCashGiftRewardFields.state];
        }

        public getUseCount(bigType: number, gid): number {
            if (typeof this.awardNode(bigType)[gid] == "undefined") {
                return 0
            }
            return this.awardNode(bigType)[gid][LimitXunBaoCashGiftRewardFields.useCount];
        }

        public getAwardStateById(bigType: number, id: number): number {
            let tempArr = 0;

            for (let i = 0; i < this.awardNode(bigType)[GetFishGiftInfoReplyFields.rewardList].length; i++) {
                if (id == this.awardNode(bigType)[0][i][LimitXunBaoCashGiftRewardFields.id]) {
                    tempArr = this.awardNode(bigType)[0][i][LimitXunBaoCashGiftRewardFields.state];
                }
            }
            return tempArr;
        }

        // 礼包id
        public giftId(bigType: number, index: number): number {
            return this._id_arr[bigType][index];
        }

        public endTime(bigType: number): number {
            return this._endTime[bigType];
        }


    }
}