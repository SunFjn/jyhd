
/**秒杀活动控制器*/
namespace modules.one_buy{
    import BaseCtrl = modules.core.BaseCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetOneBuyInfoReply = Protocols.GetOneBuyInfoReply;
    import UpdateOneBuyInfo = Protocols.UpdateOneBuyInfo;
    import GetOneBuyRewardReply = Protocols.GetOneBuyRewardReply;
    import GetOneBuyRewardReplyFields = Protocols.GetOneBuyRewardReplyFields;



    export class OneBuyCtrl extends BaseCtrl {
        private static _instance: OneBuyCtrl;


        public static get instance(): OneBuyCtrl {
            return this._instance = this._instance || new OneBuyCtrl();
        }
        constructor(){
            super();
        }
        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetOneBuyInfoReply, this, this.getOneBuyInfoReply);
            /*更新数据*/
            Channel.instance.subscribe(SystemClientOpcode.UpdateOneBuyInfo, this, this.updateOneBuyInfo);
            /*领取返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetOneBuyRewardReply, this, this.getOneBuyRewardReply);

            this.requsetAllData();
        }
        
        /**
         * 向服务器请求数据
         */
        public requsetAllData(): void {
            this.getLoginRewad();
        }

        /*返回数据*/
        private getOneBuyInfoReply(tuple:GetOneBuyInfoReply) {
            OneBuyModel.instance.updateInfo(tuple);
            // console.log("one buy tuple = " + tuple);
        }
        /*更新数据*/
        private updateOneBuyInfo(tuple:UpdateOneBuyInfo){
            OneBuyModel.instance.updateInfo(tuple);
            // console.log("one buy tuple = " + tuple);
        }
        /*领取返回*/
        private getOneBuyRewardReply(tuple:GetOneBuyRewardReply){
            CommonUtil.noticeError(tuple[GetOneBuyRewardReplyFields.result]);
        }

        //获取数据
        public getLoginRewad(): void {
            Channel.instance.publish(UserFeatureOpcode.GetOneBuyInfo, null);
        }

        /*领取奖励*/
        public getLoginRewardReward(itemId: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetOneBuyReward, [itemId]);
        }
    }
}
