///<reference path="../config/limit_reap_cfg.ts"/>

namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetLimitXunBaoCumulativeTaskInfoReply = Protocols.GetLimitXunBaoCumulativeTaskInfoReply;
    import GetLimitXunBaoCumulativeTaskRewardReply = Protocols.GetLimitXunBaoCumulativeTaskRewardReply;
    import GetLimitXunBaoCumulativeTaskRewardReplyFields = Protocols.GetLimitXunBaoCumulativeTaskRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetLimitXunBaoCumulativeTaskReward = Protocols.GetLimitXunBaoCumulativeTaskReward;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import LimitReapCfg = modules.config.LimitReapCfg
    export class LimitReapCtrl extends BaseCtrl {
        private static _instance: LimitReapCtrl;
        public static get instance(): LimitReapCtrl {
            return this._instance = this._instance || new LimitReapCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoCumulativeTaskInfoReply, this, this.GetLimitXunBaoCumulativeTaskInfoReply);
            // Channel.instance.subscribe(SystemClientOpcode.UpdateFishReapInfo, this, this.updateFishReapInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoCumulativeTaskRewardReply, this, this.getLimitReapReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            // 新加活动时这里记得请求初始信息
            this.GetLimitXunBaoCumulativeTaskInfo(LimitBigType.fish,LimitTaskSmallType.null);
            this.GetLimitXunBaoCumulativeTaskInfo(LimitBigType.dishu,LimitTaskSmallType.null);
            this.GetLimitXunBaoCumulativeTaskInfo(LimitBigType.year,LimitTaskSmallType.money);
            this.GetLimitXunBaoCumulativeTaskInfo(LimitBigType.year,LimitTaskSmallType.day);
            this.GetLimitXunBaoCumulativeTaskInfo(LimitBigType.year,LimitTaskSmallType.cjjf);
        }
        //消费赠礼获取数据
        public GetLimitXunBaoCumulativeTaskInfo(bigtype: number,smallType:number): void {

            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoCumulativeTaskInfo.toString(16)}:FishReapModel.instance.atv_type`, bigtype, smallType);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoCumulativeTaskInfo, [bigtype, smallType]);
        }

        //消费赠礼信息返回
        private GetLimitXunBaoCumulativeTaskInfoReply(tuple: GetLimitXunBaoCumulativeTaskInfoReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoCumulativeTaskInfoReply.toString(16)}:tuple`, tuple);
            // console.log('vtz消费赠礼:tuple',tuple);
            LimitReapModel.instance.updateInfo(tuple);
        }

        //消费赠礼领取奖励返回
        private getLimitReapReply(tuple: GetLimitXunBaoCumulativeTaskRewardReply) {
            console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoCumulativeTaskRewardReply.toString(16)}:tuple`, tuple);
            if (!tuple[GetLimitXunBaoCumulativeTaskRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
            else {
                CommonUtil.noticeError(tuple[GetLimitXunBaoCumulativeTaskRewardReplyFields.result]);
            }
        }

        //消费赠礼领取奖励
        public getLimitReap(data: GetLimitXunBaoCumulativeTaskReward): void {
            console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoCumulativeTaskReward.toString(16)}:tuple`, data);

            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoCumulativeTaskReward, data);
        }

    }
}