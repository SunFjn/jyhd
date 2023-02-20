/*限时一折数据模型*/
namespace modules.limit_one_discount {
    import StoreCfg = modules.config.StoreCfg;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;

    export class LimitOneDiscountModel {
        private static _instance: LimitOneDiscountModel;
        public static get instance(): LimitOneDiscountModel {
            return this._instance = this._instance || new LimitOneDiscountModel();
        }
        private constructor() {
        }

        private _endTime: number;


        //获取商品列表
        public getGoodsList(): Array<mall> {
            let cfgs: Array<mall> = StoreCfg.instance.getTypeStoreCfgByChildType(MallType.mall_4, 1);

            return cfgs;
        }

        //活动倒计时
        public set Time(endTime: number) {
            this._endTime = endTime;

            GlobalData.dispatcher.event(CommonEventType.OS_LIMIT_ONE_DISCOUNT_UPDATE);
        }

        //活动倒计时
        public get Time(): number {
            return this._endTime = this._endTime + GlobalData.serverTime;
        }
    }
}