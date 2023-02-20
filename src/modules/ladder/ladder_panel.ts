///<reference path="../config/tianti_cfg.ts"/>
///<reference path="../config/tianti_awards_cfg.ts"/>


/** 天梯面板*/


namespace modules.ladder {
    import LadderViewUI = ui.LadderViewUI;
    import Tianti = Protocols.Tianti;
    import TiantiTimes = Protocols.TiantiTimes;
    import TiantiTimesFields = Protocols.TiantiTimesFields;
    import TiantiRank = Protocols.TiantiRank;
    import TiantiRankFields = Protocols.TiantiRankFields;
    import ActorRankFields = Protocols.ActorRankFields;
    import TiantiScore = Protocols.TiantiScore;
    import TiantiScoreFields = Protocols.TiantiScoreFields;
    import Items = Configuration.Items;
    import TiantiCfg = modules.config.TiantiCfg;
    import tiantiFields = Configuration.tiantiFields;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import tianti = Configuration.tianti;
    import AwardState = Protocols.AwardState;
    import AwardStateFields = Protocols.AwardStateFields;
    import CustomClip = modules.common.CustomClip;
    import TiantiAwardsCfg = modules.config.TiantiAwardsCfg;
    import tianti_awardsFields = Configuration.tianti_awardsFields;
    import Item = Protocols.Item;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import CopySceneState = Protocols.CopySceneState;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import TeamBattleModel = modules.teamBattle.TeamBattleModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class LadderPanel extends LadderViewUI {
        private _baseItems: Array<BaseItem>;
        private _scoreProCtrl: ProgressBarCtrl;
        private _joinProCtrl: ProgressBarCtrl;
        private _gotImgs: Array<Laya.Image>;
        private _clips: Array<CustomClip>;
        private _matchBtnCustomClip: CustomClip;
        // 场景状态
        private _sceneState: CopySceneState;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;

            this._baseItems = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6];
            this._scoreProCtrl = new ProgressBarCtrl(this.progressBar, 233, this.progressTxt);
            this._joinProCtrl = new ProgressBarCtrl(this.joinProImg, 584, this.joinProTxt);

            this._gotImgs = [this.gotImg1, this.gotImg2, this.gotImg3, this.gotImg4];

            this.currencyIcon.skin = CommonUtil.getIconById(MoneyItemId.honor, true);

            this._clips = [];

