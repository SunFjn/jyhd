///<reference path="../multi_boss/multi_boss_model.ts"/>
///<reference path="../config/scene_multi_boss_cfg.ts"/>
///<reference path="../config/scene_cross_boss_cfg.ts"/>
///<reference path="../scene/scene_model.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/monster_cfg.ts"/>
///<reference path="../zhizun/zhizun_model.ts"/>
///<reference path="../boss_dungeon/boss_dungeon_ctrl.ts"/>


/** 副本数据*/


namespace modules.dungeon {
    import Inspire = Protocols.Inspire;
    import GetCopyTimesReply = Protocols.GetCopyTimesReply;
    import UpdateCopyTimes = Protocols.UpdateCopyTimes;
    import CopyTimes = Protocols.CopyTimes;
    import GetCopyTimesReplyFields = Protocols.GetCopyTimesReplyFields;
    import CopyTimesFields = Protocols.CopyTimesFields;
    import UpdateCopyTimesFields = Protocols.UpdateCopyTimesFields;
    import BroadcastBeginCombat = Protocols.BroadcastBeginCombat;
    import BroadcastEndCombat = Protocols.BroadcastEndCombat;
    import BroadcastCopyMonsterWare = Protocols.BroadcastCopyMonsterWare;
    import BroadcastCopyIncome = Protocols.BroadcastCopyIncome;
    import BroadcastCopyStar = Protocols.BroadcastCopyStar;
    import UpdateIncomeRecord = Protocols.UpdateIncomeRecord;
    import UpdateJoinAward = Protocols.UpdateJoinAward;
    import BossInfo = Protocols.BossInfo;
    import HurtRank = Protocols.HurtRank;
    import BossTimes = Protocols.BossTimes;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BossInfoFields = Protocols.BossInfoFields;
    import SceneMultiBossCfg = modules.config.SceneMultiBossCfg;
    import BossStateFields = Protocols.BossStateFields;
    import BossState = Protocols.BossState;
    import BossTimesFields = Protocols.BossTimesFields;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import FollowBoss = Protocols.FollowBoss;
    import FollowBossFields = Protocols.FollowBossFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import SceneHomeBossCfg = modules.config.SceneHomeBossCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import LogUtils = game.misc.LogUtils;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import SceneUtil = modules.scene.SceneUtil;
    import MonsterCfg = modules.config.MonsterCfg;
    import monsterFields = Configuration.monsterFields;
    import ZhizunModel = modules.zhizun.ZhizunModel;
    import scene_cross_boss = Configuration.scene_cross_boss;
    import scene_multi_bossFields = Configuration.scene_multi_bossFields;
    import scene_multi_boss = Configuration.scene_multi_boss;
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import VipModel = modules.vip.VipModel;
    import BossDungenModel = modules.bossDungeon.BossDungeonModel;
    import BossDungeonCtrl = modules.bossDungeon.BossDungeonCtrl;

    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;

    import FactionCtrl = modules.faction.FactionCtrl;
    export class DungeonModel {
        private static _instance: DungeonModel;
        public static get instance(): DungeonModel {
            return this._instance = this._instance || new DungeonModel();
        }

        private _inspires: Array<Inspire>;

        // 副本自动鼓舞
        private _autoInspire: Map<number, AutoInspire>;

        public set autoInspire(list: Array<AutoInspire>) {
            if (!this._autoInspire) this._autoInspire = new Map<number, AutoInspire>();
            this._autoInspire.clear();
            for (const item of list) {
                this._autoInspire.set(item[AutoInspireFields.sceneType], item)
            }
            GlobalData.dispatcher.event(CommonEventType.COPY_AUTO_INSPIRE);
        }
        public getAutoInspire(sceneType: SceneTypeEx) {
            return this._autoInspire.get(sceneType) || [sceneType, 0, 0]
        }

