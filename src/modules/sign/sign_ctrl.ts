/**签到控制*/


namespace modules.sign {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetSignReply = Protocols.GetSignReply;
    import SignReply = Protocols.SignReply;
    import SignReplyFields = Protocols.SignReplyFields;


    export class SignCtrl extends BaseCtrl {
        private static _instance: SignCtrl;

        public static get instance(): SignCtrl {
            return this._instance = this._instance || new SignCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.SignReply, this, this.SignError);
            Channel.instance.subscribe(SystemClientOpcode.GetSignReply, this, this.getSign);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSign, null);
        }

        // 获取签到信息
        public getSign(tuple: GetSignReply): void {
            // console.log('vtz:tuple',tuple);
            SignModel.instance.getSign(tuple);
            GlobalData.dispatcher.event(CommonEventType.GET_SIGN);
        }

        public SignError(tuple: SignReply): void {
            SignModel.instance.SignReply = tuple[SignReplyFields.result];
            GlobalData.dispatcher.event(CommonEventType.SIGN_REPLY);
        }
    }
}