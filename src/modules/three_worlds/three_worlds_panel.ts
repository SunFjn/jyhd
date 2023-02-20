///<reference path="../multi_boss/multi_boss_item.ts"/>
///<reference path="../config/scene_cross_boss_cfg.ts"/>

/** 三界BOSS面板*/
namespace modules.threeWorlds {
    import DungeonUtil = modules.dungeon.DungeonUtil;
    import ThreeWorldsViewUI = ui.ThreeWorldsViewUI;
    import Event = Laya.Event;
    import CustomList = modules.common.CustomList;
    import scene_cross_boss = Configuration.scene_cross_boss;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import PlayerModel = modules.player.PlayerModel;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import BaseItem = modules.bag.BaseItem;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BossInfo = Protocols.BossInfo;
    import DungeonModel = modules.dungeon.DungeonModel;
    import BossInfoFields = Protocols.BossInfoFields;
    import BossStateFields = Protocols.BossStateFields;
    import BossTimes = Protocols.BossTimes;
    import SceneCfg = modules.config.SceneCfg;
    import scene = Configuration.scene;
    import sceneFields = Configuration.sceneFields;
    import BossTimesFields = Protocols.BossTimesFields;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import CustomClip = modules.common.CustomClip;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import CommonUtil = modules.common.CommonUtil;
    import BagModel = modules.bag.BagModel;
    import BtnGroup = modules.common.BtnGroup;
    import ListWithArrowCtrl = modules.common.ListWithArrowCtrl;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class ThreeWorldsPanel extends ThreeWorldsViewUI {

        private _list: CustomList;
        private _proCtrl: ProgressBarCtrl;
        private _listCtrl: ListWithArrowCtrl;
        // 选中的BOSS
        private _selectedBoss: scene_cross_boss;

        // 参与奖励
        private _joinAward: BaseItem;
        // 最后一击奖励
        private _killAward: BaseItem;
        // 排名奖励
        private _rankAwards: Array<BaseItem>;

        private _reviveTimeStamp: number;

        private _btnClip: CustomClip;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _btnGroup: BtnGroup;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.universeBossBtn, this.shengYuBossBtn, this.bossHomeBtn);
            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.vCount = 1;
            this._list.spaceX = 10;
            this._list.itemRender = ThreeWorldsItem;
            this._list.width = 686;
            this._list.height = 126;
            this._list.pos(24, 128, true);
            this.addChild(this._list);

            this.rankTxt.underline = true;

            this._joinAward = new BaseItem();
            this.addChild(this._joinAward);
            this._joinAward.pos(475, 845, true);
            this._joinAward.scale(0.9, 0.9, true);
            this._joinAward.nameVisible = false;

            this._killAward = new BaseItem();
            this.addChild(this._killAward);
            this._killAward.pos(585, 845, true);
            this._killAward.scale(0.9, 0.9, true);
            this._killAward.nameVisible = false;

            this._rankAwards = new Array<BaseItem>();
            for (let i: int = 0; i < 4; i++) {
                let bagItem: BaseItem = new BaseItem();
                this.addChild(bagItem);
                bagItem.pos(40 + i * 106, 845, true);
                bagItem.nameVisible = false;
                bagItem.scale(0.9, 0.9, true);
                this._rankAwards.push(bagItem);
            }

