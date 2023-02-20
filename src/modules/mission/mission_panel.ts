///<reference path="../config/onhook_income_cfg.ts"/>
///<reference path="../config/skill_cfg.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../bag/bag_util.ts"/>
///<reference path="../ranking_list/player_ranking_model.ts"/>


/** 天关面板*/
namespace modules.mission {
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import onhook_income = Configuration.onhook_income;
    import onhook_incomeFields = Configuration.onhook_incomeFields;
    import scene_copy_tianguan = Configuration.scene_copy_tianguan;
    import scene_copy_tianguanFields = Configuration.scene_copy_tianguanFields;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import OnhookIncomeCfg = modules.config.OnhookIncomeCfg;
    import SceneCopyTianguanCfg = modules.config.SceneCopyTianguanCfg;
    import MissionViewUI = ui.MissionViewUI;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import PlayerRankingModel = modules.rankingList.PlayerRankingModel;
    import Rank = Protocols.Rank;
    import RankFields = Protocols.RankFields;

    export class MissionPanel extends MissionViewUI {

        private _missionCfg: scene_copy_tianguan;
        private _proCtrl: ProgressBarCtrl;
        private _baseItem: CopyAwardItem;
        private _awardItems: Array<BaseItem>;
        private _awardLv: number = -1;
        private _prizeEffect: CustomClip;
        private _btnClip: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._proCtrl = new ProgressBarCtrl(this.barImg, 482, this.proTxt);
            this._baseItem = new CopyAwardItem();
            this._baseItem.pos(539, 524 - 9, true);

            this.centerX = 0;
            this.centerY = 0;

            this._prizeEffect = new CustomClip();
            this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._prizeEffect.durationFrame = 5;
            this._prizeEffect.loop = true;
            this._prizeEffect.pos(410, 404 - 9, true);
            this._prizeEffect.scale(1.4, 1.4, true);

            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.pos(287, 1048 - 9, true);
            this._btnClip.scale(0.8, 0.8, true);

