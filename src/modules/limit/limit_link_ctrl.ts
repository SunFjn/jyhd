/**
 * 连充活动 - 接口
 */
namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetLimitXunBaoContinuePayInfoReply = Protocols.GetLimitXunBaoContinuePayInfoReply;
    import GetLimitXunBaoContinuePayRewardReply = Protocols.GetLimitXunBaoContinuePayRewardReply;
    import GetLimitXunBaoContinuePayRewardReplyFields = Protocols.GetLimitXunBaoContinuePayRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class LimitLinkCtrl extends BaseCtrl {

        constructor() {
            super();
        }
        private static _instance: LimitLinkCtrl;
        public static get instance(): LimitLinkCtrl {
            return this._instance = this._instance || new LimitLinkCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply, this, this.getInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoContinuePayRewardReply, this, this.gainReply);
            

           this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.getInfo(LimitBigType.year);
            this.getInfo(LimitBigType.fish);
        }

        //获取数据
        public getInfo(bigType: number): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoContinuePayInfo.toString(16)}`,FishLinkModel.instance.atv_type);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoContinuePayInfo, [bigType]);
        }
        //连充 获取数据 返回
        private getInfoReply(tuple: GetLimitXunBaoContinuePayInfoReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply.toString(16)}:tuple`, tuple);
            LimitLinkModel.instance.updateInfo(tuple);
        }


        //领取奖励
        public getContinueReward(bigType: number,grade: number, day: number): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoContinuePayReward.toString(16)}:bigType grade day`, FishLinkModel.instance.atv_type, grade, day);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoContinuePayReward, [bigType, grade, day]);
        }
        //连充 领取奖励 返回
        private gainReply(tuple: GetLimitXunBaoContinuePayRewardReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply.toString(16)}:tuple`, tuple);
            if(tuple[GetLimitXunBaoContinuePayRewardReplyFields.result]){
                CommonUtil.noticeError(tuple[GetLimitXunBaoContinuePayRewardReplyFields.result]);
                return;
            }
            SystemNoticeManager.instance.addNotice("领取成功");
        }
    }

}