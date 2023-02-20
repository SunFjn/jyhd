/** 派对大奖*/


namespace modules.mission_party{
    import GetSetNameInfoReply = Protocols.GetSetNameInfoReply;

    export class MissionPartyAwardModule {
        private static _instance:MissionPartyAwardModule;
        public static get instance():MissionPartyAwardModule{
            return this._instance = this._instance || new MissionPartyAwardModule();
        }

        // 奖励信息
        private _awardInfo:GetSetNameInfoReply;

        constructor(){

        }

        // 奖励信息
        public get awardInfo():GetSetNameInfoReply{
            return this._awardInfo;
        }

        public set awardInfo(value:GetSetNameInfoReply){
            this._awardInfo = value;
            // GlobalData.dispatcher.event(CommonEventType.UpdateMissionAwardInfo);
        }


    }
}