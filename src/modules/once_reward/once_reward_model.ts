/** 单次奖励*/


namespace modules.onceReward{
    import DrawOnceRewardReply = Protocols.DrawOnceRewardReply;
    import OnceRewardData = Protocols.OnceRewardData;
    import SetOnceRewardDataReply = Protocols.SetOnceRewardDataReply;
    import OnceRewardDataFields = Protocols.OnceRewardDataFields;
    import SetOnceRewardDataReplyFields = Protocols.SetOnceRewardDataReplyFields;

    export class OnceRewardModel {
        private static _instance:OnceRewardModel;
        public static get instance():OnceRewardModel{
            return this._instance = this._instance || new OnceRewardModel();
        }

        // 已领取奖励的ID数组
        private _gotAwardIds:Array<number>;
        // 保存到服务器的数据
        private _datas:Array<OnceRewardData>;

        constructor(){

        }

        // 已领取奖励的ID数组
        public get gotAwardIds():Array<number>{
            return this._gotAwardIds;
        }
        public set gotAwardIds(value:Array<number>){
            this._gotAwardIds = value;
            GlobalData.dispatcher.event(CommonEventType.ONCE_REWARD_UPDATE);
        }

        // 领取单次奖励返回
        public drawOnceRewardReply(id:number):void{
            if(this._gotAwardIds && this._gotAwardIds.indexOf(id) === -1){
                this._gotAwardIds.push(id);
                GlobalData.dispatcher.event(CommonEventType.ONCE_REWARD_UPDATE);
            }
        }

        // 保存到服务器的数据
        public get datas():Array<OnceRewardData>{
            return this._datas;
        }
        public set datas(value:Array<OnceRewardData>){
            this._datas = value;
            GlobalData.dispatcher.event(CommonEventType.ONCE_REWARD_UPDATE);
        }

        // 设置单次奖励数据返回
        public setOnceRewardDataReply(id:number, data:string):void{
            let arr:Array<OnceRewardData> = OnceRewardModel.instance.datas;
            let flag:boolean = false;
            for(let i:int = 0, len:int = arr.length; i < len; i++) {
                if (id === arr[i][OnceRewardDataFields.id]) {
                    arr[i][OnceRewardDataFields.data] = data;
                    flag = true;
                    break;
                }
            }
            if(!flag) arr.push([data, id]);
            GlobalData.dispatcher.event(CommonEventType.ONCE_REWARD_UPDATE);
        }

        // 根据id获取保存在服务器的数据
        public getDataById(id:number):string{
            let str:string = null;
            if(this._datas) {
                for (let i: int = 0, len: int = this._datas.length; i < len; i++) {
                    if (id === this._datas[i][OnceRewardDataFields.id]) {
                        str = this._datas[i][OnceRewardDataFields.data];
                        break;
                    }
                }
            }
            return str;
        }
    }
}