            this.timeTxt.text = BlendCfg.instance.getCfgById(20111)[blendFields.stringParam][0];
            this.initializeClip();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.helpBtn, LayaEvent.CLICK, this, this.helpHandler);
            this.addAutoListener(this.sportAwardBtn, LayaEvent.CLICK, this, this.sportAwardHandler);
            this.addAutoListener(this.shopBtn, LayaEvent.CLICK, this, this.shopHandler);
            this.addAutoListener(this.rankBtn, LayaEvent.CLICK, this, this.rankHandler);
            this.addAutoListener(this.dailyAwardBtn, LayaEvent.CLICK, this, this.dailyAwardHandler);
            this.addAutoListener(this.addBtn, LayaEvent.CLICK, this, this.addHandler);
            this.addAutoListener(this.autoBtn, LayaEvent.CLICK, this, this.autoHandler);
            this.addAutoListener(this.matchBtn, LayaEvent.CLICK, this, this.matchHandler);
            this.addAutoListener(this.awardImg1, LayaEvent.CLICK, this, this.awardHandler, [0]);
            this.addAutoListener(this.awardImg2, LayaEvent.CLICK, this, this.awardHandler, [1]);
            this.addAutoListener(this.awardImg3, LayaEvent.CLICK, this, this.awardHandler, [2]);
            this.addAutoListener(this.awardImg4, LayaEvent.CLICK, this, this.awardHandler, [3]);
            this.addAutoListener(this.arenaBtn, LayaEvent.CLICK, this, this.arenaHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_TIMES_UPDATE, this, this.updateTimes);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_RANKS_UPDATE, this, this.updateRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_SCORE_UPDATE, this, this.updateScore);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_AUTO_MATCH_UPDATE, this, this.updateAutoMatch);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_JOIN_AWARD_UPDATE, this, this.updateJoinAward);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.updateSceneState);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MATCH_STATE_UPDATE, this, this.updateMatchState);

            this.addAutoRegisteRedPoint(this.jingjiRP, ["arenaRP"]);
            this.addAutoRegisteRedPoint(this.tianTiRP, ["tianTiRP"]);
        }


        protected onOpened(): void {
            super.onOpened();

            // 每次打开获取一次排行
            LadderCtrl.instance.getTiantiRank();
            this.updateSceneState();
            this.updateInfo();
            this.updateTimes();
            this.updateRank();
            this.updateScore();
            this.updateJoinAward();


            let score: TiantiScore = LadderModel.instance.tiantiScore;
            if (!score || score[TiantiScoreFields.remainTimes] === 0) {
                LadderModel.instance.autoMatch = false;
            }
            this.updateAutoMatch();
        }

        public close(): void {
            super.close();
            for (let i: int = 0, len: int = this._clips.length; i < len; i++) {
                this._clips[i].stop();
                this._clips[i].removeSelf();
            }
        }

        // 规则帮助
        private helpHandler(): void {
            CommonUtil.alertHelp(20033);
        }

        // 竞技奖励
        private sportAwardHandler(): void {
            WindowManager.instance.open(WindowEnum.LADDER_GRADE_AWARD_ALERT);
        }

        // 荣誉商店
        private shopHandler(): void {
            WindowManager.instance.open(WindowEnum.HONOR_STORE_PANEL);
        }

        // 榜单
        private rankHandler(): void {
            WindowManager.instance.open(WindowEnum.LADDER_RANK_ALERT);
        }

        // 每日荣誉奖励
        private dailyAwardHandler(): void {
            WindowManager.instance.open(WindowEnum.HONOR_AWARD_ALERT);
        }

        // 购买次数
        private addHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyTiantiTicket);
        }

        // 自动匹配
        private autoHandler(): void {
            if (this.checkCanMatch()) {
                LadderModel.instance.autoMatch = !LadderModel.instance.autoMatch;
            }
        }

        private getCheckCanMatch(): boolean {
            if (!this._sceneState || this._sceneState[CopySceneStateFields.state] !== 2) {    // 未开启
                // SystemNoticeManager.instance.addNotice("未到活动时间", true);
                return false;
            }
            let score: TiantiScore = LadderModel.instance.tiantiScore;
            if (!score || score[TiantiScoreFields.remainTimes] === 0) {
                // SystemNoticeManager.instance.addNotice("挑战次数不足", true);
                return false;
            }
            return true;
        }

        private checkCanMatch(): boolean {
            if (!this._sceneState || this._sceneState[CopySceneStateFields.state] !== 2) {    // 未开启
                SystemNoticeManager.instance.addNotice("未到活动时间", true);
                return false;
            }
            let score: TiantiScore = LadderModel.instance.tiantiScore;
            if (!score || score[TiantiScoreFields.remainTimes] === 0) {
                SystemNoticeManager.instance.addNotice("挑战次数不足", true);
                return false;
            }
            return true;
        }

        // 匹配
        private matchHandler(): void {
            if (this.checkCanMatch()) {
                LadderCtrl.instance.reqBeginMatch();
            }
        }

        // 更新天梯信息
        private updateInfo(): void {
            let info: Tianti = LadderModel.instance.ladderInfo;
            if (!info) return;
        }

        // 更新次数
        private updateTimes(): void {
            let times: TiantiTimes = LadderModel.instance.times;
            if (!times) return;
            this.successRateTxt.text = `${times[TiantiTimesFields.winSeasonTimes] === 0 ? 0 : Math.round(times[TiantiTimesFields.winSeasonTimes] / times[TiantiTimesFields.joinSeasonTimes] * 100) + "%"}`;
            this.timesTxt.text = `${times[TiantiTimesFields.joinSeasonTimes]}`;
            let joinTimes: number = times[TiantiTimesFields.joinTimes];
            let needJoinTimes: number = 10;
            this._joinProCtrl.maxValue = needJoinTimes;
            this._joinProCtrl.value = joinTimes;
        }

        // 更新排行
        private updateRank(): void {
            let ranks: Array<TiantiRank> = LadderModel.instance.ranks;
            if (!ranks) return;
            let myRank: number = -1;
            for (let i: int = 0, len: int = ranks.length; i < len; i++) {
                if (ranks[i][TiantiRankFields.actorRank][ActorRankFields.objId] === PlayerModel.instance.actorId) {
                    myRank = ranks[i][TiantiRankFields.actorRank][ActorRankFields.rank];
                }
            }
            this.rankTxt.text = myRank === -1 ? "未上榜" : myRank.toString();
        }

        // 更新积分
        private updateScore(): void {
            let score: TiantiScore = LadderModel.instance.tiantiScore;
            if (!score) return;
            this.restTimesTxt.text = score[TiantiScoreFields.remainTimes] + "";
            let seg: number = score[TiantiScoreFields.seg];      // 段位
            let cfg: tianti = TiantiCfg.instance.getCfgById(seg);
            // 奖励展示取下一段位的
            let nextCfg: tianti = TiantiCfg.instance.getCfgById(seg + 1);
            let items: Array<Items> = nextCfg ? nextCfg[tiantiFields.promoteAwards] : [];
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                this._baseItems[i].visible = true;
                this._baseItems[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
            }
            for (let i: int = items.length, len: int = this._baseItems.length; i < len; i++) {
                this._baseItems[i].visible = false;
            }
            //满级之后 服务器给的等级比最高等级大一级
            if (seg >= TiantiCfg.instance.getCfgMaxId()) {
                seg = TiantiCfg.instance.getCfgMaxId();
                cfg = TiantiCfg.instance.getCfgById(seg);
                // this.img1.visible = this.img2.visible = false;
                // this.jinshengText.visible = false;
                this.maxTipText1.visible = true;
            } else {
                // this.img1.visible = this.img2.visible = true;
                // this.jinshengText.visible = true;
                this.maxTipText1.visible = false;
            }
            let scoreNum: number = score[TiantiScoreFields.score];
            let needScore: number = 0;
            if (cfg) {
                needScore = cfg[tiantiFields.totalScore];
                this._scoreProCtrl.maxValue = needScore;
                this._scoreProCtrl.value = scoreNum;
                let maxSocre = TiantiCfg.instance.getCfgMaxSocre();
                if (scoreNum >= maxSocre) {
                    this.progressTxt.visible = false;
                    this.progressBar.visible = false;
                    this.maxTipText.visible = true;
                } else {
                    this.progressTxt.visible = true;
                    this.progressBar.visible = true;
                    this.maxTipText.visible = false;
                }
                this.gradeFont.value = cfg[tiantiFields.name];
                let id = cfg[tiantiFields.id];

                if (id == 1 || id == 6 || id == 11 || id == 16 || id == 21 || id == 26) {
                    this.gradeFont1.value = `5`;
                } else if (id == 1 + 1 || id == 6 + 1 || id == 11 + 1 || id == 16 + 1 || id == 21 + 1 || id == 26 + 1) {
                    this.gradeFont1.value = `4`;
                } else if (id == 1 + 2 || id == 6 + 2 || id == 11 + 2 || id == 16 + 2 || id == 21 + 2 || id == 26 + 2) {
                    this.gradeFont1.value = `3`;
                } else if (id == 1 + 3 || id == 6 + 3 || id == 11 + 3 || id == 16 + 3 || id == 21 + 3 || id == 26 + 3) {
                    this.gradeFont1.value = `2`;
                } else if (id == 1 + 4 || id == 6 + 4 || id == 11 + 4 || id == 16 + 4 || id == 21 + 4 || id == 26 + 4) {
                    this.gradeFont1.value = `1`;
                } else {
                    this.gradeFont1.value = ``;
                }
                this.currencyTxt.text = `${cfg[tiantiFields.honorAwards][0][ItemsFields.count]}`;
            } else {
                this.progressTxt.visible = false;
                this.progressBar.visible = false;
                // this.img1.visible = this.img2.visible = false;
                // this.jinshengText.visible = false;
                this.maxTipText1.visible = true;
                this.maxTipText.visible = true;
                this.gradeFont.value = `王者一阶`;
                this.gradeFont1.value = `1`;
                this.currencyTxt.text = ``;
            }


            if (this.getCheckCanMatch()) {
                this._matchBtnCustomClip.visible = true;
                this._matchBtnCustomClip.play();
                this.matchBtn.gray = false;
            } else {
                this._matchBtnCustomClip.visible = false;
                this._matchBtnCustomClip.stop();
                this.matchBtn.gray = true;
            }

        }

        // 更新自动匹配
        private updateAutoMatch(): void {
            let autoMatch: boolean = LadderModel.instance.autoMatch;
            this.autoBtn.selected = autoMatch;
            if (autoMatch) {
                LadderCtrl.instance.reqBeginMatch();
            } else {
                LadderCtrl.instance.reqCancelMatch();
            }
        }

        // 领取参与奖励
        private awardHandler(index: int): void {
            let states: Array<AwardState> = LadderModel.instance.joinAwardStates;
            if (states && states[index] && states[index][AwardStateFields.state] === 1) {        // 0未达成 1可领取 2已领取
                LadderCtrl.instance.getTiantiJoinAward(index);
            } else if (!states || !states[index] || states[index][AwardStateFields.state] === 0) {
                let items: Array<Items> = TiantiAwardsCfg.instance.cfgs[index][tianti_awardsFields.joinAwards];
                let arr: Array<Item> = [];
                for (let i: int = 0, len: int = items.length; i < len; i++) {
                    arr[i] = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
                }
                WindowManager.instance.open(WindowEnum.COMMON_ITEMS_ALERT, [arr, "奖励预览"]);
            }
        }

        // 竞技场跳转
        private arenaHandler(): void {
            WindowManager.instance.open(WindowEnum.ARENA_PANEL);
        }

        // 更新奖励状态
        private updateJoinAward(): void {
            for (let i: int = 0, len: int = this._clips.length; i < len; i++) {
                this._clips[i].stop();
                this._clips[i].removeSelf();
            }
            let states: Array<AwardState> = LadderModel.instance.joinAwardStates;
            if (!states || states.length === 0) return;
            for (let i: int = 0; i < 4; i++) {
                let state: AwardState = states[i];
                this._gotImgs[i].visible = state[AwardStateFields.state] === 2;

                if (state[AwardStateFields.state] === 1) {
                    let clip: CustomClip = this._clips[i];
                    if (!clip) {
                        clip = new CustomClip();
                        clip.skin = "assets/effect/ok_state.atlas";
                        clip.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                            "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
                        this._clips.push(clip);
                    }
                    clip.pos(this._gotImgs[i].x - 84.5, this._gotImgs[i].y - 95, true);
                    clip.play();
                    this.awardBox.addChildAt(clip, 6);
                }
            }
        }

        // 更新场景状态
        private updateSceneState(): void {
            this._sceneState = DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.tiantiCopy);
        }

        // 更新匹配状态
        private updateMatchState(): void {
            let matchState: number = TeamBattleModel.Instance.matchState;
            if (matchState === 0) {         // 匹配中
                WindowManager.instance.open(WindowEnum.LADDER_MATCH_ALERT);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._baseItems) {
                for (let e of this._baseItems) {
                    e.destroy(true);
                }
                this._baseItems = null;
            }
            if (this._scoreProCtrl) {
                this._scoreProCtrl.destroy();
                this._scoreProCtrl = null;
            }
            if (this._joinProCtrl) {
                this._joinProCtrl.destroy();
                this._joinProCtrl = null;
            }

            if (this._matchBtnCustomClip) {
                this._matchBtnCustomClip.destroy();
                this._matchBtnCustomClip = null;
            }

            if (this._gotImgs) {
                for (let e of this._gotImgs) {
                    e.destroy(true);
                }
                this._gotImgs = null;
            }

            if (this._clips) {
                for (let e of this._clips) {
                    e.destroy(true);
                }
                this._clips = null;
            }

            super.destroy(destroyChild);
        }

        /**
         * 初始化特效
         */
        public initializeClip() {
            this._matchBtnCustomClip = new CustomClip();
            this.addChild(this._matchBtnCustomClip);
            this._matchBtnCustomClip.skin = "assets/effect/btn_light.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._matchBtnCustomClip.frameUrls = arr1;
            this._matchBtnCustomClip.scale(1.23, 1.25, true);
            this._matchBtnCustomClip.pos(this.matchBtn.x - 5, this.matchBtn.y - 21, true);
        }
    }
}
