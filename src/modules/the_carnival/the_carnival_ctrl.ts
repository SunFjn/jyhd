/** 全民狂嗨 控制器*/


namespace modules.the_carnival {
    import GetKuanghaiInfoReply = Protocols.GetKuanghaiInfoReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateKuanghaiTask = Protocols.UpdateKuanghaiTask;
    import GetKuanghaiTaskAwardReply = Protocols.GetKuanghaiTaskAwardReply;
    import GetKuanghaiAwardReply = Protocols.GetKuanghaiAwardReply;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class TheCarnivalCtrl extends BaseCtrl{
        //单例
        private static _instance: TheCarnivalCtrl;
        public static get instance(): TheCarnivalCtrl {
            return this._instance = this._instance || new TheCarnivalCtrl();
        }
        //构造函数
        private constructor() {
            super();
        }

        public setup(): void {
            /*返回历练数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghaiInfoReply,this,this.getKuanghaiInfoReply);
            /*更新单个任务*/
            Channel.instance.subscribe(SystemClientOpcode.UpdateKuanghaiTask,this,this.updateKuanghaiTask);
            /*领取任务奖励返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghaiTaskAwardReply,this,this.getKuanghaiTaskAwardReply);
            /*领取奖励返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghaiAwardReply,this,this.getKuanghaiAwardReply);
           
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getKuanghaiInfo();  
        }

        /*返回历练数据*/
        private getKuanghaiInfoReply(tuple : GetKuanghaiInfoReply){
            TheCarnivalModel.instance.getdateInfo(tuple);
            TheCarnivalModel.instance.setPayRewardRP();
        }
        /*更新单个任务*/
        private updateKuanghaiTask(tuple : UpdateKuanghaiTask){
            TheCarnivalModel.instance.singleTaskUpdate(tuple);
            //TheCarnivalModel.instance.setPayRewardRP();
        }
        /*领取任务奖励返回*/
        private getKuanghaiTaskAwardReply(tuple : GetKuanghaiTaskAwardReply){
            //TheCarnivalModel.instance.getdateInfo(tuple);
        }
        /*领取奖励返回*/
        private getKuanghaiAwardReply(tuple : GetKuanghaiAwardReply){
            //TheCarnivalModel.instance.getdateInfo(tuple);
        }

        //获得狂嗨信息
        public getKuanghaiInfo():void{
            Channel.instance.publish(UserFeatureOpcode.GetKuanghaiInfo,null);
        }
        //领取任务奖励
        public getKuanghaiTaskAward(taskId:number):void{
            Channel.instance.publish(UserFeatureOpcode.GetKuanghaiTaskAward,[taskId]);
        }
        //领取奖励
        public getKuanghaiAward(grade:number):void{
            Channel.instance.publish(UserFeatureOpcode.GetKuanghaiAward,[grade]);
        }
    }
}