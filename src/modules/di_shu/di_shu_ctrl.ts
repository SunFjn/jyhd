/**
 * 地鼠 请求
*/
namespace modules.dishu {
    import BaseCtrl = modules.core.BaseCtrl;
    import AutoSC_DiShuData = Protocols.AutoSC_DiShuData;
    import AutoSC_DiShuOpen = Protocols.AutoSC_DiShuOpen;
    import AutoSC_DiShuUltimateAwdRet = Protocols.AutoSC_DiShuUltimateAwdRet;
    import AutoSC_DiShuRowAwdRet = Protocols.AutoSC_DiShuRowAwdRet;
    import AutoSC_DiShuRankRet = Protocols.AutoSC_DiShuRankRet;
    import AutoSC_DiShuOpenFields = Protocols.AutoSC_DiShuOpenFields;
    import AutoUF_DiShuTaskAwd = Protocols.AutoUF_DiShuTaskAwd;
    import AutoUF_DiShuUltimateAwd = Protocols.AutoUF_DiShuUltimateAwd;
    import AutoUF_SelectUltimate = Protocols.AutoUF_SelectUltimate;
    import AutoSC_GetTaskAwd = Protocols.AutoSC_GetTaskAwd;
    import AutoSC_GetTaskAwdFields = Protocols.AutoSC_GetTaskAwdFields;
    import AutoSC_SelectUltimateRet = Protocols.AutoSC_SelectUltimateRet;
    import AutoSC_SelectUltimateRetFields = Protocols.AutoSC_SelectUltimateRetFields;
    import AutoSC_DiShuRowAwdRetFields = Protocols.AutoSC_DiShuRowAwdRetFields;
    import AutoUF_DiShuOpenAll = Protocols.AutoUF_DiShuOpenAll;
    import GetLimitXunBaoContinuePayRewardReply = Protocols.GetLimitXunBaoContinuePayRewardReply;
    import GetLimitXunBaoContinuePayRewardReplyFields = Protocols.GetLimitXunBaoContinuePayRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetLimitXunBaoContinuePayInfoReply = Protocols.GetLimitXunBaoContinuePayInfoReply;

    export class DishuCtrl extends BaseCtrl {
        private static _instance: DishuCtrl;

        public static get instance(): DishuCtrl {
            return this._instance = this._instance || new DishuCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_DiShuData, this, this.GetInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_DiShuOpen, this, this.OpenReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_DiShuRowAwdRet, this, this.GainRankReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_DiShuUltimateAwdRet, this, this.GainBigReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_DiShuRankRet, this, this.RankReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_SelectUltimateRet, this, this.selectUltimateReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_GetTaskAwd, this, this.GainTaskPrizeReply);

            /* 连充 */
            // Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply, this, this.getAddInfoReply);
            // Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoContinuePayRewardReply, this, this.gainAddReply);

            
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getLoginInfo();


            // this.getAddInfo();
        }

