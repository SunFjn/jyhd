/**限时一折-控制器*/
namespace modules.limit_one_discount {
    import BaseCtrl = modules.core.BaseCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetOneBuyInfoReply = Protocols.GetOneBuyInfoReply;
    import UpdateOneBuyInfo = Protocols.UpdateOneBuyInfo;
    import GetOneBuyRewardReply = Protocols.GetOneBuyRewardReply;
    import CelebrationShopInfoReply = Protocols.CelebrationShopInfoReply;
    import CelebrationShopInfoReplyFields = Protocols.CelebrationShopInfoReplyFields;



    export class LimitOneDiscountCtrl extends BaseCtrl {
        private static _instance: LimitOneDiscountCtrl;


        public static get instance(): LimitOneDiscountCtrl {
            return this._instance = this._instance || new LimitOneDiscountCtrl();
        }
        constructor() {
            super();
        }
        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.LimitOneDiscountDateTimeReply, this, this.limitOneDiscountDateTimeReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            
        }

        /*返回数据*/
        private limitOneDiscountDateTimeReply(tuple: CelebrationShopInfoReply) {
            LimitOneDiscountModel.instance.Time = tuple[CelebrationShopInfoReplyFields.endTm];
        }

        // 获取时间
        public getTime() {
            Channel.instance.publish(UserFeatureOpcode.LitmitOneDiscountDateTimeRequest, null);
        }
    }
}
