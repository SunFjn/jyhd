///<reference path="../config/scene_cfg.ts"/>
///<reference path="../scene/scene_model.ts"/>
///<reference path="../config/scene_cross_boss_cfg.ts"/>
///<reference path="../mission/mission_model.ts"/>
///<reference path="../common/custom_clip.ts"/>
///<reference path="../boss_home/boss_home_model.ts"/>
///<reference path="../team_battle/team_battle_model.ts"/>
///<reference path="../activity_preview/activity_preview_ctrl.ts"/>
///<reference path="../adventure/adventure_model.ts"/>
///<reference path="../faction/faction_ctrl.ts"/>
///<reference path="../config/scene_multi_boss_cfg.ts"/>
///<reference path="../scene/switch_scene_ctrl.ts"/>
///<reference path="../three_worlds/three_worlds_model.ts"/>




/** 副本控制器*/
namespace modules.dungeon {
    import FactionCtrl = modules.faction.FactionCtrl;
    import BaseCtrl = modules.core.BaseCtrl;
    import CopyJudgeAward = Protocols.CopyJudgeAward;
    import CopyJudgeAwardFields = Protocols.CopyJudgeAwardFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import scene = Configuration.scene;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import MissionModel = modules.mission.MissionModel;
    import GetCopyAwardReply = Protocols.GetCopyAwardReply;
    import GetCopyAwardReplyFields = Protocols.GetCopyAwardReplyFields;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import ReqInspireReply = Protocols.ReqInspireReply;
    import ReqInspireReplyFields = Protocols.ReqInspireReplyFields;
    import UpdateInspire = Protocols.UpdateInspire;
    import UpdateInspireFields = Protocols.UpdateInspireFields;
    import Item = Protocols.Item;
    import BroadcastBeginCombat = Protocols.BroadcastBeginCombat;
    import BroadcastEndCombat = Protocols.BroadcastEndCombat;
    import BroadcastCopyMonsterWare = Protocols.BroadcastCopyMonsterWare;
    import BroadcastCopyIncome = Protocols.BroadcastCopyIncome;
    import BroadcastCopyStar = Protocols.BroadcastCopyStar;
    import UpdateIncomeRecord = Protocols.UpdateIncomeRecord;
    import GetCopyTimesReply = Protocols.GetCopyTimesReply;
    import UpdateCopyTimes = Protocols.UpdateCopyTimes;
    import SweepCopyReply = Protocols.SweepCopyReply;
    import SweepCopyReplyFields = Protocols.SweepCopyReplyFields;
    import ReqEnterSceneReply = Protocols.ReqEnterSceneReply;
    import ReqEnterSceneReplyFields = Protocols.ReqEnterSceneReplyFields;
    import SceneModel = modules.scene.SceneModel;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetJoinAwardReply = Protocols.GetJoinAwardReply;
    import GetJoinAwardReplyFields = Protocols.GetJoinAwardReplyFields;
    import UpdateEnterLater = Protocols.UpdateEnterLater;
    import UpdateJoinAward = Protocols.UpdateJoinAward;
    import GetBossReply = Protocols.GetBossReply;
    import GetBossReplyFields = Protocols.GetBossReplyFields;
    import UpdateBoss = Protocols.UpdateBoss;
    import UpdateBossFields = Protocols.UpdateBossFields;
    import UpdateBossHurtRack = Protocols.UpdateBossHurtRack;
    import UpdateBossHurtRackFields = Protocols.UpdateBossHurtRackFields;
    import GetBossTimesReply = Protocols.GetBossTimesReply;
    import GetBossTimesReplyFields = Protocols.GetBossTimesReplyFields;
    import UpdateBossTimes = Protocols.UpdateBossTimes;
    import UpdateBossTimesFields = Protocols.UpdateBossTimesFields;
    import BuyTimesReply = Protocols.BuyTimesReply;
    import BuyTimesReplyFields = Protocols.BuyTimesReplyFields;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import GetFollowBossReplyFields = Protocols.GetFollowBossReplyFields;
    import GetFollowBossReply = Protocols.GetFollowBossReply;
    import BossHomeModel = modules.bossHome.BossHomeModel;
    import BossInfoFields = Protocols.BossInfoFields;
    import BossStateFields = Protocols.BossStateFields;
    import SceneMultiBossCfg = modules.config.SceneMultiBossCfg;
    import scene_multi_bossFields = Configuration.scene_multi_bossFields;
    import BossInfo = Protocols.BossInfo;
    import ReqEnterNextLevelReply = Protocols.ReqEnterNextLevelReply;
    import ReqEnterNextLevelReplyFields = Protocols.ReqEnterNextLevelReplyFields;
    import BroadcastEnemyInvad = Protocols.BroadcastEnemyInvad;
    import TeamBattleModel = modules.teamBattle.TeamBattleModel;
    import MarryModel = modules.marry.MarryModel;
    import BroadcastTeamCopyMonsterWare = Protocols.BroadcastTeamCopyMonsterWare;
    import BroadcastTeamCopyMonsterWareFields = Protocols.BroadcastTeamCopyMonsterWareFields;
    import BroadcastMarryCopyMonsterWare = Protocols.BroadcastMarryCopyMonsterWare;
    import BroadcastMarryCopyMonsterWareFields = Protocols.BroadcastMarryCopyMonsterWareFields;
    import LogUtils = game.misc.LogUtils;
    import BagUtil = modules.bag.BagUtil;
    import GetSceneStateReply = Protocols.GetSceneStateReply;
    import GetSceneStateReplyFields = Protocols.GetSceneStateReplyFields;
    import BroadcasSceneState = Protocols.BroadcasSceneState;
    import BroadcasSceneStateFields = Protocols.BroadcasSceneStateFields;
    import ActivityPreviewCtrl = modules.activityPreview.ActivityPreviewCtrl;
    import AdventureModel = modules.adventure.AdventureModel;
    import GetTipsPriorInfoReply = Protocols.GetTipsPriorInfoReply;
    import GetTipsPriorInfoReplyFields = Protocols.GetTipsPriorInfoReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import ThreeWorldsModel = modules.threeWorlds.ThreeWorldsModel;

    import GetAutoInspireReply = Protocols.GetAutoInspireReply;
    import GetAutoInspireReplyFields = Protocols.GetAutoInspireReplyFields;

    export class DungeonCtrl extends BaseCtrl {
        private static _instance: DungeonCtrl;
        public static get instance(): DungeonCtrl {
            return this._instance = this._instance || new DungeonCtrl();
        }

