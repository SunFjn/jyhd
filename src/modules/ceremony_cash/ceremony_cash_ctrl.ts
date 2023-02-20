///<reference path="../treasure/treasure_model.ts"/>
/**庆典兑换-控制器*/
namespace modules.ceremony_cash {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import XunBaoExchangeListReply = Protocols.XunBaoExchangeListReply;
    import XunBaoExchangeListReplyFields = Protocols.XunBaoExchangeListReplyFields;
    import TreasureModel = modules.treasure.TreasureModel;

    export class CeremonyCashCtrl extends BaseCtrl {
        private static _instance: CeremonyCashCtrl;


        public static get instance(): CeremonyCashCtrl {
            return this._instance = this._instance || new CeremonyCashCtrl();
        }
        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetXunBaoListReply, this, this.getXunBaoListReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getCashInfo();
            this.getCashRemind();     
        }

        /*兑换请求*/
        public cashRequest(id: number) {
            Channel.instance.publish(UserFeatureOpcode.XunBaoExchange, [6, id]);
        }

        /*获取数据*/
        public getCashInfo() {
            Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeList, [6]);
        }

        /*获取探索兑换列表返回*/
        public getXunBaoListReply(tuple: XunBaoExchangeListReply) {
            // console.log('vtz:tuple',tuple);
            CeremonyCashModel.instance.setXunbaoInfo(tuple);
        }

        /*获取兑换提醒*/
        public getCashRemind() {
            Channel.instance.publish(UserFeatureOpcode.GetXunBaoHint, null);
        }
    }
}
