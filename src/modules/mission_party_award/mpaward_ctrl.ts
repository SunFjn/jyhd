/** 派对大奖*/


namespace modules.mission_party{
    import GetSetNameInfoReply = Protocols.GetSetNameInfoReply;


    export class MissionPartyAwardCtrl extends BaseCtrl{
        private static _instance:MissionPartyAwardCtrl;
        public static get instance():MissionPartyAwardCtrl{
            return this._instance = this._instance || new MissionPartyAwardCtrl();
        }

        setup(): void {
            // 获取奖励领取信息返回
            // Channel.instance.subscribe(SystemClientOpcode.xxx, this, this.getAwardStatusInfoReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getAwardStatusInfo();
        }        

        // 获取奖励领取信息
        public getAwardStatusInfo():void{
            // console.log("获取踏春派对奖励状态................");
            // Channel.instance.publish(UserFeatureOpcode.xxxx, null);
        }

        // 获取奖励领取信息返回
        private getAwardStatusInfoReply(value:GetSetNameInfoReply):void{
            // console.log("获取踏春派对奖励返回......................", value);
            MissionPartyAwardModule.instance.awardInfo = value;
        }

    }
}