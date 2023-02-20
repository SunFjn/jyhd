///<reference path="./bigtower_model.ts"/>
///<reference path="./bigtower_ctrl.ts"/>
///<reference path="../common/common_util.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../config/scene_copy_dahuang_cfg.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../ranking_list/player_ranking_ctrl.ts"/>
///<reference path="../mission/copy_award_item.ts"/>

//大荒古塔面板
namespace modules.bigTower {
    import CopyAwardItem = modules.mission.CopyAwardItem;
    import scene_copy_dahuang = Configuration.scene_copy_dahuang;
    import scene_copy_dahuangField = Configuration.scene_copy_dahuangFields;
    import BigTowerUI = ui.BigTowerUI;
    import BigTowerModel = modules.bigTower.BigTowerModel;
    import CommonUtil = modules.common.CommonUtil;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import LevelCopyData = Protocols.LevelCopyData;
    import LevelCopyDataFields = Protocols.LevelCopyDataFields;
    import Item = Protocols.Item;
    import SceneCopyDahuangCfg = modules.config.SceneCopyDahuangCfg;
    import items = Configuration.Items;
    import itemsFields = Configuration.ItemsFields;
    import scene_copy_dahuangFields = Configuration.scene_copy_dahuangFields;
    import CustomClip = modules.common.CustomClip;
    import BtnGroup = modules.common.BtnGroup;
    import BagUtil = modules.bag.BagUtil;
    import BaseItem = modules.bag.BaseItem;
    import PlayerRankingCtrl = modules.rankingList.PlayerRankingCtrl;
    import Rank = Protocols.Rank;
    import PlayerRankingModel = modules.rankingList.PlayerRankingModel;
    import RankFields = Protocols.RankFields;
    import Image = Laya.Image;
    import LayaEvent = modules.common.LayaEvent;

    export class BigTowerPlanel extends BigTowerUI {

        private _awardItems: Array<CopyAwardItem>;
        private _awardNeedLvTxts: Array<Laya.Text>;
        private _awardNeedLvImgs: Image[];
        private _awardNameImgs: Image[];
        private _effs: CustomClip[];
        private _awardBgImgs: Image[];

        //道具礼包
        private _propItem: Array<BaseItem>;
        private lev: number;

        private _btnGroup: BtnGroup;
        private _btnClip: CustomClip;

        public destroy(destroyChild: boolean = true): void {
            this._awardItems = this.destroyElement(this._awardItems);
            this._awardNeedLvTxts = this.destroyElement(this._awardNeedLvTxts);
            this._awardNeedLvImgs = this.destroyElement(this._awardNeedLvImgs);
            this._awardNameImgs = this.destroyElement(this._awardNameImgs);
            this._effs = this.destroyElement(this._effs);
            this._awardBgImgs = this.destroyElement(this._awardBgImgs);
            this._propItem = this.destroyElement(this._propItem);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._btnClip = CommonUtil.creatEff(this.challengeBtn, `btn_light`, 15);
            this._btnClip.pos(-5, -19);
            this._btnClip.scale(1.23, 1.25);

            this._propItem = [];

            this._awardNeedLvTxts = [this.needLvTxt_1, this.needLvTxt_0];
            this._awardNeedLvImgs = [this.needLvImg_1, this.needLvImg_0];
            this._awardNameImgs = [this.awardNameImg_1, this.awardNameImg_0];
            this._awardBgImgs = [this.propBg2, this.propBg1];
            this._awardItems = [];
            this._effs = [];

            // 大小奖
            for (let i: number = 0; i < 2; i++) {
                let eff: CustomClip = CommonUtil.creatEff(this, `availability`, 8, 1);
                eff.pos(470, 250 + i * 180, true);
                this._effs.unshift(eff);
                let item: CopyAwardItem = new CopyAwardItem();
                this.addChild(item);
                item.scale(0.9, 0.9, true);
                item.pos(555, 335 + i * 180, true);
                item.needTip = item.nameVisible = false;
                this._awardItems.unshift(item);
            }

            // 奖励展示
            for (let i: number = 0; i < 3; i++) {
                this._propItem[i] = new BaseItem();
                this.addChild(this._propItem[i]);
                this._propItem[i].scale(0.9, 0.9, true);
                this._propItem[i].pos(175 + i * 141, 740, true);
                this._propItem[i].nameVisible = true;
            }

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.oldTowerBtn, this.playTrialBtn, this.runeCopyBtn);

            this.regGuideSpr(GuideSpriteId.BIG_TOWER_TAB_BTN, this.oldTowerBtn);
            this.regGuideSpr(GuideSpriteId.BIG_TOWER_CHALLENGE_BTN, this.challengeBtn);
            this.regGuideSpr(GuideSpriteId.DAILY_DUNGEON_TAB_BTN, this.playTrialBtn);
            this.regGuideSpr(GuideSpriteId.RUNE_COPY_TAB_BTN, this.runeCopyBtn);
        }

