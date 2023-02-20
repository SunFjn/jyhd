///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>


/** 天关控制器*/
namespace modules.mission {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetCopyTianguanReply = Protocols.GetCopyTianguanReply;
    import GetCopyTianguanReplyFields = Protocols.GetCopyTianguanReplyFields;
    import GetRankReply = Protocols.GetRankReply;
    import LevelCopyDataFields = Protocols.LevelCopyDataFields;
    import UpdateKillMonstetWare = Protocols.UpdateKillMonstetWare;
    import UpdateKillMonstetWareFields = Protocols.UpdateKillMonstetWareFields;
    import UpdateTianguanCopy = Protocols.UpdateTianguanCopy;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import BagUtil = modules.bag.BagUtil;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class MissionCtrl extends BaseCtrl {
        private static _instance: MissionCtrl;
        public static get instance(): MissionCtrl {
            return this._instance = this._instance || new MissionCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetCopyTianguanReply, this, this.getCopyTianguanReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTianguanCopy, this, this.updateTianguanCopy);
            Channel.instance.subscribe(SystemClientOpcode.UpdateKillMonstetWare, this, this.updateKillMonstetWare);
            // Channel.instance.subscribe(SystemClientOpcode.GetRankReply, this, this.getRankReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getCopyTianguan();
            modules.player.PlayerCtrl.instance.getServerDay();
        }

        // 获取天关副本
        public getCopyTianguan(): void {
            Channel.instance.publish(UserFeatureOpcode.GetCopyTianguan, null);
        }

        // 请求天关排行
        public getRank(): void {
            // console.log("请求天关排行.................");
            Channel.instance.publish(UserCenterOpcode.GetRank, [RankType.tianguanLevel]);
        }

        // 获取天关副本回调
        private getCopyTianguanReply(tuple: GetCopyTianguanReply): void {
            // console.log("获取天关副本回调..............." + tuple);
            MissionModel.instance.curLv = tuple[GetCopyTianguanReplyFields.copyData][LevelCopyDataFields.finishLevel] + 1;
            MissionModel.instance.curWare = tuple[GetCopyTianguanReplyFields.killMonsterWare];
            MissionModel.instance.awardLvs = tuple[GetCopyTianguanReplyFields.copyData][LevelCopyDataFields.award];
        }

        // 更新天关层数和奖励
        private updateTianguanCopy(tuple: UpdateTianguanCopy): void {
            // console.log("更新天关层数和奖励..................." + tuple);
            if (MissionModel.instance.curLv == tuple[GetCopyTianguanReplyFields.copyData][LevelCopyDataFields.finishLevel]) {
                //更新的时候当前层数不等于现在层数 说明刚过关
                modules.action_preview.actionPreviewModel.instance._tianGuaIsUp = true;
            }
            MissionModel.instance.curLv = tuple[GetCopyTianguanReplyFields.copyData][LevelCopyDataFields.finishLevel] + 1;
            MissionModel.instance.awardLvs = tuple[GetCopyTianguanReplyFields.copyData][LevelCopyDataFields.award];
        }

        // 更新怪物波数
        private updateKillMonstetWare(tuple: UpdateKillMonstetWare): void {
            MissionModel.instance.curWare = tuple[UpdateKillMonstetWareFields.count];
        }

        // 挑战（进入BOSS场景）
        public challenge(mapId: number): void {

            // let restNum = BagModel.instance.getBagEnoughById(1);
            // let isShow: boolean = !(restNum > BlendCfg.instance.getCfgByTypeAndId(10007)[blendFields.intParam][0]);
            // if(isShow){
            //     MissionModel.instance.auto = false;
            //     CommonUtil.alert("温馨提示","装备背包格子不足，是否一键熔炼", true, Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt));
            // }else{
            //     WindowManager.instance.close(WindowEnum.MISSION_PANEL);
            //     Channel.instance.publish(UserFeatureOpcode.ReqEnterScene, [mapId, 1]);
            // }
            if (BagUtil.checkNeedSmeltTip()) {
                Laya.timer.callLater(this, this.cancelAuto);
            } else {
                WindowManager.instance.close(WindowEnum.MISSION_PANEL);
                DungeonCtrl.instance.reqEnterScene(mapId, 1);
            }
        }

        private cancelAuto():void{
            MissionModel.instance.auto = false;
        }

        // 获取排行榜返回
        private getRankReply(tuple: GetRankReply): void {
            // console.log("获取天关排行返回..................." + tuple);
            // MissionModel.instance.rankArr = tuple[GetRankReplyFields.rankTianguan];
        }
    }
}