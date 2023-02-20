/////<reference path="../$.ts"/>
/** 资源找回 */
namespace modules.resBack {
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateRetrieve = Protocols.UpdateRetrieve;
    import RetrieveRes = Protocols.RetrieveRes;

    export class ResBackCtrl extends BaseCtrl {
        private static _instance: ResBackCtrl;
        public static get instance(): ResBackCtrl {
            return this._instance = this._instance || new ResBackCtrl();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.UpdateRetrieve, this, this.updateRetrieve);

            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getRetrieve();
        }

        /*获取找回*/
        public getRetrieve(): void {
            Channel.instance.publish(UserFeatureOpcode.GetRetrieve, null);
        }

        private updateRetrieve(tuple: UpdateRetrieve): void {
            if(!tuple){
                CommonUtil.checkNullObject(tuple,"协议UpdateRetrieve = 0x100226a 参数为空");
            }
            ResBackModel.instance.update(tuple);
        }

        //获取找回
        public getrieveRes(value:RetrieveRes): void {
            Channel.instance.publish(UserFeatureOpcode.RetrieveRes, value);
        }
    }
}