/**
 * 钓鱼 请求
*/
namespace modules.fish {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetLimitXunbaoInfoReply = Protocols.GetLimitXunbaoInfoReply;
    import RunLimitXunbaoReply = Protocols.RunLimitXunbaoReply;
    import GetLimitXunbaoServerBroadcastReply = Protocols.GetLimitXunbaoServerBroadcastReply;
    import RunLimitXunbaoReplyFields = Protocols.RunLimitXunbaoReplyFields;
    import GainFishFields = Protocols.GainFishFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class FishCtrl extends BaseCtrl {
        private static _instance: FishCtrl;

        public static get instance(): FishCtrl {
            return this._instance = this._instance || new FishCtrl();
        }

        constructor() {
            super();
        }


        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunbaoInfoReply, this, this.GetFishInfoReply);
            /*领取返回*/
            Channel.instance.subscribe(SystemClientOpcode.RunLimitXunbaoReply, this, this.GainFishReply);
            // Channel.instance.subscribe(SystemClientOpcode.LimitXunbaoRankInfoReply, this, this.LimitXunbaoRankInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunbaoServerBroadcastReply, this, this.GetLimitXunbaoLogReply);

            // for (let i = 1; i < 4; i++) {
            //     this.getLoginInfo(i);
            // }
            // this.GetLimitXunbaoRankInfo();
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            for (let i = 1; i < 4; i++) {
                this.getLoginInfo(i);
            }
            this.getLoginInfo(LimitWeightType.year);
        }

        //获取数据
        public getLoginInfo(i: LimitWeightType): void {
            // console.log('vtz:0x' + UserFeatureOpcode.GetLimitXunbaoInfo.toString(16) + '-获取数据', i);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunbaoInfo, [i]);
        }
        /*返回数据*/
        private GetFishInfoReply(tuple: GetLimitXunbaoInfoReply) {
            // console.log('vtz:0x' + SystemClientOpcode.GetLimitXunbaoInfoReply.toString(16) + '-tuple', tuple);
            FishModel.instance.updateInfo(tuple);
        }



        /*领取奖励*/
        public GainFish(t: LimitWeightType, g: GainFishFields.grade): void {
            // console.log('vtz:0x' + UserFeatureOpcode.RunLimitXunbao.toString(16) + '-t g', t, g);
            Channel.instance.publish(UserFeatureOpcode.RunLimitXunbao, [t, g]);
        }
        /*领取返回*/
        private GainFishReply(tuple: RunLimitXunbaoReply) {
            //console.log('vtz:0x' + SystemClientOpcode.RunLimitXunbaoReply.toString(16) + '-tuple', tuple);
            // console.log('vtz:tuple[GainFishReplyFields.result]',tuple[GainFishReplyFields.result]);
            if (tuple[RunLimitXunbaoReplyFields.result]) {
                CommonUtil.noticeError(tuple[RunLimitXunbaoReplyFields.result]);
                return;
            }
            if(tuple[RunLimitXunbaoReplyFields.type] == LimitWeightType.year){
                SystemNoticeManager.instance.addNotice("探索成功");

            }else{
                SystemNoticeManager.instance.addNotice("钓鱼成功");

            }
            FishModel.instance.updateOneInfo(tuple);
        }

        // 限寻-获取寻宝全服记录
        public GetLimitXunbaoLog(type: LimitWeightType) {
            console.log('vtz:0x' + UserFeatureOpcode.GetLimitXunbaoServerBroadcast.toString(16), type);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunbaoServerBroadcast, [type]);
        }

        // 限寻-获取寻宝全服记录 返回
        public GetLimitXunbaoLogReply(tuple: GetLimitXunbaoServerBroadcastReply) {
            // console.log('vtz:0x' + SystemClientOpcode.GetLimitXunbaoServerBroadcastReply.toString(16) + '-tuple', tuple);
            GlobalData.dispatcher.event(CommonEventType.LIMIT_XUNBAO_LOG, tuple);
        }

    }
}
