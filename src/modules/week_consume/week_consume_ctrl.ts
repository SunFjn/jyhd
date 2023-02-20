namespace modules.weekConsume{
    import GetWeekConsumeReply = Protocols.GetWeekConsumeReply;
    import GetWeekConsumeAwardReply = Protocols.GetWeekConsumeAwardReply;
    import GetWeekConsumeAwardReplyFields = Protocols.GetWeekConsumeAwardReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class WeekConsumeCtrl extends modules.core.BaseCtrl{
        private static _instance: WeekConsumeCtrl;

        public static get instance(): WeekConsumeCtrl {
            return this._instance = this._instance || new WeekConsumeCtrl();
        }

        private constructor() {
            super();
        }

        public setup():void{
            Channel.instance.subscribe(SystemClientOpcode.GetWeekConsumeReply, this, this.getWeekConsumeReply);     /*获取周末狂欢-消费信息返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetWeekConsumeAwardReply, this, this.getWeekConsumeAwardReply);  /*领取周末狂欢-消费奖励返回*/

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.setFuncState);        // 功能开启更新
            this.requsetAllData();
        }

        public requsetAllData() {
            this.getWeekConsume();
        }

        /*获取周末狂欢-消费信息返回*/
        private getWeekConsumeReply(value:GetWeekConsumeReply):void{
            // console.log("getWeekConsumeReply")
            WeekConsumeModel.instance.getWeekConsumeReply(value);
        }

        /*领取周末狂欢-消费奖励返回*/
        private getWeekConsumeAwardReply(value:GetWeekConsumeAwardReply):void{
            console.log("getWeekConsumeAwardReply")
            CommonUtil.noticeError(value[GetWeekConsumeAwardReplyFields.result]);
        }

        /*获取周末狂欢-消费信息*/
        public getWeekConsume():void{
            Channel.instance.publish(UserFeatureOpcode.GetWeekConsume,null);
        }

        /*领取周末狂欢-消费奖励*/
        public getWeekConsumeAward(id:number):void{
            Channel.instance.publish(UserFeatureOpcode.GetWeekConsumeAward,[id]);
        }

        public setFuncState(ids: Array<number>) {
            for(let id of ids){
                if(id === ActionOpenId.weekConsume){
                    WeekConsumeModel.instance.setFuncState();
                    return;
                }
            }
        }
    }
}