        protected onOpened(): void {

            super.onOpened();
            this._effs[0].play();
            this._effs[1].play();
            this._btnClip.play();
            this.updatePanel();

            this._btnGroup.selectedIndex = 0;
            if (this.lev >= SceneCopyDahuangCfg.instance.cfgs.length) {
                this.challengeBtn.visible = false;
                this.finishLevel.visible = true;
            } else {
                this.challengeBtn.visible = true;
                this.finishLevel.visible = false;
            }

            // 请求排行榜
            PlayerRankingCtrl.instance.getRank(RankType.dahuangLevel);
        }

        //添加按键回掉
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_COPY_DAHUANG, this, this.updatePanel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_COPY_DAHUANG, this, this.updatePanel);

            this.addAutoListener(this._propItem[0], LayaEvent.CLICK, this, this.openPropShow, [0]);
            this.addAutoListener(this._propItem[1], LayaEvent.CLICK, this, this.openPropShow, [1]);
            this.addAutoListener(this._propItem[2], LayaEvent.CLICK, this, this.openPropShow, [2]);
            this.addAutoListener(this.challengeBtn, LayaEvent.CLICK, this, this.challenge);
            this.addAutoListener(this._btnGroup, LayaEvent.CHANGE, this, this.changeBtnHandler);

            this.addAutoRegisteRedPoint(this.bigTowerRP, ["bigTowerRP"]);
            this.addAutoRegisteRedPoint(this.dailyDungeonRP, ["dailyDungeonRP"]);
            this.addAutoRegisteRedPoint(this.runeCopyRP, ["runeCopyRP"]);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RANK_UPDATE, this, this.updateRank);
            this.addAutoListener(this.rankBtn, Laya.Event.CLICK, this, this.rankHandler);
            this.addAutoListener(this._awardItems[0], common.LayaEvent.CLICK, this, this.openGoldShow2);
            this.addAutoListener(this._awardItems[1], common.LayaEvent.CLICK, this, this.openGoldShow1);
        }

        private updateRank(): void {
            let arr: Array<Rank> = PlayerRankingModel.instance.getRanksByType(RankType.dahuangLevel);
            if (!arr || arr.length === 0) return;
            this.recordLv.text = arr[0][RankFields.param] + "";
            this.recordName.text = arr[0][RankFields.name];
        }

        private rankHandler(): void {
            WindowManager.instance.open(WindowEnum.MISSION_RANK_ALERT, RankType.dahuangLevel);
        }

        private changeBtnHandler(): void {
            if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.DAILY_DUNGEON_PANEL);
            } else if (this._btnGroup.selectedIndex === 2) {
                WindowManager.instance.open(WindowEnum.RUNE_COPY_PANEL);
            }
        }

        private updatePanel(): void {
            if (!BigTowerModel.instance.copyData) return;
            this.lev = BigTowerModel.instance.finishLevel;
            let cfg: Configuration.scene_copy_dahuang;
            if (this.lev < SceneCopyDahuangCfg.instance.cfgs.length) {
                cfg = SceneCopyDahuangCfg.instance.getCfgByLv(this.lev + 1);
                this.Lvel.text = "第" + (this.lev + 1) + "层";
            } else {
                cfg = SceneCopyDahuangCfg.instance.getCfgByLv(this.lev);
                this.Lvel.text = "第" + (this.lev) + "层";
            }

            let fighting: number = cfg[Configuration.scene_copy_dahuangFields.recommendFighting];
            let myFighting: number = PlayerModel.instance.fight;
            this.recomFightingtxt.text = fighting.toString();
            this.myFightingtxt.text = myFighting.toString();
            this.updatAward(0);
            this.updatAward(1);
            this.updateProp();
        }

        private setShow(index: number, b: boolean): void {
            this._awardBgImgs[index].visible = this._awardItems[index].visible =
                this._effs[index].visible = this._awardNameImgs[index].visible =
                this._awardNeedLvImgs[index].visible = this._awardNeedLvTxts[index].visible = b;
        }

        //更新奖励
        private updatAward(index: int): void {
            let copyData: LevelCopyData = BigTowerModel.instance.copyData;
            let serverAwards: Array<number> = copyData[index === 0 ? LevelCopyDataFields.award : LevelCopyDataFields.bigAward];
            let awardIndex: int = index === 0 ? scene_copy_dahuangField.award : scene_copy_dahuangField.bigAward;

            this.setShow(index, false);

            if (serverAwards.length > 0) { //有奖励能领
                let lv: number = serverAwards[0];
                let cfg: scene_copy_dahuang = SceneCopyDahuangCfg.instance.getCfgByLv(lv);
                let awards: Array<items> = <Array<items>>cfg[awardIndex];
                let itemId: number = awards[0][itemsFields.itemId];
                let itemCount: number = awards[0][itemsFields.count];
                let item: Item = [itemId, itemCount, 0, null];
                this._awardItems[index].dataSource = item;
                this._awardNeedLvTxts[index].text = `点击领取`;
                this._awardNeedLvTxts[index].color = `#ffffff`;
                this._awardNameImgs[index].skin = `assets/icon/ui/tianguan/${cfg[scene_copy_dahuangFields.awardNameRes]}.png`;
                this.setShow(index, true);
            } else {      // 服务器没有小奖层数，则取当前层最近的下一个小奖
                this.lev = BigTowerModel.instance.finishLevel;
                let arr: Array<scene_copy_dahuang> = SceneCopyDahuangCfg.instance.cfgs;
                for (let i: int = this.lev, len: int = arr.length; i < len; i++) {
                    let cfg: scene_copy_dahuang = arr[i];
                    let awards: Array<items> = <Array<items>>cfg[awardIndex];
                    if (awards.length > 0) {
                        let itemId: number = awards[0][itemsFields.itemId];
                        let itemCount: number = awards[0][itemsFields.count];
                        this._awardItems[index].dataSource = [itemId, itemCount, 0, null];
                        this._awardNameImgs[index].skin = `assets/icon/ui/tianguan/${cfg[scene_copy_dahuangFields.awardNameRes]}.png`;
                        let lv: number = cfg[scene_copy_dahuangField.level];
                        this._awardNeedLvTxts[index].text = lv + `${index == 0 ? `层奖励` : `层大奖`}`;
                        this._awardNeedLvTxts[index].color = `#ffffff`;
                        this.setShow(index, true);
                        this._effs[index].visible = false;
                        break;
                    }
                }
            }
        }

        private updateProp(): void {
            this.lev = BigTowerModel.instance.finishLevel;
            let nextCfg: scene_copy_dahuang;
            if (this.lev < SceneCopyDahuangCfg.instance.cfgs.length) {
                nextCfg = SceneCopyDahuangCfg.instance.getCfgByLv(this.lev + 1);
            } else {
                nextCfg = SceneCopyDahuangCfg.instance.getCfgByLv(this.lev);
            }
            let items: Array<items> = nextCfg[scene_copy_dahuangFields.tipsAward];
            for (let i: number = 0; i < items.length; i++) {
                let itemId: number = items[i][itemsFields.itemId];
                let count: number = items[i][itemsFields.count];
                let item: Protocols.Item = [itemId, count, 0, null];
                this._propItem[i].dataSource = item;
            }
        }

        private openPropShow(i: number): void {
            BagUtil.openBagItemTip(this._propItem[i].itemData);
        }

        // 大奖
        private openGoldShow1(): void {
            // 不可领时打开TIP
            let copyData: LevelCopyData = BigTowerModel.instance.copyData;
            if (copyData[LevelCopyDataFields.bigAward].length > 0) {
                let lev: number = copyData[LevelCopyDataFields.bigAward][0];
                let mapId: number = SceneCopyDahuangCfg.instance.getCfgByLv(lev)[scene_copy_dahuangFields.mapId];
                DungeonCtrl.instance.getCopyAward(mapId, lev, 1);
            } else {
                BagUtil.openBagItemTip(this._awardItems[1].itemData);
            }
        }

        // 小奖
        private openGoldShow2(): void {
            // 不可领时打开TIP
            let copyData: LevelCopyData = BigTowerModel.instance.copyData;
            if (copyData[LevelCopyDataFields.award].length > 0) {
                this._awardItems[0].needTip = false;
                let lev: number = copyData[LevelCopyDataFields.award][0];
                let mapId: number = SceneCopyDahuangCfg.instance.getCfgByLv(lev)[scene_copy_dahuangFields.mapId];
                DungeonCtrl.instance.getCopyAward(mapId, lev, 0);
            } else {
                BagUtil.openBagItemTip(this._awardItems[0].itemData);
            }
        }

        // 挑战
        private challenge(): void {
            let copyData: LevelCopyData = BigTowerModel.instance.copyData;
            let lev: number = copyData[LevelCopyDataFields.finishLevel];
            let cfg: scene_copy_dahuang = SceneCopyDahuangCfg.instance.getCfgByLv(lev + 1);
            let mapId: number = cfg[scene_copy_dahuangFields.mapId];
            DungeonCtrl.instance.reqEnterScene(mapId, lev + 1);
        }
    }
}