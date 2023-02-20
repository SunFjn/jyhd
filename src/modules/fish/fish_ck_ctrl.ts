///<reference path="../treasure/treasure_model.ts"/>
/**庆典兑换-控制器*/
namespace modules.fish {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import LimitXunBaoExchangeListReply = Protocols.LimitXunBaoExchangeListReply;
    import LimitXunBaoExchangeReply = Protocols.LimitXunBaoExchangeReply;
    import GetLimitXunBaoHintReply = Protocols.GetLimitXunBaoHintReply;
    import LimitXunBaoExchangeReplyFields = Protocols.LimitXunBaoExchangeReplyFields;

    export class FishCKCtrl extends BaseCtrl {
        private static _instance: FishCKCtrl;


        public static get instance(): FishCKCtrl {
            return this._instance = this._instance || new FishCKCtrl();
        }
        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.LimitXunBaoExchangeListReply, this, this.getCashInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.LimitXunBaoExchangeReply, this, this.gainReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoHintReply, this, this.getCashRemindReply);
            // GetXunBaoListReply - LimitXunBaoExchangeListReply
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getCashInfo(LimitBigType.fish);
            this.getCashInfo(LimitBigType.year);
            this.getCashRemind(LimitBigType.year);
        }

        /*获取数据*/
        public getCashInfo(bigtype: LimitBigType) {
            // console.log(`vtz:0x${UserFeatureOpcode.LimitXunBaoExchangeList.toString(16)}:[type]`, [bigtype]);
            Channel.instance.publish(UserFeatureOpcode.LimitXunBaoExchangeList, [bigtype]);
            // Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeList, [6]);
            // XunBaoExchangeList - LimitXunBaoExchangeList
        }

        /*获取数据返回*/
        public getCashInfoReply(tuple: LimitXunBaoExchangeListReply) {
            // console.log(`vtz:0x${SystemClientOpcode.LimitXunBaoExchangeListReply.toString(16)}:tuple`, tuple);
            // console.log('vtz:tuple', tuple);
            FishCKModel.instance.setXunbaoInfo(tuple);
            // XunBaoExchangeListReply - LimitXunBaoExchangeListReply
        }

        /*设置兑换提醒*/
        public DhHint(bigtype: LimitBigType, hintList: number[], type: number) {
            // console.log(`vtz:0x${UserFeatureOpcode.SetLimitXunBaoExchangeHint.toString(16)}:[bigtype, hintList, type]`, [bigtype, hintList, type]);
            Channel.instance.publish(UserFeatureOpcode.SetLimitXunBaoExchangeHint, [bigtype, hintList, type]);
        }

        /*获取兑换提醒*/
        public getCashRemind(bigtype: LimitBigType) {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoHint.toString(16)}:`, bigtype);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoHint, [bigtype]);
        }

        /*获取兑换提醒返回*/
        public getCashRemindReply(tuple: GetLimitXunBaoHintReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoHintReply.toString(16)}:tuple`, tuple);
            FishCKModel.instance.setHintList(tuple);
        }

        /*兑换请求*/
        public cashRequest(bigtype: LimitBigType, id: number, num: number) {
            console.log(`vtz:0x${UserFeatureOpcode.LimitXunBaoExchange.toString(16)}:[bigtype, id, num]`, [bigtype, id, num]);
            Channel.instance.publish(UserFeatureOpcode.LimitXunBaoExchange, [bigtype, id, num]);
            // Channel.instance.publish(UserFeatureOpcode.XunBaoExchange, [6, id, num]);
            // XunBaoExchange - LimitXunBaoExchange
        }

        /*兑换返回*/
        public gainReply(tuple: LimitXunBaoExchangeReply) {
            console.log(`vtz:0x${SystemClientOpcode.LimitXunBaoExchangeReply.toString(16)}:tuple`, tuple);
            if (tuple[LimitXunBaoExchangeReplyFields.result]) {
                CommonUtil.noticeError(tuple[LimitXunBaoExchangeReplyFields.result]);
                return;
            }
            this.getCashInfo(tuple[LimitXunBaoExchangeReplyFields.bugType]);
        }
    }
}
