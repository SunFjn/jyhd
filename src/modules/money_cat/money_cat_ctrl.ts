namespace modules.money_cat{
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateMoneyCatState = Protocols.UpdateMoneyCatState;
    import UpdateMoneyCatStateFields = Protocols.UpdateMoneyCatStateFields;
    import GetMoneyCatInfoReply = Protocols.GetMoneyCatInfoReply;
    import GetMoneyCatInfoReplyFields = Protocols.GetMoneyCatInfoReplyFields;
    import ActiveMoneyCatReply = Protocols.ActiveMoneyCatReply;
    import ActiveMoneyCatReplyFields = Protocols.ActiveMoneyCatReplyFields;
    export class MoneyCatCtrl extends BaseCtrl{
        private static _instance: MoneyCatCtrl;

        public static get instance(): MoneyCatCtrl {
            return this._instance = this._instance || new MoneyCatCtrl();
        }

        private constructor(){
            super();
        }

        public setup():void{
            Channel.instance.subscribe(SystemClientOpcode.UpdateMoneyCatState, this, this.updateMoneyCatState);     //护符状态更新
            Channel.instance.subscribe(SystemClientOpcode.GetMoneyCatInfoReply, this, this.getMoneyCatInfoReply);     //仙猫信息返回
            Channel.instance.subscribe(SystemClientOpcode.ActiveMoneyCatReply, this, this.activeMoneyCatReply);     //激活仙猫返回
            
            this.requsetAllData()
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getMoneyCatState();
            this.getMonthCardInfo();
        }

        //获取仙猫状态
        public getMoneyCatState():void{
            Channel.instance.publish(UserFeatureOpcode.GetMoneyCatState,null);
        }

        //获取仙猫信息
        public getMonthCardInfo():void{
            Channel.instance.publish(UserFeatureOpcode.GetMoneyCatInfo,null);
        }

        //激活仙猫
        public activeMoneyCat():void{
            Channel.instance.publish(UserFeatureOpcode.ActiveMoneyCat,null);
        }

        //仙猫状态更新
        private updateMoneyCatState(value:UpdateMoneyCatState):void{
            MoneyCatModel.instance.updateMoneyCatState(value[UpdateMoneyCatStateFields.state]);
        }

        //仙猫信息返回
        private getMoneyCatInfoReply(value:GetMoneyCatInfoReply):void{
            MoneyCatModel.instance.getMoneyCatInfoReply(value);
        }

        //激活仙猫返回
        private activeMoneyCatReply(value:ActiveMoneyCatReply):void{
             //CommonUtil.noticeError(value[ActiveMoneyCatReplyFields.result]);        //错误码返回
        }
    }
}