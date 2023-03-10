///<reference path="../config/scene_copy_nine_cfg.ts"/>
///<reference path="../config/scene_copy_teamBattle_cfg.ts"/>
///<reference path="../npc/npc_model.ts"/>
///<reference path="../scene/scene_model.ts"/>



namespace modules.npc {
    import BaseCtrl = modules.core.BaseCtrl;
    import LogUtils = game.misc.LogUtils;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import GatherReply = Protocols.GatherReply;
    import GatherReplyFields = Protocols.GatherReplyFields;
    import GatherEnd = Protocols.GatherEnd;
    import GatherEndFields = Protocols.GatherEndFields;
    import UpdateGatherPos = Protocols.UpdateGatherPos;
    import GameCenter = game.GameCenter;
    import NpcCfg = modules.config.NpcCfg;
    import npcFields = Configuration.npcFields;
    import XianfuModel = modules.xianfu.XianfuModel;
    import GetBuildingInfoReply = Protocols.GetBuildingInfoReply;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    import SceneCfg = modules.config.SceneCfg;
    import NineModel = modules.nine.NineModel;
    import ScenePromoteFields = Protocols.ScenePromoteFields;
    import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    import RankBox = Configuration.RankBox;
    import RankBoxFields = Configuration.RankBoxFields;
    import NpcModel = modules.npc.NpcModel;
    import DayDropTreasureModel = modules.day_drop_treasure.DayDropTreasureModel;
    import CommonUtil = modules.common.CommonUtil;
    import SceneModel = modules.scene.SceneModel;

    import UserTransferReply = Protocols.UserTransferReply;
    import UserTransferReplyFields = Protocols.UserTransferReplyFields;


    export class NpcCtrl extends BaseCtrl {
        private static _instance: NpcCtrl;

        public static get instance(): NpcCtrl {
            return this._instance = this._instance || new NpcCtrl();
        }

        public setup(): void {
            // ????????????
            Channel.instance.subscribe(SystemClientOpcode.GatherReply, this, this.gatherReply);
            // ????????????
            Channel.instance.subscribe(SystemClientOpcode.GatherEnd, this, this.gatherEnd);
            // ??????????????????
            Channel.instance.subscribe(SystemClientOpcode.UpdateGatherPos, this, this.updateGatherPos);

            GlobalData.dispatcher.on(CommonEventType.PLAYER_TRIGGER_NPC, this, this.onTrigger);



            Channel.instance.subscribe(SystemClientOpcode.UserTransferReply, this, this.userTransferReply);
        }


        // ????????????
        public userTransfer(id: number): void {
            console.log("????????????.......................", id)
            Channel.instance.publish(UserMapOpcode.UserTransfer, [id]);
        }
        // ??????????????????
        private userTransferReply(value: UserTransferReply): void {
            console.log("??????????????????.......................", value)
        }


        // ??????, objId:????????????ID,typ:???????????????0?????????1??????
        public gather(objId: number, type: int = 0): void {
            LogUtils.info(LogFlags.Nine, "??????......................." + objId);
            Channel.instance.publish(UserMapOpcode.Gather, [objId, type]);

        }

        // ????????????
        private gatherReply(value: GatherReply): void {
            LogUtils.info(LogFlags.Nine, "????????????......................." + value);
            console.log('????????????_chy:', "????????????......................." + value);
            CommonUtil.noticeError(value[GatherReplyFields.result]);
            let sceneId: int = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let type: int = SceneCfg.instance.getCfgById(sceneId)[sceneFields.type];
            if (value[GatherReplyFields.result] !== 0 && type !== SceneTypeEx.homeBoss) {       // BOSS?????????????????????????????????
                NpcModel.instance.isGathering = false;
                let result = value[GatherEndFields.result];
                GlobalData.dispatcher.event(CommonEventType.DAY_DROP_TREASURE_CAIJILOSE, value[GatherReplyFields.result]);
            } else {
                NpcModel.instance.isGathering = true;
            }
        }