        private _startFightClip: CustomClip;
        private _sceneType: number;
        private _commonClosePanels: WindowEnum[];
        private _copyClosePanels: WindowEnum[];

        constructor() {
            super();
            this._sceneType = -1;

            this.setClosePanels();
        }

        public setup(): void {
            // 领取副本奖励（服务器所有的领取都写在一起，所以要自己判断是什么副本）
            Channel.instance.subscribe(SystemClientOpcode.GetCopyAwardReply, this, this.getCopyAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.CopyJudgeAward, this, this.copyJudgeAward);
            // 鼓舞返回
            Channel.instance.subscribe(SystemClientOpcode.ReqInspireReply, this, this.reqInspireReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateInspire, this, this.updateInspire);

            Channel.instance.subscribe(SystemClientOpcode.GetCopyTimesReply, this, this.getCopyTimesReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateCopyTimes, this, this.updateCopyTimes);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastBeginCombat, this, this.broadcastBeginCombat);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastEndCombat, this, this.broadcastEndCombat);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastCopyMonsterWare, this, this.broadcastCopyMonsterWare);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastTeamCopyMonsterWare, this, this.broadcastTeamCopyMonsterWare);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastMarryCopyMonsterWare, this, this.BroadcastMarryCopyMonsterWare);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastCopyIncome, this, this.broadcastCopyIncome);
            Channel.instance.subscribe(SystemClientOpcode.BroadcastCopyStar, this, this.broadcastCopyStar);
            Channel.instance.subscribe(SystemClientOpcode.UpdateIncomeRecord, this, this.updateIncomeRecord);

            Channel.instance.subscribe(SystemClientOpcode.SweepCopyReply, this, this.sweepCopyReply);

            Channel.instance.subscribe(SystemClientOpcode.ReqEnterSceneReply, this, this.reqEnterSceneReply);
            // 领取参与奖励
            Channel.instance.subscribe(SystemClientOpcode.GetJoinAwardReply, this, this.getJoinAwardReply);
            // 公共BOSS进入时BOSS死亡
            Channel.instance.subscribe(SystemClientOpcode.UpdateEnterLater, this, this.updateEnterLater);
            // 更新参与奖励
            Channel.instance.subscribe(SystemClientOpcode.UpdateJoinAward, this, this.updateJoinAward);
            // 获取BOSS返回
            Channel.instance.subscribe(SystemClientOpcode.GetBossReply, this, this.getBossReply);
            // 更新BOSS 死亡、重生推送
            Channel.instance.subscribe(SystemClientOpcode.UpdateBoss, this, this.updateBoss);
            // 更新BOSS 伤害排行
            Channel.instance.subscribe(SystemClientOpcode.UpdateBossHurtRack, this, this.updateBossHurtRack);
            // 获取BOSS次数返回
            Channel.instance.subscribe(SystemClientOpcode.GetBossTimesReply, this, this.getBossTimesReply);
            // 获取关注的BOSS返回
            Channel.instance.subscribe(SystemClientOpcode.GetFollowBossReply, this, this.getFollowBossReply);
            // 更新BOSS次数
            Channel.instance.subscribe(SystemClientOpcode.UpdateBossTimes, this, this.updateBossTimes);
            // 购买副本次数返回
            Channel.instance.subscribe(SystemClientOpcode.BuyTimesReply, this, this.buyTimesReply);
            // 进入下一层返回
            Channel.instance.subscribe(SystemClientOpcode.ReqEnterNextLevelReply, this, this.reqEnterNextLevelReply);
            // 强敌来袭
            Channel.instance.subscribe(SystemClientOpcode.BroadcastEnemyInvad, this, this.broadcastEnemyInvad);

            //多人BOSS新手指引协议
            Channel.instance.subscribe(SystemClientOpcode.GetBossIsFirstReply, this, this.getBossIsFirstReply);
            // 获取场景状态返回
            Channel.instance.subscribe(SystemClientOpcode.GetSceneStateReply, this, this.getSceneStateReply);
            // 广播场景状态
            Channel.instance.subscribe(SystemClientOpcode.BroadcasSceneState, this, this.broadcasSceneState);
            // 变强提示返回
            Channel.instance.subscribe(SystemClientOpcode.GetTipsPriorInfoReply, this, this.getTipsPriorInfoReply);

            Channel.instance.subscribe(SystemClientOpcode.OneKeySweepShilianCopyReply, this, this.oneKeySweepShilianCopyReply);
            Channel.instance.subscribe(SystemClientOpcode.OneKeyChallengeShilianCopyReply, this, this.oneKeyChallengeShilianCopyReply);

            Channel.instance.subscribe(SystemClientOpcode.GetAutoInspireReply, this, this.GetAutoInspireReply);

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, DungeonModel.instance.funOPenUpdateCheckCopyTimesRP);

            this.requsetAllData();
            // LogUtils.enable(LogFlags.DungeonCtrl);
        }

        public requsetAllData(): void {
            this.getCopyTimes();
            // 请求关注BOSS数组
            DungeonCtrl.instance.getFollowBoss();
            // 请求次数
            this.getBossTimes();
            // 请求BOSS信息
            this.getBoss();
            this.getSceneState();
            this.getAutoInspire();
            Channel.instance.publish(UserFeatureOpcode.GetBossIsFirst, null);
        }

        private setClosePanels(): void {
            this._commonClosePanels = [
                WindowEnum.DUNGEON_LB_PANEL,
                WindowEnum.DUNGEON_RB_PANEL,
                WindowEnum.COIN_RB_PANEL,
                WindowEnum.END_TIME_PANEL,
                WindowEnum.PET_RB_PANEL,
                WindowEnum.PET_LT_PANEL,
                WindowEnum.INSPIRE_ALERT,
                WindowEnum.THREE_WORLDS_RB_PANEL,
                WindowEnum.SINGLE_INSPIRE_ALERT,
                WindowEnum.TEAM_BATTLE_TOP_PANEL,
                WindowEnum.TEAM_BATTLE_AWARD_PANEL,
                WindowEnum.NINE_RB_PANEL,
                WindowEnum.GATHER_PANEL,
                WindowEnum.DAYDROP_TREASURE_BOTTOM_PANLE,
                WindowEnum.DAYDROP_TREASURE_RIGHT_PANLE,
                WindowEnum.KUNLUN_GAME_PANLE,
                WindowEnum.KUNLUN_BUFF_PANLE,
                WindowEnum.KUNLUN_GAIN_PANLE,
                WindowEnum.KUNLUN_RESULT_ALERT,
                WindowEnum.YUNMENGMIJING_RESULT_ALERT,
                WindowEnum.DAYDROP_TREASURE_RESULT_ALERT,
                WindowEnum.YUNMENGMIJING_BOSS_PANLE,
                WindowEnum.YUNMENGMIJING_INFORMATIOM_PANLE,
                WindowEnum.XIANFU_HAND_BOOK_VIOLET_PANEL,
                WindowEnum.XIANFU_LEFT_BOTTOM_PANEL,
                WindowEnum.XIANFU_BOTTOM_PANEL,
                WindowEnum.XIANFU_RIGHT_BOTTOM_PANEL,
                WindowEnum.XIANFU_TOP_PANEL,
                WindowEnum.REVIVE_ALERT,
                WindowEnum.FACTION_COPY_RB_PANEL,
                WindowEnum.FACTION_COPY_BOTTOM_PANEL,
                WindowEnum.FACTION_INSPIRE_ALERT,
                WindowEnum.TREASURE_ALERT, //探索
                WindowEnum.PAYREWARD_ALERT,//充值转盘
                WindowEnum.ROTARYTABLE_SOARING_REWARD_ALERT,//封神 冲榜 夺宝
                WindowEnum.ZXIANYU_ALERT,//点券探索
                WindowEnum.ROTARYTABLE_SOARING_MYRECORD_ALERT,//九州夺宝弹窗
                //圣域BOSS 相关界面关闭
                WindowEnum.SHENGYU_BOSS_ANDPLAYERLIST_PANEL,
                WindowEnum.SHENGYU_BOSS_INFORMATION_PANEL,
                WindowEnum.SHENGYU_BOSS_LEFT_PANEL,
                WindowEnum.SHENGYU_BOSS_SHOUYI_ALERT,
                //战队玄火 相关界面关闭
                WindowEnum.XUANHUO_BOSS_ANDPLAYERLIST_PANEL,
                WindowEnum.XUANHUO_LEFT_PANEL,
                WindowEnum.XUANHUO_RB_PANEL,

                WindowEnum.MARRY_BATTLE_AWARD_PANEL,
                WindowEnum.MARRY_BATTLE_TOP_PANEL,

                WindowEnum.TEAMCHIEF_COPY_BOTTOM_PANEL,
                WindowEnum.TEAMPREPARE_COPY_BOTTOM_PANEL,
                WindowEnum.TEAMPBATTLE_COPY_CROSS_TOP_PANEL,
                WindowEnum.TEAMPBATTLE_COPY_CROSS_RB_PANEL,
            ];
            this._copyClosePanels = [
                WindowEnum.MULTI_BOSS_PANEL,
                WindowEnum.DAILY_DUNGEON_PANEL,
                WindowEnum.THREE_WORLDS_PANEL,
                WindowEnum.BOSS_HOME_PANEL,
                WindowEnum.COMMON_TXT_ALERT,
                WindowEnum.LADDER_MATCH_ALERT,
                WindowEnum.ACTIVITY_ALL_PANEL,
                WindowEnum.ACTION_PREVIEW_PANEL,
                // WindowEnum.BIG_TOWER,
                // WindowEnum.RUNE_COPY_PANEL,
                // WindowEnum.TEAM_BATTLE_PANEL,
            ];
        }


        // 副本结算
        private copyJudgeAward(tuple: CopyJudgeAward): void {

            // GlobalData.dispatcher.event(CommonEventType.DUNGEON_RESULT, tuple);
            LogUtils.info(LogFlags.DungeonCtrl, "副本结算............" + tuple);
            WindowManager.instance.close(WindowEnum.SINGLE_INSPIRE_ALERT);
            WindowManager.instance.close(WindowEnum.COMMON_TXT_ALERT);
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            //不处理公共弹窗 -玄火
            switch (mapId) {
                case SCENE_ID.scene_xuanhuo_arena:
                case SCENE_ID.scene_teamBattle_copy:
                case SCENE_ID.scene_teamchief_copy:
                    return;
                default:
                    break;
            }

            let cfg: scene = SceneCfg.instance.getCfgById(mapId);
            let sceneType: int = cfg[sceneFields.type];
            let success: boolean = tuple[CopyJudgeAwardFields.success];
            if (success) {
                let type: int = tuple[CopyJudgeAwardFields.type];        // 0正常结算  1最后一击  2MVP  3参与
                let items: Array<Item> = tuple[CopyJudgeAwardFields.items];
                let itemsAward: Array<number> = tuple[CopyJudgeAwardFields.itemSources];
                if (type === 0) {
                    if (mapId === SCENE_ID.scene_copper_copy || mapId === SCENE_ID.scene_zq_copy) {       // 金币泰拉矿场
                        WindowManager.instance.openDialog(WindowEnum.COIN_WIN_PANEL);
                    } else if (mapId === SCENE_ID.scene_xianqi_copy ||
                        mapId === SCENE_ID.scene_pet_copy ||
                        mapId === SCENE_ID.scene_shenbing_copy ||
                        mapId === SCENE_ID.scene_wing_copy ||
                        mapId === SCENE_ID.scene_fashion_copy ||
                        mapId === SCENE_ID.scene_tianzhu_copy ||
                        mapId === SCENE_ID.scene_xilian_copy) {
                        // 宠物神之墟
                        WindowManager.instance.openDialog(WindowEnum.PET_WIN_PANEL, [items, itemsAward] || []);
                    } else if (mapId === SCENE_ID.scene_multi_boss) {
                        WindowManager.instance.open(WindowEnum.FIRST_WIN_PANEL, tuple);
                    } else {
                        if (SceneModel.instance.isInMission || mapId == SCENE_ID.scene_dahuang) {   // 天关
                            Laya.timer.once(3000, this, () => {
                                WindowManager.instance.openDialog(WindowEnum.WIN_PANEL, items || []);
                            })
                        } else {
                            WindowManager.instance.openDialog(WindowEnum.WIN_PANEL, items || []);
                        }
                    }
                } else if (type === 1) {
                    // WindowManager.instance.openDialog(WindowEnum.LAST_HIT_AWARD_ALERT, items || []);
                    DungeonResultManager.instance.addResult(tuple);
                } else if (type === 2) {
                    // WindowManager.instance.openDialog(WindowEnum.MVP_AWARD_ALERT, items);
                    DungeonResultManager.instance.addResult(tuple);
                } else if (type === 3) {
                    // WindowManager.instance.openDialog(WindowEnum.WIN_PANEL, items || []);
                    DungeonResultManager.instance.addResult(tuple);
                } else if (type === 4) {       // 三界BOSS
                    // WindowManager.instance.openDialog(WindowEnum.THREE_WORLDS_RANK_PANEL, [bossId, 2]);
                    ThreeWorldsModel.instance.mapId = SceneModel.instance.enterScene[EnterSceneFields.mapId];
                    ThreeWorldsModel.instance.mapLv = SceneModel.instance.enterScene[EnterSceneFields.level];
                    DungeonResultManager.instance.addResult(tuple);
                } else if (type === 5) {//boss之家
                    DungeonResultManager.instance.addResult(tuple);
                } else if (type === 6) {//天降财宝
                    let items = tuple[CopyJudgeAwardFields.items];
                    WindowManager.instance.open(WindowEnum.DAYDROP_TREASURE_RESULT_ALERT, items);
                } else if (type === 7) {//云梦秘境
                    let items = tuple[CopyJudgeAwardFields.items];
                    WindowManager.instance.open(WindowEnum.YUNMENGMIJING_RESULT_ALERT, items);
                } else if (type === 8) {//昆仑瑶池 沐浴时间达上限结算
                    let items = tuple[CopyJudgeAwardFields.items];
                    modules.kunlun.KunLunModel.instance._overType = 2;
                    WindowManager.instance.open(WindowEnum.KUNLUN_RESULT_ALERT, items);
                } else if (type === 9) {//昆仑瑶池活动结束结算
                    let items = tuple[CopyJudgeAwardFields.items];
                    modules.kunlun.KunLunModel.instance._overType = 1;
                    WindowManager.instance.open(WindowEnum.KUNLUN_RESULT_ALERT, items);
                }
                modules.scene.SceneModel.instance._isshibaiShowFP = false;
            } else {
                if (sceneType === SceneTypeEx.tiantiCopy) {
                    let items: Array<Item> = tuple[CopyJudgeAwardFields.items];
                    WindowManager.instance.open(WindowEnum.LADDER_LOSE_ALERT, items);
                } else {
                    WindowManager.instance.open(WindowEnum.LOSE_PANEL);
                }

                if (sceneType === 0) {
                    // 取消自动挂机
                    MissionModel.instance.auto = false;
                }
                modules.scene.SceneModel.instance._isshibai = true;
                modules.scene.SceneModel.instance._isshibaiShowFP = true;
                modules.main.RightTopModel.instance._isshibai = true;
                modules.main.RightTopModel.instance._isshibai1 = true;
            }

            if (sceneType === SceneTypeEx.tiantiCopy) {
                // 结算后角色待机
                PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
            } else if (sceneType === SceneTypeEx.common) {
                PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
            }
            // 结算后角色待机
            if (SceneModel.instance.isEveryDayCopyScene
                || modules.scene.SceneModel.instance.isEventScene
                || modules.scene.SceneModel.instance.isMarryScene) {
                MapUtils.waitTransition = WaitTransitionType.WaitTransitionFive;
            }
        }

        // 请求进入场景，mapId为0代表退出副本进入挂机场景
        public reqEnterScene(mapId: number = 0, level: int = 1, params: Array<number> = []): void {
            // console.log("=============1")
            if (TeamBattleModel.Instance.isHaveRoom) {
                TeamBattleCtrl.instance.teamWaitingHandler();
                return;
            }
            // console.log("=============2")
            if (mapId !== 0) {        // 切场景前先看当前是否在副本中，如果在副本中，不可切换
                let cfg: scene = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId]);
                let type: int = cfg[sceneFields.type];
                let reqType: int = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
                if ((type !== 0 && type !== reqType) || scene.SceneModel.instance.isInMission) {
                    SystemNoticeManager.instance.addNotice("副本中不可切换到其它副本", true);
                    return;
                }
            }
            // console.log("=============3")
            if (mapId === 0 || !BagUtil.checkNeedSmeltTip()) {
                // console.log("=============4")
                console.log('研发测试_chy:请求进入地图', mapId, level, params);
                Channel.instance.publish(UserFeatureOpcode.ReqEnterScene, [mapId, level, params]);
            }
        }

        // 进入场景返回
        private reqEnterSceneReply(value: ReqEnterSceneReply): void {
            let result: number = value[ReqEnterSceneReplyFields.result];
            if (result !== 0) {
                CommonUtil.noticeError(result);
            }
        }

        // 进入场景(场景控制器里调用)
        public enterScene(sceneId: number): void {

            let cfg: scene = SceneCfg.instance.getCfgById(sceneId);
            let type: int = cfg[sceneFields.type];
            this._sceneType = type;
            MapEffectCtrl.instance.show();
            if (type === SceneTypeEx.common) {            // 挂机场景
                for (let i: int = 0, len: int = this._commonClosePanels.length; i < len; i++) {
                    WindowManager.instance.close(this._commonClosePanels[i]);
                }

                Laya.timer.clear(this, this.showMissionMaskPanel);
                WindowManager.instance.close(WindowEnum.MISSION_MASK_PANEL);

                BossHomeModel.instance.hideTwoList();
                DungeonModel.instance.broadcastCopyStar = null;
                DungeonModel.instance.ranks = null;

                // BossReviveManager.instance.show();
            } else {              // 副本
                WindowManager.instance.open(WindowEnum.DUNGEON_LB_PANEL);

                if (type !== SceneTypeEx.tianguanCopy) {       // 切换到天关时不用关闭面板
                    for (let i: int = 0, len: int = this._copyClosePanels.length; i < len; i++) {
                        WindowManager.instance.close(this._copyClosePanels[i]);
                    }

                    let stack: Array<WindowEnum> = BottomTabCtrl.instance.panelsStack;
                    if (stack.length > 0) {
                        WindowManager.instance.close(stack[stack.length - 1]);
                    }
                }

                if (type === SceneTypeEx.tianguanCopy) {         // 天关
                    Laya.timer.once(CommonConfig.panelTweenDuration, this, this.showMissionMaskPanel, null, true);
                } else if (type === SceneTypeEx.multiBoss) {     // 多人BOSS
                    WindowManager.instance.open(WindowEnum.DUNGEON_RB_PANEL);
                } else if (type === SceneTypeEx.copperCopy || type === SceneTypeEx.zqCopy) {       // 金币泰拉矿场
                    WindowManager.instance.open(WindowEnum.COIN_RB_PANEL);
                } else if (type === SceneTypeEx.xianqiCopy ||
                    type === SceneTypeEx.petCopy ||
                    type === SceneTypeEx.shenbingCopy ||
                    type === SceneTypeEx.wingCopy ||
                    type === SceneTypeEx.fashionCopy ||
                    type === SceneTypeEx.tianzhuCopy ||
                    type === SceneTypeEx.xilianCopy ||
                    type === SceneTypeEx.guangHuanCopy
                ) {         // 宠物神之墟
                    WindowManager.instance.open(WindowEnum.PET_RB_PANEL);
                    WindowManager.instance.open(WindowEnum.PET_LT_PANEL);
                } else if (type === SceneTypeEx.crossBoss) {
                    WindowManager.instance.open(WindowEnum.THREE_WORLDS_RB_PANEL);
                } else if (type == SceneTypeEx.dahuangCopy) {

                } else if (type === SceneTypeEx.homeBoss) {
                    WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_LEFT_PANEL, 1);
                    BossHomeModel.instance.showTwoList();
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                } else if (type == SceneTypeEx.singleBossCopy) {
                    WindowManager.instance.close(WindowEnum.CashEquip_PANEL);
                    WindowManager.instance.close(WindowEnum.CashEquip_ALERT);
                } else if (type === SceneTypeEx.teamCopy) {
                    WindowManager.instance.open(WindowEnum.TEAM_BATTLE_AWARD_PANEL);
                    WindowManager.instance.close(WindowEnum.TEAM_BATTLE_PANEL);
                    WindowManager.instance.close(WindowEnum.TEAM_BATTLE_MATCH_ALERT);
                } else if (type === SceneTypeEx.marryCopy) {
                    WindowManager.instance.close(WindowEnum.MARRY_Copy_Alert);
                    WindowManager.instance.open(WindowEnum.MARRY_BATTLE_AWARD_PANEL);
                } else if (type === SceneTypeEx.nineCopy) {        // 九天之巅
                    if (SceneModel.instance.enterScene[EnterSceneFields.level] === 1) {       // 第一层进场景提示
                        WindowManager.instance.open(WindowEnum.NINE_ENTER_TIP_PANEL);
                    }
                    if (SceneModel.instance.enterScene[EnterSceneFields.level] !== 9) {
                        WindowManager.instance.open(WindowEnum.NINE_RB_PANEL);
                    } else {
                        WindowManager.instance.close(WindowEnum.DUNGEON_LB_PANEL);
                        WindowManager.instance.close(WindowEnum.NINE_RB_PANEL);
                    }
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                } else if (type === SceneTypeEx.xuanhuoCopy) {        // 战队玄火
                    // if (SceneModel.instance.enterScene[EnterSceneFields.level] === 1) {       // 第一层进场景提示
                    //     WindowManager.instance.open(WindowEnum.NINE_ENTER_TIP_PANEL);
                    // }


                    WindowManager.instance.open(WindowEnum.XUANHUO_BOSS_ANDPLAYERLIST_PANEL);
                    WindowManager.instance.open(WindowEnum.XUANHUO_LEFT_PANEL);
                    WindowManager.instance.open(WindowEnum.XUANHUO_RB_PANEL);


                    // } else {
                    //     WindowManager.instance.close(WindowEnum.DUNGEON_LB_PANEL);
                    //     WindowManager.instance.close(WindowEnum.NINE_RB_PANEL);
                    // }
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                } else if (type === SceneTypeEx.homestead) {
                    WindowManager.instance.open(WindowEnum.XIANFU_TOP_PANEL);
                    WindowManager.instance.open(WindowEnum.XIANFU_LEFT_BOTTOM_PANEL);
                    WindowManager.instance.open(WindowEnum.XIANFU_BOTTOM_PANEL);
                    WindowManager.instance.open(WindowEnum.XIANFU_RIGHT_BOTTOM_PANEL);
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                } else if (type === SceneTypeEx.tiantiCopy) {
                    PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
                } else if (type === SceneTypeEx.richesCopy) {        // 天降财宝
                    WindowManager.instance.open(WindowEnum.DAYDROP_TREASURE_TIP_PANLE);
                    WindowManager.instance.open(WindowEnum.DAYDROP_TREASURE_BOTTOM_PANLE);
                    WindowManager.instance.open(WindowEnum.DAYDROP_TREASURE_RIGHT_PANLE);
                } else if (type === SceneTypeEx.cloudlandCopy) {
                    WindowManager.instance.open(WindowEnum.YUNMENGMIJING_BOSS_PANLE);
                    WindowManager.instance.open(WindowEnum.YUNMENGMIJING_INFORMATIOM_PANLE);
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                } else if (type === SceneTypeEx.fairy) {
                    PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
                } else if (type === SceneTypeEx.swimming) {
                    WindowManager.instance.open(WindowEnum.KUNLUN_GAME_PANLE);
                    WindowManager.instance.open(WindowEnum.KUNLUN_BUFF_PANLE);
                    WindowManager.instance.open(WindowEnum.KUNLUN_GAIN_PANLE);
                } else if (type === SceneTypeEx.adventruePK) {
                    PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
                } else if (type === SceneTypeEx.adventrueMonster) {
                    WindowManager.instance.open(WindowEnum.ADVENTURE_MONSTER_PANEL);
                } else if (type === SceneTypeEx.adventrueBoss) {
                    PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
                } else if (type === SceneTypeEx.arenaCopy) {//群仙竞技场
                    PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
                } else if (type === SceneTypeEx.faction) {  //仙盟诛仙
                    FactionCtrl.instance.getHurtAwardList();
                    WindowManager.instance.open(WindowEnum.FACTION_COPY_RB_PANEL);
                    WindowManager.instance.open(WindowEnum.FACTION_COPY_BOTTOM_PANEL);
                } else if (type === SceneTypeEx.arenaCopy) {
                    PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
                }
                else if (type === SceneTypeEx.templeBoss) {//圣殿BOSS
                    WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_ANDPLAYERLIST_PANEL);
                    WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_INFORMATION_PANEL);
                    WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_LEFT_PANEL, 0);
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                } else if (type === SceneTypeEx.teamChiefCopy) {
                    WindowManager.instance.open(WindowEnum.TEAMCHIEF_COPY_BOTTOM_PANEL);
                } else if (type === SceneTypeEx.teamPrepare) {
                    WindowManager.instance.open(WindowEnum.TEAMPREPARE_COPY_BOTTOM_PANEL);
                } else if (type === SceneTypeEx.teamBattleCopy) {
                    WindowManager.instance.close(WindowEnum.TEAMPREPARE_COPY_BOTTOM_PANEL);
                    WindowManager.instance.open(WindowEnum.TEAMPBATTLE_COPY_CROSS_TOP_PANEL);
                    WindowManager.instance.open(WindowEnum.TEAMPBATTLE_COPY_CROSS_RB_PANEL);
                }

            }


            ActivityPreviewCtrl.instance.updateSceneState();
        }

        private showMissionMaskPanel(): void {
            WindowManager.instance.open(WindowEnum.MISSION_MASK_PANEL);
        }

        public leaveScene(sceneId: number): void {
            let cfg: scene = SceneCfg.instance.getCfgById(sceneId);
            let type: int = cfg[sceneFields.type];
            if (type == SceneTypeEx.singleBossCopy) {
                // WindowManager.instance.open(WindowEnum.SINGLE_BOSS_PANEL);
            } else if (type === SceneTypeEx.tiantiCopy) {  // 天梯
                // WindowManager.instance.open(WindowEnum.LADDER_PANEL);
            } else if (type === SceneTypeEx.adventrueMonster || type === SceneTypeEx.adventrueBoss || type === SceneTypeEx.adventruePK) {
                // WindowManager.instance.open(WindowEnum.ADVENTURE_PANEL);
                AdventureModel.instance.dropItems.length = 0;
                WindowManager.instance.close(WindowEnum.ADVENTURE_MONSTER_PANEL);
            }
        }

        // 领取副本奖励
        public getCopyAward(mapId: number, level: number, bigAward: number = 0): void {
            Channel.instance.publish(UserFeatureOpcode.GetCopyAward, [mapId, level, bigAward]);
        }

        // 领取副本奖励返回
        private getCopyAwardReply(tuple: GetCopyAwardReply): void {
            let result: number = tuple[GetCopyAwardReplyFields.result];
            if (result === 0) {
            } else {
                // CommonUtil.alert("提示", "领取天关奖励失败：" + result);
                CommonUtil.noticeError(result);
            }
            GlobalData.dispatcher.event(CommonEventType.MISSION_UPDATE);
        }

        // 鼓舞，1金币2代币券
        public reqInspire(type: int, auto: boolean = false): void {
            LogUtils.info(LogFlags.DungeonCtrl, "鼓舞................" + type);
            Channel.instance.publish(UserMapOpcode.ReqInspire, [type, auto]);
        }

        // 鼓舞返回
        private reqInspireReply(value: ReqInspireReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "鼓舞返回..............." + value);
            CommonUtil.noticeError(value[ReqInspireReplyFields.result]);
            // if(value[ReqInspireReplyFields.result] === 0){
            //
            // }
        }

        // 更新鼓舞
        private updateInspire(value: UpdateInspire): void {
            LogUtils.info(LogFlags.DungeonCtrl, "更新鼓舞...................." + value);
            DungeonModel.instance.inspires = value[UpdateInspireFields.inspires];
        }

        // 请求购买副本次数
        public buyTimes(mapId: number): void {
            LogUtils.info(LogFlags.DungeonCtrl, "请求购买副本次数.................." + mapId);
            Channel.instance.publish(UserFeatureOpcode.BuyTimes, [mapId]);
        }

        // 获取副本次数
        public getCopyTimes(): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取副本次数.............");
            Channel.instance.publish(UserFeatureOpcode.GetCopyTimes, null);
        }

        // 获取多人组队副本次数返回
        private getCopyTimesReply(value: GetCopyTimesReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取副本次数返回................." + value);
            DungeonModel.instance.getCopyTimesReply(value);
        }

        // 更新副本次数
        private updateCopyTimes(value: UpdateCopyTimes): void {
            //LogUtils.info(LogFlags.DungeonCtrl, "更新副本次数..............." + value);
            DungeonModel.instance.updateCopyTimes(value);
        }

        // 广播开始战斗
        private broadcastBeginCombat(value: BroadcastBeginCombat): void {
            console.log(LogFlags.DungeonCtrl, "广播开始战斗.................." + value);
            // console.log(`SceneTypeEx --- ${this._sceneType}`);
            DungeonModel.instance.broadcastBeginCombat = value;
            if (this._sceneType === SceneTypeEx.teamCopy) {  //组队副本
                WindowManager.instance.open(WindowEnum.TEAM_BATTLE_TOP_PANEL);
            } else if (this._sceneType === SceneTypeEx.tiantiCopy) {   // 天梯不打开结束时间面板

            }       // 奇遇不打开结束时间面板
            else if (this._sceneType === SceneTypeEx.adventruePK || this._sceneType === SceneTypeEx.adventrueBoss ||
                this._sceneType === SceneTypeEx.arenaCopy || this._sceneType === SceneTypeEx.xuanhuoCopy) {

            } else {
                WindowManager.instance.open(WindowEnum.END_TIME_PANEL);
            }
            if ((this._sceneType !== SceneTypeEx.dahuangCopy) &&
                (this._sceneType !== SceneTypeEx.runeCopy) &&
                (this._sceneType !== SceneTypeEx.richesCopy) &&
                (this._sceneType !== SceneTypeEx.swimming) &&
                (this._sceneType !== SceneTypeEx.fairy) &&
                (this._sceneType !== SceneTypeEx.homestead)
            ) {
                if (!this._startFightClip) {
                    this._startFightClip = new CustomClip();
                    let arr: Array<string> = [];
                    for (let i: int = 0; i < 8; i++) {
                        arr.push("assets/effect/start_fight/" + i + ".png");
                    }
                    this._startFightClip.frameUrls = arr;
                    this._startFightClip.loop = false;
                    this._startFightClip.autoRemove = true;
                    this._startFightClip.durationFrame = 5;
                }
                this._startFightClip.pos(CommonConfig.viewWidth * 0.5 - 400, 300, true);
                this._startFightClip.play();
                LayerManager.instance.addToEffectLayer(this._startFightClip);

                // if(this._sceneType === SceneTypeEx.adventruePK){        // 奇遇PK播完特效之后才战斗
                //     Laya.timer.frameOnce(40, this, this.endEffectHandler);
                // }
            }
        }

        // private endEffectHandler():void{
        //     PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
        // }

        // 广播结束战斗
        private broadcastEndCombat(value: BroadcastEndCombat): void {
            LogUtils.info(LogFlags.DungeonCtrl, "广播结束战斗.................." + value);
            DungeonModel.instance.broadcastEndCombat = value;
        }

        // 广播怪物波数
        private broadcastCopyMonsterWare(value: BroadcastCopyMonsterWare): void {
            //LogUtils.info(LogFlags.DungeonCtrl, "广播怪物波数.................." + value);
            DungeonModel.instance.broadcastCopyMonsterWare = value;
        }

        //广播组队怪物波数
        private broadcastTeamCopyMonsterWare(tuple: BroadcastTeamCopyMonsterWare): void {
            TeamBattleModel.Instance.updataWave(tuple[BroadcastTeamCopyMonsterWareFields.monsterWare]);
        }

        //广播姻缘怪物波数
        private BroadcastMarryCopyMonsterWare(tuple: BroadcastMarryCopyMonsterWare): void {
            MarryModel.instance.updataWave(tuple[BroadcastMarryCopyMonsterWareFields.monsterWare]);
        }



        // 广播副本收益
        private broadcastCopyIncome(value: BroadcastCopyIncome): void {
            LogUtils.info(LogFlags.DungeonCtrl, "广播副本收益..................." + value);
            DungeonModel.instance.broadcastCopyIncome = value;
        }

        // 广播副本星级
        private broadcastCopyStar(value: BroadcastCopyStar): void {
            LogUtils.info(LogFlags.DungeonCtrl, "广播副本星级....................." + value);
            DungeonModel.instance.broadcastCopyStar = value;
        }

        // 更新收益记录
        private updateIncomeRecord(value: UpdateIncomeRecord): void {
            LogUtils.info(LogFlags.DungeonCtrl, "更新收益记录..................." + value);
            DungeonModel.instance.updateIncomeRecord = value;
        }

        // 扫荡副本
        public sweepCopy(mapId: number): void {
            // console.log("扫荡副本");
            LogUtils.info(LogFlags.DungeonCtrl, "扫荡副本............." + mapId);
            Channel.instance.publish(UserFeatureOpcode.SweepCopy, [mapId]);
        }

        // 扫荡副本返回
        private sweepCopyReply(value: SweepCopyReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "扫荡副本返回................." + value);
            let result: number = value[SweepCopyReplyFields.result];
            let mapId: number = value[SweepCopyReplyFields.mapId];
            if (result !== 0) {
                CommonUtil.noticeError(result);
            }
            else {
                SystemNoticeManager.instance.addNotice("扫荡成功", false);
            }
        }
        /**
         * 一键扫荡试炼副本
         */
        public oneKeySweepShilianCopy() {
            // console.log("一键扫荡试炼副本");
            Channel.instance.publish(UserFeatureOpcode.OneKeySweepShilianCopy, null);
        }
        /**
               * 一键挑战试炼副本
               */
        public oneKeyChallengeShilianCopy() {
            // console.log("一键挑战试炼副本");
            Channel.instance.publish(UserFeatureOpcode.OneKeyChallengeShilianCopy, null);
        }
        // 一键扫荡试炼副本 返回
        private oneKeySweepShilianCopyReply(value: Protocols.OneKeySweepShilianCopyReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, " 一键扫荡试炼副本 返回................." + value);
            let result: number = value[Protocols.OneKeySweepShilianCopyReplyFields.result];
            if (result !== 0) {
                CommonUtil.noticeError(result);
            }
            else {
                SystemNoticeManager.instance.addNotice("一键扫荡成功", false);
                GlobalData.dispatcher.event(CommonEventType.YIJIAN_SAODANG_UPDATE);

            }
        }
        //一键挑战试炼副本 返回
        private oneKeyChallengeShilianCopyReply(value: Protocols.OneKeyChallengeShilianCopyReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, " 一键挑战试炼副本 返回................." + value);
            let result: number = value[Protocols.OneKeyChallengeShilianCopyReplyFields.result];
            if (result !== 0) {
                CommonUtil.noticeError(result);
            }
            else {
                SystemNoticeManager.instance.addNotice("一键挑战成功", false);
                GlobalData.dispatcher.event(CommonEventType.YIJIAN_SAODANG_UPDATE);

            }
        }
        // 领取参与奖励
        public getJoinAward(): void {
            LogUtils.info(LogFlags.DungeonCtrl, "请求领取参与奖励..................");
            Channel.instance.publish(UserMapOpcode.GetJoinAward, null);
        }

        // 领取参与奖励返回
        private getJoinAwardReply(value: GetJoinAwardReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "领取参与奖励返回..................." + value);
            let code: number = value[GetJoinAwardReplyFields.result];
            if (code !== 0) {
                CommonUtil.noticeError(code);
            }
        }

        // 公共BOSS进入时BOSS已死
        private updateEnterLater(value: UpdateEnterLater): void {
            let handler: Handler = Handler.create(this, () => {
                DungeonCtrl.instance.reqEnterScene();
                // console.log("BOSS已被击杀 直接退出場景");
            });
            CommonUtil.alert("提示", "您来晚了，BOSS已被击杀。", [handler]);
        }

        // 更新参与奖励
        private updateJoinAward(value: UpdateJoinAward): void {
            LogUtils.info(LogFlags.DungeonCtrl, "更新参与奖励..................." + value);
            DungeonModel.instance.joinAward = value;
        }

        // 获取BOSS信息
        public getBoss(): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取多人BOSS信息");
            Channel.instance.publish(UserCenterOpcode.GetBoss, null);
        }

        // 获取BOSS信息返回
        private getBossReply(tuple: GetBossReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取多人BOSS信息返回............" + tuple);
            DungeonModel.instance.updateBossInfos(tuple[GetBossReplyFields.bossInfos]);
        }

        // 更新BOSS 死亡、重生推送
        private updateBoss(tuple: UpdateBoss): void {
            LogUtils.info(LogFlags.DungeonCtrl, "更新BOSS 死亡、重生推送............" + tuple);
            DungeonModel.instance.updateBossInfos(tuple[UpdateBossFields.bossInfos]);
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BOSS_DEAD_REVIVE, [tuple[UpdateBossFields.bossInfos]]);
        }

        // 更新BOSS伤害排行
        private updateBossHurtRack(tuple: UpdateBossHurtRack): void {
            LogUtils.info(LogFlags.DungeonCtrl, "更新BOSS伤害排行............" + tuple);
            DungeonModel.instance.ranks = tuple[UpdateBossHurtRackFields.hurtRank];
        }

        // 获取BOSS次数
        public getBossTimes(): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取BOSS次数............");
            Channel.instance.publish(UserFeatureOpcode.GetBossTimes, null);
        }

        // 获取BOSS次数返回
        private getBossTimesReply(tuple: GetBossTimesReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取BOSS次数返回............" + tuple);
            DungeonModel.instance.bossTimesArr = tuple[GetBossTimesReplyFields.bossTimes];
        }

        // 更新BOSS次数
        private updateBossTimes(tuple: UpdateBossTimes): void {
            LogUtils.info(LogFlags.DungeonCtrl, "更新BOSS次数............" + tuple);
            DungeonModel.instance.bossTimes = tuple[UpdateBossTimesFields.bossTimes];
        }

        // 购买副本次数返回
        private buyTimesReply(value: BuyTimesReply): void {
            let code: number = value[BuyTimesReplyFields.result];
            if (code == 12012) {
                CommonUtil.goldNotEnoughAlert();
            } else if (code == 0) {
                SystemNoticeManager.instance.addNotice(`购买成功`);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            WindowManager.instance.close(WindowEnum.VIP_TIMES_ALERT);
        }

        // 获取关注的BOSS
        public getFollowBoss(): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取关注的BOSS............");
            Channel.instance.publish(UserFeatureOpcode.GetFollowBoss, null);
        }

        // 获取关注的BOSS返回
        private getFollowBossReply(tuple: GetFollowBossReply): void {
            LogUtils.info(LogFlags.DungeonCtrl, "获取关注的BOSS返回............" + tuple);
            DungeonModel.instance.follows = tuple[GetFollowBossReplyFields.follows];
        }

        // 设置关注BOSS
        public setFollowBoss(bossId: number, isFollow: boolean): void {
            LogUtils.info(LogFlags.DungeonCtrl, "设置关注BOSS............" + bossId + "   " + isFollow);
            Channel.instance.publish(UserFeatureOpcode.SetFollowBoss, [[bossId, isFollow]]);
        }

        // 请求进入下一层
        public reqEnterNextLevel(): void {
            Channel.instance.publish(UserMapOpcode.ReqEnterNextLevel, null);
        }

        //进入下一层返回
        private reqEnterNextLevelReply(tuple: ReqEnterNextLevelReply) {
            let result: number = tuple[ReqEnterNextLevelReplyFields.result];
            if (result === 0) {
            } else {
                // CommonUtil.alert("提示", "领取天关奖励失败：" + result);
                CommonUtil.noticeError(result);
            }

        }

        //怪物击杀副本传送
        public reqEnterKillMonsterCopyTransmit(): void {
            Channel.instance.publish(UserMapOpcode.KillMonsterCopyTransmit, null);
        }

        //游历副本传送
        public reqEnterAdventureCopyTransmit(): void {
            Channel.instance.publish(UserMapOpcode.AdventureCopyTransmit, null);
        }

        // 强敌来袭
        private broadcastEnemyInvad(value: BroadcastEnemyInvad): void {
            let sceneId: int = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let cfg: scene = SceneCfg.instance.getCfgById(sceneId);
            let type: int = cfg[sceneFields.type];
            if (type === SceneTypeEx.tianguanCopy) {         // 天关
                WindowManager.instance.open(WindowEnum.DUNGEON_ENTER_EFFECT);
            } else if (type === SceneTypeEx.multiBoss) {     // 多人BOSS
                Laya.timer.once(300, this, (): void => {
                    let bossId: number = SceneMultiBossCfg.instance.getCfgByLv(SceneModel.instance.enterScene[EnterSceneFields.level])[scene_multi_bossFields.occ];
                    let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(bossId);
                    if (bossInfo && !bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {
                        WindowManager.instance.open(WindowEnum.DUNGEON_ENTER_EFFECT);
                    }
                });
            } else if (type === SceneTypeEx.crossBoss) {
                let bossId: number = SceneCrossBossCfg.instance.getCfgByMapIdAndLv(sceneId, SceneModel.instance.enterScene[EnterSceneFields.level])[scene_cross_bossFields.occ];
                if (DungeonModel.instance.getBossInfoById(bossId)) {
                    if (!DungeonModel.instance.getBossInfoById(bossId)[BossInfoFields.bossState][BossStateFields.dead]) {
                        WindowManager.instance.open(WindowEnum.DUNGEON_ENTER_EFFECT);
                    }
                }
            } else if (type == SceneTypeEx.dahuangCopy) {
                WindowManager.instance.open(WindowEnum.DUNGEON_ENTER_EFFECT);
                WindowManager.instance.open(WindowEnum.BIG_TOWER_LEVEL_PANLE, 0);
            } else if (type == SceneTypeEx.singleBossCopy) {
                WindowManager.instance.open(WindowEnum.DUNGEON_ENTER_EFFECT);
            } else if (type == SceneTypeEx.runeCopy) {
                WindowManager.instance.open(WindowEnum.DUNGEON_ENTER_EFFECT);
                WindowManager.instance.open(WindowEnum.BIG_TOWER_LEVEL_PANLE, 1);
            }
        }

        // 获取场景状态
        public getSceneState(): void {
            // LogUtils.info(LogFlags.Nine, "获取场景状态.......................");
            Channel.instance.publish(UserFeatureOpcode.GetSceneState, null);
        }

        // 获取场景状态返回
        private getSceneStateReply(value: GetSceneStateReply): void {
            if (!value) {
                return;
            }
            // console.log("获取场景状态返回", value, value[GetSceneStateReplyFields.states])
            LogUtils.info(LogFlags.Nine, "获取场景状态返回.................." + value);
            DungeonModel.instance.initStates(value[GetSceneStateReplyFields.states]);
        }

        // 广播场景状态
        private broadcasSceneState(value: BroadcasSceneState): void {
            LogUtils.info(LogFlags.Nine, "广播场景状态......................." + value);
            // console.log("广播场景状态", value)
            DungeonModel.instance.updateStates(value[BroadcasSceneStateFields.states]);
        }

        //
        /*获取优先提示返回(用于失败界面)*/
        public getTipsPriorInfo() {
            Channel.instance.publish(UserFeatureOpcode.GetTipsPriorInfo, null);
        }

        /*获取优先提示返回(用于失败界面)*/
        private getTipsPriorInfoReply(value: GetTipsPriorInfoReply): void {
            LogUtils.info(LogFlags.Nine, "获取优先提示返回......................." + value);
            DungeonModel.instance.tipType = value[GetTipsPriorInfoReplyFields.type];
        }

        private getBossIsFirstReply(tuple: Protocols.GetBossIsFirstReply): void {
            DungeonModel.instance.firstBoss = tuple[Protocols.GetBossIsFirstReplyFields.isFirst];
        }

        // 设置自动鼓舞状态
        public setAutoInspire(sceneType: SceneTypeEx, type: number, auto: boolean): void {
            Channel.instance.publish(UserFeatureOpcode.SetAutoInspire, [sceneType, type, auto]);
        }

        // 获取自动鼓舞状态
        public getAutoInspire(): void {
            Channel.instance.publish(UserFeatureOpcode.GetAutoInspire, null);
        }

        /*获取自动鼓舞状态返回*/
        private GetAutoInspireReply(value: GetAutoInspireReply): void {
            DungeonModel.instance.autoInspire = value[GetAutoInspireReplyFields.inspires]
        }
    }
}