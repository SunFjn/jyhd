/////<reference path="../$.ts"/>
/**
 * 抢购礼包 （封神榜）
 */
namespace modules.soaring_panicBuyingGift {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BuyRushBuyFSReplyFields = Protocols.BuyRushBuyFSReplyFields;

    export class SoaringPanicBuyingGiftCtrl extends BaseCtrl {
        private static _instance: SoaringPanicBuyingGiftCtrl;
        public static get instance(): SoaringPanicBuyingGiftCtrl {
            return this._instance = this._instance || new SoaringPanicBuyingGiftCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetRushBuyFSInfoReply, this, this.GetRushBuyFSInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRushBuyFSInfo, this, this.UpdateRushBuyFSInfo);
            Channel.instance.subscribe(SystemClientOpcode.BuyRushBuyFSReply, this, this.BuyRushBuyFSReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            GlobalData.dispatcher.on(CommonEventType.SOARING_PANICBUYINGGIFT_NEXT_DAY_UPDATE, this, this.DateUpdate);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetRushBuyFSInfo();
        }


        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.rushBuyFS) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.rushBuyFS)) {
                        //SoaringPanicBuyingGiftModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public BuyRushBuyFS(): void {
            // console.log(" 抢购礼包 （封神榜） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.BuyRushBuyFS, null);
        }

        /**
         *获取数据 请求
         */
        public GetRushBuyFSInfo(): void {
            // console.log(" 抢购礼包 （封神榜） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetRushBuyFSInfo, null);
            SoaringPanicBuyingGiftModel.instance.openPanel();
        }

        private GetRushBuyFSInfoReply(tuple: Protocols.GetRushBuyFSInfoReply): void {
            // console.log(" 抢购礼包 （封神榜） 返回数据...............:   ", tuple);
            SoaringPanicBuyingGiftModel.instance.getInfo(tuple);
        }

        private UpdateRushBuyFSInfo(tuple: Protocols.UpdateRushBuyFSInfo): void {
            // console.log(" 抢购礼包 （封神榜） 更新数据...............:   ", tuple);
            SoaringPanicBuyingGiftModel.instance.updateInfo(tuple);
        }
        private DateUpdate(): void {
            SoaringPanicBuyingGiftModel.instance.dateUpdate();
        }

        private BuyRushBuyFSReply(tuple: Protocols.BuyRushBuyFSReply): void {
            // console.log("抢购礼包 （封神榜） 领取返回...............:   ", tuple);
            if (tuple[BuyRushBuyFSReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("购买成功", false);
                SoaringPanicBuyingGiftModel.instance.isBuy();
            } else {
                CommonUtil.noticeError(tuple[BuyRushBuyFSReplyFields.result]);
            }
        }
    }
}
