namespace modules.weekConsume {
    import GetWeekConsumeReplyFields = Protocols.GetWeekConsumeReplyFields;
    import GetWeekConsumeReply = Protocols.GetWeekConsumeReply;
    import week_consume = Configuration.week_consume;
    import week_consumeFields = Configuration.week_consumeFields;
    import WeekConsumeCfg = modules.config.WeekConsumeCfg;
    import ThreeNumber = Protocols.ThreeNumber;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SinglePayModel = modules.singlePay.SinglePayModel;

    enum DatFields {
        id = 0,       //id
        state = 1,    //状态：0不可领，1可领，2已领
        consume = 2,  //消费代币券数
    }

    export class WeekConsumeModel {

        private static _instance: WeekConsumeModel;
        public static get instance(): WeekConsumeModel {
            return this._instance = this._instance || new WeekConsumeModel();
        }

        private _state: boolean;     //开始活动状态
        private _time: number;       //结束时间戳
        private _arr: Array<ThreeNumber>;    /*项目列表 [id,状态：0不可领，1可领，2已领,消费代币券数]*/

        //活动数据返回
        public getWeekConsumeReply(value: GetWeekConsumeReply): void {
            this._state = value[GetWeekConsumeReplyFields.state];
            this._time = value[GetWeekConsumeReplyFields.time];
            this._arr = value[GetWeekConsumeReplyFields.stateList];

            this.setFuncState();
            //遍历Item，如有可领取，显示红点
            RedPointCtrl.instance.setRPProperty("weekConsumeRP", false);
            for (let i = 0; i < this._arr.length; ++i) {
                if (this._arr[i][DatFields.state] == 1) {
                    RedPointCtrl.instance.setRPProperty("weekConsumeRP", true);
                }
            }

            GlobalData.dispatcher.event(CommonEventType.WEEK_CONSUME_UPDATE);       //发送事件刷新页面

            //调试输出
            // console.log("消费赠礼（周末狂欢）###############################################################");
            // console.log("活动状态: "+this._state);
            // console.log("结束时间: "+this._time);
            // for(let i = 0;i<this._arr.length;++i){
            //     console.log("活动Item("+i+") id: "+this._arr[i][0]+" 状态: "+this._arr[i][1]+" 消费代币券数: "+this._arr[i][2]);
            // }
            // console.log("##################################################################################");
        }

        public get state(): boolean {
            return this._state;
        }

        public get time(): number {
            return this._time;
        }

        public get arr(): Array<ThreeNumber> {
            return this._arr;
        }

        public setFuncState(): void {
            FuncOpenModel.instance.setActionOpen(ActionOpenId.weekConsume, this._state ? ActionOpenState.open : ActionOpenState.close);     //设置页签功能开关
        }
    }
}