            this._proCtrl = new ProgressBarCtrl(this.proBar, 325, this.proTxt);
            this._proCtrl.maxValue = 1;

            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.scale(1.09, 1.09);
            this._btnClip.pos(250, 960);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.visible = false;

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 3);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.x = 250;
            // this._modelClip.y = 630;

            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 750, true);

            this._listCtrl = new ListWithArrowCtrl(this._list, this.leftBtn, this.rightBtn);
            this._listCtrl.scrollDis = 136 * 4;

            this.regGuideSpr(GuideSpriteId.THREE_WORLDS_CHALLENGE_BTN, this.gotoBtn);
            this.regGuideSpr(GuideSpriteId.THREE_WORLDS_TAB_BTN, this.universeBossBtn);
            this.regGuideSpr(GuideSpriteId.BOSS_HOME_TAB_BTN, this.bossHomeBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            this._listCtrl.addListeners();

            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.helpBtn, Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.gotoBtn, Event.CLICK, this, this.gotoHandler);
            this.addAutoListener(this.addBtn, Event.CLICK, this, this.addHandler);
            this.addAutoListener(this._list, Event.SELECT, this, this.selectBossHandler);
            this.addAutoListener(this.rankTxt, Event.CLICK, this, this.rankHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateBoss);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_TIMES_UPDATE, this, this.updateBossTimes);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BOSS_KILL_INFO_UPDATE, this, this.showKillBossInfo);


            this.addAutoRegisteRedPoint(this.threeWorldsRP, ["threeWorldsRP"]);
            this.addAutoRegisteRedPoint(this.bossHomeRP, ["bossHomeRP"]);
            this.addAutoRegisteRedPoint(this.shengYuBossRP, ["shenYuBossRP"]);
        }
        private showKillBossInfo(value: string) {
            this.killName.text = value
        }
        protected removeListeners(): void {
            this._listCtrl.removeListeners();
            Laya.timer.clear(this, this.reviveCDHandler);
            super.removeListeners();
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.SHENGYU_BOSS_PANEL);
                this._btnGroup.selectedIndex = 0;
            } else if (this._btnGroup.selectedIndex === 2) {
                WindowManager.instance.open(WindowEnum.BOSS_HOME_PANEL);
                this._btnGroup.selectedIndex = 0;
            }
        }

        protected onOpened(): void {
            super.onOpened();

            let arr: Array<scene_cross_boss> = SceneCrossBossCfg.instance.cfgs;

            let era: number = PlayerModel.instance.eraLevel;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let eras: Array<number> = arr[i][scene_cross_bossFields.eraLevelSection];
                console.log("ERAS", eras, era, arr);

                if (era >= eras[0] && era <= eras[1]) {
                    ThreeWorldsModel.instance.canChallenge = i
                    this._list.datas = arr;
                    this._list.selectedIndex = i;
                    break;
                }
            }

            this._list.scrollTo(this._list.selectedIndex * 202);
            // 请求BOSS信息
            DungeonCtrl.instance.getBoss();
            DungeonCtrl.instance.getBossTimes();
            ThreeWorldsCtrl.instance.getManualKillBossInfo();

            this.updateBossTimes();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._btnGroup.selectedIndex = 0;
        }

        private helpHandler(): void {
            CommonUtil.alertHelp(20012);
        }

        private gotoHandler(): void {
            if (!this._selectedBoss) return;
            if (!DungeonUtil.checkUseTicketBySceneType(SceneTypeEx.crossBoss, this._selectedBoss[scene_cross_bossFields.level])) {
                DungeonCtrl.instance.reqEnterScene(this._selectedBoss[scene_cross_bossFields.mapId], this._selectedBoss[scene_cross_bossFields.level]);
            }
        }

        private addHandler(): void {
            if (!this._selectedBoss) return;
            let num = 0;
            let itemId = 0;
            itemId = 20730010;
            num = BagModel.instance.getItemCountById(itemId);
            if (num > 0) {
                let date: Array<Protocols.Item> = BagModel.instance.getItemsById(itemId);
                if (date) {
                    modules.bag.BagUtil.openBagItemTip(date[0]);
                } else {
                    WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyCrossBoss);
                }
            } else {
                WindowManager.instance.openDialog(WindowEnum.VIP_TIMES_ALERT, Privilege.copyCrossBoss);
            }
        }

        private updateBoss(): void {
            if (!this._selectedBoss) return;
            if (this._selectedBoss[1] - 1 === ThreeWorldsModel.instance.canChallenge) {
                this.gotoBtn.gray = false;
                this.gotoBtn.mouseEnabled = true;
                let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(this._selectedBoss[scene_cross_bossFields.occ]);
                if (!bossInfo) return;
                if (bossInfo[BossInfoFields.bossState][BossStateFields.dead]) {       // 死亡
                    this.stateBox.visible = false;
                    this.timeTxt.visible = true;
                    this.count_tiem.visible = true
                    this._reviveTimeStamp = bossInfo[BossInfoFields.bossState][BossStateFields.reviveTime];
                    if (this._reviveTimeStamp > GlobalData.serverTime) {
                        Laya.timer.loop(1000, this, this.reviveCDHandler);
                        this.reviveCDHandler();
                    } else {
                        Laya.timer.clear(this, this.reviveCDHandler);
                    }
                    this.proBg.visible = this.proBar.visible = this.proTxt.visible = false;
                } else {
                    let per: number = bossInfo[BossInfoFields.bossState][BossStateFields.totalHpPer];
                    if (per === 1) {
                        this.stateBox.visible = false;
                    } else {
                        this.stateBox.visible = true;
                        if (per > 1) {
                            this.stateTxt.text = `暴怒中`;
                            this.stateTxt.color = this.changeTxt.color = `#ff3e3e`;
                            this.changeTxt.text = `血量增加${Math.round((per - 1) * 100)}%`;
                        } else {
                            this.stateTxt.text = `虚弱中`;
                            this.stateTxt.color = this.changeTxt.color = `#50ff28`;
                            this.changeTxt.text = `血量减少${Math.round((1 - per) * 100)}%`;
                        }
                    }
                    this.timeTxt.visible = false;
                    this.count_tiem.visible = false
                    Laya.timer.clear(this, this.reviveCDHandler);
                    this.proBg.visible = this.proBar.visible = this.proTxt.visible = true;
                    let hp: number = bossInfo[BossInfoFields.bossState][BossStateFields.hpPer];
                    this._proCtrl.value = hp;
                    this._proCtrl.txt = (hp * 100).toFixed(hp === 0 || hp === 1 ? 0 : 2) + "%";
                }
                this.checkChallenge();
                this.killBoss_bg.visible = true;
                this.killName.visible = true;
                this.kill_boss_title.visible = true;

            } else {
                this.stateBox.visible = false;
                this.timeTxt.visible = false;
                this.count_tiem.visible = false;
                this.proBg.visible = false;
                this._proCtrl.txt = ""
                this.stateTxt.text = ""
                this.changeTxt.text = ""
                this._btnClip.visible = false;
                this.gotoBtn.mouseEnabled = false;
                this.gotoBtn.gray = true;
                this.killBoss_bg.visible = false;
                this.killName.visible = false;
                this.kill_boss_title.visible = false;
            }


        }

        private reviveCDHandler(): void {
            if (this._reviveTimeStamp > GlobalData.serverTime) {
                this.timeTxt.text = `复活倒计时：${CommonUtil.timeStampToMMSS(this._reviveTimeStamp)}`;
            } else {
                this.timeTxt.visible = false;
                this.count_tiem.visible = false
                Laya.timer.clear(this, this.reviveCDHandler);
                this.updateBoss();
            }
        }

        private selectBossHandler(): void {
            this._selectedBoss = this._list.selectedData;
            let items: Array<Items> = this._selectedBoss[scene_cross_bossFields.tipsJoinAwards];
            this._joinAward.dataSource = [items[0][ItemsFields.itemId], items[0][ItemsFields.count], 0, null];
            items = this._selectedBoss[scene_cross_bossFields.tipsKillAwards];
            this._killAward.dataSource = [items[0][ItemsFields.itemId], items[0][ItemsFields.count], 0, null];
            items = this._selectedBoss[scene_cross_bossFields.tipsRankAwards];
            for (let i: int = 0; i < 4; i++) {
                this._rankAwards[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
            }
            let bossId: number = this._selectedBoss[scene_cross_bossFields.occ];
            this.nameTxt.text = MonsterResCfg.instance.getCfgById(bossId)[MonsterResFields.name];

            this.updateBoss();
            this.selectBossModel();
        }

        private selectBossModel(): void {
            let id: number = MonsterResCfg.instance.getCfgById(this._selectedBoss[scene_cross_bossFields.occ])[MonsterResFields.res];
            // let modelCfg: Exterior = ExteriorSKCfg.instance.getCfgById(id);

            this._skeletonClip.reset(id);
            // this._modelClip.reset(id);

            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
        }

        private updateBossTimes(): void {
            if (!this._selectedBoss) return;
            let mapId: number = this._selectedBoss[scene_cross_bossFields.mapId];
            let mapCfg: scene = SceneCfg.instance.getCfgById(mapId);
            let times: BossTimes = DungeonModel.instance.getBossTimesBySceneType(mapCfg[sceneFields.type]);
            if (times) {
                this.timesTxt.text = `${times[BossTimesFields.remainTimes]}/${times[BossTimesFields.totalTimes]}`;
                if (times[BossTimesFields.remainTimes] === 0) {
                    this.timesTxt.color = CommonUtil.getColorByQuality(5);
                } else {
                    this.timesTxt.color = "#2d2d2d";
                }
            }

            this.checkChallenge();
        }

        // 检测是否可挑战
        private checkChallenge(): void {
            if (!this._selectedBoss) return;
            let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(this._selectedBoss[scene_cross_bossFields.occ]);
            if (!bossInfo) return;
            let mapId: number = this._selectedBoss[scene_cross_bossFields.mapId];
            let mapCfg: scene = SceneCfg.instance.getCfgById(mapId);
            let times: BossTimes = DungeonModel.instance.getBossTimesBySceneType(mapCfg[sceneFields.type]);
            if (!times) return;
            if (!bossInfo[BossInfoFields.bossState][BossStateFields.dead] && times[BossTimesFields.remainTimes] > 0) {
                this._btnClip.visible = true;
                this._btnClip.play();
            } else {
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        private rankHandler(): void {
            if (!this._selectedBoss) return;
            WindowManager.instance.openDialog(WindowEnum.THREE_WORLDS_RANK_PANEL, [this._selectedBoss[scene_cross_bossFields.occ], 1]);
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._proCtrl = this.destroyElement(this._proCtrl);
            this._joinAward = this.destroyElement(this._joinAward);
            this._killAward = this.destroyElement(this._killAward);
            this._rankAwards = this.destroyElement(this._rankAwards);
            this._btnClip = this.destroyElement(this._btnClip);
            // this._modelClip = this.destroyElement(this._modelClip);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy(destroyChild);
        }
    }
}
