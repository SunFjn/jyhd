/**庆典探索-控制器*/
namespace modules.ceremony_geocaching {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import CelebrationHuntInfoReply = Protocols.CelebrationHuntInfoReply;
    import CelebrationHuntRunReply = Protocols.CelebrationHuntRunReply;
    import CelebrationHuntRunReplyFields = Protocols.CelebrationHuntRunReplyFields;
    import CelebrationHuntGetScoreRewardReply = Protocols.CelebrationHuntGetScoreRewardReply;
    import CelebrationHuntRankInfoReply = Protocols.CelebrationHuntRankInfoReply;
    import CelebrationHuntRun = Protocols.CelebrationHuntRun;

    export class CeremonyGeocachingCtrl extends BaseCtrl {
        private static _instance: CeremonyGeocachingCtrl;


        public static get instance(): CeremonyGeocachingCtrl {
            return this._instance = this._instance || new CeremonyGeocachingCtrl();
        }
        constructor() {
            super();
        }
        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.CeremonyGeocachingInfoReply, this, this.ceremonyGeocachingInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.CeremonyGeocachingGetAwardReply, this, this.ceremonyGeocachingGetAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.CeremonyGeocachingDoReply, this, this.ceremonyGeocachingDoReply);
            Channel.instance.subscribe(SystemClientOpcode.CeremonyGeocachingGetRankReply, this, this.ceremonyGeocachingGetRankReply);

           this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            // 请求基本数据
            this.getBaseInfo();    
        }

        /*领取积分奖励*/
        public getAward() {
            Channel.instance.publish(UserFeatureOpcode.CeremonyGeocachingGetAwardRequest, null);
        }

        /*获取排行榜*/
        public getRankList() {
            Channel.instance.publish(UserFeatureOpcode.CeremonyGeocachingGetRankRequest, null);
        }

        /*探索*/
        public startGeocaching(data: CelebrationHuntRun) {
            Channel.instance.publish(UserFeatureOpcode.CeremonyGeocachingDoRequest, data);
        }

        /*获取基本数据*/
        public getBaseInfo() {
            Channel.instance.publish(UserFeatureOpcode.CeremonyGeocachingInfoRequest, null);
        }

        /*返回基本数据*/
        private ceremonyGeocachingInfoReply(tuple: CelebrationHuntInfoReply) {
            CeremonyGeocachingModel.instance.setBaseInfo(tuple);
        }

        /*排行榜返回*/
        private ceremonyGeocachingGetRankReply(tuple: CelebrationHuntRankInfoReply) {
            CeremonyGeocachingModel.instance.setRankList(tuple);
        }

        /*获取积分奖励返回*/
        private ceremonyGeocachingGetAwardReply(tuple: CelebrationHuntGetScoreRewardReply) {
            let code: number = tuple[CelebrationHuntRunReplyFields.result];
            CommonUtil.codeDispose(code, `领取成功`);
        }

        /*抽奖返回*/
        private ceremonyGeocachingDoReply(tuple: CelebrationHuntRunReply) {
            let code: number = tuple[CelebrationHuntRunReplyFields.result];
            if (code == 0) {
                WindowManager.instance.open(WindowEnum.OPENSERVICE_CEREMONYGEO_GETED_ALERT, tuple);
            } else {
                CommonUtil.noticeError(code);
            }
        }
    }
}
