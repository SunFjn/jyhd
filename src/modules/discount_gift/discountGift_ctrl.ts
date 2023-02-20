/** 特惠礼包ctrl*/

namespace modules.discountGift {

    import BaseCtrl = modules.core.BaseCtrl;
    import VipModel = modules.vip.VipModel;

    /*  import GetDiscountGiftInfoReplyFields=Protocols.GetDiscountGiftInfoFields;
        import GetDiscountGiftInfoReply=Protocols.GetDiscountGiftInfoReply;
        import  UpdateDiscountGiftInfoFields=Protocols.UpdateDiscountGiftInfoFields;
       import UpdateDiscountGiftInfo=Protocols.UpdateDiscountGiftInfo;
       import DiscountGiftBuyReplyFields=Protocols.DiscountGiftBuyReplyFields;
       import DiscountGiftBuyReply=Protocols.DiscountGiftBuyReply;
        import UserFeatureOpcode = Protocols.UserFeatureOpcode;*/

    export class DiscountGiftCtrl extends BaseCtrl {
        private static _instance: DiscountGiftCtrl;
        public static get instance(): DiscountGiftCtrl {
            return this._instance = this._instance || new DiscountGiftCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetDiscountGiftInfoReply, this, this.GetDiscountGiftInfoReply);

            Channel.instance.subscribe(SystemClientOpcode.UpdateDiscountGiftInfo, this, this.UpdateDiscountGiftInfo);

            Channel.instance.subscribe(SystemClientOpcode.DiscountGiftBuyReply, this, this.DiscountGiftBuyReply);
            //this.GetVipInfo();
            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.GetDiscountGiftInfo();
        }

        /*返回数据*/
        private GetDiscountGiftInfoReply(tuple: Protocols.GetDiscountGiftInfoReply) {
            // console.log(" /*更新discontgift数据*/" + tuple);
            discountGiftModel.instance.updateData(tuple);
        }

        /*更新数据*/
        private UpdateDiscountGiftInfo(tuple: Protocols.UpdateDiscountGiftInfo) {
            // console.log(" /*更新discontgift数据*/" + tuple);
            discountGiftModel.instance.updateData(tuple);
        }

        /*购买返回*/
        private DiscountGiftBuyReply(tuple: Protocols.DiscountGiftBuyReply) {
            discountGiftModel.instance.ReceiveResult = tuple[0];

        }

        /**每次打开面板刷新面板数据 0x201266*/
        GetDiscountGiftInfo() {
            Channel.instance.publish(Protocols.UserFeatureOpcode.GetDiscountGiftInfo, null);
        }

        /**购买*/
        public DiscountGiftBuy() {
            Channel.instance.publish(Protocols.UserFeatureOpcode.DiscountGiftBuy, null);
        }

        /**请求当前VIP信息*/
        public GetVipInfo() {
            discountGiftModel.instance.curVip = VipModel.instance.vipLevel;
            discountGiftModel.instance.maxVip = VipModel.instance.maxVipLevel;
        }

    }
}