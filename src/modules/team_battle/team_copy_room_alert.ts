/////<reference path="../$.ts"/>
/** 组队副本小队弹框 */
namespace modules.teamBattle {
    import TeamCopyRoomAlertUI = ui.TeamCopyRoomAlertUI;
    // import AvatarClip = modules.common.AvatarClip;
    import TeamMemberFields = Protocols.TeamMemberFields;
    import TeamMember = Protocols.TeamMember;
    import ActorShow = Protocols.ActorShow;
    import ActorShowFields = Protocols.ActorShowFields;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class TeamCopyRoomAlert extends TeamCopyRoomAlertUI {

        // private _centerAvatar: AvatarClip;
        // private _leftAvatar: AvatarClip;
        // private _rightAvatar: AvatarClip;
        private _centerSkeleton: SkeletonAvatar;
        private _leftSkeleton: SkeletonAvatar;
        private _rightSkeleton: SkeletonAvatar;
        private _infos: TeamMember[];
        private _isFull: boolean;//true是满员
        private _time: number;

        private _avatars:SkeletonAvatar[];
        // private _avatars:AvatarClip[];
        private _nameTxts:Laya.Text[];
        private _fightTxts: Laya.Text[];
        private _addBoxs: Laya.Box[];
        private _infoBoxs: Laya.Box[];
        private _tipBoxs: Laya.Box[];
        private _btns: Laya.Button[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            // this._leftAvatar = this.createRole();
            // this._leftAvatar.pos(162, 459);

            // this._rightAvatar = this.createRole();
            // this._rightAvatar.pos(497, 459);

            // this._centerAvatar = this.createRole();
            // this._centerAvatar.pos(330, 342);
            this._leftSkeleton = this.createRole();
            this._leftSkeleton.pos(122, 499);

            this._rightSkeleton = this.createRole();
            this._rightSkeleton.pos(547, 499);

            this._centerSkeleton = this.createRole();
            this._centerSkeleton.pos(330, 412);

            this._time = 0;

            // this._avatars = [this._centerAvatar, this._leftAvatar, this._rightAvatar];
            this._avatars = [this._centerSkeleton, this._leftSkeleton, this._rightSkeleton];
            this._nameTxts = [this.centerNameTxt, this.leftNameTxt, this.rightNameTxt];
            this._fightTxts = [this.centerFightTxt, this.leftFightTxt, this.rightFightTxt];
            this._addBoxs = [null, this.leftAddBox, this.rightAddBox];
            this._infoBoxs = [null, this.leftInfoBox, this.rightInfoBox];
            this._tipBoxs = [null, this.leftTipBox, this.rightTipBox];
            this._btns  = [this.centerBtn, this.leftBtn, this.rightBtn];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.leftAddBox, common.LayaEvent.CLICK, this, this.addBtnHandler);
            this.addAutoListener(this.rightAddBox, common.LayaEvent.CLICK, this, this.addBtnHandler);
            this.addAutoListener(this.centerBtn, common.LayaEvent.CLICK, this, this.centerBtnHandler);
            this.addAutoListener(this.leftBtn, common.LayaEvent.CLICK, this, this.kickedTeamHandler, [1]);
            this.addAutoListener(this.rightBtn, common.LayaEvent.CLICK, this, this.kickedTeamHandler, [2]);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MATCH_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_COPY_ROOM_UPDATE, this, this.roomUpdateHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MATCH_STATE_UPDATE, this, this.showingTime);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_COPY_MEMBER_KICKED, this, super.close);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);
        }

        protected removeListeners(): void {

            Laya.timer.clear(this, this.loopHandler);

            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.timeTxt.visible = false;
            this.btn.visible = true;
            this.updateView();
            this.showingTime();
        }

        private setHiddenBox(isShow: boolean) {
            this.hiddenBox.visible = isShow;
            this.height = this.bgImg.height = isShow ? 730 : 635;
            this.tipTxt.y = isShow ? 780 : 685;
        }

        private updateView(): void {
            //两个视角 做房主处理
            let state: TeamMatchState = TeamBattleModel.Instance.matchState;
            let list: TeamMember[] = TeamBattleModel.Instance.playerInfos;
            let datas: TeamMember[] = []; //中左右的顺序
            let mineInfo: TeamMember = TeamBattleModel.Instance.mineInfo;
            let bossInfo: TeamMember = TeamBattleModel.Instance.bossInfo;
            if (bossInfo == mineInfo) {//自己是房主
                datas.push(mineInfo, ...list);
                this.setHiddenBox(true);
            } else { //自己不是房主 找出房主
                let tempList: TeamMember[] = list.concat();
                for (let i: int = 0, len: int = tempList.length; i < len; i++) {
                    if (tempList[i][TeamMemberFields.leader]) {
                        let ele: TeamMember = tempList.splice(i, 1)[0];
                        datas.push(ele);
                        break;
                    }
                }
                datas.push(mineInfo, ...tempList);
                this.setHiddenBox(state == TeamMatchState.success);
            }
            this._infos = datas;

            this._isFull = datas.length >= 3;
            if (this._isFull) {
                this.btn.label = `进入副本`;
            } else {
                this.btn.label = `快速匹配`;
                Laya.timer.clear(this, this.loopHandler);
                this.btn.visible = true;
                this.timeTxt.visible = false;
            }


            for (let i: int = 0; i < this._avatars.length; i++) {
                let info: TeamMember = datas[i];
                if (info) { //有人
                    this._fightTxts[i].visible = this._avatars[i].visible = true;
                    this._infoBoxs[i] && (this._infoBoxs[i].visible = true);
                    this._btns[i].visible = bossInfo == mineInfo;
                    this._tipBoxs[i] && (this._tipBoxs[i].visible = false);
                    this._addBoxs[i] && (this._addBoxs[i].visible = false);
                    let name: string = info[TeamMemberFields.name];
                    this._nameTxts[i].text = name;
                    let fight: number = info[TeamMemberFields.fight];
                    this._fightTxts[i].text = `战力:${fight}`;
                    let show: ActorShow = info[TeamMemberFields.show];
                    let weapon: number = show[ActorShowFields.weapon];
                    let clothes: number = show[ActorShowFields.clothes];
                    this._avatars[i].reset(clothes, weapon);
                    this._avatars[i].resetScale(AvatarAniBigType.clothes, 0.6);
                } else {
                    this._infoBoxs[i].visible = this._btns[i].visible = this._fightTxts[i].visible = this._avatars[i].visible = false;
                    this._tipBoxs[i].visible = this._addBoxs[i].visible = true;
                }
            }
        }

        private createRole(): SkeletonAvatar {
            // let avatar: AvatarClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(avatar, 2);
            // avatar.anchorX = 0.5;
            // avatar.anchorY = 0.5;
            // avatar.mouseEnabled = false;
            // avatar.avatarRotationY = 180;
            // return avatar;
            let avatar:SkeletonAvatar = SkeletonAvatar.createShow(this,this);
            return avatar;
        }

        private addBtnHandler(): void {
            let factionId: string = faction.FactionModel.instance.factionId;
            if (!factionId) { //未加入仙盟
                notice.SystemNoticeManager.instance.addNotice(`尚未加入公会，请加入公会后再邀请`, true);
            } else {
                WindowManager.instance.open(WindowEnum.TEAM_COPY_INVITE_ALERT);
            }
        }

        private centerBtnHandler(): void {
            let str: string = `是否确定解散队伍?`;
            let okHandler: Handler = Handler.create(this, () => {
                TeamBattleCtrl.instance.destoryTeam();
                super.close();
            });
            CommonUtil.alert(`提示`, str, [okHandler], []);
        }

        public close(): void {
            let isBoss: boolean = TeamBattleModel.Instance.mineInfo[TeamMemberFields.leader];
            let cancelHandler: Handler;
            if (isBoss) { //队长解散房间
                cancelHandler = Handler.create(this, () => {
                    TeamBattleCtrl.instance.destoryTeam();
                    super.close();
                });
            } else {
                cancelHandler = Handler.create(this, () => {
                    TeamBattleCtrl.instance.leaveTeam();
                    WindowManager.instance.close(WindowEnum.TEAM_BATTLE_PANEL);
                    TeamBattleModel.Instance.isHaveRoom = false;
                    super.close();
                });
            }
            let okHandler: Handler = Handler.create(this, () => {
                TeamBattleModel.Instance.isHaveRoom = true;
                WindowManager.instance.close(WindowEnum.TEAM_BATTLE_PANEL);
                super.close();
            });
            CommonUtil.alert(`提示`, `您是否退出队伍?`, [okHandler, `缩小界面`], [cancelHandler, `离开队伍`]);
        }

        private btnHandler(): void {
            if (this._isFull) {
                TeamBattleCtrl.instance.reqBeginMatch(SCENE_ID.scene_team_copy);
            } else {
                TeamBattleCtrl.instance.startMatch();
            }
        }

        private showingTime(): void {
            let state: TeamMatchState = TeamBattleModel.Instance.matchState;
            if (state == TeamMatchState.success) {
                this._time = config.BlendCfg.instance.getCfgById(10705)[Configuration.blendFields.intParam][0];
                this.setHiddenBox(true);
                this.btn.visible = false;
                this.timeTxt.visible = true;
                this.loopHandler();
                Laya.timer.loop(1000, this, this.loopHandler);
            }
        }

        private loopHandler(): void {
            if (this._time <= 0) {
                Laya.timer.clear(this, this.loopHandler);
                TeamBattleModel.Instance.matchState = TeamMatchState.init;
                super.close();
            } else {
                this.timeTxt.text = `${Math.floor(this._time / 1000)}s后进入副本`;
                this._time -= 1000;
            }
        }

        private roomUpdateHandler(): void {
            if (!TeamBattleModel.Instance.isHaveRoom) {
                super.close();
            }
        }

        private kickedTeamHandler(index: number): void {
            let info: TeamMember = this._infos[index];
            let objId: number = info[TeamMemberFields.objId];
            let name: string = info[TeamMemberFields.name];
            let str: string = `是否将队员${CommonUtil.formatHtmlStrByColor(`#ffec7c`, `【${name}】`)}踢出房间?`;
            let handler: Handler = Handler.create(TeamBattleCtrl.instance, TeamBattleCtrl.instance.kickedTeam, [objId]);
            CommonUtil.alert(`提示`, str, [handler], []);
        }

        private updateName():void{
            if(!this._infos) return;
            let info:UpdateNameReply = RenameModel.instance.updateNameReply;
            if(!info) return;
            for(let i:int = 0, len:int = this._infos.length; i < len; i++){
                if(this._avatars[i]){
                    if(info && info[UpdateNameReplyFields.roleID] === this._infos[i][TeamMemberFields.objId]){
                        this._nameTxts[i].text = info[UpdateNameReplyFields.name];
                        break;
                    }
                }
            }
        }

        private updateOcc():void{
            if(!this._infos) return;
            let info:UpdateOccReply = RenameModel.instance.updateOccReply;
            if(!info) return;
            for(let i:int = 0, len:int = this._infos.length; i < len; i++){
                if(this._avatars[i]){
                    if(info && info[UpdateOccReplyFields.roleID] === this._infos[i][TeamMemberFields.objId]){
                        let show: ActorShow = this._infos[i][TeamMemberFields.show];
                        let weapon: number = show[ActorShowFields.weapon];
                        let clothes: number = show[ActorShowFields.clothes];
                        clothes = (clothes - clothes % 10) + info[UpdateOccReplyFields.occ];
                        this._avatars[i].reset(clothes, weapon);
                        this._avatars[i].resetScale(AvatarAniBigType.clothes, 0.6);
                        break;
                    }
                }
            }
        }

        public destroy(): void {
            this._nameTxts = this.destroyElement(this._nameTxts);
            this._fightTxts = this.destroyElement(this._fightTxts);
            this._addBoxs = this.destroyElement(this._addBoxs)
            this._infoBoxs = this.destroyElement(this._infoBoxs);
            this._tipBoxs = this.destroyElement(this._tipBoxs);
            this._btns  = this.destroyElement(this._btns);
            // this._centerAvatar = this.destroyElement(this._centerAvatar);
            // this._leftAvatar = this.destroyElement(this._leftAvatar);
            // this._rightAvatar = this.destroyElement(this._rightAvatar);
            this._centerSkeleton = this.destroyElement(this._centerSkeleton);
            this._leftSkeleton = this.destroyElement(this._leftSkeleton);
            this._rightSkeleton = this.destroyElement(this._rightSkeleton);
            this._avatars.length = 0;
            this._avatars = null;
            if (this._infos) {
                this._infos.length = 0;
                this._infos = null;
            }
            super.destroy();
        }
    }
}