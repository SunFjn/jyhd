/** 天梯匹配弹框*/



namespace modules.ladder {
    import LadderMatchAlertUI = ui.LadderMatchAlertUI;
    import TweenGroup = utils.tween.TweenGroup;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import TiantiScore = Protocols.TiantiScore;
    import TiantiScoreFields = Protocols.TiantiScoreFields;
    import TiantiCfg = modules.config.TiantiCfg;
    import tianti = Configuration.tianti;
    import tiantiFields = Configuration.tiantiFields;
    import TeamBattleModel = modules.teamBattle.TeamBattleModel;
    import TeamMember = Protocols.TeamMember;
    import TeamMemberFields = Protocols.TeamMemberFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class LadderMatchAlert extends LadderMatchAlertUI {
        private _seconds: number;
        private _tweenGroup: TweenGroup;
        private _tweenCount: number;
        private _matched: boolean;

        private _enterTime: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.closeOnSide = false;

            this.myHeadIcon.skin = `assets/icon/head/${CommonUtil.getHeadUrl(PlayerModel.instance.selectHead + Number(PlayerModel.instance.occ))}`;
            this.headIcon1.skin = `assets/icon/head/1.png`;
            this.headIcon2.skin = `assets/icon/head/2.png`;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.cancelBtn, Laya.Event.CLICK, this, this.cancelHandler);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MATCH_UPDATE, this, this.matchedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MATCH_STATE_UPDATE, this, this.matchedHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);

            this._tweenGroup = this.destroyElement(this._tweenGroup);
        }

        public onOpened(): void {
            super.onOpened();
            this.nameTxt.text = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.name];
            let score: TiantiScore = LadderModel.instance.tiantiScore;
            if (score) {
                let cfg: tianti = TiantiCfg.instance.getCfgById(score[TiantiScoreFields.seg]);
                this.gradeTxt.text = cfg[tiantiFields.name];
            }
            this._matched = false;
            // this.matchTxt.visible = true;
            this.cancelBtn.visible = true;
            this.otherNameTxt.visible = this.otherGradeTxt.visible = false;
            this.headIcon1.skin = `assets/icon/head/1.png`;

            Laya.timer.loop(1000, this, this.loopHandler);
            this._seconds = 0;
            this.loopHandler();

            this._tweenGroup = new TweenGroup();
            this._tweenCount = 0;
            this.startTween();
        }

        private startTween(): void {
            this.headBg1.y = 0;
            this.headIcon1.y = 6;
            this.otherBox.y = 0;
            if (this._matched) this._tweenCount++;
            if (this._tweenCount === 1) {
                let arr: Array<TeamMember> = TeamBattleModel.Instance.playerInfos;
                if (arr && arr.length > 0) {
                    let member: TeamMember = arr[0];
                    this.otherNameTxt.visible = this.otherGradeTxt.visible = true;
                    this.otherNameTxt.text = member[TeamMemberFields.name];
                    this.otherGradeTxt.text = TiantiCfg.instance.getCfgById(member[TeamMemberFields.seg])[tiantiFields.name];
                    this.headIcon1.skin = `assets/icon/head/${member[TeamMemberFields.occ]}.png`;
                }
                return;
            }
            TweenJS.create(this.otherBox, this._tweenGroup).to({ y: -93 }, 300 + this._tweenCount * 200).onComplete(this.completeHandler.bind(this)).start();
        }

        private completeHandler(): void {
            this.headBg1.y = 186;
            this.headIcon1.y = 189;
            TweenJS.create(this.otherBox, this._tweenGroup).to({ y: -186 }, 300 + this._tweenCount * 200).onComplete(this.completeHandler2.bind(this)).start();
        }

        private completeHandler2(): void {
            this.startTween();
        }

        private matchedHandler(): void {
            let matchState: number = TeamBattleModel.Instance.matchState;
            if (matchState === 1) {
                this._matched = true;
                // Laya.timer.clear(this, this.loopHandler);
                // this.matchTxt.visible = false;
                // this.close();
                // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_tianti_copy);
                this.cancelBtn.visible = false;
                this._enterTime = BlendCfg.instance.getCfgById(10705)[blendFields.intParam][0] * 0.001;
                this.loopHandler();
            }
        }

        // 取消匹配
        private cancelHandler(): void {
            LadderCtrl.instance.reqCancelMatch();
            LadderModel.instance.autoMatch = false;
            this.close();
        }

        private loopHandler(): void {
            if (!this._matched) {
                this.matchTxt.text = `匹配中....(${this._seconds})`;
                this.matchTxt.y = 296;
                this._seconds++;
            } else {
                // this.matchTxt.text = `${this._enterTime}秒后进入场景`;
                this.matchTxt.text = "匹配成功";
                // this.matchTxt.y = 350;
                this._enterTime--;
                if (this._enterTime < 0) {
                    Laya.timer.clear(this, this.loopHandler);
                }
            }
        }
    }
}