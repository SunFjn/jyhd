
/**
 * 活动礼包 请求
*/
namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetLimitXunBaoCashGiftInfoReply = Protocols.GetLimitXunBaoCashGiftInfoReply;
    import GetLimitXunBaoCashGiftRewardReply = Protocols.GetLimitXunBaoCashGiftRewardReply;
    import GetLimitXunBaoCashGiftRewardReplyFields = Protocols.GetLimitXunBaoCashGiftRewardReplyFields;



    export class LimitGiftCtrl extends BaseCtrl {
        private static _instance: LimitGiftCtrl;

        public static get instance(): LimitGiftCtrl {
            return this._instance = this._instance || new LimitGiftCtrl();
        }
        constructor() {
            super();
        }
        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoCashGiftInfoReply, this, this.GetLimitXunBaoCashGiftInfoReply);
            /*领取返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoCashGiftRewardReply, this, this.GetLimitXunBaoCashGiftRewardReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.getLoginRewad(LimitBigType.fish);
        }

        //获取数据
        public getLoginRewad(bigType: number): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoCashGiftInfo.toString(16)}`, FishLinkModel.instance.atv_type);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoCashGiftInfo, [bigType]);
        }
        /*返回数据*/
        private GetLimitXunBaoCashGiftInfoReply(tuple: GetLimitXunBaoCashGiftInfoReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoCashGiftInfoReply.toString(16)}:tuple`, tuple);
            LimitGiftModel.instance.updateInfo(tuple);
        }


        /*领取奖励*/
        public getLoginRewardReward(bigType: number, itemId: number): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoCashGiftReward.toString(16)}:itemId`, itemId);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoCashGiftReward, [bigType, itemId]);
        }
        /*领取返回*/
        private GetLimitXunBaoCashGiftRewardReply(tuple: GetLimitXunBaoCashGiftRewardReply) {
            if (tuple[GetLimitXunBaoCashGiftRewardReplyFields.result]) {
                CommonUtil.noticeError(tuple[GetLimitXunBaoCashGiftRewardReplyFields.result]);
                return;
            }
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoCashGiftRewardReply.toString(16)}:tuple`, tuple);
            CommonUtil.noticeError(tuple[GetLimitXunBaoCashGiftRewardReplyFields.result]);
        }
    }
}