        // 获取地鼠活动配置
        public getLoginInfo(): void {
            // console.log('vtz:0x' + UserFeatureOpcode.AutoUF_DiShuGetdata.toString(16));
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuGetdata, []);
        }
        // 地鼠活动数据返回
        private GetInfoReply(tuple: AutoSC_DiShuData) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_DiShuData.toString(16) + '-tuple', tuple);
            DishuModel.instance.GetInfoReply(tuple);
        }

        // 获取地鼠活动配置
        public getRankInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.AutoUC_GetDiShuRank, []);
        }
        // 排行榜数据返回
        private RankReply(tuple: AutoSC_DiShuRankRet) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_DiShuRankRet.toString(16) + '-tuple', tuple);
            DishuModel.instance.RankReply(tuple[0]);
        }

        // 领取任务奖励
        public GainTaskPrize(rowLine: AutoUF_DiShuTaskAwd) {
            // console.log('vtz:0x' + UserFeatureOpcode.AutoUF_DiShuTaskAwd.toString(16), rowLine);
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuTaskAwd, rowLine);
        }
        // 领取任务奖励返回
        public GainTaskPrizeReply(tuple: AutoSC_GetTaskAwd) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_GetTaskAwd.toString(16) + '-tuple', tuple);
            if (tuple[AutoSC_GetTaskAwdFields.ErrorCode]) {
                CommonUtil.noticeError(tuple[0]);
                return;
            }
            DishuModel.instance.updateTaskList(tuple[AutoSC_GetTaskAwdFields.data]);
        }

        // 选择终极奖励
        public selectUltimate(data: AutoUF_SelectUltimate): void {
            Channel.instance.publish(UserFeatureOpcode.AutoUF_SelectUltimate, data);
        }
        // 选择终极奖励返回
        private selectUltimateReply(tuple: AutoSC_SelectUltimateRet) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_SelectUltimateRet.toString(16) + '-tuple', tuple);
            if (tuple[AutoSC_SelectUltimateRetFields.ErrorCode]) {
                CommonUtil.noticeError(tuple[AutoSC_DiShuOpenFields.ErrorCode]);
                return;
            }
            GlobalData.dispatcher.event(CommonEventType.DISHU_ULTIMATE_UPDATE, [tuple[AutoSC_SelectUltimateRetFields.index]]);
        }

        // 打地鼠
        public getDishuInfo(x: number, y: number): void {
            // console.log("getDishuInfo", x, y);
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuOpen, [x, y]);
        }
        // 打地鼠返回
        private OpenReply(tuple: AutoSC_DiShuOpen) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_DiShuOpen.toString(16) + '-tuple', tuple);
            if (tuple[AutoSC_DiShuOpenFields.ErrorCode]) {
                CommonUtil.noticeError(tuple[AutoSC_DiShuOpenFields.ErrorCode]);
                return;
            }
            GlobalData.dispatcher.event(CommonEventType.DISHU_CKICK_UPDATE, [tuple[AutoSC_DiShuOpenFields.Open]]);
        }

        // 领取行奖励
        public GainRank(rowLine: number) {
            // console.log('vtz:0x' + UserFeatureOpcode.AutoUF_DiShuRowAwd.toString(16), rowLine);
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuRowAwd, [rowLine]);
        }
        // 领取行奖励返回
        public GainRankReply(tuple: AutoSC_DiShuRowAwdRet) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_DiShuRowAwdRet.toString(16) + '-tuple', tuple);
            if (tuple[AutoSC_DiShuRowAwdRetFields.ErrorCode]) {
                CommonUtil.noticeError(tuple[0]);
                return;
            }
            GlobalData.dispatcher.event(CommonEventType.DISHU_ROWPRIZE_UPDATE, [tuple[AutoSC_DiShuRowAwdRetFields.rowLine]]);
        }

        // 领取最终奖励
        public GainBig() {
            // console.log('vtz:0x' + UserFeatureOpcode.AutoUF_DiShuUltimateAwd.toString(16));
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuUltimateAwd, []);
        }
        // 领取终极奖励返回
        private GainBigReply(tuple: AutoSC_DiShuUltimateAwdRet) {
            // console.log('vtz:0x' + SystemClientOpcode.AutoSC_DiShuUltimateAwdRet.toString(16) + '-tuple', tuple);
            if (tuple[0]) {
                CommonUtil.noticeError(tuple[0]);
                return;
            }
            GlobalData.dispatcher.event(CommonEventType.DISHU_BIGPRIZE_UPDATE);
        }

        // 一键砸地鼠AutoUF_DiShuOpenAll
        public DiShuOpenAll() {
            // console.log('vtz:0x' + UserFeatureOpcode.AutoUF_DiShuOpenAll.toString(16));
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuOpenAll, []);
        }

        // 领取行奖励 AutoUF_DiShuTaskAwd
        public GainTaskAwd(tuple: AutoUF_DiShuTaskAwd) {
            // console.log('vtz:0x' + UserFeatureOpcode.AutoUF_DiShuTaskAwd.toString(16));
            Channel.instance.publish(UserFeatureOpcode.AutoUF_DiShuTaskAwd, tuple);
        }



        /* 连充 */
        //领取奖励
        public getContinueReward(grade: number, day: number): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoContinuePayReward.toString(16)}:bigType grade day`, FishLinkModel.instance.atv_type, grade, day);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoContinuePayReward, [DishuModel.instance.atv_type, grade, day]);
        }
        //连充 领取奖励 返回
        private gainAddReply(tuple: GetLimitXunBaoContinuePayRewardReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply.toString(16)}:tuple`, tuple);
            if (tuple[GetLimitXunBaoContinuePayRewardReplyFields.result]) {
                CommonUtil.noticeError(tuple[GetLimitXunBaoContinuePayRewardReplyFields.result]);
                return;
            }
            SystemNoticeManager.instance.addNotice("领取成功");
        }

        //获取数据
        // public getAddInfo(): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoContinuePayInfo.toString(16)}`,FishLinkModel.instance.atv_type);
        //     Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoContinuePayInfo, [DishuModel.instance.atv_type]);
        // }
        //连充 获取数据 返回
        // private getAddInfoReply(tuple: GetLimitXunBaoContinuePayInfoReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply.toString(16)}:tuple`, tuple);
        //     DishuModel.instance.updateInfo(tuple);
        // }
    }
}
