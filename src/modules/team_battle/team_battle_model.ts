/**组队副本数据 */


namespace modules.teamBattle {

    import TeamCopyTimes = Protocols.TeamCopyTimes;
    import TeamCopyTimesFields = Protocols.TeamCopyTimesFields;
    import TeamCopyRank = Protocols.TeamCopyRank;
    import TeamCopyRankFields = Protocols.TeamCopyRankFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import TeamMember = Protocols.TeamMember;
    import TeamCopyMonsterWare = Protocols.TeamCopyMonsterWare;
    import TeamCopyMonsterWareFields = Protocols.TeamCopyMonsterWareFields;
    import TeamMemberFields = Protocols.TeamMemberFields;
    import TeamInvite = Protocols.TeamInvite;
    import TeamInviteFields = Protocols.TeamInviteFields;
    import MissionModel = modules.mission.MissionModel;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import ActorShowFields = Protocols.ActorShowFields;
    import ActorShow = Protocols.ActorShow;

    export class TeamBattleModel {

        private static _instance: TeamBattleModel;

        public static get Instance(): TeamBattleModel {
            return this._instance = this._instance || new TeamBattleModel();
        }

        private _totalTimes: number;  //总次数
        private _remainTimes: number; //剩余次数
        private _myRecordLevel: number;
        private _playerInfos: Array<TeamMember>;
        private _currWave: number;
        private _doneWave: number;
        private _timeState: boolean;
        private _skipWave: number;
        private _isMaxWave: boolean;
        private _mineInfo: TeamMember;
        private _bossInfo: TeamMember;
        private _askList: TeamInvite[];
        private _isHaveRoom: boolean;

        public matchState: number;
        public rankList: Array<TeamCopyRank>;
        public tempSelectTeam: TeamInvite;
        public currSceneId: SCENE_ID;

        private _maxRecord:TeamCopyRank;

        constructor() {
            this._myRecordLevel = 0;
            this._skipWave = 0;
            this._timeState = false;
            this._doneWave = 0;
            this._isMaxWave = false;
            this._playerInfos = [];
            this._askList = [];
        }

        //设置次数
        public setTimes(tuple: TeamCopyTimes): void {
            this._totalTimes = tuple[TeamCopyTimesFields.totalTimes];  //总次数
            this._remainTimes = tuple[TeamCopyTimesFields.remainTimes]; //剩余次数
            if (!dungeon.DungeonModel.instance.timesTable) {
                dungeon.DungeonModel.instance.initTimesTable();
            }
            dungeon.DungeonModel.instance.timesTable[SCENE_ID.scene_team_copy] = [SCENE_ID.scene_team_copy, 0, this._remainTimes, 0, 0, 0, 0, 0, 0, false, 0];
            this._myRecordLevel = tuple[TeamCopyTimesFields.maxRecord]; //自己的最高纪录
            GlobalData.dispatcher.event(CommonEventType.TEAM_BATTLE_TIMES_UPDATE);
            this.checkRedDot();
        }

        //设置最高纪录信息
        public setMaxRecordInfo(tuple: TeamCopyRank): void {
            this._maxRecord = tuple;
            GlobalData.dispatcher.event(CommonEventType.TEAM_BATTLE_MAX_RECORD);
        }

        //增加匹配玩家信息
        public set playerInfos(list: Array<TeamMember>) {

            //判断一次满员
            if (list.length - 1 > this._playerInfos.length && list.length == 3) {
                if (this.isHaveRoom) {
                    WindowManager.instance.open(WindowEnum.TEAM_COPY_ROOM_ALERT);
                }
            }
            this._playerInfos.length = 0;
            this._mineInfo = null;
            let id: number = PlayerModel.instance.actorId;
            for (let i: int = 0, len: int = list.length; i < len; i++) {
                if (list[i][TeamMemberFields.leader]) { //是队长
                    this._bossInfo = list[i];
                }
                if (id === list[i][TeamMemberFields.objId]) {
                    this._mineInfo = list.splice(i, 1)[0];
                    break;
                }
            }
            this._playerInfos = list;
            GlobalData.dispatcher.event(CommonEventType.TEAM_BATTLE_MATCH_UPDATE);
        }

        public get playerInfos(): Array<TeamMember> {
            return this._playerInfos;
        }

