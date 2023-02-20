/////<reference path="../$.ts"/>
/**
 * 特惠礼包 （封神榜）
 */
namespace modules.soaring_specialGift {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BuyDiscountGiftFSReplyFields = Protocols.BuyDiscountGiftFSReplyFields;

    export class SoaringSpecialGiftCtrl extends BaseCtrl {
        private static _instance: SoaringSpecialGiftCtrl;
        public static get instance(): SoaringSpecialGiftCtrl {
            return this._instance = this._instance || new SoaringSpecialGiftCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetDiscountGiftFSInfoReply, this, this.GetDiscountGiftFSInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateDiscountGiftFSInfo, this, this.UpdateDiscountGiftFSInfo);
            Channel.instance.subscribe(SystemClientOpcode.BuyDiscountGiftFSReply, this, this.BuyDiscountGiftFSReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetDiscountGiftFSInfo();
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.discountGiftFS) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.discountGiftFS)) {
                        //SoaringSpecialGiftModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public BuyDiscountGiftFS(id: number): void {
            // console.log(" 特惠礼包 （封神榜） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.BuyDiscountGiftFS, [id]);
        }

        /**
         *获取数据 请求
         */
        public GetDiscountGiftFSInfo(): void {
            // console.log(" 特惠礼包 （封神榜） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetDiscountGiftFSInfo, null);
        }

        private GetDiscountGiftFSInfoReply(tuple: Protocols.GetDiscountGiftFSInfoReply): void {
            // console.log(" 特惠礼包 （封神榜） 返回数据...............:   ", tuple);
            SoaringSpecialGiftModel.instance.getInfo(tuple);
        }

        private UpdateDiscountGiftFSInfo(tuple: Protocols.UpdateDiscountGiftFSInfo): void {
            // console.log(" 特惠礼包 （封神榜） 更新数据...............:   ", tuple);
            SoaringSpecialGiftModel.instance.updateInfo(tuple);
        }

        private BuyDiscountGiftFSReply(tuple: Protocols.BuyDiscountGiftFSReply): void {
            // console.log("特惠礼包 （封神榜） 领取返回...............:   ", tuple);
            if (tuple[BuyDiscountGiftFSReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("购买成功", false);
            } else {
                CommonUtil.noticeError(tuple[BuyDiscountGiftFSReplyFields.result]);
            }
        }
    }
}