            this.regGuideSpr(GuideSpriteId.MISSION_CHALLENGE_BTN, this.challengeBtn);
            this.regGuideSpr(GuideSpriteId.MISSION_AWARD_ITEM, this._baseItem);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.challengeBtn, common.LayaEvent.CLICK, this, this.challengeHandler);
            this.addAutoListener(this.rankBtn, common.LayaEvent.CLICK, this, this.openRank);
            this.addAutoListener(this._baseItem, common.LayaEvent.CLICK, this, this.awardClickHandler);
            this.addAutoListener(this.clearBtn, common.LayaEvent.CLICK, this, this.clearBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RANK_UPDATE, this, this.updateRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.updateLv);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_WARE, this, this.updateWare);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_AWARD_LV, this, this.updateAwardLv);

            this.addAutoRegisteRedPoint(this.clearRP, ["lineClearOut"]);   //挂机扫荡红点
        }

        protected onOpened(): void {
            super.onOpened();

            MissionCtrl.instance.getRank();

            this.updateLv();
            this.updateWare();
            this.updateAwardLv();
        }

        // 挑战
        private challengeHandler(): void {
            if (!this._missionCfg) return;
            MissionCtrl.instance.challenge(this._missionCfg[scene_copy_tianguanFields.mapId]);
        }

        // 更新层数
        private updateLv(): void {
            this._missionCfg = SceneCopyTianguanCfg.instance.getCfgByLv(MissionModel.instance.curLv);
            if (!this._missionCfg) {              // 已通关
                this._missionCfg = SceneCopyTianguanCfg.instance.getCfgByLv(MissionModel.instance.curLv - 1);
            }
            if (!this._missionCfg) return;
            let lv: number = this._missionCfg[scene_copy_tianguanFields.level];
            this.lvTxt.text = `第${lv}关`;
            let incomeCfg: onhook_income = OnhookIncomeCfg.instance.getIncomeCfgByLv(lv);
            let coinIncome = sweeping_income.SweepingIncomeModel.instance.coinImcome;
            let exeIncome = sweeping_income.SweepingIncomeModel.instance.exeImcome;
            this.copperTxt.text = coinIncome ? coinIncome.toString() : `${incomeCfg[onhook_incomeFields.coin]}/小时`;
            this.expTxt.text = exeIncome ? exeIncome.toString() : `${incomeCfg[onhook_incomeFields.exp]}/小时`;
            let itemArr: Array<Items> = this._missionCfg[scene_copy_tianguanFields.tipsAward];
            if (!itemArr || itemArr.length === 0) return;

            this._awardItems = this._awardItems || new Array<BaseItem>();
            for (let i: int = 0, len = this._awardItems.length; i < len; i++) {
                this._awardItems[i].removeSelf();
            }
            let w: number = itemArr.length * 100 + (itemArr.length - 1) * 31;
            let offset: number = (this.width - w >> 1) + 8;
            for (let i: int = 0, len = itemArr.length; i < len; i++) {
                let itemId: number = itemArr[i][ItemsFields.itemId];
                let count: number = itemArr[i][ItemsFields.count];
                let bagItem: BaseItem;
                if (this._awardItems.length > i) {
                    bagItem = this._awardItems[i];
                } else {
                    bagItem = new BaseItem();
                    this._awardItems.push(bagItem);
                }
                this.addChild(bagItem);
                bagItem.dataSource = [itemId, count, 0, null];
                bagItem.pos(offset + i * 131, 840, true);
            }
        }

        // 更新波数
        private updateWare(): void {
            let cfg: scene_copy_tianguan = SceneCopyTianguanCfg.instance.getCfgByLv(MissionModel.instance.curLv);
            if (!cfg) {      // 通关
                this.allPassTxt.visible = true;
                this.challengeBtn.removeSelf();
                this.proBg.visible = this.barImg.visible = this.proTxt.visible = this.tipTxt.visible = false;
                this._btnClip.visible = false;
                this._btnClip.stop();
            } else {
                let maxWare: number = this._missionCfg[scene_copy_tianguanFields.killWare];
                let curWare: number = MissionModel.instance.curWare;
                if (maxWare === curWare) {
                    this.addChild(this.challengeBtn);
                    this.proBg.visible = this.barImg.visible = this.proTxt.visible = this.tipTxt.visible = false;
                    this._btnClip.visible = true;
                    this._btnClip.play();
                    this.allPassTxt.visible = false;
                } else {
                    this.challengeBtn.removeSelf();
                    this.proBg.visible = this.barImg.visible = this.proTxt.visible = this.tipTxt.visible = true;
                    this._proCtrl.maxValue = maxWare;
                    this._proCtrl.value = curWare;
                    this.tipTxt.text = `还需击杀${maxWare - curWare}波怪物，才能开启闯关`;
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    this.allPassTxt.visible = false;
                }
            }
        }

        // 更新已领奖层数
        private updateAwardLv(): void {
            this.speAwardBg.visible = this.speItemBox.visible = this.awardNameImg.visible = true;
            this._awardLv = -1;
            let awardLvs: Array<number> = MissionModel.instance.awardLvs;
            let cfg: scene_copy_tianguan;
            let awardLv: number;
            if (!awardLvs || awardLvs.length === 0) {
                cfg = SceneCopyTianguanCfg.instance.getSpeCfgByLv(MissionModel.instance.curLv);
                if (!cfg) {           // 后面没有特殊奖励时隐藏
                    this.speAwardBg.visible = this.speItemBox.visible = this.awardNameImg.visible = false;
                    this._prizeEffect.stop();
                    this._prizeEffect.removeSelf();
                    this._baseItem.removeSelf();
                    return;
                }
                awardLv = cfg[scene_copy_tianguanFields.level];
            } else {
                awardLv = awardLvs[0];
                cfg = SceneCopyTianguanCfg.instance.getCfgByLv(awardLv);
            }
            if (!cfg) {
                this.speAwardBg.visible = this.speItemBox.visible = this.awardNameImg.visible = false;
                this._prizeEffect.stop();
                this._prizeEffect.removeSelf();
                this._baseItem.removeSelf();
                return;
            }
            this.speItemTxt.text = `${awardLv}关奖励`;
            this.speItemTxt.color = `#9f6725`;
            let item: Items = cfg[scene_copy_tianguanFields.award][0];
            if (item) {
                if (cfg[scene_copy_tianguanFields.awardNameRes]) {
                    this.awardNameImg.skin = `assets/icon/ui/tianguan/${cfg[scene_copy_tianguanFields.awardNameRes]}.png`;
                }

                this._baseItem.needTip = false;
                this._baseItem.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];
                this.addChild(this._baseItem);
                if (MissionModel.instance.curLv > awardLv) {
                    this._awardLv = awardLv;
                    this._prizeEffect.play();
                    this.addChildAt(this._prizeEffect, this.getChildIndex(this.speAwardBg) + 1);
                    this.speItemTxt.text = `点击领取`;
                    this.speItemTxt.color = `#168a17`;
                } else {
                    this._awardLv = -1;
                    this._prizeEffect.stop();
                    this._prizeEffect.removeSelf();
                }
            }
        }

        // 点击特殊奖励
        private awardClickHandler(e: Event): void {
            if (this._awardLv === -1) {
                //WindowManager.instance.openDialog(WindowEnum.PROP_USE_ALERT, (e.target as BaseItem).itemData);
                BagUtil.openBagItemTip((e.target as BaseItem).itemData);
            } else {
                let cfg: scene_copy_tianguan = SceneCopyTianguanCfg.instance.getCfgByLv(this._awardLv);
                DungeonCtrl.instance.getCopyAward(cfg[scene_copy_tianguanFields.mapId], cfg[scene_copy_tianguanFields.level]);
            }
        }

        // 更新排行榜
        private updateRank(): void {
            this.rankGuanTxt3.visible = this.rankGuanTxt2.visible = this.rankGuanTxt1.visible = this.rankTxt2.visible = this.rankTxt3.visible = this.rankTxt1.visible = false;
            let ranks: Array<Rank> = PlayerRankingModel.instance.getRanksByType(RankType.tianguanLevel);
            if (!ranks || !ranks.length) return;
            if (ranks.length >= 1) {
                this.rankTxt1.text = this.genRankStr(ranks[0]);
                this.rankGuanTxt1.text = this.genRankStr1(ranks[0]);
                this.rankGuanTxt1.visible = this.rankTxt1.visible = true;
            }
            if (ranks.length >= 2) {
                this.rankTxt2.text = this.genRankStr(ranks[1]);
                this.rankGuanTxt2.text = this.genRankStr1(ranks[1]);
                this.rankGuanTxt2.visible = this.rankTxt2.visible = true;
            }
            if (ranks.length >= 3) {
                this.rankTxt3.text = this.genRankStr(ranks[2]);
                this.rankGuanTxt3.text = this.genRankStr1(ranks[2]);
                this.rankTxt3.visible = this.rankGuanTxt3.visible = true;
            }
        }

        // 生成排行文本
        private genRankStr(rank: Rank): string {
            return `${rank[RankFields.rank]}.${rank[RankFields.name]}`;
        }

        // 生成排行文本
        private genRankStr1(rank: Rank): string {
            return `${rank[RankFields.param]}关`;
        }

        // 打开排行榜
        private openRank(): void {
            WindowManager.instance.open(WindowEnum.MISSION_RANK_ALERT, RankType.tianguanLevel);
        }

        public destroy(destroyChild: boolean = true): void {
            this.challengeBtn = this.destroyElement(this.challengeBtn);
            this._baseItem = this.destroyElement(this._baseItem);
            this._btnClip = this.destroyElement(this._btnClip);
            this._prizeEffect = this.destroyElement(this._prizeEffect);
            this._awardItems = this.destroyElement(this._awardItems);
            this._proCtrl = this.destroyElement(this._proCtrl);

            super.destroy(destroyChild);
        }

        private clearBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.LINE_CLEAR_OUT_ALERT);
        }
    }
}