//每日累充
namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetLimitXunBaoDaySinglePayInfoReply = Protocols.GetLimitXunBaoDaySinglePayInfoReply;
     import GetLimitXunBaoDaySinglePayRewardReplyFields =Protocols.GetLimitXunBaoDaySinglePayRewardReplyFields
    import GetLimitXunBaoDaySinglePayRewardReply = Protocols.GetLimitXunBaoDaySinglePayRewardReply;
    import GetLimitXunBaoDaySinglePayReward = Protocols.GetLimitXunBaoDaySinglePayReward;
    
    export class LimitDaySingleCtrl extends BaseCtrl {
        public static _instance: LimitDaySingleCtrl;
        public static get instance(): LimitDaySingleCtrl {
            return this._instance = this._instance || new LimitDaySingleCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoDaySinglePayInfoReply, this, this.GetLimitXunBaoDaySinglePayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoDaySinglePayRewardReply, this, this.GetLimitXunBaoDaySinglePayRewardReply);

           this.requsetAllData()
        }
        
        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.getLimitDaySingleInfo(LimitBigType.dishu)
            this.getLimitDaySingleInfo(LimitBigType.fish)
            this.getLimitDaySingleInfo(LimitBigType.year)
        }
        constructor() {
            super();

        }

        //获取数据
        public getLimitDaySingleInfo(bigtype:number): void {
            // console.log("------------------------getSinglepay2Info")
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoDaySinglePayInfo.toString(16)}`, bigtype);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoDaySinglePayInfo, [bigtype]);
        }

        //累充豪礼信息返回
        private GetLimitXunBaoDaySinglePayInfoReply(tuple: GetLimitXunBaoDaySinglePayInfoReply) {
            // console.log("------------------------getSinglepay2InfoReply",tuple)
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoDaySinglePayInfoReply.toString(16)}:tuple`, tuple);
            LimitDaySingleModel.instance.updateInfo(tuple);
        }

        //获取奖励返回
        private GetLimitXunBaoDaySinglePayRewardReply(tuple: GetLimitXunBaoDaySinglePayRewardReply) {
            //console.log("------------------------getSinglepay2RewardReply",tuple)
            if (!tuple[GetLimitXunBaoDaySinglePayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public GetLimitXunBaoDaySinglePayReward(tuple: GetLimitXunBaoDaySinglePayReward): void {
            //console.log("------------------------getSinglepay2Reward",tuple)
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoDaySinglePayReward,tuple);
        }


    }
}