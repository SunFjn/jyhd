///<reference path="../config/scene_copy_team_cfg.ts"/>

/**组队副本面板 */
namespace modules.teamBattle {
    import TeamBattleViewUI = ui.TeamBattleViewUI;
    import BagItem = modules.bag.BagItem;
    import scene_copy_team = Configuration.scene_copy_team;
    import scene_copy_teamFields = Configuration.scene_copy_teamFields;
    import SceneCopyTeamCfg = modules.config.SceneCopyTeamCfg;
    import Items = Configuration.Items;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import SceneModel = modules.scene.SceneModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import BagModel = modules.bag.BagModel;
    import TeamCopyRank = Protocols.TeamCopyRank;
    import UpdateNameReply = Protocols.UpdateNameReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateNameReplyFields = Protocols.UpdateNameReplyFields;
    import TeamCopyRankFields = Protocols.TeamCopyRankFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class TeamBattlePanel extends TeamBattleViewUI {

        private _showAward: Array<BaseItem>;
        private _btnClip: CustomClip;

        public destroy(destroyChild: boolean = true): void {
            this._showAward = this.destroyElement(this._showAward);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._showAward = new Array<BagItem>();
            this.initAward();

            this._btnClip = CommonUtil.creatEff(this.matchBtn, `btn_light`, 15);
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(1.23, 1.2);

            this.regGuideSpr(GuideSpriteId.TEAM_BATTLE_MATCH_BTN, this.matchBtn);
        }

        private initAward(): void {

            let cfg: scene_copy_team = SceneCopyTeamCfg.instance.getCfgByWare(1);
            let awards: Array<Items> = cfg[scene_copy_teamFields.awardTips];
            let count: number = awards.length;
            for (let i: int = 0, len: int = count; i < len; i++) {
                this._showAward[i] = new BaseItem();
                this.addChild(this._showAward[i]);
                this._showAward[i].dataSource = [awards[i][ItemsFields.itemId], awards[i][ItemsFields.count], 0, null];
                this._showAward[i].y = 620;
            }
            let inter: number = 30;
            let sumWidth: number = this._showAward[0].width * count + inter * (count - 1);
            let firstX: number = (this.width - sumWidth) / 2;
            for (let i: int = 0, len: int = count; i < len; i++) {
                this._showAward[i].x = firstX + (inter + this._showAward[0].width) * i;
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.rankBtn, common.LayaEvent.CLICK, this, this.rankBtnHandler);
            this.addAutoListener(this.matchBtn, common.LayaEvent.CLICK, this, this.matchBtnHandler);
            this.addAutoListener(this.tipsBtn, common.LayaEvent.CLICK, this, this.tipsBtnHandler);
            this.addAutoListener(this.addTimesBtn, common.LayaEvent.CLICK, this, this.addTimesBtnHandler);
            this.addAutoListener(this.createRoomBtn, common.LayaEvent.CLICK, this, this.createRoomBtnHandler);
            this.addAutoListener(this.mergeBtn, common.LayaEvent.CLICK, this, this.mergeBtnHandler);
            this.addAutoListener(this.instructionsBtn, common.LayaEvent.CLICK, this, this.instructionsBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_TIMES_UPDATE, this, this.updateTimes);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MAX_RECORD, this, this.updateMaxRecord);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_NAME_UPDATE, this, this.updateName);

