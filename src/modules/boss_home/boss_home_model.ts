/**boss之家数据 */


///<reference path="../config/scene_home_boss_cfg.ts"/>
///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../../utils/table_utils.ts"/>
///<reference path="../boss_dungeon/boss_dungeon_model.ts"/>


namespace modules.bossHome {
    import blendFields = Configuration.blendFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import BlendCfg = modules.config.BlendCfg;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import SceneHomeBossCfg = modules.config.SceneHomeBossCfg;
    import PlayerModel = modules.player.PlayerModel;
    import SceneModel = modules.scene.SceneModel;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import BoxTimesFields = Protocols.BoxTimesFields;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import VipModel = modules.vip.VipModel;
    import BornModel = modules.born.BornModel;
    import BossDungenModel = modules.bossDungeon.BossDungeonModel;

    export class BossHomeModel {
        private static _instance: BossHomeModel;

        public static get instance(): BossHomeModel {
            return this._instance = this._instance || new BossHomeModel();
        }

        public remainTimes: number;
        public totalTimes: number;
        public addTimes: number;
        public bigBossState: Array<Array<number>>;
        private _layerInfo: Array<scene_home_boss>;
        private _allBossInfo: Array<scene_home_boss>;
        private _noAward: boolean;
        private _bossIds: Array<number>;
        private _showBossList: BossHomeList;
        private _showPlayerlList: BossHomeList;
        public bossSeletIndex: number;
        public bossLastSeletIndex: number;

        constructor() {
            this._layerInfo = [];
            this._layerInfo = SceneHomeBossCfg.instance.getTotalLayerCfg();
        }

