namespace modules.limit_pack {
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetLimitPackInfoReply = Protocols.GetLimitPackInfoReply;
    import GetLimitPackInfoReplyFields = Protocols.GetLimitPackInfoReplyFields;
    import BuyLimitPackReply = Protocols.BuyLimitPackReply;
    import BuyLimitPackReplyFields = Protocols.BuyLimitPackReplyFields;
    import BuyLimitPack = Protocols.BuyLimitPack;
    import BuyLimitPackFields = Protocols.BuyLimitPackFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class LimitPackCtrl extends core.BaseCtrl {
        private static _instance: LimitPackCtrl
        public static get instance(): LimitPackCtrl {
            return this._instance = this._instance || new LimitPackCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetLimitPackInfoReply, this, this.getLimitPackInfoReply);     //礼包信息返回
            Channel.instance.subscribe(SystemClientOpcode.BuyLimitPackReply, this, this.buyLimitPackReply);     //购买信息返回
            this.requsetAllData();
        }
        public requsetAllData() {
            this.getLimitPackInfo();
        }

        //礼包信息返回
        private getLimitPackInfoReply(value: GetLimitPackInfoReply): void {
            // console.log("礼包信息返回: ",value);
            LimitPackModel.instance.getLimitPackInfoReply(value);
        }

        //购买信息返回
        private buyLimitPackReply(value: BuyLimitPackReply): void {
            // console.log("购买信息返回 ",value[0]);
            //LimitPackModel.instance.buyReply();
            if (value[BuyLimitPackReplyFields.result] == 12012) {
                CommonUtil.goldNotEnoughAlert(Laya.Handler.create(this, () => {
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                    WindowManager.instance.close(WindowEnum.LIMIT_PACK_ALERT);
                }));
            }
            else if (value[BuyLimitPackReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("购买成功", false);      //系统提示
            }
            LimitPackModel.instance.isBuyReply = false;
        }

        //获取礼包信息
        public getLimitPackInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetLimitPackInfo, null);
        }

        //购买礼包
        public buyLimitPack(value: BuyLimitPack): void {
            Channel.instance.publish(UserFeatureOpcode.BuyLimitPack, value);
            LimitPackModel.instance.isBuyReply = true;
        }
    }
}