            this.addAutoRegisteRedPoint(this.dotImg, ["teamBattleRP"]);
        }

        public onOpened(): void {
            super.onOpened();

            if (TeamBattleModel.Instance.isHaveRoom) {
                WindowManager.instance.open(WindowEnum.TEAM_COPY_ROOM_ALERT);
            }

            this._btnClip.play();
            this.teamBtn.selected = true;
            this.mergeBtn.selected = heroAura.HeroAuraModel.instance.mergeFbCount == 0 ? false : true;
            this.updateShow();
        }

        //更新显示内容
        private updateShow(): void {

            this.updateTimes();
            this.updateMaxRecord();
        }

        //更新最高纪录
        private updateMaxRecord(): void {
            let level: number = TeamBattleModel.Instance.maxRecordLevel;
            if (level) {
                this.playerName.visible = true;
                this.topRecord.text = `${level}关`;
                let playerInfo: string = TeamBattleModel.Instance.maxRecordName;
                // let index:number = playerInfo.indexOf(".");
                // this.playerSever.text = playerInfo.substr(0, index);
                this.playerName.text = playerInfo; //playerInfo.substr(index + 1, playerInfo.length);
            } else {
                this.topRecord.text = '无';
                this.playerSever.text = '无';
                this.playerName.visible = false;
            }
        }

        //更新次数显示
        private updateTimes(): void {
            let myLevel = TeamBattleModel.Instance.myRecordLevel;
            if (myLevel) {
                this.myRecord.text = `${myLevel}关`;
            } else {
                this.myRecord.text = '无';
            }

            if (TeamBattleModel.Instance.remainTimes > 0) {
                this.challengeCountTxt.color = '#4c4d4f';
                this._btnClip.visible = true;
            } else {
                this.challengeCountTxt.color = '#e6372e';
                this._btnClip.visible = false;
            }
            this.challengeCountTxt.text = `挑战次数：${TeamBattleModel.Instance.remainTimes}/${TeamBattleModel.Instance.totalTimes}`;
        }

        //增加次数按钮处理
        private addTimesBtnHandler(): void {
            let num = 0;
            let itemId = 0;
            itemId = 20730009;
            num = BagModel.instance.getItemCountById(itemId);
            if (num > 0) {
                let date: Array<Protocols.Item> = BagModel.instance.getItemsById(itemId);
                if (date) {
                    modules.bag.BagUtil.openBagItemTip(date[0]);
                } else {
                    WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyTeamTicket);
                }
            } else {
                WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyTeamTicket);
            }
        }

        //tips显示
        private tipsBtnHandler(): void {
            CommonUtil.alertHelp(20024);
        }

        //弹窗到通关排行榜
        private rankBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.TEAM_BATTLE_RANK_ALERT);
        }

        // 合并规则显示
        private instructionsBtnHandler() {
            CommonUtil.alertHelp(20070);
        }

        // 合并与否
        private mergeBtnHandler() {
            let flag = heroAura.HeroAuraModel.instance.flag;
            if (flag == 1) {
                if (this.mergeBtn.selected) {
                    Channel.instance.publish(UserFeatureOpcode.SetMergeHeroAuraFbCount, [0]);
                } else {
                    Channel.instance.publish(UserFeatureOpcode.SetMergeHeroAuraFbCount, [1]);
                }
                this.mergeBtn.selected = !this.mergeBtn.selected;
            } else {
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.HERO_AURA_PANEL]);
                CommonUtil.alert('温馨提示', '您未激活黑钻特权,不可合并次数挑战.是否前往激活?', [handler]);
            }
        }

        private createRoomBtnHandler(): void {
            let count: number = TeamBattleModel.Instance.remainTimes;
            if (count < 0) {
                CommonUtil.noticeError(ErrorCode.CopyTimesNotEnough);
            } else {
                //创建队伍
                TeamBattleCtrl.instance.createTeam();
            }
        }

        //快速匹配按钮处理---------------发起请求进入匹配队列
        private matchBtnHandler(): void {
            if (SceneModel.instance.isInMission) {
                SystemNoticeManager.instance.addNotice("当前正在天关挑战中，请稍后再试", true);
            } else if (!scene.SceneUtil.isCommonScene) {
                SystemNoticeManager.instance.addNotice("副本中不可切换到其他副本", true);
            } else {
                if (TeamBattleModel.Instance.remainTimes > 0) {
                    TeamBattleCtrl.instance.startMatch();
                } else {
                    if (!dungeon.DungeonUtil.checkUseTicketBySceneId(SCENE_ID.scene_team_copy)) {
                        CommonUtil.noticeError(ErrorCode.CopyTimesNotEnough);
                    }
                }
            }
        }

        // 更新名字
        private updateName(): void {
            let maxRecord: TeamCopyRank = TeamBattleModel.Instance.maxRecord;
            if (!maxRecord) return;
            let info: UpdateNameReply = RenameModel.instance.updateNameReply;
            if (info && info[UpdateNameReplyFields.roleID] === maxRecord[TeamCopyRankFields.objId]) {
                let name: string = info[UpdateNameReplyFields.name];
                let index: number = name.indexOf(".");
                this.playerSever.text = name.substr(0, index);
                this.playerName.text = name.substr(index + 1, name.length);
            }
        }
    }
}