        //设置选择的目标
        public setSelectTarget(id: number, isBoss: boolean): void {
            let model = PlayerModel.instance;
            if (id == -1) {
                if (model.selectTargetType == SelectTargetType.Monster) {
                    if (this._showPlayerlList) {
                        this._showPlayerlList.initSelectIndex();
                    }
                } else if (model.selectTargetType == SelectTargetType.Player) {
                    if (this._showBossList) {
                        this._showBossList.initSelectIndex();
                    }
                }

                BossDungenModel.instance.selectLastBoss = id;
                model.selectTarget(SelectTargetType.Dummy, -1);
                GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);

            } else if (isBoss) {
                if (this._showPlayerlList) {
                    this._showPlayerlList.initSelectIndex();
                }
                model.selectTarget(SelectTargetType.Monster, id);
                BossDungenModel.instance.selectLastBoss = id;
                BossDungenModel.instance.selectTargetPos = DungeonModel.instance.getBossInfoById(id)[BossInfoFields.pos];
                GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);
            } else {
                if (this._showBossList) {
                    this._showBossList.initSelectIndex();
                }
                model.selectTarget(SelectTargetType.Player, id);
            }
            GlobalData.dispatcher.event(CommonEventType.BOSS_MOVE_POS_UPDATE);
        }

        //更新boss状态
        public updateBossState(tuple: Array<BossInfo>): void {
            DungeonModel.instance.updateBossInfos(tuple);
        }

        //更新显示boss
        public updateBigBossState(value: Array<Array<number>>): void {
            this.bigBossState = value;
        }

        //更新、初始化打开次数
        public updateOpenTimes(tuple: Protocols.BoxTimes): void {
            this.remainTimes = tuple[BoxTimesFields.remainTimes];
            this.totalTimes = tuple[BoxTimesFields.totalTimes];
            this.addTimes = tuple[BoxTimesFields.addTimes];
            GlobalData.dispatcher.event(CommonEventType.BOSS_HOME_UPDATE_TIMES);
        }

        //判断对应显示的boss是否被关注
        public checkIsFollowBoss(bossId: number): boolean {
            let info: Protocols.FollowBoss = DungeonModel.instance.getFollowBossById(bossId);
            if (info && info[Protocols.FollowBossFields.follow]) {
                return true;
            }
            return false;
        }

        //根据BOSSID获取服务器BOSS信息
        public getBossSeversInfoById(bossId: int): BossInfo {
            return DungeonModel.instance.getBossInfoById(bossId);
        }

        //根据层数获取对应的boss信息
        public getBossInfoByLayer(layer: number): Array<scene_home_boss> {
            this._bossIds = [];
            this._allBossInfo = SceneHomeBossCfg.instance.getCfgByLayer(layer);
            for (let i = 0; i < this._allBossInfo.length; i++) {
                this._bossIds.push(this._allBossInfo[i][scene_home_bossFields.occ]);
            }
            return this._allBossInfo;
        }

        //根据bossId判断对应index
        public getIndexByBossId(bossId: number): number {
            if (this._bossIds && this._bossIds.length > 0) {
                for (let i = 0; i < this._bossIds.length; i++) {
                    if (this._bossIds[i] == bossId) {
                        return i;
                    }
                }
            }
            return -1;
        }

        //获取数据刷新时boss数据
        public getBossInfoInUpate(): Array<scene_home_boss> {
            return this._allBossInfo;
        }

        //根据选择的index获取boss信息
        public getBossInfoByIndex(index: number): scene_home_boss {
            return this._allBossInfo[index];
        }

        //根据对应id获取总boss表中信息
        public getCfgByid(id: number): MonsterRes {
            return MonsterResCfg.instance.getCfgById(id);
        }

        //根据对应id获取Homeboss表中信息
        public getHomeCfgByid(id: number): scene_home_boss {
            return SceneHomeBossCfg.instance.getCfgByBossId(id);
        }

        //根据对应层数获取vip信息
        public getVipByLayer(layer: number): number {
            return this._layerInfo[layer][scene_home_bossFields.vip];
        }

        //根据对应层数获取显示名称
        public getBtnNameByLayer(layer: number): string {
            return this._layerInfo[layer][scene_home_bossFields.levelTips];
        }

        //根据对应层数获取显示名称
        public getTotalLayer(): number {
            return this._layerInfo.length;
        }

        //根据玩家vip等级来判断最低满足条件 -1没有满足的
        public getSelectLayerIndex(): number {
            let playerVIP = VipModel.instance.vipLevel;
            for (let i = this._layerInfo.length - 1; i >= 0; i--) {
                if (playerVIP >= this._layerInfo[i][scene_home_bossFields.vip]) {
                    return i;
                }
            }
            return -1;
        }

        //根据觉醒等级来判断最低满足条件
        public getIndexByEra(): number {
            let eraLv: int = Math.floor(BornModel.instance.lv / 100);
            for (let i = this._layerInfo.length - 1; i >= 0; i--) {
                let eraLvs: int[] = this._layerInfo[i][scene_home_bossFields.eraLv];
                if (eraLv >= eraLvs[0] && eraLv <= eraLvs[1]) {
                    return i;
                }
            }
            return -1;
        }


        //检测是否能够进入
        public checkSvipCondition(layer: number): boolean {
            let maxLayer = this.getSelectLayerIndex();
            if (layer <= maxLayer) {
                return true;
            }
            return false;
        }

        //判断玩家等级是否太高
        public checkPlayerLevelHeigh(bossId: number): boolean {
            let cfg: MonsterRes = this.getCfgByid(bossId);
            let bossLevel = cfg[MonsterResFields.level];
            let maxLevel = BlendCfg.instance.getCfgById(10606)[blendFields.intParam][0];
            this._noAward = bossLevel < PlayerModel.instance.level - maxLevel;
            return this._noAward;
        }

        //进入场景时进行显示内容
        public showTwoList(): void {
            this._showBossList = new BossHomeList();
            this._showPlayerlList = new BossHomeList();
            this._showBossList.setWidth(270);
            this._showBossList.setShowName('怪物列表');
            let num = Math.floor((720 - 270) / 2);
            this._showBossList.setCenter(num);
            if (!this._bossIds || this._bossIds.length == 0) {
                let layer = SceneModel.instance.enterScene[EnterSceneFields.level] - 1;
                this.getBossInfoByLayer(layer);
            }
            this._showBossList.setBossData(this._bossIds);
            this._showPlayerlList.setWidth(300);
            this._showPlayerlList.setShowName('点击列表发起攻击');
            let value = Math.floor((720 - 300) / 2) - 270;
            this._showPlayerlList.setCenter(value);
            this._showPlayerlList.setPlayerData();
            LayerManager.instance.addToMainUILayer(this._showBossList);
            LayerManager.instance.addToMainUILayer(this._showPlayerlList);
            BossDungenModel.instance.isInScene = true;
            Laya.timer.loop(1000, BossDungenModel.instance, BossDungenModel.instance.loopHandler);
        }

        //出场景时隐藏内容
        public hideTwoList(): void {
            if (this._showBossList) {
                this._showBossList.destroy();
                this._showBossList = null;
            }
            if (this._showPlayerlList) {
                this._showPlayerlList.destroy();
                this._showPlayerlList = null;
            }
            BossDungenModel.instance.resetShuJu();
            Laya.timer.clear(BossDungenModel.instance, BossDungenModel.instance.loopHandler);
        }


        public getBossIdsByLayer(layer: int): int[] {
            let ids: int[] = [];
            for (let ele of this.getBossInfoByLayer(layer)) {
                let id: int = ele[scene_home_bossFields.occ];
                ids.push(id);
            }
            ids = ids.sort(CommonUtil.smallToBigSort.bind(this));
            return ids;
        }
    }
}