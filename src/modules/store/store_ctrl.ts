namespace modules.store {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetMallInfoReply = Protocols.GetMallInfoReply;
    import UpdateMallInfo = Protocols.UpdateMallInfo;
    import BuyMallItemReply = Protocols.BuyMallItemReply;
    import GetMallInfoReplyFields = Protocols.GetMallInfoReplyFields;
    import LogUtils = game.misc.LogUtils;
    import UpdateMallInfoFields = Protocols.UpdateMallInfoFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import CommonUtil = modules.common.CommonUtil;




    import GetXianFuMall2InfoReply = Protocols.GetXianFuMall2InfoReply;
    import GetXianFuMall2InfoReplyFields = Protocols.GetXianFuMall2InfoReplyFields;
    import BuyXianFuMall2GoodsReply = Protocols.BuyXianFuMall2GoodsReply;
    import BuyXianFuMall2GoodsReplyFields = Protocols.BuyXianFuMall2GoodsReplyFields;
    import F5XianFuMall2Reply = Protocols.F5XianFuMall2Reply;
    import F5XianFuMall2ReplyFields = Protocols.F5XianFuMall2ReplyFields;
    export class StoreCtrl extends BaseCtrl {
        private static _instance: StoreCtrl;
        public static get instance(): StoreCtrl {
            return this._instance = this._instance || new StoreCtrl();
        }

        public setup() {
            // Channel.instance.publish(UserFeatureOpcode.GetXunbaoInfo,[0]);
            Channel.instance.subscribe(SystemClientOpcode.GetMallInfoReply, this, this.GetMallInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateMallInfo, this, this.UpdateMallInfo);
            Channel.instance.subscribe(SystemClientOpcode.BuyMallItemReply, this, this.BuyMallItemReply);

            Channel.instance.subscribe(SystemClientOpcode.GetXianFuMall2InfoReply, this, this.GetXianFuMall2InfoReply);
            Channel.instance.subscribe(SystemClientOpcode.BuyXianFuMall2GoodsReply, this, this.BuyXianFuMall2GoodsReply);
            Channel.instance.subscribe(SystemClientOpcode.F5XianFuMall2Reply, this, this.F5XianFuMall2Reply);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            LogUtils.enable(LogFlags.Store);
            this.GetYuGeInfo();
            Channel.instance.publish(UserFeatureOpcode.GetMallInfo, null);
        }

        private GetMallInfoReply(tuple: GetMallInfoReply): void {
            StoreModel.instance.GetMallInfo = tuple[GetMallInfoReplyFields.nodeList];
            // LogUtils.info(LogFlags.Store,`获取------------${tuple}`);

        }

        private UpdateMallInfo(tuple: UpdateMallInfo): void {
            StoreModel.instance.UpdateMallInfo = tuple[UpdateMallInfoFields.nodeList];
            // LogUtils.info(LogFlags.Store,`更新------------${tuple}`);
        }

        private BuyMallItemReply(tuple: BuyMallItemReply): void {
            // LogUtils.info(LogFlags.Store,`购买返回------------${tuple}`);
            StoreModel.instance.PurchaseReply = tuple;
            if (tuple[BuyMallItemReplyFields.result] == 12012) {
                CommonUtil.goldNotEnoughAlert();
            }
            else if (tuple[BuyMallItemReplyFields.result] == 12015) {
                CommonUtil.xianyuTips();
            }
            else {
                CommonUtil.noticeError(tuple[BuyMallItemReplyFields.result]);
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }


        /*获取仙府-家园商店信息*/
        public GetYuGeInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetXianFuMall2Info, null);
        }
        /*goumai*/
        public BuyYuGeGoods(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.BuyXianFuMall2Goods, [id]);
        }
        /*刷新仙府-家园商店*/
        public F5YuGe(): void {
            Channel.instance.publish(UserFeatureOpcode.F5XianFuMall2, null);
            //    console.log("刷新仙府-家园商店...............:   ");
        }

        public GetXianFuMall2InfoReply(tuple: GetXianFuMall2InfoReply): void {
            // console.log("仙府-家园商店信息返回...............:   ", tuple);
            StoreModel.instance.idList = tuple[GetXianFuMall2InfoReplyFields.idList];
            StoreModel.instance.f5Time = tuple[GetXianFuMall2InfoReplyFields.f5Time];
            GlobalData.dispatcher.event(CommonEventType.STORE_XIANFU_UPDATE);
            // StoreModel.instance.setRP();
        }
        public BuyXianFuMall2GoodsReply(tuple: BuyXianFuMall2GoodsReply): void {
            // console.log("购买仙府-家园商店商品返回...............:   ", tuple);
            let code: number = tuple[BuyXianFuMall2GoodsReplyFields.result];
            CommonUtil.codeDispose(code, `购买成功`);
        }
        public F5XianFuMall2Reply(tuple: F5XianFuMall2Reply): void {
            // console.log("刷新仙府-家园商店返回...............:   ", tuple);
            let code: number = tuple[F5XianFuMall2ReplyFields.result];
            CommonUtil.codeDispose(code, `刷新成功`);
        }
    }
}