        public get mineInfo(): TeamMember {
            return this._mineInfo;
        }

        public get bossInfo(): TeamMember {
            return this._bossInfo;
        }

        //更新匹配状态
        public updataMatchState(state: number): void {
            // console.log("更新匹配状态:  " + state);
            this.matchState = state;
            if (state == TeamMatchState.init) {
                WindowManager.instance.close(WindowEnum.TEAM_BATTLE_MATCH_ALERT);
            } else if (state == TeamMatchState.matching) {
                if (this.currSceneId == SCENE_ID.scene_team_copy) {
                    WindowManager.instance.open(WindowEnum.TEAM_BATTLE_MATCH_ALERT);
                } 
            } else if (state == TeamMatchState.success) {
                if (this.currSceneId == SCENE_ID.scene_team_copy) {
                    this._playerInfos.length = 0;
                    if (this.isHaveRoom && !this._mineInfo[TeamMemberFields.leader]) { //队员要进入副本
                        WindowManager.instance.open(WindowEnum.TEAM_COPY_ROOM_ALERT);
                    }
                }
            }
            GlobalData.dispatcher.event(CommonEventType.TEAM_BATTLE_MATCH_STATE_UPDATE);
        }

        //更新怪物波数和计时状态
        public updataWave(tuple: TeamCopyMonsterWare): void {
            this._currWave = tuple[TeamCopyMonsterWareFields.curWare];
            this._doneWave = tuple[TeamCopyMonsterWareFields.finishWare];
            this._timeState = tuple[TeamCopyMonsterWareFields.state];
            this._skipWave = tuple[TeamCopyMonsterWareFields.jumpWare];
            this._isMaxWave = this._currWave >= tuple[TeamCopyMonsterWareFields.maxWare];
            GlobalData.dispatcher.event(CommonEventType.TEAM_BATTLE_LEVEL_UPDATE);
        }

        //检测是否能够挑战
        public checkRedDot(): void {
            if (this._remainTimes > 0) {
                RedPointCtrl.instance.setRPProperty("teamBattleRP", true);
                return;
            }
            RedPointCtrl.instance.setRPProperty("teamBattleRP", false);
        }

        //添加被邀请列表
        public addAskList(ele: TeamInvite): void {
            let index: number = -1;
            for (let i: int = 0, len: int = this._askList.length; i < len; i++) {
                let id: number = this._askList[i][TeamInviteFields.teamId];
                if (ele[TeamInviteFields.teamId] == id) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                this._askList[index] = ele;
            } else {
                this._askList.unshift(ele);
            }
            GlobalData.dispatcher.event(CommonEventType.TEAM_COPY_ASK_LIST_UPDATE);
        }
        //删除被邀请列表
        public delAskList(ele: TeamInvite): void {
            let index: number = this._askList.indexOf(ele);
            if (index != -1) {
                this._askList.splice(index, 1);
                GlobalData.dispatcher.event(CommonEventType.TEAM_COPY_ASK_LIST_UPDATE);
            }
        }
        //清空被邀请列表
        public clearAskList(): void {
            this._askList.length = 0;
            GlobalData.dispatcher.event(CommonEventType.TEAM_COPY_ASK_LIST_UPDATE);
        }
        public get askList(): TeamInvite[] {
            return this._askList;
        }

        public get allMemberIds(): number[] {
            let arr: number[] = [];
            for (let ele of this._playerInfos) {
                let id: number = ele[TeamMemberFields.objId];
                arr.push(id);
            }
            arr.push(this._mineInfo[TeamMemberFields.objId]);
            return arr;
        }

        public set isHaveRoom(b: boolean) {
            this._isHaveRoom = b;
            if (this._isHaveRoom) {
                MissionModel.instance.auto = false;
            } else {
                this._playerInfos.length = 0;
            }
            GlobalData.dispatcher.event(CommonEventType.TEAM_COPY_ROOM_UPDATE);
        }
        public get isHaveRoom(): boolean {
            return this._isHaveRoom;
        }

        //获取剩余次数
        public get remainTimes(): number {
            return this._remainTimes;
        }

        //获取总次数
        public get totalTimes(): number {
            return this._totalTimes;
        }

        //获取我的最高纪录
        public get myRecordLevel(): number {
            return this._myRecordLevel;
        }

