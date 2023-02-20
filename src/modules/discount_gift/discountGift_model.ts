/** 特惠礼包数据*/

namespace modules.discountGift {

    import UpdateDiscountGiftInfoFields = Protocols.UpdateDiscountGiftInfoFields;
    import UpdateDiscountGiftInfo = Protocols.UpdateDiscountGiftInfo;
    import GetDiscountGiftInfoReply = Protocols.GetDiscountGiftInfoReply;

    export class discountGiftModel {
        private static _instance: discountGiftModel;
        public static get instance(): discountGiftModel {
            return this._instance = this._instance || new discountGiftModel();
        }

        /** 1功能是否开启*/
        private _discountGiftState: int;
        /** 2活动类型*/
        private _type: int;
        /** 3当前折扣ID*/
        private _id: int;
        /** 4剩余时间*/
        private _restTm: int;
        /** 5当前购买数量*/
        private _curCount: int;
        /** 6最大数量*/
        private _maxCount: int;
        /** 7领取结果*/
        private _result: int;
        /** 8 当前VIP等级*/
        private _curVip: int;
        /** 9 max VIP等级*/
        private _maxVip: int;
        /** 10 今天活动是否结束标志位*/
        private _isDayOver: int;


        constructor() {
        }


        /**UpdateDiscountGiftInfo */
        public updateData(tuple: UpdateDiscountGiftInfo | GetDiscountGiftInfoReply) {

            this._discountGiftState = tuple[UpdateDiscountGiftInfoFields.openState];
            this._type = tuple[UpdateDiscountGiftInfoFields.type];

            this._id = tuple[UpdateDiscountGiftInfoFields.id];

            this._restTm = tuple[UpdateDiscountGiftInfoFields.restTm] + GlobalData.serverTime;
            this._curCount = tuple[UpdateDiscountGiftInfoFields.curCount];
            this._maxCount = tuple[UpdateDiscountGiftInfoFields.maxCount];
            this._isDayOver = tuple[UpdateDiscountGiftInfoFields.endFlag];
                //   console.log("discountgift 特惠礼包数据------------- GlobalData.serverTime "+ GlobalData.serverTime);
            // console.log("discountgift 特惠礼包数据------------- this._restTm "+  this._restTm);
            /**特惠礼包数据更新 */
            GlobalData.dispatcher.event(CommonEventType.DISCOUNT_GIFT_UPDATE);
        }

        /// ---GET SET-----

        /**  1功能是否开启 */
        public get discountGiftState(): int {
            return this._discountGiftState;
        }

        /**  1功能是否开启 */
        public set discountGiftState(value: int) {
            this._discountGiftState = value;
        }

        /**  2活动类型 */
        public get type(): int {
            return this._type;
        }

        /**  2活动类型 */
        public set type(value: int) {
            // console.log('当前活动类型'+this._type);
            this._type = value;
        }

        /**  3当前折扣ID */
        public get ID(): int {
            // console.log('当前折扣ID'+this._id);
            return this._id;
        }

        /**  3当前折扣ID */
        public set ID(value: int) {
            this._id = value;
        }

        /**   4剩余时间 */
        public get restTm(): int {
            // console.log('剩余时间：'+this._restTm);
            // console.log('当前时间'+GlobalData.serverTime);
            return this._restTm;
        }

        /**   4剩余时间 */
        public set restTm(value: int) {
            this._restTm = value;
        }

        /**  5当前购买数量 */
        public get curCount(): int {
            return this._curCount
        }

        /**  5当前购买次数 */
        public set curCount(value: int) {
            this._curCount = value;
        }

        /**  6最大可购买次数 */
        public get maxCount(): int {
            return this._maxCount;
        }

        /**  6最大可购买数量 */
        public set maxCount(value: int) {
            this._maxCount = value;
        }

        /** 7领取结果 */
        public get ReceiveResult(): int {
            return this._result;
        }

        /** 7领取结果 */
        public set ReceiveResult(value: int) {
            this._result = value;
        }

        /** 8 当前VIP等级*/
        public get curVip() {
            return this._curVip;
        }

        /** 8 当前VIP等级*/
        public set curVip(value: int) {
            this._curVip = value
        }

        /** 9 当前VIP等级*/
        public get maxVip() {
            return this._maxVip;
        }

        /** 9 当前VIP等级*/
        public set maxVip(value: int) {
            this._maxVip = value
        }

        /** 10 当天活动是否结束*/
        public get isDayOver() {
            return this._isDayOver;
        }

        /** 10 当天活动是否结束*/
        public set isDayOver(value: int) {
            this._isDayOver = value
        }

        /// ---GET SET----


    }
}