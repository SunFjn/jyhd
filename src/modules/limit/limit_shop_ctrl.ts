namespace modules.limit {
    import BaseCtrl = modules.core.BaseCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    import GetLimitXunBaoMallInfoReply = Protocols.GetLimitXunBaoMallInfoReply;
    import BuyLimitXunBaoMallItemReply = Protocols.BuyLimitXunBaoMallItemReply;
    import BuyLimitXunBaoMallItemReplyFields = Protocols.BuyLimitXunBaoMallItemReplyFields;


    export class LimitShopCtrl extends BaseCtrl {
        private static _instance: LimitShopCtrl;
        public static get instance(): LimitShopCtrl {
            return this._instance = this._instance || new LimitShopCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitXunBaoMallInfoReply, this, this.getInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.BuyLimitXunBaoMallItemReply, this, this.getReapReply);

      

        this.requsetAllData();
    }

    /**
     * 向服务器请求数据
    */
    public requsetAllData(): void {
        // 新加活动时这里记得请求初始信息
        this.getInfo(LimitBigType.fish);
        this.getInfo(LimitBigType.year);
    }

        //获取数据
        public getInfo(bigType:number): void {
            // console.log(`vtz:0x${UserFeatureOpcode.GetLimitXunBaoMallInfo.toString(16)}:LimitShopModel.instance.atv_type, 0`, LimitShopModel.instance.atv_type, 0);
            Channel.instance.publish(UserFeatureOpcode.GetLimitXunBaoMallInfo, [bigType]);
        }
        //信息返回
        private getInfoReply(tuple: GetLimitXunBaoMallInfoReply) {
            // console.log(`vtz:0x${SystemClientOpcode.GetLimitXunBaoMallInfoReply.toString(16)}:tuple`, tuple);
            LimitShopModel.instance.updateInfo(tuple);
        }

        //领取奖励
        public getReap(bigType:number, id: number, num: number): void {
            // console.log("🚀 ~ file: limit_shop_ctrl.ts:52 ~ LimitShopCtrl ~ getReap ~ bigType:number, id: number, num: number", bigType, id, num)
            
            // console.log(`vtz:0x${UserFeatureOpcode.BuyLimitXunBaoMallItem.toString(16)}:LimitShopModel.instance.atv_type, id,num`, LimitShopModel.instance.atv_type, id, num);
            Channel.instance.publish(UserFeatureOpcode.BuyLimitXunBaoMallItem, [bigType, id, num]);
        }
        //获取奖励返回
        private getReapReply(tuple: BuyLimitXunBaoMallItemReply) {
            // console.log(`vtz:0x${SystemClientOpcode.BuyLimitXunBaoMallItemReply.toString(16)}:tuple`, tuple);
            if (!tuple[BuyLimitXunBaoMallItemReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("购买成功");
            } else {
                CommonUtil.noticeError(tuple[BuyLimitXunBaoMallItemReplyFields.result]);
            }
        }
    }
}