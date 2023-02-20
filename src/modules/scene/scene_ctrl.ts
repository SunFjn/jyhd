/** 场景控制器*/
///<reference path="../player/player_model.ts"/>
///<reference path="../open_award/open_award_ctrl.ts"/>
///<reference path="../../base/mesh/lwjs_avatar.ts"/>
///<reference path="../../base/materials/material_initializer.ts"/>
///<reference path="../quick_use/quick_use_ctrl.ts"/>
///<reference path="../mission/mission_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../main/main_ctrl.ts"/>
///<reference path="../sign/sign_ctrl.ts"/>
///<reference path="../magic_weapon/magic_weapon_ctrl.ts"/>
///<reference path="../single_boss/single_boss_ctrl.ts"/>
///<reference path="../talisman/talisman_ctrl.ts"/>
///<reference path="../multi_boss/multi_boss_ctrl.ts"/>
///<reference path="../intensive/intensive_ctrl.ts"/>
///<reference path="../stone/stone_ctrl.ts"/>
///<reference path="../compose/compose_ctrl.ts"/>
///<reference path="../online_gift/online_gift_ctrl.ts"/>
///<reference path="../ranking_list/player_ranking_ctrl.ts"/>
///<reference path="../three_worlds/three_worlds_ctrl.ts"/>
///<reference path="../boss_home/boss_home_model.ts"/>
///<reference path="../offline/offline_ctrl.ts"/>
///<reference path="../month_card/month_card_ctrl.ts"/>
///<reference path="../immortals/immortals_ctrl.ts"/>
///<reference path="../wing/wing_ctrl.ts"/>
///<reference path="../treasure/treasure_ctrl.ts"/>
///<reference path="../recharge/recharge_ctrl.ts"/>
///<reference path="../buff/buff_ctrl.ts"/>
///<reference path="../first_pay/first_pay_ctrl.ts"/>
///<reference path="../line_clear_out/line_clear_out_ctrl.ts"/>
///<reference path="../../game/game_center.ts"/>
///<reference path="../nine/nine_ctrl.ts"/>
///<reference path="../nine/nine_model.ts"/>

///<reference path="../day_pay/day_pay_ctrl.ts"/>
///<reference path="../cumulate_pay/cumulate_pay_ctrl.ts"/>
///<reference path="../activity_preview/activity_preview_ctrl.ts"/>
///<reference path="../zerobuy/zero_buy_ctrl.ts"/>
///<reference path="../continue_pay/continue_pay_ctrl.ts"/>
///<reference path="../consume_reward/consume_reward_ctrl.ts"/>
///<reference path="../invest_reward/invest_reward_ctrl.ts"/>
///<reference path="../sprint_rank_task/sprint_rank_task_ctrl.ts"/>
///<reference path="../ladder/ladder_ctrl.ts"/>
///<reference path="../pay_reward/pay_reward_ctrl.ts"/>
///<reference path="../sprint_rank/sprint_rank_ctrl.ts"/>
///<reference path="../gushen/gushen_ctrl.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_ctrl.ts"/>
///<reference path="../kunlun/kunlun_ctrl.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_ctrl.ts"/>
///<reference path="../kuanghuan/kuanghuan_ctrl.ts"/>
///<reference path="../cumulate2_pay/cumulate2_pay_ctrl.ts"/>
/**daw  src\modules\common\modules_util.ts 如果class ModulesUtil 报错找不到引用 就是这里添加*/
///<reference path="../cumulate3_pay/cumulate3_pay_ctrl.ts"/>
///<reference path="../adventure/adventure_ctrl.ts"/>
///<reference path="../guide/guide_ctrl.ts"/>
///<reference path="../discount_gift/discountGift_ctrl.ts"/>
///<reference path="../day_consume_reward/day_consume_reward_ctrl.ts"/>
///<reference path="../adventure/adventure_model.ts"/>
///<reference path="../xianfu/xianfu_ctrl.ts"/>
///<reference path="../faction/faction_ctrl.ts"/>
///<reference path="../equip_suit/equip_suit_ctrl.ts"/>

///<reference path="../action_preview/action_preview_ctrl.ts"/>
///<reference path="../player_title/player_title_ctrl.ts"/>
///<reference path="../soaring_rank/soaring_rank_ctrl.ts"/>
///<reference path="../arena/arena_ctrl.ts"/>EquipmentZuHunCtrl
///<reference path="../soaring_cumulatePay/soaring_cumulatePay_ctrl.ts"/>
///<reference path="../soaring_singlePay/soaring_singlePay_ctrl.ts"/>
///<reference path="../soaring_specialGift/soaring_specialGift_ctrl.ts"/>
///<reference path="../soaring_dayConsumeReward/soaring_dayConsumeReward_ctrl.ts"/>
///<reference path="../soaring_panicBuyingGift/soaring_panicBuyingGift_ctrl.ts"/>
///<reference path="../every_day_rebate/every_day_rebate_ctrl.ts"/>
///<reference path="../fashion/fashion_ctrl.ts"/>
///<reference path="../tian_zhu/tian_zhu_ctrl.ts"/>
///<reference path="../half_month_gift/half_month_gift_ctrl.ts"/>
///<reference path="../xi_lian/xi_lian_ctrl.ts"/>
///<reference path="../equipment_zu_hun/equipment_zu_hun_ctrl.ts"/>
///<reference path="../cumulatePay_shenHun/cumulatePay_shenHun_ctrl.ts"/>
///<reference path="../cumulatePay_tianZhu/cumulatePay_tianZhu_ctrl.ts"/>
///<reference path="../rotary_table_soraing/rotary_table_soraing_ctrl.ts"/>
///<reference path="../rotary_table_jiuzhou/rotary_table_jiuzhou_ctrl.ts"/>
///<reference path="../login_reward/login_reward_ctrl.ts"/>

///<reference path="../week_login/week_login_ctrl.ts"/>

///<reference path="../seven_day_gift/seven_day_gift_crtl.ts"/>
///<reference path="../single_pay/single_pay_ctrl.ts"/>
///<reference path="../repeat_pay/repeat_pay_ctrl.ts"/>
///<reference path="../feed_back/feed_back_ctrl.ts"/>
///<reference path="../zhizun/zhizun_ctrl.ts"/>
///<reference path="../announcement/announcement_ctrl.ts"/>
///<reference path="../limit_pack/limit_pack_ctrl.ts"/>
/// <reference path="../pay_rank/pay_rank_ctrl.ts" />
/// <reference path="../invitation/invitation_ctrl.ts" />
/// <reference path="../vip_new/vip_new_ctrl.ts" />
/// <reference path="../zxian_yu/zxian_yu_ctrl.ts" />
///<reference path="../common/modules_util.ts"/>
///<reference path="../boss_dungeon/boss_dungeon_ctrl.ts"/>
///<reference path="../xuanhuo/xuanhuo_ctrl.ts"/>
///<reference path="../xuanhuo/xuanhuo_model.ts"/>

