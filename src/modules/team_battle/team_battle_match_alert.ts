/**组队副本匹配弹窗 */


namespace modules.teamBattle {
    import TeamBattleMatchAlertUI = ui.TeamBattleMatchAlertUI;
    import Event = Laya.Event;
    import TeamMember = Protocols.TeamMember;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import TeamMemberFields = Protocols.TeamMemberFields;
    import PlayerModel = modules.player.PlayerModel;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class TeamBattleMatchAlert extends TeamBattleMatchAlertUI {

        private _waitTime: number;
        private _enterTime: number;
        private _nameArr: Array<Text>;
        private _valueArr: Array<Text>;
        private _headArr: Array<Image>;
        private _waitTxtArr: Array<Text>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._waitTime = 1;
            this._enterTime = 3;

            this._nameArr = new Array<Text>();
            this._nameArr = [this.playerName_1, this.playerName_2];

            this._valueArr = new Array<Text>();
            this._valueArr = [this.playerBattle_1, this.playerBattle_2];

            this._headArr = new Array<Image>();
            this._headArr = [this.playerIcon_1, this.playerIcon_2];

            this._waitTxtArr = new Array<Text>();
            this._waitTxtArr = [this.waitTxt_1, this.waitTxt_2];

            this.closeOnSide = false;
        }

        public onOpened(): void {
            super.onOpened();

            this.initShowInfo();
            this.isWaitInfoShow(true);
            this.matchStateUpdate();
            this.matchManUpdate();
        }

        protected addListeners(): void {
            super.addListeners();
            this.cancelBtn.on(Event.CLICK, this, this.cancelBtnHandler);
            GlobalData.dispatcher.on(CommonEventType.TEAM_BATTLE_MATCH_UPDATE, this, this.matchManUpdate);
            GlobalData.dispatcher.on(CommonEventType.TEAM_BATTLE_MATCH_STATE_UPDATE, this, this.matchStateUpdate);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.cancelBtn.off(Event.CLICK, this, this.cancelBtnHandler);
            GlobalData.dispatcher.off(CommonEventType.TEAM_BATTLE_MATCH_UPDATE, this, this.matchManUpdate);
            GlobalData.dispatcher.off(CommonEventType.TEAM_BATTLE_MATCH_STATE_UPDATE, this, this.matchStateUpdate);
        }

        protected initShowInfo(): void {

            let att: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            this.myNameTxt.text = att[ActorBaseAttrFields.name];
            this.myBattleTxt.text = PlayerModel.instance.fight.toString();
            // this.myHeadIconImg.skin = `assets/icon/head/${att[ActorBaseAttrFields.occ]}.png`;
            this.myHeadIconImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(PlayerModel.instance.selectHead + att[ActorBaseAttrFields.occ])}`;
            this.cancelBtn.visible = true;
            for (let i: int = 0, len: int = this._waitTxtArr.length; i < len; i++) {
                this._nameArr[i].visible = this._valueArr[i].visible = false;
                this._waitTxtArr[i].visible = true;
                this._headArr[i].skin = "";
            }
        }

        //控制等待显示
        private isWaitInfoShow(isShow: boolean): void {
            if (isShow) {
                this._waitTime = 1;
                this.waitTime.text = `(${this._waitTime})`;
                Laya.timer.loop(1000, this, this.waitLoop);
                Laya.timer.clear(this, this.enterLoop);
            } else {
                this._enterTime = 3;
                this.enterTime.text = `(${this._enterTime})`;
                Laya.timer.loop(1000, this, this.enterLoop);
                Laya.timer.clear(this, this.waitLoop);
            }
        }

        //更新匹配玩家数据
        private matchManUpdate(): void {
            let playerInfos: Array<TeamMember> = TeamBattleModel.Instance.playerInfos;
            if (!playerInfos) return;
            let hasNumLen: number = playerInfos.length;
            this.cancelBtn.visible = !(hasNumLen == 2);

            for (let i: int = 0, len: int = this._nameArr.length; i < len; i++) {
                if (hasNumLen > i) {
                    let playerInfo: TeamMember = playerInfos[i];
                    this._nameArr[i].visible = this._valueArr[i].visible = true;
                    this._waitTxtArr[i].visible = false;
                    this._headArr[i].skin = `assets/icon/head/${CommonUtil.getHeadUrl(playerInfo[TeamMemberFields.headImg] + playerInfo[TeamMemberFields.occ])}`;


                    this._nameArr[i].text = playerInfo[TeamMemberFields.name];
                    this._valueArr[i].text = playerInfo[TeamMemberFields.fight].toString();
                } else {          //没有的置空
                    this._nameArr[i].visible = this._valueArr[i].visible = false;
                    this._waitTxtArr[i].visible = true;
                    this._headArr[i].skin = null;
                }
            }
            this.isWaitInfoShow(true);
        }

        //更新匹配状态
        private matchStateUpdate(): void {
            let state: number = TeamBattleModel.Instance.matchState;
            if (state == TeamMatchState.success) {
                this.isWaitInfoShow(false);
            } else if (state == TeamMatchState.matching) {
                this.isWaitInfoShow(true);
            }

            this.completeBox.visible = !!state;
            this.matchingBox.visible = !state;
        }

        //进入游戏倒计时
        private enterLoop(): void {
            this._enterTime--;
            this.enterTime.text = `(${this._enterTime})`;
            if (this._enterTime == 0) {
                Laya.timer.clear(this, this.enterLoop);
            }
        }

        //等待匹配中的倒计时
        private waitLoop(): void {
            this._waitTime++;
            this.waitTime.text = `(${this._waitTime})`;
        }

        public onClosed(): void {
            super.onClosed();
            Laya.timer.clear(this, this.waitLoop);
            Laya.timer.clear(this, this.enterLoop);
        }

        //处理点击取消按钮操作
        private cancelBtnHandler(): void {
            TeamBattleCtrl.instance.reqCancelMatch();
            this.close();
        }
    }
}
