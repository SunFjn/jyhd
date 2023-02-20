///<reference path="../common/list_with_arrow_ctrl.ts"/>
///<reference path="../config/scene_multi_boss_cfg.ts"/>
///<reference path="../dungeon/dungeon_model.ts"/>
///<reference path="../bottom_tab/bottom_tab_ctrl.ts"/>
///<reference path="../dungeon/dungeon_util.ts"/>


/** 多人BOSS面板*/
namespace modules.multiBoss {
    import MultiBossViewUI = ui.MultiBossViewUI;
    import CustomList = modules.common.CustomList;
    import ListWithArrowCtrl = modules.common.ListWithArrowCtrl;
    import BtnGroup = modules.common.BtnGroup;
    import SceneMultiBossCfg = modules.config.SceneMultiBossCfg;
    import scene_multi_boss = Configuration.scene_multi_boss;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import BaseItem = modules.bag.BaseItem;
    import PlayerModel = modules.player.PlayerModel;
    import scene_multi_bossFields = Configuration.scene_multi_bossFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BossInfo = Protocols.BossInfo;
    import BossInfoFields = Protocols.BossInfoFields;
    import KillReocrdFields = Protocols.KillReocrdFields;
    import BossStateFields = Protocols.BossStateFields;
    import BossTimes = Protocols.BossTimes;
    import BossTimesFields = Protocols.BossTimesFields;
    import FollowBoss = Protocols.FollowBoss;
    import FollowBossFields = Protocols.FollowBossFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CustomClip = modules.common.CustomClip;
    import DungeonUtil = modules.dungeon.DungeonUtil;
    import CommonUtil = modules.common.CommonUtil;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import EnterScene = Protocols.EnterScene;
    import SceneModel = modules.scene.SceneModel;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    export class MultiBossPanel extends MultiBossViewUI {
        private _list: CustomList;
        private _listAward: CustomList;
        private _btnGroup: BtnGroup;
        private _proCtrl: ProgressBarCtrl;

        // 选中的BOSS
        private _selectedBoss: scene_multi_boss;
        // 奖励
        private _awardItems: Array<BaseItem>;
        // BOSS复活时间戳
        private _reviveTimeStamp: number;
        // 次数恢复时间戳
        private _timesRecoverStamp: number;

        private _btnClip: CustomClip;

        private _isBossDead: boolean;

        private _selectedBossId: number;
        private _skeletonClip: SkeletonAvatar;
        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.itemRender = MultiBossItem;
            this._list.width = 255;
            this._list.height = 596;
            this._list.hCount = 1;
            this._list.spaceY = 3;
            this._list.x = 455;
            this._list.y = 112;
            this.addChild(this._list);

            this._listAward = new CustomList();
            this._listAward.itemRender = BaseItem;
            this._listAward.width = 378;
            this._listAward.height = 120;
            this._listAward.vCount = 1;
            this._listAward.hCount = 8;
            this._listAward.spaceX = 3;
            this._listAward.x = 56;
            this._listAward.y = 800;
            this._listAward.scrollDir = 2
            this.addChild(this._listAward);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.singleBoss, this.multiBoss, this.yunMengBoss);

            this._proCtrl = new ProgressBarCtrl(this.proBar, 263, this.proTxt);
            this._proCtrl.maxValue = 1;

            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.visible = false;
            this._btnClip.pos(238, 915, true);
            this._btnClip.scale(1.15, 1, true);

            this._isBossDead = true;
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(260, 660, true);