        // ????????????
        public gatherInterrupt(): void {
            LogUtils.info(LogFlags.Nine, "????????????.......................");
            Channel.instance.publish(UserMapOpcode.GatherInterrupt, null);
            NpcModel.instance.isGathering = false;
        }



        // ????????????
        private gatherEnd(value: GatherEnd): void {
            LogUtils.info(LogFlags.Nine, "????????????......................." + value);
            NpcModel.instance.isGathering = false;
            if (value[GatherEndFields.result] == 0) {
                GlobalData.dispatcher.event(CommonEventType.SCENE_GATHER_END);
                WindowManager.instance.close(WindowEnum.GATHER_PANEL);
            } else {
                //???????????????????????????
                let result = value[GatherEndFields.result];
                CommonUtil.noticeError(result);
            }
        }

        // ??????????????????
        private updateGatherPos(value: UpdateGatherPos): void {
            LogUtils.info(LogFlags.Nine, "??????????????????......................." + value);
            // WindowManager.instance.open(WindowEnum.GATHER_PANEL);
            let sceneId: int = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let type: int = SceneCfg.instance.getCfgById(sceneId)[sceneFields.type];
            if (type === SceneTypeEx.nineCopy) {      // ????????????
                let myRank: number = NineModel.instance.scenePromote[ScenePromoteFields.selfRank];
                let arr: Array<RankBox> = SceneCopyNineCfg.instance.getCfgByLevel(9)[scene_copy_nineFields.rankBox];
                let occ: number = -1;
                for (let i: int = arr.length - 1; i >= 0; i--) {
                    if (myRank >= arr[i][RankBoxFields.rank]) {
                        occ = arr[i][RankBoxFields.boxId];
                        break;
                    }
                }
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, occ);
            } else if (type === SceneTypeEx.teamBattleCopy) {
                // GlobalData.dispatcher.event(CommonEventType.SCENE_GATHER_END);
            }
        }

        private onTrigger(id: number): void {
            NpcModel.instance.triggeredNpcId = 0;
            let role = GameCenter.instance.getRole(id);
            if (role == null) {
                return;
            }

            NpcModel.instance.triggeredNpcId = id;
            let tuple = NpcCfg.instance.getCfgById(role.property.get("occ"));
            let fun = tuple[npcFields.funId] || 0;
            switch (fun) {
                case 1: {
                    WindowManager.instance.openDialog(WindowEnum.BOX_OPEN_ALERT, id);
                    break;
                }
                case 2: {
                    // this.gather(id, 0);
                    if (WindowManager.instance.isOpened(WindowEnum.Transport_PANEL)) return;
                    WindowManager.instance.open(WindowEnum.GATHER_PANEL);
                    break;
                }
                case 3: { //????????? ?????????
                    WindowManager.instance.open(WindowEnum.JULING_ACCOUNT_ALERT);
                    break;
                }
                case 4: {//2????????? 3????????? 4?????????
                    let buildInfo: GetBuildingInfoReply = XianfuModel.instance.getBuildInfo(XianfuModel.instance.buildType);
                    let state: number = buildInfo[GetBuildingInfoReplyFields.state];
                    /*???????????? 0????????? 1:????????? 2????????????*/
                    if (state == 0) { //??????cd??? ??????????????????
                        WindowManager.instance.open(WindowEnum.XIANFU_SMELT_PANEL);
                    } else if (state == 1) {
                        WindowManager.instance.open(WindowEnum.XIANFU_SMELTING_ALERT);
                    } else {
                        WindowManager.instance.open(WindowEnum.XIANFU_SMELT_END_ALERT);
                    }
                    break;
                }
                case 5: {       // ????????????
                    if (!DayDropTreasureModel.instance.getGatherCountIsMax()) {
                        WindowManager.instance.open(WindowEnum.GATHER_PANEL);
                    }
                    break;
                }
                case 6: {
                    WindowManager.instance.open(WindowEnum.GATHER_PANEL);
                    break;
                }
                case 11: { // ??????-????????????
                    XianfuModel.instance._transmit();
                    break;
                }

            }
        }
    }
}