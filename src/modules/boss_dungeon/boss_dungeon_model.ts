/////<reference path="../$.ts"/>
/** model */
namespace modules.bossDungeon {
    import TableUtils = utils.TableUtils;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import DropOwn = Protocols.DropOwn;
    import DropOwnFields = Protocols.DropOwnFields;
    import Pos = Protocols.Pos;

    export class BossDungeonModel {
        private static _instance: BossDungeonModel;
        public static get instance(): BossDungeonModel {
            return this._instance = this._instance || new BossDungeonModel();
        }

        private _attackId: Table<number>;  //key id  value 攻击时间
        private _attackIdGuiShu: Table<number>;  //key id  value 攻击时间
        private _beAttackId: Table<number>;  //key id  value 攻击时间
        private _isInScene: boolean;
        public _ownsInfo: Array<DropOwn>;

        public _interTime: number;
        //要监控寻路的bossIds
        public searchBossIds: int[];
        //boss类型
        public searchBossType: SCENE_ID;
        public _selectLastBoss: int;
        public selectTargetPos: Pos;  //需要移动到的点

        public readonly _bossOwn: Table<DropOwn>;
        public readonly _playerToBoss: Table<number>;
        public _bossHomeShow: Table<[number, string]>;
        constructor() {
            this._selectLastBoss = -1;

            this._isInScene = false;
            this._beAttackId = {};
            this._attackId = {};
            this._attackIdGuiShu = {};

            this._bossOwn = {};
            this._playerToBoss = {};

            this._bossHomeShow = {};
            let cfg = BlendCfg.instance.getCfgById(10605);
            this._interTime = cfg[blendFields.intParam][0];
        }


        public resetShuJu() {
            this._isInScene = false;
            this._beAttackId = {};
            this._attackId = {};
            this._attackIdGuiShu = {};
            this._bossHomeShow = {};
        }
        public getBossOnwer(occ: number): number {
            let tuple = this._bossOwn[occ];
            return tuple != null ? tuple[DropOwnFields.objId] : 0;
        }
        //获得所有入屏玩家信息
        public getPlayerInfo(): Array<[number, string]> {
            //主角自身 自会入屏 一次 死亡后便会移除  需要手动加入
            if (!this._bossHomeShow[PlayerModel.instance.actorId]) {
                this._bossHomeShow[PlayerModel.instance.actorId] = [PlayerModel.instance.actorId, PlayerModel.instance.roleName];
            }
            return TableUtils.values(this._bossHomeShow);
        }
        //更新归属者
        public updateBossDropOwns(ownsInfo: Array<DropOwn>): void {
            this._ownsInfo = ownsInfo;
            for (let tuple of this._ownsInfo) {
                let bossId: number = tuple[DropOwnFields.occ];
                let playerId: number = tuple[DropOwnFields.objId];
                let dropChangeInfo = this._bossOwn[bossId];

                if (playerId == 0) {
                    if (dropChangeInfo) {
                        let forPlayerId = dropChangeInfo[DropOwnFields.objId];
                        delete this._playerToBoss[forPlayerId];
                        delete this._bossOwn[bossId];
                    }
                    // LogUtils.info(LogFlags.BossHome, "++++++++++++++++++++++++++++++++++++++++++~~~~~~~~~~无归属状态  " + bossId);
                } else {
                    if (dropChangeInfo) {
                        delete this._playerToBoss[dropChangeInfo[DropOwnFields.objId]];
                    }
                    this._bossOwn[bossId] = tuple;
                    this._playerToBoss[playerId] = bossId;
                    // LogUtils.info(LogFlags.BossHome, "++++++++++++++++++++++++++++++++++++++++++bossId  " + bossId);
                    // LogUtils.info(LogFlags.BossHome, "++++++++++++++++++++++++++++++++++++++++++playerId   " + playerId);
                }
            }
            GlobalData.dispatcher.event(CommonEventType.BOSS_OWN_UPDATE);
        }

        public getOwnByBossId(bossId: int): DropOwn {
            if (!this._bossOwn) return null;
            return this._bossOwn[bossId];
        }

        //判断当前玩家是否为归属者LeaveScenceAlert
        public isSelectBossOwner(id: number): boolean {
            return this._playerToBoss[id] == this._selectLastBoss;
        }

        //判断当前玩家是否为归属者
        public playerIsOwn(playerId: number): boolean {
            if (this._playerToBoss[playerId]) {
                return true;
            }
            return false;
        }

        public get isInScene(): boolean {
            return this._isInScene;
        }
        public set isInScene(value: boolean) {
            this._isInScene = value;
        }

        public get selectLastBoss(): int {
            return this._selectLastBoss;
        }
        public set selectLastBoss(value: int) {
            this._selectLastBoss = value;
        }

        //设置玩家攻击对象
        public setPlayAttackId(id: number): void {
            if (!this._isInScene) { //如果不在场景中
                return;
            }
            this._attackId[id] = GlobalData.serverTime;
            this._attackIdGuiShu[id] = GlobalData.serverTime;
            GlobalData.dispatcher.event(CommonEventType.BOSS_ATTACK_UPDATE);
        }
        //判断玩家是否为我的攻击对象
        public playerIsMeAttackGuiShu(playerId: number): boolean {
            let isHave = this._attackIdGuiShu[playerId];
            if (isHave) {
                return true;
            }
            return false;
        }
        //判断玩家是否为我的攻击对象
        public playerIsMeAttack(playerId: number): boolean {
            let isHave = this._attackId[playerId];
            if (isHave) {
                return true;
            }
            return false;
        }

        //设置打我的玩家
        public setBeAttackId(id: number): void {
            if (!this._isInScene) { //如果不在场景中
                return;
            }
            this._beAttackId[id] = GlobalData.serverTime;
            GlobalData.dispatcher.event(CommonEventType.BOSS_ATTACK_UPDATE);
        }
        //判断打我的人
        public playerIsAttackMe(playerId: number): boolean {
            if (this._beAttackId[playerId]) {
                return true;
            }
            return false;
        }

        public loopHandler(): void {
            this.checkDelete(this._attackId, this._interTime);
            this.checkDelete(this._beAttackId, this._interTime);
            this.checkDelete(this._attackIdGuiShu, 1000);
        }

        private checkDelete(tab: Table<number>, time: number): void {
            if (tab) {
                let ids: string[] = TableUtils.keys(tab);
                for (let key of ids) {
                    let value: int = tab[key];
                    if (GlobalData.serverTime - value >= time) {
                        delete tab[key];
                        GlobalData.dispatcher.event(CommonEventType.BOSS_ATTACK_UPDATE);
                    }
                }
            }
        }
    }
}