        /**
         * 请求鼓舞
         * @param type 1金币2代币券
         * @param tips 不足时是否提示
         * @param auto 来源是否时自动挑战(true时 后端会一次性加满)
         * @param map 来源场景 区分发送消息
         * @returns 
         */
        public  reqInspire(type: int, tips: boolean = false, auto: boolean = false, map: SceneTypeEx = SceneTypeEx.common): void {
            if (type === 1) {
                if (PlayerModel.instance.copper < BlendCfg.instance.getCfgById(10304)[blendFields.intParam][0]) {
                    if (tips) CommonUtil.noticeError(12106);
                    return;
                }
            } else if (type === 2) {
                if (PlayerModel.instance.ingot < BlendCfg.instance.getCfgById(10305)[blendFields.intParam][0]) {
                    if (tips) {
                        CommonUtil.noticeError(12107);
                        CommonUtil.goldNotEnoughAlert();
                    }
                    return;
                }
            } else return;

            switch (map) {
                case SceneTypeEx.faction:
                    FactionCtrl.instance.factionReqInspire([type, auto]);
                    break;
                default:
                    DungeonCtrl.instance.reqInspire(type, auto);
                    break;
            }
        }

        // 副本次数table
        private _timesTable: Table<CopyTimes>;

        // 开始战斗广播
        private _broadcastBeginCombat: BroadcastBeginCombat;
        // 结束战斗
        private _broadcastEndCombat: BroadcastEndCombat;
        // 怪物波数广播
        private _broadcastCopyMonsterWare: BroadcastCopyMonsterWare;
        // 副本收益广播
        private _broadcastCopyIncome: BroadcastCopyIncome;
        // 副本星级广播
        private _broadcastCopyStar: BroadcastCopyStar;
        // 收益记录
        private _updateIncomeRecord: UpdateIncomeRecord;
        // 参与奖励
        private _joinAward: UpdateJoinAward;

        // BOSS信息数组
        private _bossTable: Table<BossInfo>;
        // BOSS伤害排行
        private _ranks: Array<HurtRank>;
        // BOSS次数table
        private _bossTimesTable: Table<BossTimes>;

        //第一只boss
        public firstBoss: boolean;

        // 关注的BOSS数组
        private _follows: Array<FollowBoss>;
        // 关注的BOSS table
        private _followTable: Table<FollowBoss>;
        // 场景状态数组
        private _sceneStates: Array<CopySceneState>;
        //*优先提示(用于失败界面) 提示类型
        private _tipType: number;

        constructor() {
        }

        public get inspires(): Array<Inspire> {
            return this._inspires;
        }

        public set inspires(value: Array<Inspire>) {
            this._inspires = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_INSPIRE_UPDATE);
        }

        // 副本次数table
        public initTimesTable() {
            this._timesTable = {};
        }

        public get timesTable(): Table<CopyTimes> {
            return this._timesTable;
        }

