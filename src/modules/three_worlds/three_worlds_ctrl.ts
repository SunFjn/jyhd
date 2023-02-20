/** 三界BOSS控制器*/


namespace modules.threeWorlds {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetBossRankRecordReply = Protocols.GetBossRankRecordReply;
    import AutoSC_BossKillInfos = Protocols.AutoSC_BossKillInfos;

    export class ThreeWorldsCtrl extends BaseCtrl {
        private static _instance: ThreeWorldsCtrl;
        public static get instance(): ThreeWorldsCtrl {
            return this._instance = this._instance || new ThreeWorldsCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 获取BOSS排行记录返回
            Channel.instance.subscribe(SystemClientOpcode.GetBossRankRecordReply, this, this.getBossRankRecordReply);
            Channel.instance.subscribe(SystemClientOpcode.AutoSC_BossKillInfos, this, this.getKillBossInfo);
        }

        // 获取BOSS排行记录
        public getBossRankRecord(occ: number): void {
            // console.log("获取boss排行记录................" + occ);
            Channel.instance.publish(UserCenterOpcode.GetBossRankRecord, [occ]);
        }

        // 获取BOSS排行记录返回
        private getBossRankRecordReply(value: GetBossRankRecordReply): void {
            // console.log("获取boss排行记录返回............." + value);
            ThreeWorldsModel.instance.bossRankRecord = value;
        }
        /**
         * boss击杀信息
         * @param value 
         */
        private getKillBossInfo(value: AutoSC_BossKillInfos): void {
            // console.log("获取boss击杀信息.............11" + value);
            let temp:string="暂无击杀信息"
            if(value){
                temp=value[1]
            }
            GlobalData.dispatcher.event(CommonEventType.BOSS_KILL_INFO_UPDATE,temp);
        }
         /**
         * 手动获取击杀信息
         */
         public getManualKillBossInfo(): void {
            Channel.instance.publish(UserCenterOpcode.GetBossKillInfo,null);
        }
    }
}