        // 获取最高记录
        public get maxRecord():TeamCopyRank{
            return this._maxRecord;
        }

        //获取最高纪录等级
        public get maxRecordLevel(): number {
            return this._maxRecord ? this._maxRecord[TeamCopyRankFields.ware] : 0;
        }

        //获取最高纪录名称
        public get maxRecordName(): string {
            return this._maxRecord ? this._maxRecord[TeamCopyRankFields.name] : "";
        }

        //获取当前波数
        public get currWave(): number {
            return this._currWave;
        }

        //获取完成波数
        public get doneWave(): number {
            return this._doneWave;
        }

        //获取是否计时
        public get timeState(): boolean {
            return this._timeState;
        }

        //获取要跳转的波数
        public get skipWave(): number {
            return this._skipWave;
        }

        //获取是否达到最大波数
        public get isMaxWave(): boolean {
            return this._isMaxWave;
        }

        // 更新名字
        public updateName():void{
            let info:UpdateNameReply = RenameModel.instance.updateNameReply;
            if(this._maxRecord && info && info[UpdateNameReplyFields.roleID] === this._maxRecord[TeamCopyRankFields.objId]){
                this._maxRecord[TeamCopyRankFields.name] = info[UpdateNameReplyFields.name];
            }
            if(this._mineInfo && info && info[UpdateNameReplyFields.roleID] === this._mineInfo[TeamMemberFields.objId]){
                this._mineInfo[TeamMemberFields.name] = this._mineInfo[TeamMemberFields.show][ActorShowFields.name] = info[UpdateNameReplyFields.name];
            }
            if(info && this._playerInfos){
                for(let i:int = 0, len:int = this._playerInfos.length; i < len; i++){
                    if(this._playerInfos[i] && info[UpdateNameReplyFields.roleID] === this._playerInfos[i][TeamMemberFields.objId]){
                        this._playerInfos[i][TeamMemberFields.name] = this._playerInfos[i][TeamMemberFields.show][ActorShowFields.name] = info[UpdateNameReplyFields.name];
                        break;
                    }
                }
            }
            if(info && this._askList){
                for(let i:int = 0, len:int = this._askList.length; i < len; i++){
                    if(this._askList[i] && this._askList[i][TeamInviteFields.objId] === info[UpdateNameReplyFields.roleID]){
                        this._askList[i][TeamInviteFields.name] = info[UpdateNameReplyFields.name];
                        break;
                    }
                }
            }
        }

        // 更新职业
        public updateOcc():void{
            let info:UpdateOccReply = RenameModel.instance.updateOccReply;
            if(this._maxRecord && info && info[UpdateOccReplyFields.roleID] === this._maxRecord[TeamCopyRankFields.objId]){
                this._maxRecord[TeamCopyRankFields.occ] = info[UpdateOccReplyFields.occ];
            }
            if(this._mineInfo && info && info[UpdateOccReplyFields.roleID] === this._mineInfo[TeamMemberFields.objId]){
                this._mineInfo[TeamMemberFields.occ] = this._mineInfo[TeamMemberFields.show][ActorShowFields.occ] = info[UpdateOccReplyFields.occ];
            }
            if(info && this._playerInfos){
                for(let i:int = 0, len:int = this._playerInfos.length; i < len; i++){
                    if(this._playerInfos[i] && info[UpdateOccReplyFields.roleID] === this._playerInfos[i][TeamMemberFields.objId]){
                        let show:ActorShow = this._playerInfos[i][TeamMemberFields.show];
                        this._playerInfos[i][TeamMemberFields.occ] = show[ActorShowFields.occ] = info[UpdateOccReplyFields.occ];
                        show[ActorShowFields.clothes] = show[ActorShowFields.clothes] - show[ActorShowFields.clothes] % 10 + info[UpdateOccReplyFields.occ];
                        break;
                    }
                }
            }
            if(info && this._askList){
                for(let i:int = 0, len:int = this._askList.length; i < len; i++){
                    if(this._askList[i] && this._askList[i][TeamInviteFields.objId] === info[UpdateOccReplyFields.roleID]){
                        this._askList[i][TeamInviteFields.occ] = info[UpdateOccReplyFields.occ];
                        break;
                    }
                }
            }
        }
    }
}