        // 获取副本次数返回
        public getCopyTimesReply(value: GetCopyTimesReply): void {
            this._timesTable = this._timesTable || {};
            let arr: Array<CopyTimes> = value[GetCopyTimesReplyFields.times];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._timesTable[arr[i][CopyTimesFields.mapId]] = arr[i];
            }
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_TIMES_UPDATE);
            this.checkCopyTimesRP();
        }

        // 更新副本次数
        public updateCopyTimes(value: UpdateCopyTimes): void {
            this._timesTable = this._timesTable || {};
            let times: CopyTimes = value[UpdateCopyTimesFields.times];
            this._timesTable[times[CopyTimesFields.mapId]] = times;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_TIMES_UPDATE);
            this.checkCopyTimesRP();
        }

        // 开始战斗广播
        public get broadcastBeginCombat(): BroadcastBeginCombat {
            return this._broadcastBeginCombat;
        }

        public set broadcastBeginCombat(value: BroadcastBeginCombat) {
            this._broadcastBeginCombat = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BROADCAST_BEGIN_COMBAT);
        }

        // 结束战斗广播
        public get broadcastEndCombat(): BroadcastEndCombat {
            return this._broadcastEndCombat;
        }

        public set broadcastEndCombat(value: BroadcastEndCombat) {
            this._broadcastEndCombat = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BROADCAST_END_COMBAT);
        }

        // 怪物波数广播
        public get broadcastCopyMonsterWare(): BroadcastCopyMonsterWare {
            return this._broadcastCopyMonsterWare;
        }

        public set broadcastCopyMonsterWare(value: BroadcastCopyMonsterWare) {
            this._broadcastCopyMonsterWare = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BROADCAST_COPY_MONSTER_WARE);
        }

        // 副本收益广播
        public get broadcastCopyIncome(): BroadcastCopyIncome {
            return this._broadcastCopyIncome;
        }

        public set broadcastCopyIncome(value: BroadcastCopyIncome) {
            this._broadcastCopyIncome = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BROADCAST_COPY_INCOME);
        }

        // 副本星级广播
        public get broadcastCopyStar(): BroadcastCopyStar {
            return this._broadcastCopyStar;
        }

        public set broadcastCopyStar(value: BroadcastCopyStar) {
            this._broadcastCopyStar = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BROADCAST_COPY_STAR);
        }

        // 收益记录
        public get updateIncomeRecord(): UpdateIncomeRecord {
            return this._updateIncomeRecord;
        }

        public set updateIncomeRecord(value: UpdateIncomeRecord) {
            this._updateIncomeRecord = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_UPDATE_INCOME_RECORD);
        }

        // 参与奖励
        public get joinAward(): UpdateJoinAward {
            return this._joinAward;
        }

        public set joinAward(value: UpdateJoinAward) {
            this._joinAward = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_UPDATE_JOIN_AWARD);
        }

        // boss信息table
        public updateBossInfos(value: Array<BossInfo>) {
            // console.log("boss信息table", value)
            this._bossTable = this._bossTable || {};
            // let isDeadSearchFlag: boolean = this.isDeadSearch();
            let searchCount: int = this.liveCount();
            let aheadTime: int = BlendCfg.instance.getCfgById(1001)[blendFields.intParam][0];
            for (let i: int = 0, len: int = value.length; i < len; i++) {
                let bossId: number = value[i][BossInfoFields.occ];
                let flag: boolean = !this._bossTable[bossId];
                if (!flag && SceneUtil.isCommonScene && ZhizunModel.instance.state) {          //  之前有BOSS且BOSS由死亡状态变为活着
                    if (this._bossTable[bossId][BossInfoFields.bossState][BossStateFields.dead] && !value[i][BossInfoFields.bossState][BossStateFields.dead]) {
                        if (DungeonModel.instance.getFollowBossById(bossId)) {
                            let bossType: number = MonsterCfg.instance.getMonsterById(bossId)[monsterFields.bossType];
                            let sceneType: SceneTypeEx;
                            let mapId: number;
                            let mapLv: number;
                            let t: boolean = true;
                            if (bossType === BossType.crossBoss) {      // 三界BOSS
                                sceneType = SceneTypeEx.crossBoss;
                                let cfg: scene_cross_boss = SceneCrossBossCfg.instance.getCfgByBossId(bossId);
                                mapId = cfg[scene_cross_bossFields.mapId];
                                mapLv = cfg[scene_cross_bossFields.level];
                            } else if (bossType === BossType.multiBoss) {    // 多人BOSS
                                sceneType = SceneTypeEx.multiBoss;
                                let cfg: scene_multi_boss = SceneMultiBossCfg.instance.getCfgByBossId(bossId);
                                mapId = cfg[scene_multi_bossFields.mapId];
                                mapLv = cfg[scene_multi_bossFields.level];
                            } else if (bossType === BossType.homeBoss) {  //boss之家
                                sceneType = SceneTypeEx.homeBoss;
                                let cfg: scene_home_boss = SceneHomeBossCfg.instance.getCfgByBossId(bossId);
                                mapId = cfg[scene_home_bossFields.mapId];
                                mapLv = cfg[scene_home_bossFields.level];
                                // let needGold = BossHomeModel.instance.getNeedEraByLayer(mapLv - 1);
                                let noCostLevel = BossHomeModel.instance.getVipByLayer(mapLv - 1);
                                if (/*needGold > 0 &&*/ VipModel.instance.vipLevel < noCostLevel) {       // 需要花钱不自动
                                    t = false;
                                } else {
                                    BossHomeModel.instance.getBossInfoByLayer(mapLv - 1);
                                    BossHomeModel.instance.setSelectTarget(bossId, true);
                                }
                            }
                            let bossTimes: BossTimes = this.getBossTimesBySceneType(sceneType);
                            if (t && (!bossTimes || bossTimes[BossTimesFields.remainTimes] > 0)) {
                                DungeonCtrl.instance.reqEnterScene(mapId, mapLv);
                            }
                        }
                    }
                }
                this._bossTable[bossId] = value[i];
                let bossState: BossState = value[i][BossInfoFields.bossState];
                // 如果是关注的BOSS且BOSS挑战次数>0，并且复活时间少于配置时间，弹提示框
                if (DungeonModel.instance.getFollowBossById(bossId)) {
                    // 刚进入游戏且BOSS为复活状态时
                    if (flag && !bossState[BossStateFields.dead]) {
                        // 如果已经在场景中，不提示
                        let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
                        let type: number = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
                        if (type === SceneTypeEx.crossBoss) {
                            let lv: number = SceneModel.instance.enterScene[EnterSceneFields.level];
                            if (SceneCrossBossCfg.instance.getCfgByMapIdAndLv(mapId, lv)[scene_cross_bossFields.occ] !== bossId) {
                                this.reviveTip(bossId);
                            }
                        } else {
                            this.reviveTip(bossId);
                        }
                    } else if (bossState[BossStateFields.dead]) {
                        if (bossState[BossStateFields.reviveTime] <= GlobalData.serverTime + aheadTime * 1000) {
                            // 弹提示
                            LogUtils.info(LogFlags.DungeonModel, "boss复活提示");
                            this.reviveTip(bossId);
                        } else if (bossState[BossStateFields.reviveTime] > GlobalData.serverTime + aheadTime * 1000) {
                            let delayTime: number = bossState[BossStateFields.reviveTime] - GlobalData.serverTime - aheadTime * 1000;
                            Laya.timer.once(delayTime, this, this.reviveTip, [bossId]);
                        }
                    }
                }

            }
            BossDungeonCtrl.instance.setAutoFindWay(searchCount);

            LogUtils.info(LogFlags.DungeonModel, `----------------------------------------------@synTimeReply(${GlobalData.serverTime})`);
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BOSS_UPDATE);
            this.checkBossRP();
        }

        private reviveTip(bossId: number): void {
            let sceneType: SceneTypeEx;
            if (SceneCrossBossCfg.instance.getCfgByBossId(bossId)) {      // 三界BOSS
                sceneType = SceneTypeEx.crossBoss;
                if (WindowManager.instance.isOpened(WindowEnum.THREE_WORLDS_PANEL)) return;
            } else if (SceneMultiBossCfg.instance.getCfgByBossId(bossId)) {    // 多人BOSS
                sceneType = SceneTypeEx.multiBoss;
                if (WindowManager.instance.isOpened(WindowEnum.MULTI_BOSS_PANEL)) return;
            } else if (SceneHomeBossCfg.instance.getCfgByBossId(bossId)) {  //boss之家
                sceneType = SceneTypeEx.homeBoss;
                if (WindowManager.instance.isOpened(WindowEnum.BOSS_HOME_PANEL)) return;
            }
            // 判断BOSS次数，没次数不提示
            let bossTimes: BossTimes = this.getBossTimesBySceneType(sceneType);
            if (!bossTimes || bossTimes[BossTimesFields.remainTimes] > 0) {
                GlobalData.dispatcher.event(CommonEventType.DUNGEON_BOSS_REVIVE_TIP, bossId);
            }
        }

        // 伤害排行数组
        public get ranks(): Array<HurtRank> {
            return this._ranks;
        }

        public set ranks(value: Array<HurtRank>) {
            this._ranks = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BOSS_RANKS_UPDATE);
        }

        // BOSS次数数组
        public set bossTimesArr(value: Array<BossTimes>) {
            if (!this._bossTimesTable) this._bossTimesTable = {};
            for (let i: int = 0, len: int = value.length; i < len; i++) {
                this._bossTimesTable[value[i][BossTimesFields.sceneType]] = value[i];
            }
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BOSS_TIMES_UPDATE);
        }

        public set bossTimes(value: BossTimes) {
            if (!this._bossTimesTable) this._bossTimesTable = {};
            this._bossTimesTable[value[BossTimesFields.sceneType]] = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_BOSS_TIMES_UPDATE);
            this.checkBossRP();
        }

        // 根据BOSSID获取BOSS信息
        public getBossInfoById(bossId: int): BossInfo {
            return this._bossTable ? this._bossTable[bossId] : null;
        }

        // 根据场景类型获取BOSS次数
        public getBossTimesBySceneType(sceneType: number): BossTimes {
            return this._bossTimesTable ? this._bossTimesTable[sceneType] : null;
        }

        // 关注的BOSS数组
        public get follows(): Array<FollowBoss> {
            return this._follows;
        }

        public set follows(value: Array<FollowBoss>) {
            this._follows = value;
            this._followTable = {};
            for (let i: int = 0, len: int = value.length; i < len; i++) {
                if (value[i][FollowBossFields.follow]) {
                    this._followTable[value[i][FollowBossFields.occ]] = value[i];
                }
            }
            GlobalData.dispatcher.event(CommonEventType.MULTI_BOSS_FOLLOWS_UPDATE);
            this.checkBossRP();
        }

        // 根据bossID获取关注信息
        public getFollowBossById(bossId: int): FollowBoss {
            return this._followTable ? this._followTable[bossId] : null;
        }

        // 初始化场景状态
        public initStates(value: Array<CopySceneState>): void {
            this._sceneStates = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_SCENE_STATE_UPDATE);
        }

        // 更新场景状态
        public updateStates(value: Array<CopySceneState>): void {
            this._sceneStates = value;
            GlobalData.dispatcher.event(CommonEventType.DUNGEON_SCENE_STATE_UPDATE);
        }

        // 根据场景类型获取场景状态
        public getCopySceneStateByType(type: SceneTypeEx): CopySceneState {
            let state: CopySceneState;
            if (this._sceneStates) {
                for (let i: int = 0, len: int = this._sceneStates.length; i < len; i++) {
                    if (this._sceneStates[i][CopySceneStateFields.sceneType] === type) {
                        state = this._sceneStates[i];
                        // break;//服务器同一场景可能有两条数据  需要取最后一条数据
                    }
                }
            }
            return state;
        }

        // 场景状态table
        public get sceneStates(): Array<CopySceneState> {
            return this._sceneStates;
        }


        /**
         * 副本开启时监听一次 检测副本次数红点  因为等级满足时 副本次数更新在前  功能开启在后
         */
        public funOPenUpdateCheckCopyTimesRP(ID: Array<number>) {
            // FUNC_OPEN_UPDATE
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.copperCopy
                    || element == ActionOpenId.zqCopy
                    || element == ActionOpenId.rideCopy
                    || element == ActionOpenId.petCopy
                    || element === SCENE_ID.scene_shenbing_copy
                    || element === SCENE_ID.scene_wing_copy
                    || element === SCENE_ID.scene_fashion_copy
                    || element === SCENE_ID.scene_tianzhu_copy
                    || element === SCENE_ID.scene_xilian_copy
                ) {
                    if (FuncOpenModel.instance.getFuncIsOpen(element)) {
                        if (DungeonModel.instance.checkCopyTimesRP()) {
                            return;
                        }
                    }
                }
            }

        }

        // 检测副本次数红点
        private checkCopyTimesRP(): boolean {
            let dailyDungeonRP: boolean = false;
            if (this._timesTable) {
                for (let key in this._timesTable) {
                    let times: CopyTimes = this._timesTable[key];
                    let mapId: number = times[CopyTimesFields.mapId];
                    let funcId: number = 0;
                    if (mapId === SCENE_ID.scene_copper_copy) {
                        funcId = ActionOpenId.copperCopy;
                    } else if (mapId === SCENE_ID.scene_zq_copy) {
                        funcId = ActionOpenId.zqCopy;
                    } else if (mapId === SCENE_ID.scene_xianqi_copy) {
                        funcId = ActionOpenId.rideCopy;
                    } else if (mapId === SCENE_ID.scene_pet_copy) {
                        funcId = ActionOpenId.petCopy;
                    } else if (mapId === SCENE_ID.scene_shenbing_copy) {
                        funcId = ActionOpenId.shenbingCopy;
                    } else if (mapId === SCENE_ID.scene_wing_copy) {
                        funcId = ActionOpenId.wingCopy;
                    } else if (mapId === SCENE_ID.scene_fashion_copy) {
                        funcId = ActionOpenId.fashionCopy;
                    } else if (mapId === SCENE_ID.scene_tianzhu_copy) {
                        funcId = ActionOpenId.tianzhuCopy;
                    } else if (mapId === SCENE_ID.scene_xilian_copy) {
                        funcId = ActionOpenId.xilianCopy;
                    }
                    //  shenbingCopy = 219,     //洛兰深处
                    // wingCopy = 220,         //苍穹落幕
                    // fashionCopy = 221,      //永恒之森
                    // tianzhuCopy = 222,      //旧忆·诅咒
                    // xilianCopy = 223,       //洗炼副本
                    // scene_shenbing_copy = 2301, //洛兰深处
                    // scene_wing_copy = 2311,     //苍穹落幕
                    // scene_fashion_copy = 2321,  //永恒之森
                    // scene_tianzhu_copy = 2331,  //旧忆·诅咒
                    // scene_xilian_copy = 2341,   //洗炼副本
                    let remainTimes = times[CopyTimesFields.challengeRemainTimes];
                    if ((mapId === SCENE_ID.scene_copper_copy ||
                        mapId === SCENE_ID.scene_zq_copy ||
                        mapId === SCENE_ID.scene_xianqi_copy ||
                        mapId === SCENE_ID.scene_pet_copy
                        || mapId === SCENE_ID.scene_shenbing_copy
                        || mapId === SCENE_ID.scene_wing_copy
                        || mapId === SCENE_ID.scene_fashion_copy
                        || mapId === SCENE_ID.scene_tianzhu_copy
                        || mapId === SCENE_ID.scene_xilian_copy) &&
                        remainTimes > 0 &&
                        FuncOpenModel.instance.getFuncNeedShow(funcId)) {
                        dailyDungeonRP = true;
                        RedPointCtrl.instance.setRPProperty("dailyDungeonRP", dailyDungeonRP);
                        return dailyDungeonRP;//修改 满足一个就 直接退出
                    }
                }
            }

            RedPointCtrl.instance.setRPProperty("dailyDungeonRP", dailyDungeonRP);
            return dailyDungeonRP;
        }

        /**
         * 一键扫荡获取需要消耗的代币券数量
         * @param type  1 获取扫荡需要消耗的代币券  2 获取可挑战的副本总次数
         */
        public getSdMoneyOrCishu(type: number): Array<any> {
            let _num = 0;
            let isHaveIsPassNo = false;//是否含有未通关过的副本
            if (this._timesTable) {
                for (let key in this._timesTable) {
                    let times: CopyTimes = this._timesTable[key];
                    let mapId: number = times[CopyTimesFields.mapId];
                    let sweepRemainTimes: number = times[CopyTimesFields.sweepRemainTimes];
                    let challengeRemainTimes: number = times[CopyTimesFields.challengeRemainTimes];
                    let diffcultLevel: number = times[CopyTimesFields.diffcultLevel];
                    let maxRecord: number = times[CopyTimesFields.maxRecord];
                    let sweepTimes: number = times[CopyTimesFields.sweepTimes];
                    let isPass = times[CopyTimesFields.isPass];
                    let star: number = times[CopyTimesFields.star];
                    let sweepTotalTimes: number = times[CopyTimesFields.sweepTotalTimes];
                    if (mapId == SCENE_ID.scene_copper_copy || mapId == SCENE_ID.scene_zq_copy) { //henqi
                        if (!isPass) {
                            isHaveIsPassNo = true;
                        }
                        if (isPass) {
                            if (type == 1) {
                                if (challengeRemainTimes <= 0) {
                                    _num += (modules.dailyDungeon.DailyDungeonModel.instance.getNum(mapId, sweepTimes, sweepTotalTimes)[1]);
                                }
                            } else {
                                if (challengeRemainTimes > 0) {
                                    _num++;
                                }
                            }
                        }
                    } else if ( //这里组队副本也在里面 因为不知道会不会有其他的 所以只判断 试炼副本 自己的类型
                        mapId == SCENE_ID.scene_xianqi_copy ||
                        mapId == SCENE_ID.scene_pet_copy ||
                        mapId == SCENE_ID.scene_shenbing_copy ||
                        mapId == SCENE_ID.scene_wing_copy ||
                        mapId == SCENE_ID.scene_fashion_copy ||
                        mapId == SCENE_ID.scene_tianzhu_copy ||
                        mapId == SCENE_ID.scene_xilian_copy
                    ) {
                        if (!isPass) {
                            isHaveIsPassNo = true;
                        }
                        if (isPass) {
                            if (type == 1) {
                                if (challengeRemainTimes <= 0) {
                                    _num += (modules.dailyDungeon.DailyDungeonModel.instance.getNum(mapId, sweepTimes, sweepTotalTimes)[1]);
                                }
                            } else {
                                if (challengeRemainTimes > 0) {
                                    _num++;
                                }
                            }
                        }
                    }
                }
            }
            return [_num, isHaveIsPassNo]
        }

        /**
         * 获取当前试炼副本的状态（可挑战，可扫荡，挑战和扫荡都已打完）
         */
        public getStateById(key: number): number {
            let times: CopyTimes = this._timesTable[key];
            // let mapId: number = times[CopyTimesFields.mapId];
            let sweepRemainTimes: number = times[CopyTimesFields.sweepRemainTimes];
            let challengeRemainTimes: number = times[CopyTimesFields.challengeRemainTimes];
            // let diffcultLevel: number = times[CopyTimesFields.diffcultLevel];
            // let maxRecord: number = times[CopyTimesFields.maxRecord];
            // let isPass = times[CopyTimesFields.isPass];
            // let star: number = times[CopyTimesFields.star];
            if (challengeRemainTimes > 0) {
                return 2;
            } else {
                if (sweepRemainTimes > 0) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        // 检测BOSS红点
        private checkBossRP(): void {
            if (!this._followTable || !this._bossTable || !this._bossTimesTable) return;
            let multiBossRP: boolean = false;
            let threeWorldsRP: boolean = false;
            let bossHomeRP: boolean = false;
            for (let key in this._followTable) {
                let bossId: number = parseInt(key);
                let bossInfo: BossInfo = this._bossTable[bossId];
                if (bossInfo && !bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {
                    let sceneType: SceneTypeEx;
                    if (SceneCrossBossCfg.instance.getCfgByBossId(bossId)) {      // 三界BOSS
                        sceneType = SceneTypeEx.crossBoss;
                        let bossTimes: BossTimes = this.getBossTimesBySceneType(sceneType);
                        if (bossTimes && bossTimes[BossTimesFields.remainTimes] > 0) {
                            threeWorldsRP = true;
                        }
                    } else if (SceneMultiBossCfg.instance.getCfgByBossId(bossId)) {    // 多人BOSS
                        sceneType = SceneTypeEx.multiBoss;
                        let bossTimes: BossTimes = this.getBossTimesBySceneType(sceneType);
                        if (bossTimes && bossTimes[BossTimesFields.remainTimes] > 0) {
                            multiBossRP = true;
                        }
                    } else if (SceneHomeBossCfg.instance.getCfgByBossId(bossId)) {  //boss之家
                        // sceneType = SceneTypeEx.homeBoss;
                        bossHomeRP = true;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("multiBossRP", multiBossRP);
            RedPointCtrl.instance.setRPProperty("threeWorldsRP", threeWorldsRP);
            RedPointCtrl.instance.setRPProperty("bossHomeRP", bossHomeRP);
        }

        /**  tipType */
        public get tipType(): int {
            return this._tipType;
        }

        public set tipType(value: int) {
            this._tipType = value;
            GlobalData.dispatcher.event(CommonEventType.TIPBIANQIANG_UPDATE);
        }

        //需求一
        //传入当前的bossId 传入要搜寻的bossIds(需求是id从小到大排序) 返回可以寻找的bossId -1为待机
        public searchBoss(bossId: int, bossIds: int[]): int {
            if (!this._bossTable) return -1;
            let state: BossState;
            let isDead: boolean;
            //判断当前的boss
            let info: BossInfo = this._bossTable[bossId];
            if (info) {
                state = info[BossInfoFields.bossState];
                isDead = state[BossStateFields.dead];
                if (!isDead) {
                    return bossId;
                }
            }
            //判断所有的BOSS
            for (let id of bossIds) {
                info = this._bossTable[id];
                if (!info) continue;
                state = info[BossInfoFields.bossState];
                isDead = state[BossStateFields.dead];
                if (!isDead) return id;
            }
            return -1;
        }

        //需求二
        //要检测更新的BOssIds
        //此事件发生则返回bossId  否则返回空
        public isDeadSearch(): boolean {
            if (!this._bossTable || !BossDungenModel.instance.searchBossIds) return null;
            let bossId: int = BossDungenModel.instance.selectLastBoss;
            if (!bossId) return null;
            let info: BossInfo = this._bossTable[bossId];
            if (!info) return null;
            let isDead: boolean = info[BossInfoFields.bossState][BossStateFields.dead];
            return isDead;
        }

        //需求二
        //要检测更新的BOssIds
        //此事件发生则返回bossId  否则返回空
        public liveCount(): int {
            if (!this._bossTable || !BossDungenModel.instance.searchBossIds) return null;
            //存活boss的数量
            let count: int = 0;
            for (let id of BossDungenModel.instance.searchBossIds) {
                let info: BossInfo = this._bossTable[id];
                if (info) {
                    let isDead: boolean = info[BossInfoFields.bossState][BossStateFields.dead];
                    if (!isDead) { //没死
                        count++;
                    }
                }
            }
            return count;
        }

        /**
         * 获取第一个没死的BOSS
         */
        public getLiveBoss(occ: number = -1): int {
            if (!this._bossTable || !BossDungenModel.instance.searchBossIds) return -1;
            for (let id of BossDungenModel.instance.searchBossIds) {
                if (occ != -1 && id != occ) {
                    continue;
                }
                let info: BossInfo = this._bossTable[id];
                if (info) {
                    let isDead: boolean = info[BossInfoFields.bossState][BossStateFields.dead];
                    if (!isDead) { //没死
                        return id
                    }
                }
            }
            return -1;
        }


        public bossIsLive(bossId: number): boolean {
            // console.log("this._bossTable", this._bossTable)
            let info: BossInfo = this._bossTable[bossId];
            if (info) {
                let isDead: boolean = info[BossInfoFields.bossState][BossStateFields.dead];
                return isDead;
            }
            return true;
        }
    }
}