namespace modules.scene {
    import MaterialInitializer = base.materials.MaterialInitializer;
    import MonsterResFields = Configuration.MonsterResFields;
    import npcFields = Configuration.npcFields;
    import GameCenter = game.GameCenter;
    import World = game.world.World;
    import Point = Laya.Point;
    import BossHomeModel = modules.bossHome.BossHomeModel;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import NpcCfg = modules.config.NpcCfg;
    import BaseCtrl = modules.core.BaseCtrl;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import DungeonModel = modules.dungeon.DungeonModel;
    import MainCtrl = modules.main.MainCtrl;
    import BossReviveManager = modules.notice.BossReviveManager;
    import PlayerModel = modules.player.PlayerModel;
    import Channel = net.Channel;
    import ActorShowFields = Protocols.ActorShowFields;
    import BroadcastActorShow = Protocols.BroadcastActorShow;
    import BroadcastActorShowFields = Protocols.BroadcastActorShowFields;
    import BroadcastDeadFields = Protocols.BroadcastDeadFields;
    import BroadcastEnterScreenFields = Protocols.BroadcastEnterScreenFields;
    import BroadcastHpFields = Protocols.BroadcastHpFields;
    import BroadcastLeaveScreenFields = Protocols.BroadcastLeaveScreenFields;
    import BroadcastMoveFields = Protocols.BroadcastMoveFields;
    import UpDateSpeedFields = Protocols.UpDateSpeedFields;
    import BroadcastPlaySkillFields = Protocols.BroadcastPlaySkillFields;
    import BroadcastReviveFields = Protocols.BroadcastReviveFields;
    import CombatHurtFields = Protocols.CombatHurtFields;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import HumanShowFields = Protocols.HumanShowFields;
    import MonsterShowFields = Protocols.MonsterShowFields;
    import NpcShowFields = Protocols.NpcShowFields;
    import ReqReviveReplyFields = Protocols.ReqReviveReplyFields;
    import SystemClientOpcode = Protocols.SystemClientOpcode;
    import TransmitPos = Protocols.TransmitPos;
    import TransmitPosFields = Protocols.TransmitPosFields;
    import UpdateHpFields = Protocols.UpdateHpFields;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import TableUtils = utils.TableUtils;
    import UpdateChangeMap = Protocols.UpdateChangeMap;
    import UpdateBossBirthPos = Protocols.UpdateBossBirthPos;
    import UpdateBossBirthPosFields = Protocols.UpdateBossBirthPosFields;
    import UpdatePKMode = Protocols.UpdatePKMode;
    import LogUtils = game.misc.LogUtils;
    import UpdatePKModeFields = Protocols.UpdatePKModeFields;
    import UpdateActorState = Protocols.UpdateActorState;
    import UpdateChangeMapFields = Protocols.UpdateChangeMapFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import LeaveSceneFields = Protocols.LeaveSceneFields;
    import UpdateActorStateFields = Protocols.UpdateActorStateFields;
    import NineModel = modules.nine.NineModel;
    import XuanHuoModel = modules.xuanhuo.XuanHuoModel;
    import UpdateDropItem = Protocols.UpdateDropItem;
    import UpdateDropItemFields = Protocols.UpdateDropItemFields;
    import ItemsFields = Protocols.ItemsFields;
    import UpdateNpc = Protocols.UpdateNpc;
    import UpdateNpcFields = Protocols.UpdateNpcFields;
    import AdventureModel = modules.adventure.AdventureModel;
    import SoundCtrl = modules.sound.SoundCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import RecoverQueue = base.assets.RecoverQueue;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import PlaySkillReplyFields = Protocols.PlaySkillReplyFields;
    import TypesAttr = Protocols.TypesAttr;
    import TypesAttrFields = Protocols.TypesAttrFields;
    import ModulesUtil = modules.common.ModulesUtil;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import BossDungeonCtrl = modules.bossDungeon.BossDungeonCtrl;
    import MapSpriteLayer = game.map.MapSpriteLayer;
    import TitleComponent = game.role.component.TitleComponent;

    import List = utils.collections.List;
    import ShiftMsg = Protocols.ShiftMsg;
    import ShiftMsgFields = Protocols.ShiftMsgFields;
    import PosFields = Protocols.PosFields;

    import BroadcastData = Protocols.BroadcastData;
    import BroadcastDataFields = Protocols.BroadcastDataFields;

    type delayDeathData = [number, number, boolean];
    const enum delayDeathDataFields {
        objId = 0,           // 对象ID
        time,                // 延迟判断
        isBoss,             // 是否BOSS 判断播放动画
    }
    export class SceneCtrl extends BaseCtrl {
        private static _instance: SceneCtrl;

        public static get instance(): SceneCtrl {
            return this._instance = this._instance || new SceneCtrl();
        }

        private _first: boolean;
        private _tuple: Protocols.EnterScene;
        private _world: World;
        private _sceneType: SceneTypeEx;
        private _isEnterScene: boolean;

        // 是否第一次发送登录完成（部分请求需要放在登录完成的时候处理，比如离线收益）
        private _isFirstLoginComplete: boolean;

        private _delayDeathList: List<delayDeathData>
        private _delayDeathCopy: List<delayDeathData>
        private constructor() {
            super();
            this._first = true;
            this._isFirstLoginComplete = true;
            this._isEnterScene = false;

            this._delayDeathList = new List<delayDeathData>();
            this._delayDeathCopy = new List<delayDeathData>();
        }
        private onUpdate(): void {
            this.checkDeath();
        }

        private checkDeath() {
            if (this._delayDeathList.isEmpty) return;
            let now = Date.now();
            do {
                let e = this._delayDeathList.shift();
                let del = false;
                let isBoss = e[delayDeathDataFields.isBoss]; //BOSS不做延迟死亡
                if (now >= e[delayDeathDataFields.time] || isBoss) {
                    let role = GameCenter.instance.getRole(e[delayDeathDataFields.objId]);
                    if (role == null) continue;
                    if (role.getComponent(TitleComponent).hurtEmpty() || isBoss) {
                        // 可以死亡
                        del = true
                        if (isBoss) Laya.timer.once(0, this, this.delayBossDeath, [role.property.get("pos")])
                        role.property.set("delayDeath", false);
                        role.property.set("status", RoleState.DEATH);
                        role.property.event("status", RoleState.DEATH);
                    } else {
                        // 继续延迟
                        e[delayDeathDataFields.time] = now + 50
                    }

                }
                if (!del) this._delayDeathCopy.unshift(e)
            } while (!this._delayDeathList.isEmpty);
            this._delayDeathList.swap(this._delayDeathCopy);
        }
        private leaveDeath() {
            if (this._delayDeathList.isEmpty) return;
            do {
                let e = this._delayDeathList.shift();
                let role = GameCenter.instance.getRole(e[delayDeathDataFields.objId]);
                if (role == null) continue;
                role.property.set("delayDeath", false);
                role.property.set("status", RoleState.DEATH);
                role.property.event("status", RoleState.DEATH);
            } while (!this._delayDeathList.isEmpty);

        }

