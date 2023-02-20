/*九霄令控制层*/
namespace modules.jiuxiaoling {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import JiuxiaoOrderInfoReply = Protocols.JiuxiaoOrderInfoReply;
    import JiuxiaoOrderDayTaskReply = Protocols.JiuxiaoOrderDayTaskReply;
    import JiuxiaoOrderSeasonTaskReply = Protocols.JiuxiaoOrderSeasonTaskReply;
    import JiuxiaoOrderGetRewardReply = Protocols.JiuxiaoOrderGetRewardReply;
    import JiuxiaoOrderGetRewardReplyFields = Protocols.JiuxiaoOrderGetRewardReplyFields;
    import JiuxiaoOrderGettTaskRewardReply = Protocols.JiuxiaoOrderGettTaskRewardReply;
    import JiuxiaoOrderBuyLevelReply = Protocols.JiuxiaoOrderBuyLevelReply;
    import JiuxiaoOrderBuyLevelReplyFields = Protocols.JiuxiaoOrderBuyLevelReplyFields;
    import JiuxiaoOrderTakeExpWrapReply = Protocols.JiuxiaoOrderTakeExpWrapReply;
    import JiuxiaoOrderOneTaskReply = Protocols.JiuxiaoOrderOneTaskReply;
    import GetJiuXiaoLingTaskInfo = Protocols.GetJiuXiaoLingTaskInfo;
    import GetJiuXiaoLingTaskExpAward = Protocols.GetJiuXiaoLingTaskExpAward;
    import GetJiuXiaoLingLevelAward = Protocols.GetJiuXiaoLingLevelAward;
    import BuyJiuXiaoLingLevel = Protocols.BuyJiuXiaoLingLevel;
    import GetJiuXiaoLingExtralExpPackage = Protocols.GetJiuXiaoLingExtralExpPackage;
    import JiuxiaoOrderGettTaskRewardReplyFields = Protocols.JiuxiaoOrderGettTaskRewardReplyFields;
    import JiuxiaoOrderTakeExpWrapReplyFields = Protocols.JiuxiaoOrderTakeExpWrapReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class JiuXiaoLingCtrl extends BaseCtrl {
        private static _instance: JiuXiaoLingCtrl;
        public static get instance(): JiuXiaoLingCtrl {
            return this._instance = this._instance || new JiuXiaoLingCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingLevelAwardReply, this, this.jiuXiaolingLevelAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingDailyTaskReply, this, this.jiuXiaolingDailyTaskReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingSeasonTaskReply, this, this.jiuXiaolingSeasonTaskReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingGetAwardReply, this, this.jiuXiaolingGetAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingGetTaskExpReply, this, this.jiuXiaolingGetTaskExpReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingBuyLevelReply, this, this.jiuXiaolingBuyLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingGetExtralExpReply, this, this.jiuXiaolingGetExtralExpReply);
            Channel.instance.subscribe(SystemClientOpcode.JiuXiaolingUpdateTaskReply, this, this.jiuXiaolingUpdateTaskReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.GetLevelAwardAndInfo();
            this.GetTaskList([0]);
            this.GetTaskList([1]); 
        }

        // 获取等级奖励和基础信息请求
        public GetLevelAwardAndInfo() {
            Channel.instance.publish(UserFeatureOpcode.GetJiuXiaoLingAwardInfo, null);
        }

        // 获取任务列表请求
        public GetTaskList(tuple: GetJiuXiaoLingTaskInfo) {
            Channel.instance.publish(UserFeatureOpcode.GetJiuXiaoLingTaskInfo, tuple);
        }

        // 领取等级奖励请求
        public GetLevelAward() {
            Channel.instance.publish(UserFeatureOpcode.GetJiuXiaoLingLevelAward, null);
        }

        // 领取任务经验请求
        public GetTaskExp(tuple: GetJiuXiaoLingTaskExpAward) {
            Channel.instance.publish(UserFeatureOpcode.GetJiuXiaoLingTaskExpAward, tuple);
        }

        // 购买等级请求
        public BuyLevel(tuple: BuyJiuXiaoLingLevel) {
            Channel.instance.publish(UserFeatureOpcode.BuyJiuXiaoLingLevel, tuple);
        }

        // 领取额外经验请求
        public GetExtralExp() {
            Channel.instance.publish(UserFeatureOpcode.GetJiuXiaoLingExtralExpPackage, null);
        }

        // 等级奖励和基础信息返回
        private jiuXiaolingLevelAwardReply(tuple: JiuxiaoOrderInfoReply) {
            JiuXiaoLingModel.instance.jiuxiaoOrderInfoData = tuple;
        }

        // 日常任务返回
        private jiuXiaolingDailyTaskReply(tuple: JiuxiaoOrderDayTaskReply) {
            JiuXiaoLingModel.instance.dailyTaskInfo = tuple;
        }

        // 赛季任务返回
        private jiuXiaolingSeasonTaskReply(tuple: JiuxiaoOrderSeasonTaskReply) {
            JiuXiaoLingModel.instance.seasonTaskInfo = tuple;
        }

        // 领取奖励返回
        private jiuXiaolingGetAwardReply(tuple: JiuxiaoOrderGetRewardReply) {
            let code: number = tuple[JiuxiaoOrderGetRewardReplyFields.result]
            if (code == 0) {
                // SystemNoticeManager.instance.addNotice("领取成功!");
                JiuXiaoLingModel.instance.getedAwardList = tuple[JiuxiaoOrderGetRewardReplyFields.list];
                //打开面板
                WindowManager.instance.open(WindowEnum.JIUXIAOLING_GETED_AWARD_ALERT);
            } else {
                CommonUtil.codeDispose(code, "");
            }
        }

        // 领取任务经验返回
        private jiuXiaolingGetTaskExpReply(tuple: JiuxiaoOrderGettTaskRewardReply) {
            let code: number = tuple[JiuxiaoOrderGettTaskRewardReplyFields.result]
            if (code == 0) {
                SystemNoticeManager.instance.addNotice("领取成功!");
            } else {
                CommonUtil.codeDispose(code, "");
            }
        }

        // 购买等级返回
        private jiuXiaolingBuyLevelReply(tuple: JiuxiaoOrderBuyLevelReply) {
            let code: number = tuple[JiuxiaoOrderBuyLevelReplyFields.result]
            if (code == 0) {
                SystemNoticeManager.instance.addNotice("购买成功!");
                WindowManager.instance.close(WindowEnum.JIUXIAOLING_BUY_LEVEL_ALERT);
            } else {
                CommonUtil.codeDispose(code, "");
            }
        }

        // 领取额外经验包返回
        private jiuXiaolingGetExtralExpReply(tuple: JiuxiaoOrderTakeExpWrapReply) {
            let code: number = tuple[JiuxiaoOrderTakeExpWrapReplyFields.result]
            if (code == 0) {
                SystemNoticeManager.instance.addNotice("领取成功!");
            } else {
                CommonUtil.codeDispose(code, "");
            }
        }

        // 更新任务返回
        private jiuXiaolingUpdateTaskReply(tuple: JiuxiaoOrderOneTaskReply) {

        }

    }
}