            this.regGuideSpr(GuideSpriteId.SINGLE_BOSS_TAB_BTN, this.singleBoss);
            this.regGuideSpr(GuideSpriteId.MULTI_BOSS_TAB_BTN, this.multiBoss);
            this.regGuideSpr(GuideSpriteId.MULTI_BOSS_CHALLENGE_BTN, this.killBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.bossUpdateHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_TIMES_UPDATE, this, this.timesUpdateHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MULTI_BOSS_FOLLOWS_UPDATE, this, this.followsUpdateHandler);

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.selectBossHandler);
            this.addAutoListener(this.followBtn, common.LayaEvent.CLICK, this, this.followHandler);
            this.addAutoListener(this.killBtn, common.LayaEvent.CLICK, this, this.killHandler);
            this.addAutoListener(this.helpBtn, common.LayaEvent.CLICK, this, this.helpHandler);

            this.addAutoRegisteRedPoint(this.singleBossDot, ["singleBossRP"]);
            this.addAutoRegisteRedPoint(this.multiBossDot, ["multiBossRP"]);
            this.addAutoRegisteRedPoint(this.yunMengBossDot, ["yunMengBossRP"]);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.reviveCDHandler);
            super.removeListeners();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._selectedBossId = value;
        }

        protected onOpened(): void {
            super.onOpened();

            this._btnGroup.selectedIndex = 1;
            this._list.selectedIndex = -1;
            let cfgs: Array<scene_multi_boss> = SceneMultiBossCfg.instance.cfgs.concat();
            let firstCfg: scene_multi_boss = cfgs[0];
            cfgs.shift();
            if (DungeonModel.instance.firstBoss) {
                cfgs[0] = firstCfg;
                this._selectedBossId = firstCfg[scene_multi_bossFields.occ];
            }
            this._list.datas = cfgs;
            if (this._selectedBossId) {
                for (let i: int = 0, len: int = cfgs.length; i < len; i++) {
                    if (cfgs[i][scene_multi_bossFields.occ] === this._selectedBossId) {
                        this._list.selectedIndex = i;
                        break;
                    }
                }
            } else {
                let lv: int = PlayerModel.instance.level;
                let era: int = PlayerModel.instance.eraLevel;
                let maxIndex: number = - 1;          // 觉醒等级对应的最大BOSS
                let aliveIndex: number = -1;          // 关注且活着的最大BOSS
                for (let i: int = cfgs.length - 1; i >= 0; i--) {
                    let bossId: number = cfgs[i][scene_multi_bossFields.occ];
                    if (DungeonModel.instance.getFollowBossById(bossId)) {
                        let info: BossInfo = DungeonModel.instance.getBossInfoById(bossId);
                        let bossState: Protocols.BossState = info ? info[BossInfoFields.bossState] : null;
                        let isDead: boolean = !bossState || bossState[BossStateFields.dead];
                        if (!isDead) {
                            aliveIndex = i;
                            break;
                        }
                    }
                    if (lv >= cfgs[i][scene_multi_bossFields.actorLevel] && era >= cfgs[i][scene_multi_bossFields.eraLevel]) {
                        if (maxIndex === -1) maxIndex = i;
                    }
                }
                this._list.selectedIndex = aliveIndex === -1 ? maxIndex : aliveIndex;
            }

            this._list.scrollTo(this._list.selectedIndex * 120);

            this.timesUpdateHandler();
            // 请求次数
            DungeonCtrl.instance.getBossTimes();
            // 请求BOSS信息
            DungeonCtrl.instance.getBoss();
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.SINGLE_BOSS_PANEL);
                this._btnGroup.selectedIndex = 1;
            } else if (this._btnGroup.selectedIndex === 2) {
                WindowManager.instance.open(WindowEnum.YUNMENGMIJING_PANLE);
                this._btnGroup.selectedIndex = 1;
            }
        }

        // 选中BOSS
        private selectBossHandler(): void {
            this._selectedBoss = this._list.selectedData;
            if (!this._selectedBoss) return;
            // 请求次数
            DungeonCtrl.instance.getBossTimes();
            // 请求BOSS信息
            DungeonCtrl.instance.getBoss();
            let monsterCfg: MonsterRes = MonsterResCfg.instance.getCfgById(this._selectedBoss[scene_multi_bossFields.occ]);
            // this.bossNameTxt.text = monsterCfg[MonsterResFields.name];
            // this.headImg.skin = `assets/icon/monster/${monsterCfg[MonsterResFields.icon]}.png`;
            
            // 奖励
            let awards: Array<Items> = this._selectedBoss[scene_multi_bossFields.tipsAward];
            this._awardItems = this._awardItems || [];

            let firstAward = this._selectedBoss[scene_multi_bossFields.firstRankAward];
            this.bagItem.dataSource = [firstAward[ItemsFields.itemId], firstAward[ItemsFields.count], 0, null];

            let tempArr = new Array();
            for (let i: int = 0; i < awards.length; i++) {
                let awardItem: BaseItem;
                if (this._awardItems.length > i) {
                    awardItem = this._awardItems[i];
                } else {
                    awardItem = new BaseItem();
                    this._awardItems[i] = awardItem;
                }
                tempArr[i] = [awards[i][ItemsFields.itemId], awards[i][ItemsFields.count], 0, null];
            }

            let id: number = monsterCfg[MonsterResFields.res];
            this._listAward.datas = tempArr;
            this._skeletonClip.reset(id)

            this.bossUpdateHandler();
            this.followBtn.selected = false;
            this.followsUpdateHandler();
        }

        private followHandler(): void {
            if (!this._selectedBoss) return;
            this.followBtn.selected = !this.followBtn.selected;
            if (DungeonModel.instance.firstBoss) {      // 如果是引导BOSS，关注的应该是实际的未觉醒BOSS
                let cfgs: Array<scene_multi_boss> = SceneMultiBossCfg.instance.cfgs;
                DungeonCtrl.instance.setFollowBoss(cfgs[1][scene_multi_bossFields.occ], this.followBtn.selected);
            } else {
                DungeonCtrl.instance.setFollowBoss(this._selectedBoss[scene_multi_bossFields.occ], this.followBtn.selected);
            }
        }

        private killHandler(): void {
            if (!this._selectedBoss) return;
            if (this._selectedBossId == SceneMultiBossCfg.instance.cfgs[0][scene_multi_bossFields.occ]) { //新手引导的东西
                DungeonCtrl.instance.reqEnterScene(this._selectedBoss[scene_multi_bossFields.mapId], 1);
            } else if (!DungeonUtil.checkUseTicketBySceneType(SceneTypeEx.multiBoss, this._selectedBoss[scene_multi_bossFields.level])) {
                DungeonCtrl.instance.reqEnterScene(this._selectedBoss[scene_multi_bossFields.mapId], this._selectedBoss[scene_multi_bossFields.level]);
            }
        }

        private helpHandler(): void {
            CommonUtil.alertHelp(20007);
        }

        private showClip(value: boolean): void {
            if (value) {
                this._btnClip.visible = true;
                this._btnClip.play();
            } else {
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        // BOSS信息更新
        private bossUpdateHandler(): void {
            if (!this._selectedBoss) return;
            let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(this._selectedBoss[scene_multi_bossFields.occ]);
            if (!bossInfo) return;
            if (DungeonModel.instance.firstBoss && this._list.selectedIndex == 0) {
                bossInfo[BossInfoFields.bossState][BossStateFields.dead] = false;
                bossInfo[BossInfoFields.bossState][BossStateFields.hpPer] = 1;
            }
            this.lastFirstTxt.text = `${bossInfo[BossInfoFields.killRecord][KillReocrdFields.killer] || "无"}`;
            this._proCtrl.value = bossInfo[BossInfoFields.bossState][BossStateFields.hpPer];
            this._proCtrl.txt = (bossInfo[BossInfoFields.bossState][BossStateFields.hpPer] * 100).toFixed(2) + "%";
            if (bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {       // 死亡
                this.killedImg.visible = this.reviveTimeTxt.visible = this.reviveTimeTxtBg.visible = true;
                this.proBg.visible = this.proBar.visible = this.proTxt.visible = false;
                this._reviveTimeStamp = bossInfo[BossInfoFields.bossState][BossStateFields.reviveTime];
                if (this._reviveTimeStamp > GlobalData.serverTime) {
                    Laya.timer.loop(1000, this, this.reviveCDHandler);
                    this.reviveCDHandler();
                    this._isBossDead = true;
                    this.checkRP();
                } else {
                    Laya.timer.clear(this, this.reviveCDHandler);
                    this.showClip(true);
                    this._isBossDead = false;
                    this.checkRP();
                }
            } else {
                this.killedImg.visible = this.reviveTimeTxt.visible = this.reviveTimeTxtBg.visible = false;
                this.proBg.visible = this.proBar.visible = this.proTxt.visible = true;
                Laya.timer.clear(this, this.reviveCDHandler);
                this._isBossDead = false;
                this.checkRP();
            }
        }

        private reviveCDHandler(): void {
            if (this._reviveTimeStamp > GlobalData.serverTime) {
                this.reviveTimeTxt.text = `复活倒计时：${CommonUtil.timeStampToMMSS(this._reviveTimeStamp)}`;
            } else {
                this.killedImg.visible = this.reviveTimeTxt.visible = this.reviveTimeTxtBg.visible = false;
                this.proBg.visible = this.proBar.visible = this.proTxt.visible = true;
                Laya.timer.clear(this, this.reviveCDHandler);
                this._isBossDead = false;
                this.checkRP();
            }
        }

        // 检查是否有红点
        private checkRP(): void {
            let flag: boolean = false;
            if (this._selectedBoss) {
                let timeInfo: BossTimes = DungeonModel.instance.getBossTimesBySceneType(SceneTypeEx.multiBoss);
                if (timeInfo) {
                    if (!this._isBossDead && timeInfo[BossTimesFields.remainTimes] > 0) {
                        let follow: FollowBoss = DungeonModel.instance.getFollowBossById(this._selectedBoss[scene_multi_bossFields.occ]);
                        if (follow && follow[FollowBossFields.follow]) {
                            flag = true;
                        }
                    }
                }
            }
            this.showClip(flag);
        }

        // BOSS次数更新
        private timesUpdateHandler(): void {
            let timeInfo: BossTimes = DungeonModel.instance.getBossTimesBySceneType(SceneTypeEx.multiBoss);
            if (!timeInfo) return;
            this.timesTxt.text = `${timeInfo[BossTimesFields.remainTimes]}/${timeInfo[BossTimesFields.totalTimes]}`;
            this.timesTxt.color = timeInfo[BossTimesFields.remainTimes] > 0 ? "#168a17" : "#FF3e3e";
            this._timesRecoverStamp = timeInfo[BossTimesFields.recoverTime];
            if (this._timesRecoverStamp > GlobalData.serverTime) {
                this.cdTxt.visible = true;
                this.challengeTxt.x = 157;
                this.timesTxt.x = 272;
                Laya.timer.loop(1000, this, this.timesCDHandler);
                this.timesCDHandler();
            } else {
                this.cdTxt.visible = false;
                this.challengeTxt.x = 284;
                this.timesTxt.x = 399;
                Laya.timer.clear(this, this.timesCDHandler);
            }
            this.checkRP();
        }

        private timesCDHandler(): void {
            if (this._timesRecoverStamp > GlobalData.serverTime) {
                this.cdTxt.text = `${CommonUtil.timeStampToHHMMSS(this._timesRecoverStamp)}后恢复1次`;
            } else {
                this.cdTxt.visible = false;
                this.challengeTxt.x = 284;
                this.timesTxt.x = 399;
                Laya.timer.clear(this, this.timesCDHandler);
            }
        }

        // 关注更新
        private followsUpdateHandler(): void {
            if (!this._selectedBoss) return;
            let arr: Array<FollowBoss> = DungeonModel.instance.follows;
            if (!arr) return;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                if (this._selectedBoss[scene_multi_bossFields.occ] === arr[i][FollowBossFields.occ]) {
                    this.followBtn.selected = arr[i][FollowBossFields.follow];
                    break;
                }
            }
            this.checkRP();
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._listAward = this.destroyElement(this._listAward);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._proCtrl = this.destroyElement(this._proCtrl);
            this._awardItems = this.destroyElement(this._awardItems);
            this._btnClip = this.destroyElement(this._btnClip);
            this._skeletonClip = this.destroyElement(this._skeletonClip);
            super.destroy(destroyChild);
        }
    }
}