        public setup(): void {
            Channel.instance
                .subscribe(SystemClientOpcode.EnterScene, this, this.enterScene)
                .subscribe(SystemClientOpcode.LeaveScene, this, this.leaveScene)
                .subscribe(SystemClientOpcode.BroadcastEnterScreen, this, this.broadcastEnterScreen)
                .subscribe(SystemClientOpcode.BroadcastLeaveScreen, this, this.broadcastLeaveScreen)
                .subscribe(SystemClientOpcode.BroadcastMove, this, this.broadcastMove)
                //.subscribe(SystemClientOpcode.BroadcastUpDateSpeed, this, this.broadcastUpDateSpeed)
                .subscribe(SystemClientOpcode.BroadcastHp, this, this.broadcastHp)
                .subscribe(SystemClientOpcode.UpdateHp, this, this.updateHp)
                .subscribe(SystemClientOpcode.ReqReviveReply, this, this.reqReviveReply)
                .subscribe(SystemClientOpcode.BroadcastRevive, this, this.broadcastRevive)
                .subscribe(SystemClientOpcode.BroadcastDead, this, this.broadcastDead)
                .subscribe(SystemClientOpcode.BroadcastPlaySkill, this, this.broadcastPlaySkill)
                .subscribe(SystemClientOpcode.TransmitPos, this, this.transmitPos)
                .subscribe(SystemClientOpcode.PlaySkillReply, this, this.playSkillReply)
                .subscribe(SystemClientOpcode.BroadcastActorShow, this, this.broadcastActorShow)
                .subscribe(SystemClientOpcode.UpdateChangeMap, this, this.updateChangeMap)
                .subscribe(SystemClientOpcode.UpdateBossBirthPos, this, this.updateBossBirthPos)
                .subscribe(SystemClientOpcode.UpdatePKMode, this, this.updatePKMode)
                .subscribe(SystemClientOpcode.UpdateActorState, this, this.updateActorState)
                .subscribe(SystemClientOpcode.UpdateDropItem, this, this.updateDropItem)
                .subscribe(SystemClientOpcode.UpdateNpc, this, this.updateNpc)
            // .subscribe(SystemClientOpcode.BroadcastData, this, this.broadcastDebug); 苏丹服务器调试时候开启

            GlobalData.dispatcher.on(CommonEventType.PLAYER_TOTAL_ATTR_UPDATE, this, this.playerTotalAttrUpdate);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_MOVE_POINT_UPDATE, this, this.leaveDeath);
            this._first = true;

            // LogUtils.enable(LogFlags.SceneCtrl);
        }

        /**
           * 当前场景
           */
        public get sceneType(): SceneTypeEx {
            return this._sceneType;
        }

        /** 更新玩家血量*/
        private updateHp(tuple: Protocols.UpdateHp): void {
            let role = GameCenter.instance.getRole(tuple[UpdateHpFields.objId]);
            if (role != null) {
                role.property.set("hp", [tuple[UpdateHpFields.curHp], tuple[UpdateHpFields.maxHp]]);
            }
            if (tuple[UpdateHpFields.objId] === PlayerModel.instance.actorId) {
                PlayerModel.instance.hp = tuple[UpdateHpFields.curHp];
                PlayerModel.instance.maxHp = tuple[UpdateHpFields.maxHp];
            }
        }

        // 进入场景
        private enterScene(tuple: Protocols.EnterScene): void {
            this._isEnterScene = false;
            showProgressInterface(2, 4, 0, "正在进入场景......");
            TraceUtils.trace("enterScene");

            this._tuple = tuple;
            SceneModel.instance.enterScene = tuple;
            if (this._first) {
                if (Main.instance.assets) {
                    for (let handle of Main.instance.assets) {
                        base.assets.HandlePool.instance.free(handle);
                    }
                }
                // 刚进入游戏时先锁屏，等引导初始化完成后由引导判断要不要解锁
                LayerManager.instance.lockAllLayer(true);
                this._first = false;
                PlatParams.recordStep(RecordStep.StartEnterScene);
                let counter = 3;
                let callback = () => {
                    showProgressInterface((3 - counter) + 1, 3, 1, "正在加载基础资源......");
                    if (--counter <= 0) {
                        this.onReadyComplete();
                    }
                };
                let configs = "assets/configs.obj"
                if (!!LoginModel.instance.config) configs = `../../config/${LoginModel.instance.config}/front/configs.obj`;
                console.log('当前使用 configs', configs);
                showProgressInterface(0, 3, 0.6, "开始加载基础资源......");
                ResourcePool.instance.load(configs, (url: string, handle: number, res: ArrayBuffer): void => {
                    GlobalData.loadConfiguration(res);
                    callback();
                }, 0, false, false, 1);


                let n: number

                MaterialInitializer.setup(callback);
                Laya.loader.load(["res/atlas/common.atlas", "res/atlas/common_sg.atlas", "res/atlas/bottom_tab.atlas"]
                    , Laya.Handler.create(this, callback), null, null, null, true);
            } else {
                // 断线重连清理场景数据
                if (Main.instance.reconnect_enterscene) {
                    this.leaveScene([MapSpriteLayer.current_map_id, -1]);
                    Channel.instance.publish(UserNexusOpcode.LoadComplate, null);
                    Main.instance.reconnect_enterscene = false;
                    SceneModel.instance.isInMission = false;
                    modules.mission.MissionModel.instance.auto = false;

                    // if (MapSpriteLayer.current_map_id == tuple[Protocols.EnterSceneFields.mapId]) {
                    //     Channel.instance.publish(UserNexusOpcode.LoadComplate, null);
                    //     SceneModel.instance.isInMission = false;
                    //     modules.mission.MissionModel.instance.auto = false;
                    //     modules.dungeon.DungeonCtrl.instance.reqEnterScene(0);
                    //     console.log("断线重连不能加载到当前场景!!! Map:", MapSpriteLayer.current_map_id);
                    // } else {
                    this.enterGame();
                    // }
                } else {
                    this.enterGame();
                }
            }
        }

        private playSkillReply(tuple: Protocols.PlaySkillReply): void {
            if (DEBUG) {
                if (tuple[PlaySkillReplyFields.result] != 0) {
                    CommonUtil.noticeError(tuple[PlaySkillReplyFields.result]);
                }
            }
        }

        private onReadyComplete(): void {
            TraceUtils.trace("onReadyComplete");
            PlatParams.recordStep(RecordStep.StartLoadCommon);
            showProgressInterface(3, 4, 0, "正在加载通用图集......");
            base.particle.snowflake.SnowflakeParticleUtils.init();
            base.particle.snowflake.SnowflakeParticleUtils.precompileShaderWithGame();
            this.onPreloadComplete();
        }

