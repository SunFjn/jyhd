namespace modules.recharge {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class RechargeCtrl extends BaseCtrl {
        private static _instance: RechargeCtrl;
        public static get instance(): RechargeCtrl {
            return this._instance = this._instance || new RechargeCtrl();
        }

        constructor() {
            super();
        }

        public setup() {
            Channel.instance.subscribe(SystemClientOpcode.GetRechargeInfoReply, this, this.getRechargeInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRechargeInfo, this, this.updateRechargeInfo);
            
            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetRechargeInfo, null);
        }

        private getRechargeInfoReply(tuple: Protocols.GetRechargeInfoReply): void {
            RechargeModel.instance.getRechargeInfoReply(tuple);
        }

        private updateRechargeInfo(tuple: Protocols.UpdateRechargeInfo): void {
            RechargeModel.instance.updateRechargeInfo(tuple);
        }

    }
}