        private onPreloadComplete(): void {
            TraceUtils.trace("onPreloadComplete");
            // 埋点  记录加载通用资源完成
            PlatParams.recordStep(RecordStep.CommonLoaded);
            DungeonModel.instance;
            BossReviveManager.instance;

            this._world = GameCenter.instance.world;
            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, () => {
                this._world.publish("stageResize", Laya.stage.width, Laya.stage.height);
            });
            this._world.publish("stageResize", Laya.stage.width, Laya.stage.height);
            this.enterGame();
        }

        protected enterGame(): void {
            GameCenter.instance.enterScene();
            TraceUtils.trace("enterGame");
            let mapId: number = this._tuple[EnterSceneFields.mapId];
            let cfg = SceneCfg.instance.getCfgById(mapId);

            this._sceneType = cfg[sceneFields.type];
            showProgressInterface(3, 4, 0, "正在进入场景......");
            // 地图加载完成监听 1.1
            this._world.once("loadMapComplete", this, this.onLoadComplete);
            // 派发事件进入场景 1.0 （在 layer_component.ts 中监听该事件）
            this._world.publish("enterScene", mapId);

            WindowManager.instance.close(WindowEnum.COMMON_TXT_ALERT);
            // if (Main.instance._reconnect) {
            //     Main.instance._reconnect = false
            //     SceneModel.instance.isInMission = false;
            //     modules.mission.MissionModel.instance.auto = false;
            //     this.leaveScene(null);
            //     Laya.timer.once(1000, this, modules.dungeon.DungeonCtrl.instance.reqEnterScene)
            // }
            Laya.timer.clear(this, this.onUpdate);
            Laya.timer.frameLoop(1, this, this.onUpdate);
        }

        private transmitPos(tuple: TransmitPos): void {
            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role != null) {
                console.log("transmitPos = ", tuple);
                role.publish("transmit", ...tuple[TransmitPosFields.pos]);
                if ((SceneModel.instance.isEveryDayCopyScene
                    || modules.scene.SceneModel.instance.isEventScene
                    || modules.scene.SceneModel.instance.isMarryScene
                    || modules.scene.SceneModel.instance.isFactonScene
                    || modules.scene.SceneModel.instance.isTeamCopyScene
                    || modules.scene.SceneModel.instance.isCrossBossScene)) {
                    GameCenter.instance.world.publish("setTransformDoorActive", false);
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionOne;
                    if (modules.scene.SceneModel.instance.isMarryScene) {//服务器自动控制传送，等不到下一帧初化寻路点，寻路点也在这初始化
                        MapUtils.initCommonFindPathArray();
                    }
                }
            }
        }

        // 场景加载完成。处理初始化、面板和选怪信息
        private onLoadComplete(): void {
            TraceUtils.trace("onLoadComplete");
            Channel.instance.publish(UserNexusOpcode.LoadComplate, null);
            // Statistics.authRequest(4, PlayerModel.instance.actorId);
            if (this._isFirstLoginComplete) {
                firstEnterGameScene();
                // 微信小游戏延迟300ms关闭选服和登录界面（资源加载慢）
                if (Main.instance.isWXChannel) {
                    setTimeout(() => {
                        WindowManager.instance.close(WindowEnum.LOGIN_PANEL);
                    }, 300);
                }
                PlatParams.recordStep(RecordStep.EnterScene);
                this._isFirstLoginComplete = false;
                Channel.instance.publish(UserNexusOpcode.LoginComplete, null);

                GlobalData.dispatcher.event(CommonEventType.PLAYER_CLIENT_READY);
                setTimeout(() => {
                    GlobalData.enableCombat = true;
                }, 1000);
                // 初始化setup
                ModulesUtil.init();
            } else {
                // 云离开动画
                SwitchSceneCtrl.instance.tweenCloudLeave();
            }

            let mapId = this._tuple[EnterSceneFields.mapId];

            // 底部面板处理
            BottomTabCtrl.instance.enterScene();
            // 基础面板显示隐藏处理
            MainCtrl.instance.enterScene(mapId);
            // 副本面板处理
            DungeonCtrl.instance.enterScene(mapId);


            // 副本自动选怪功能
            if (this._sceneType == SceneTypeEx.homeBoss) {
                BossHomeModel.instance.setSelectTarget(BossDungeonModel.instance.selectLastBoss, true);
            } else if (this._sceneType == SceneTypeEx.templeBoss) {
                modules.sheng_yu.ShengYuBossModel.instance.setSelectTarget(BossDungeonModel.instance.selectLastBoss, true);

            }

            // 播放背景音乐
            SoundCtrl.instance.playSceneBg(this._tuple[EnterSceneFields.mapId]);
        }

        // 离开场景
        private leaveScene(tuple: Protocols.LeaveScene) {

            if (tuple[Protocols.LeaveSceneFields.copyId] == -1) {
                console.log("断线重连 离开并清理当前场景.........");
            }

            Laya.timer.clear(this, this.onUpdate);
            SoundCtrl.instance.stopAll();
            GameCenter.instance._master = null
            this.leaveDeath();
            if (this._first) {
                return;
            }

            if (this._world != null) {
                this._world.publish("leaveScene");
            }
            SwitchSceneCtrl.instance.tweenCloudEnter();
            GameCenter.instance.leaveScene();
            (tuple != null) && DungeonCtrl.instance.leaveScene(tuple[LeaveSceneFields.mapId]);
            PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
            this._isEnterScene = false;
            //Browser.container.setAttribute("style", "visibility: hidden;");
            WindowManager.instance.gc();
            AssetPoolBase.gc(true);
            RecoverQueue.default.gc(true);
            ResourcePool.instance.recoverQueue.gc(true);
        }

        // private aaaa = 0
        // 广播入屏
        private broadcastEnterScreen(tuple: Protocols.BroadcastEnterScreen): void {
            if (!this._isEnterScene) {
                this._isEnterScene = true;
                Browser.container.setAttribute("style", "visibility: visible;");
            }

            //console.log("广播入屏:", [...tuple]);

            let center = GameCenter.instance;

            // 加载怪物
            let monsters = tuple[BroadcastEnterScreenFields.monsters];
            if (monsters != null && monsters.length > 0) {
                for (let monster of monsters) {

                    // console.log("广播怪物入屏:", monsters);
                    let occ = monster[MonsterShowFields.occ];
                    let info = MonsterResCfg.instance.getCfgById(occ);
                    if (info == null) {
                        throw new Error(`怪物类型${occ}不存在！`);
                        continue;
                    }
                    let id = monster[MonsterShowFields.objId] //+ ((Math.random() * Math.random() * Math.random() * 1000) >> 0);

                    if (center.getRole(id)) {
                        let reason = `重复进入${id}, ${occ}, ${monster[MonsterShowFields.pos]}`;
                        GlobalData.recordError(reason, new Error(reason));
                        continue;
                    }
                    let role = center.createRole(id, RoleType.Monster);
                    let context = role.property;
                    context.set("occ", occ);
                    context.set("name", info[MonsterResFields.name]);
                    context.set("hp", [monster[MonsterShowFields.curHp], monster[MonsterShowFields.maxHp]]);
                    context.set("speed", monster[MonsterShowFields.speed]);
                    context.set("exterior", [info[MonsterResFields.res], 0, 0, 0, 0, 0, 0]);

                    // 刷怪位置处理
                    context.set("pos", new Point(...monster[MonsterShowFields.pos]));
                    context.set("desPos", new Point(...monster[MonsterShowFields.desPos]));

                    context.set("direction", monster[MonsterShowFields.angle] || Math.random() * 360);
                    context.set("status", RoleState.DUMMY);
                    context.set("level", monster[MonsterShowFields.level]);

                    center.enterRole(id);

                    let tuple = MonsterResCfg.instance.getCfgById(occ);
                    let hasShow = tuple[MonsterResFields.show] || 0;
                    if (hasShow) {
                        context.set("showType", 1);
                        context.set("status", RoleState.SHOW);
                    } else {
                        // 2023 1 12 临时增加测试
                        if (context.get("type") == RoleType.Monster && (monster[MonsterShowFields.pos][0] != monster[MonsterShowFields.desPos][0] || monster[MonsterShowFields.pos][1] != monster[MonsterShowFields.desPos][1])) {
                            context.set("status", RoleState.MOVING);
                        } else {
                            context.set("status", RoleState.IDLE);
                        }
                    }
                }
            }

            // 加载玩家
            let humans = tuple[BroadcastEnterScreenFields.humans];
            if (humans != null && humans.length > 0) {
                let aliveMan = false;
                for (let human of humans) {
                    let show = human[HumanShowFields.actorShow];
                    let id = show[ActorShowFields.objId];
                    if (center.getRole(id)) {
                        let reason = `重复进入${id}, ${show[ActorShowFields.occ]}, ${human[HumanShowFields.pos]}`;
                        GlobalData.recordError(reason, new Error(reason));
                        continue;
                    }
                    let role = center.createRole(id, id == PlayerModel.instance.actorId ? RoleType.Master : RoleType.Player);
                    let context = role.property;
                    context.set("occ", show[ActorShowFields.occ]);
                    context.set("name", show[ActorShowFields.name]);
                    context.set("headId", show[ActorShowFields.headImg]);
                    context.set("hp", [human[HumanShowFields.curHp], human[HumanShowFields.maxHp]]);
                    context.set("speed", human[HumanShowFields.speed]);
                    context.set("exterior", [
                        show[ActorShowFields.clothes],
                        show[ActorShowFields.weapon],
                        show[ActorShowFields.wing],
                        show[ActorShowFields.ride],
                        show[ActorShowFields.rideFazhen],
                        show[ActorShowFields.tianZhu],
                        show[ActorShowFields.guanghuan]
                    ]);
                    context.set("pet", [show[ActorShowFields.pet], show[ActorShowFields.petFazhen]]);
                    context.set("pos", new Point(...human[HumanShowFields.pos]));
                    context.set("desPos", new Point(...human[HumanShowFields.desPos]));
                    // console.log("玩家目标点：：：", new Point(...human[HumanShowFields.desPos]));


                    context.set("direction", human[HumanShowFields.angle]);
                    context.set("moveType", show[ActorShowFields.runState] ? 2 : 0);
                    context.set("desgnation", show[ActorShowFields.desgnation]);
                    context.set("factionName", show[ActorShowFields.factionName]);
                    context.set("factionId", show[ActorShowFields.factionId]);
                    context.set("rise", show[ActorShowFields.riseId]);
                    context.set("fightTeamId", show[ActorShowFields.fightTeamId]);
                    context.set("fightTeamName", show[ActorShowFields.fightTeamName]);

                    if (human[HumanShowFields.isDead]) {
                        context.set("status", RoleState.DEATH);
                        BossDungeonModel.instance._bossHomeShow[id] = [id, context.get("name")];
                    } else {
                        if (context.get("type") == RoleType.Player && (human[HumanShowFields.pos][0] != human[HumanShowFields.desPos][0] || human[HumanShowFields.pos][1] != human[HumanShowFields.desPos][1])) {
                            context.set("status", RoleState.MOVING);
                        } else {
                            context.set("status", RoleState.IDLE);
                        }
                        BossDungeonModel.instance._bossHomeShow[id] = [id, context.get("name")];
                        aliveMan = true;
                    }

                    // if (id == PlayerModel.instance.actorId) {
                    //     let tuple: UpdateDropItem = [human[HumanShowFields.pos],[[50121011,2],[50121031,2],[50121051,2]]];
                    //     Laya.timer.loop(10000, this, () => {
                    //         this.updateDropItem(tuple);
                    //     })
                    // }

                    center.enterRole(id);
                }
                if (aliveMan) {
                    GlobalData.dispatcher.event(CommonEventType.BOSS_SHOW_PLAYER_INFO);
                }
            }

            // 加载npc
            let npcs = tuple[BroadcastEnterScreenFields.npcs];
            if (npcs != null && npcs.length > 0) {
                for (let npc of npcs) {
                    let id = npc[NpcShowFields.objId];
                    if (center.getRole(id)) {
                        let reason = `重复进入${id}, ${npc[NpcShowFields.occ]}, ${npc[NpcShowFields.pos]}`;
                        GlobalData.recordError(reason, new Error(reason));
                        continue;
                    }
                    let occ = npc[NpcShowFields.occ];
                    let info = NpcCfg.instance.getCfgById(occ);
                    let role = center.createRole(id, RoleType.Npc);
                    let context = role.property;
                    context.set("occ", npc[NpcShowFields.occ]);
                    context.set("pos", new Point(...npc[NpcShowFields.pos]));
                    context.set("liveTime", npc[NpcShowFields.endTime]);
                    context.set("exterior", [info[npcFields.res], 0, 0, 0, 0, 0, 0]);
                    context.set("own", npc[NpcShowFields.own]);
                    center.enterRole(id);
                }
            }

            SceneModel.instance.enterSceneHandler(tuple);
        }

        // 广播离屏
        private broadcastLeaveScreen(tuple: Protocols.BroadcastLeaveScreen): void {
            if (this._first) {
                return;
            }
            let self = PlayerModel.instance.actorId;
            let lastEnemy = 0;
            let master = GameCenter.instance.getRole(self);
            if (master != null) {
                lastEnemy = master.property.get("lastEnemy");
            }
            let list = tuple[BroadcastLeaveScreenFields.objIds];
            let playeChange: boolean = false;
            for (let id of list) {
                if (id == lastEnemy && master != null) {
                    master.property.set("lastEnemy", 0);
                }
                GameCenter.instance.leaveRole(id);
                if (BossDungeonModel.instance._bossHomeShow[id]) {
                    delete BossDungeonModel.instance._bossHomeShow[id];
                    playeChange = true;
                    if (this._sceneType == SceneTypeEx.homeBoss) {
                        let model = BossHomeModel.instance;
                        if (PlayerModel.instance.selectTargetType == SelectTargetType.Player && PlayerModel.instance.selectTargetId == id) {
                            model.setSelectTarget(BossDungeonModel.instance.selectLastBoss, true);
                        }
                    } else if (this._sceneType == SceneTypeEx.templeBoss) {
                        if (PlayerModel.instance.selectTargetType == SelectTargetType.Player && PlayerModel.instance.selectTargetId == id) {
                            modules.sheng_yu.ShengYuBossModel.instance.setSelectTarget(BossDungeonModel.instance.selectLastBoss, true);
                        }
                    }
                }
            }
            if (playeChange) {
                GlobalData.dispatcher.event(CommonEventType.BOSS_SHOW_PLAYER_INFO);
            }

            SceneModel.instance.leaveSceneHandler(tuple);
        }

        // 广播玩家移动(非自己)
        private broadcastMove(tuple: Protocols.BroadcastMove): void {
            //console.log("broadcastMove",tuple);
            let id = tuple[BroadcastMoveFields.objId];
            if (id != PlayerModel.instance.actorId) {
                let role = GameCenter.instance.getRole(id);
                if (role != null) {
                    // if (role.property.get("type") == RoleType.Player) {
                    //     console.log("pos = ", new Point(...tuple[BroadcastMoveFields.startPos]), "despos = ", new Point(...tuple[BroadcastMoveFields.endPos]));
                    // }

                    let context = role.property;
                    let p = context.get('pos')

                    context.set("speed", tuple[BroadcastMoveFields.speed]);
                    // 处理移动
                    // this.handMovePos(tuple, context);
                    context.set("pos", new Point(...tuple[BroadcastMoveFields.startPos]));
                    context.set("desPos", new Point(...tuple[BroadcastMoveFields.endPos]));
                    context.set("moveType", tuple[BroadcastMoveFields.runState] ? 2 : 0);
                    context.set("status", RoleState.MOVING);
                    context.event("status", RoleState.MOVING);
                }
            }
        }

        //广播移动速度更新
        // private broadcastUpDateSpeed(tuple: Protocols.UpDateSpeed): void {
        //     console.log("broadcastUpDateSpeed",tuple);
        //     let id = tuple[UpDateSpeedFields.targetObjId];
        //     let role = GameCenter.instance.getRole(id);
        //     if (role != null) {
        //         let context = role.property;
        //         context.set("speed", tuple[BroadcastMoveFields.speed]);
        //     }
        // }

        // 处理移动 挂机和非挂机怪物的移动位置
        private handMovePos(tuple: Protocols.BroadcastMove, context: game.role.Property) {
            // 非挂机场景也不是天关直接返回，不处理
            if (!SceneModel.instance.isHangupScene && !SceneModel.instance.isInMission) {
                context.set("pos", new Point(...tuple[BroadcastMoveFields.startPos]));
                context.set("desPos", new Point(...tuple[BroadcastMoveFields.endPos]));
                return;
            }

            // 挂机场景区分怪物
            let roleType: RoleType = context.get("type");
            if (roleType == RoleType.Monster) {
                // 目标位置加上玩家所在当前地图相对的位置
                let masterPos = GameCenter.instance._master.property.get("transform").localPosition;
                let monsterPos = context.get("transform").localPosition;
                let self_x: number = MapUtils.getPosition(masterPos.x, masterPos.y).x;
                let mapCount: number = Math.floor(self_x / MapUtils.cols);
                let offsetX = mapCount * MapUtils.cols;

                // console.log("怪物移动：", "玩家x：", self_x, "怪", MapUtils.getPosition(monsterPos.x, monsterPos.y).x, "=>", tuple[BroadcastMoveFields.endPos][0] + offsetX);


                // context.set("pos", new Point(tuple[BroadcastMoveFields.startPos][0] + offsetX, tuple[BroadcastMoveFields.startPos][1]));
                context.set("pos", new Point(MapUtils.getPosition(monsterPos.x, monsterPos.y).x, -MapUtils.getPosition(monsterPos.x, monsterPos.y).y));
                context.set("desPos", new Point(tuple[BroadcastMoveFields.endPos][0] + offsetX, tuple[BroadcastMoveFields.endPos][1]));
            }
        }

        // 广播飘血
        private broadcastHp(tuple: Protocols.BroadcastHp): void {
            let self = PlayerModel.instance.actorId;
            let hurts = tuple[BroadcastHpFields.CombatHurts];

            for (let hurt of hurts) {
                let id = hurt[CombatHurtFields.targetObjId];
                let source = hurt[CombatHurtFields.sourObjId];


                if (id != self && source != self) {
                    continue;
                }

                if (id == self) {
                    PlayerModel.instance.hp = hurt[CombatHurtFields.curHp];
                    PlayerModel.instance.maxHp = hurt[CombatHurtFields.maxHp];
                }

                // if (id == source) {
                //     throw new Error("不能自己打自己");
                // }

                let role = GameCenter.instance.getRole(id);
                let target = GameCenter.instance.getRole(source);
                let direction = 0
                if (role != null && target != null) {
                    let pos = role.property.get("avatarSK").getSKPositon()
                    let targetPos = target.property.get("avatarSK").getSKPositon()
                    if (targetPos.x > pos.x) direction = -1;
                    if (targetPos.x < pos.x) direction = 1;
                }



                let isHurt: boolean = true;
                if (role != null) {
                    role.property.set("hp", [hurt[CombatHurtFields.curHp], hurt[CombatHurtFields.maxHp]]);
                    let type = hurt[CombatHurtFields.hurtType];
                    let flags: TipsFlags = 0;
                    if (type == HurtType.crit) {
                        flags |= TipsFlags.Crit;
                    } else if (type == HurtType.dodge) {
                        flags |= TipsFlags.Miss;
                    } else if (type == HurtType.hpRecover || type == HurtType.suckBlood || type == HurtType.hurtRecoverHp) {
                        flags |= TipsFlags.Heal;
                        isHurt = false;
                    }

                    if (hurt[CombatHurtFields.isPetAtk]) {
                        flags |= TipsFlags.Pet;
                    }

                    if (source == self) {
                        flags |= TipsFlags.Self;
                    }

                    if (id == self && source != self) {
                        role.property.set("lastEnemy", source);
                    }

                    role.publish("hurt", source, hurt[CombatHurtFields.skillId] * 10000, hurt[CombatHurtFields.hurt], flags, direction);
                }

                if (isHurt) {
                    if (id == self) { //如果玩家被攻击
                        BossDungeonModel.instance.setBeAttackId(source);
                    } else if (source == self) { //如果玩家主动攻击
                        BossDungeonModel.instance.setPlayAttackId(id);
                        if (this._sceneType == SceneTypeEx.homeBoss) {
                            if (role && role.property.get("type") === RoleType.Monster) {     // 打BOSS等级判断提示
                                if (BossHomeModel.instance.checkPlayerLevelHeigh(role.property.get("occ"))) {
                                    SystemNoticeManager.instance.addNotice("您的等级过高，击杀BOSS没有掉落", true);
                                }
                            }
                        }
                    }
                }
            }

        }

        // 请求复活
        public reqRevive(): void {
            Channel.instance.publish(UserMapOpcode.ReqRevive, null);
        }

        // 复活返回
        private reqReviveReply(tuple: Protocols.ReqReviveReply): void {
            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role != null) {
                role.publish("reviveReply", tuple[ReqReviveReplyFields.result]);
                role.property.set("status", RoleState.IDLE);
                //console.log("玩家复活 id = ",role.id);
                let mapId: int = SceneModel.instance.enterScene[EnterSceneFields.mapId];
                switch (mapId) {
                    case SCENE_ID.scene_home_boss:
                    case SCENE_ID.scene_temple_boss:
                        BossDungeonCtrl.instance.setAutoFindWayFuHuo();
                        break;
                }
            }
        }

        // 广播复活
        private broadcastRevive(tuple: Protocols.BroadcastRevive): void {
            let id = tuple[BroadcastReviveFields.objId];
            let role = GameCenter.instance.getRole(id);
            if (role != null) {
                //console.log("广播玩家复活 id = ",role.id);
                let context = role.property;
                context.set("status", RoleState.REVIVE);
                context.event("status", RoleState.REVIVE);
            }
        }

        private getdesc(id) {
            if (id != PlayerModel.instance.actorId) return ""
            return "XX"

        }
        //广播死亡
        private broadcastDead(tuple: Protocols.BroadcastDead): void {
            let deadId = tuple[BroadcastDeadFields.objId];
            let role = GameCenter.instance.getRole(deadId);
            let now = Date.now();
            if (role == null) return;
            let context = role.property;
            // 移除死亡那货的技能特效
            this._world.publish("removeDeadSkillEffect", deadId);
            let e: delayDeathData = [deadId, now + 50, false]
            if (SceneUtil.singleScene) {
                context.set("delayDeath", true);
                context.set("status", RoleState.STRIKE);
                context.event("status", RoleState.STRIKE);
                this._delayDeathList.unshift(e);
            } else {
                context.set("delayDeath", false);
                context.set("status", RoleState.DEATH);
                context.event("status", RoleState.DEATH);
            }
            if (deadId == PlayerModel.instance.actorId) {
                // 玩家自己被击败
                PlayerModel.instance.playerDeadTuple = tuple;
                PlayerModel.instance.playerDeadTime = GlobalData.serverTime;
            }

            if (tuple[BroadcastDeadFields.killerId] === PlayerModel.instance.actorId) {       // 自己击杀他人或怪物
                if (this._tuple[EnterSceneFields.mapId] === SCENE_ID.scene_nine_copy) {   // 九天之巅
                    NineModel.instance.defeatInfo = tuple;
                    WindowManager.instance.open(WindowEnum.NINE_DEFEAT_PANEL, tuple);
                }
                if (SceneModel.instance.isInMission) {   // 天关
                    let occ = context.get("occ");
                    let info = MonsterResCfg.instance.getCfgById(occ);
                    // BOSS死亡延迟暂时取消
                    //先接入新逻辑 延迟死亡  飘血未结束不允许怪物死亡 一直受击
                    if (info[MonsterResFields.type] == 1) { // 判断BOSS死亡
                        e[delayDeathDataFields.isBoss] = true;
                    }
                }
            }
            if (tuple[BroadcastDeadFields.objId] === PlayerModel.instance.actorId) {
                if (this._tuple[EnterSceneFields.mapId] === SCENE_ID.scene_xuanhuo_arena) {   // 玄火副本
                    XuanHuoModel.instance.defeatInfo = tuple;
                }
            }

            if (BossDungeonModel.instance._bossHomeShow[deadId]) {
                delete BossDungeonModel.instance._bossHomeShow[deadId];
                if (this._sceneType == SceneTypeEx.homeBoss) {
                    let model = BossHomeModel.instance;
                    if (PlayerModel.instance.selectTargetType == SelectTargetType.Player && PlayerModel.instance.selectTargetId == deadId) {
                        model.setSelectTarget(BossDungeonModel.instance.selectLastBoss, true);
                    }
                    GlobalData.dispatcher.event(CommonEventType.BOSS_SHOW_PLAYER_INFO);
                } else if (this._sceneType == SceneTypeEx.templeBoss) {
                    let model = modules.sheng_yu.ShengYuBossModel.instance;
                    if (PlayerModel.instance.selectTargetType == SelectTargetType.Player && PlayerModel.instance.selectTargetId == deadId) {
                        model.setSelectTarget(BossDungeonModel.instance.selectLastBoss, true);
                    }
                    GlobalData.dispatcher.event(CommonEventType.BOSS_SHOW_PLAYER_INFO);
                }
            }
        }

        public broadcastDebug(tuple: BroadcastData) {
            let id = tuple[BroadcastDataFields.objId];
            let role = GameCenter.instance.getRole(id);
            if (role != null) {
                let context = role.property;
                let desPos = tuple[BroadcastDataFields.desPos];
                let pixelPos = tuple[BroadcastDataFields.pixelPos];
                let pos = tuple[BroadcastDataFields.pos];
                context.set("debug", [pos, pixelPos, desPos]);
            }
        }

        private delayBossDeath(pos: Point) {
            let world = GameCenter.instance.world;
            CommonUtil.isSlow = true;
            // 增加死亡特效
            world.publish("playBossdeath", MapUtils.getRealPosition(pos.x, pos.y - 5));
            // 减速当前所有单位
            world.publish("setPlayRate",
                // 怪物 主角 宠物 其他玩家 技能特效
                [LayerType.Master, LayerType.Player, LayerType.Monster, LayerType.Foreground, LayerType.Background],
                [
                    [AvatarAniBigType.clothes, 0.1],
                    [AvatarAniBigType.weapon, 0.1],
                    [AvatarAniBigType.other, 0.1],
                    [AvatarAniBigType.wing, 0.1],
                    [AvatarAniBigType.immortals, 0.1],
                    [AvatarAniBigType.aura, 0.1],
                    [AvatarAniBigType.tianZhu, 0.1]
                ]

            )
            // x秒后恢复
            Laya.timer.once(1500, this, () => {
                world.publish("setPlayRate",
                    [LayerType.Master, LayerType.Player, LayerType.Monster, LayerType.Foreground, LayerType.Background],
                    [
                        [AvatarAniBigType.clothes, 1],
                        [AvatarAniBigType.weapon, 1],
                        [AvatarAniBigType.other, 1],
                        [AvatarAniBigType.wing, 1],
                        [AvatarAniBigType.immortals, 1],
                        [AvatarAniBigType.aura, 1],
                        [AvatarAniBigType.tianZhu, 1]
                    ]
                )
                CommonUtil.isSlow = false;
                GameCenter.instance._master.property.set("status", RoleState.IDLE);
            });

        }


        private broadcastPlaySkill(tuple: Protocols.BroadcastPlaySkill): void {
            let id = tuple[BroadcastPlaySkillFields.objId];
            if (id != PlayerModel.instance.actorId) {
                let role = GameCenter.instance.getRole(id);
                if (role != null) {
                    let context = role.property;
                    if (tuple[BroadcastPlaySkillFields.isPet]) {
                        let pet = context.get("petContext");
                        if (pet != null) {
                            context = pet.property;
                        }
                    }
                    context.set("battle", [tuple[BroadcastPlaySkillFields.targetObjId], tuple[BroadcastPlaySkillFields.skillId]]);
                    context.set("status", RoleState.ATTACK);
                    context.event("status", RoleState.ATTACK);

                }
            }
            SoundCtrl.instance.playSkillSound(tuple[BroadcastPlaySkillFields.skillId]);
        }



        private broadcastActorShow(tuple: BroadcastActorShow): void {
            let show = tuple[BroadcastActorShowFields.actorShow];
            let id = show[ActorShowFields.objId];
            let role = GameCenter.instance.getRole(id);
            if (role != null) {
                let context = role.property;
                context.set("exterior", [show[ActorShowFields.clothes], show[ActorShowFields.weapon], show[ActorShowFields.wing], show[ActorShowFields.ride], show[ActorShowFields.rideFazhen], show[ActorShowFields.tianZhu], show[ActorShowFields.guanghuan]]);
                context.set("pet", [show[ActorShowFields.pet], show[ActorShowFields.petFazhen]]);
                context.set("desgnation", show[ActorShowFields.desgnation]);
                context.set("factionName", show[ActorShowFields.factionName]);
                context.set("factionId", show[ActorShowFields.factionId]);
                context.set("rise", show[ActorShowFields.riseId]);
                context.set("fightTeamId", show[ActorShowFields.fightTeamId]);
                context.set("fightTeamName", show[ActorShowFields.fightTeamName]);
            }
        }

        // 天关挂机、打BOSS切换
        private updateChangeMap(tuple: UpdateChangeMap): void {
            // console.log(" 天关挂机、打BOSS切换:", tuple);
            let curMapId: number = this._tuple[EnterSceneFields.mapId];
            let mapId: number = tuple[UpdateChangeMapFields.mapId];
            let curMapType: int = SceneCfg.instance.getCfgById(curMapId)[sceneFields.type];
            let mapType: int = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
            GameCenter.instance.world.publish('updateTianguan')
            // GameCenter.instance.delAllRole(RoleType.Monster);
            // 从挂机切换到打BOSS
            if (curMapType === SceneTypeEx.common && mapType === SceneTypeEx.tianguanCopy) {
                SceneModel.instance.isInMission = true;
                this.leaveDeath();
                GameCenter.instance.clearDelayLeave()
                MainCtrl.instance.enterScene(mapId);
                DungeonCtrl.instance.enterScene(mapId);
                GlobalData.dispatcher.event(CommonEventType.SCENE_ENTER, mapId);
                GameCenter.instance.world.publish('playWarning', true)
            } else if (curMapType === SceneTypeEx.common && mapType === SceneTypeEx.common) {
                // 从打BOSS切换到挂机
                SceneModel.instance.isInMission = false;
                MainCtrl.instance.enterScene(mapId);
                DungeonCtrl.instance.enterScene(mapId);
                GlobalData.dispatcher.event(CommonEventType.SCENE_ENTER, mapId);
                PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
                GameCenter.instance.world.publish('playWarning', false)
            }

        }

        private updateBossBirthPos(tuple: UpdateBossBirthPos): void {
            console.log("updateBossBirthPos tuple:::", tuple);
            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role != null) {
                let context = role.property;
                let pos: Point = new Point(...tuple[UpdateBossBirthPosFields.pos]);
                // console.log("Boss!!!设置玩家移动的服务器的目的位置。", pos.x, pos.y);

                context.set("desPos", pos);
                context.set("moveType", 1);
                GlobalData.dispatcher.event(CommonEventType.MISSION_MOVE_POS_UPDATE);
            }
        }

        private updatePKMode(tuple: UpdatePKMode): void {
            PlayerModel.instance.pkMode = tuple[UpdatePKModeFields.pkMode];
            LogUtils.info(LogFlags.SceneCtrl, `PK模式: ${tuple[UpdatePKModeFields.pkMode]}`);
        }

        private updateActorState(tuple: UpdateActorState): void {
            let id = tuple[UpdateActorStateFields.objId];
            let role = GameCenter.instance.getRole(id);
            if (role != null) {
                let state = tuple[UpdateActorStateFields.acotrState];
                role.property.set("actorState", state);
            }

            LogUtils.info(LogFlags.SceneCtrl, `角色状态: ${tuple[UpdateActorStateFields.objId]}, ${tuple[UpdateActorStateFields.acotrState]}`);
        }

        private updateDropItem(tuple: UpdateDropItem): void {
            let items = tuple[UpdateDropItemFields.items];
            let pos = tuple[UpdateDropItemFields.pos];
            let id = tuple[UpdateDropItemFields.dropObjId] || 0;
            if (items != null) {
                GameCenter.instance.world.publish("updateDropItems", pos[0], pos[1], items, id);
                let mapId = this._tuple[EnterSceneFields.mapId];
                let sceneType = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
                if (sceneType === SceneTypeEx.adventrueMonster) {
                    for (let item of items) {
                        AdventureModel.instance.addDropItem([item[ItemsFields.ItemId], item[ItemsFields.count], 0, null]);
                    }
                    AdventureModel.instance.dropItemsUpdated = true;
                }
            }
        }

        private updateNpc(tuple: UpdateNpc): void {
            let npcs = tuple[UpdateNpcFields.npcs];
            for (let show of npcs) {
                let id = show[NpcShowFields.objId];
                let role = GameCenter.instance.getRole(id);
                if (role != null) {
                    let context = role.property;
                    context.set("occ", show[NpcShowFields.occ]);
                    let pos = new Point(...show[NpcShowFields.pos]);
                    context.set("pos", pos);
                    context.set("liveTime", show[NpcShowFields.endTime]);
                    context.set("own", show[NpcShowFields.own]);
                    role.publish("setCoordinate", pos.x, pos.y);
                }
            }
        }

        private playerTotalAttrUpdate(): void {
            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role != null) {
                let arr: Array<TypesAttr> = PlayerModel.instance.playerTotolAttrs;
                let property = role.property;
                for (let i: int = 0, len: int = arr.length; i < len; i++) {
                    if (arr[i][TypesAttrFields.type] === ItemAttrType.speed) {
                        property.set("speed", arr[i][TypesAttrFields.value]);
                        break;
                    }
                }
            }
        }

        private ShiftMsg(tuple: ShiftMsg) {
            // 暂时默认只有击退
            let role = GameCenter.instance.getRole(tuple[ShiftMsgFields.targetObjId]);
            if (role != null) {
                let context = role.property;
                let deviationX = Math.abs(tuple[ShiftMsgFields.startPos][PosFields.x] - tuple[ShiftMsgFields.endPos][PosFields.x])
                role.publish("shiftMsg", 0, deviationX);
            }


        }
    }
}

