///<reference path="../config/scene_copy_rune_cfg.ts"/>


namespace modules.rune_copy {
    import RuneCopyViewUI = ui.RuneCopyViewUI;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import BtnGroup = modules.common.BtnGroup;
    import Event = Laya.Event;
    import scene_copy_rune = Configuration.scene_copy_rune;
    import SceneCopyRuneCfg = modules.config.SceneCopyRuneCfg;
    import scene_copy_runeFields = Configuration.scene_copy_runeFields;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import Box = Laya.Box;
    import Text = Laya.Text;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import ItemFields = Protocols.ItemFields;
    import Node = Laya.Node;
    import CommonUtil = modules.common.CommonUtil;

    export class RuneCopyPanel extends RuneCopyViewUI {

        private _currCfg: scene_copy_rune;
        private _btnClip: CustomClip;
        private _rewardArr: Array<BaseItem>;
        private _btnGroup: BtnGroup;
        private _bigAwardArr: Array<BaseItem>;
        private _nameBoxArr: Array<Box>;
        private _nameTxtArr: Array<Text>;
        private prizeEffect_0: CustomClip;      //奖品特效
        private prizeEffect_1: CustomClip;
        private _isCanGetAward: boolean;
        private _awardItemTipBoxArr: Array<Box>;

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this.prizeEffect_0 = this.destroyElement(this.prizeEffect_0);
            this.prizeEffect_1 = this.destroyElement(this.prizeEffect_1);
            this._rewardArr = this.destroyElement(this._rewardArr);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._bigAwardArr = this.destroyElement(this._bigAwardArr);
            this._nameBoxArr = this.destroyElement(this._nameBoxArr);
            this._nameTxtArr = this.destroyElement(this._nameTxtArr);
            this._awardItemTipBoxArr = this.destroyElement(this._awardItemTipBoxArr);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;

            this._rewardArr = new Array<BaseItem>();
            for (let i: int = 0; i < 4; i++) {
                let item = new BaseItem();
                item.y = 762;
                item.nameVisible = true;
                this._rewardArr.push(item);
                this.addChild(item);
            }

            this._bigAwardArr = new Array<BaseItem>();
            for (let i: int = 0; i < 2; i++) {
                let item: BaseItem = new BaseItem();
                item.pos(25, 43);
                item.nameVisible = false;
                item.hintTxt.fontSize = 18;
                item.hintTxt.stroke = 0;
                item.hintTxt.text = ``;
                item.hintTxt.color = "#00ad38";
                item.hintTxt.y += 5;
                item._numTxt.stroke = 0;
                this._bigAwardArr.push(item);
            }
            this.awardBox_0.addChildAt(this._bigAwardArr[0], 1);
            this.awardBox_1.addChildAt(this._bigAwardArr[1], 1);
            this._bigAwardArr[1].y -= 20;

            this._nameBoxArr = [this.runeNameBox_0, this.runeNameBox_1];

            this._nameTxtArr = [this.runeNameTxt_0, this.runeNameTxt_0];
            this._awardItemTipBoxArr = [this.awardItemTipBox_0, this.awardItemTipBox_1];
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1, this.btnGroup_2);

            this.prizeEffect_0 = this.creatAwardEffect(this.awardBox_0);
            this.prizeEffect_1 = this.creatAwardEffect(this.awardBox_1);

            this._isCanGetAward = false;

            this._btnClip = CommonUtil.creatEff(this.goBtn, `btn_light`, 15);
            this._btnClip.pos(-5, -22);
            this._btnClip.scale(1.23, 1.3);

            this.regGuideSpr(GuideSpriteId.BIG_TOWER_TAB_BTN, this.btnGroup_0);
            this.regGuideSpr(GuideSpriteId.DAILY_DUNGEON_TAB_BTN, this.btnGroup_1);
            this.regGuideSpr(GuideSpriteId.RUNE_COPY_TAB_BTN, this.btnGroup_2);
            this.regGuideSpr(GuideSpriteId.RUNE_COPY_CHALLENGE_BTN, this.goBtn);
        }

        protected onOpened(): void {
            super.onOpened();
            WindowManager.instance.close(WindowEnum.RUNE_ALL_ALERT);
            WindowManager.instance.close(WindowEnum.RUNE_BAG_ALERT);
            this._btnGroup.selectedIndex = 2;
            this._btnClip.play();
            this.prizeEffect_0.play();
            this.prizeEffect_1.play();
            this.updateView();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.changeBtnHandler);
            this.addAutoListener(this.goBtn, Event.CLICK, this, this.goBtnHandler);
            this.addAutoListener(this.dialBtn, Event.CLICK, this, this.dialBtnHandler);
            this.addAutoListener(this.dailyAwardBtn, Event.CLICK, this, this.dailyAwardBtnHandler);
            this.addAutoListener(this._bigAwardArr[0], Event.CLICK, this, this.getBigAwardBtnHandler);
            this.addAutoListener(this._bigAwardArr[1], Event.CLICK, this, this.getBigAwardBtnHandler);
            this.addAutoListener(this.aboutBtn, Event.CLICK, this, this.aboutBtnHandler);
            this.addAutoListener(this.runeEnterBtn, Event.CLICK, this, this.runeEnterBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COPY_UPDATE, this, this.updateView);

            this.addAutoRegisteRedPoint(this.dotImg_0, ["bigTowerRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_1, ["dailyDungeonRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["runeCopyRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["runeRP"]);
        }

        private updateView(): void {

            let currLv: number = RuneCopyModel.instance.currLv;
            let currCfg: scene_copy_rune = this._currCfg = SceneCopyRuneCfg.instance.getCfgByLv(currLv);
            if (!currCfg) { //通关
                this.goBtn.visible = false;
                this.maxLvHintTxt.visible = true;
                currCfg = this._currCfg = SceneCopyRuneCfg.instance.getCfgByLv(--currLv);
            }
            let bigAwardLv: number[] = RuneCopyModel.instance.bigAwardLv;
            let bigAwardCfg: scene_copy_rune = null;
            this._isCanGetAward = !!bigAwardLv.length;
            if (!bigAwardLv.length) {
                bigAwardCfg = SceneCopyRuneCfg.instance.getAwardCfgByCurrLv(currLv);
                this._bigAwardArr[0].needTip = this._bigAwardArr[1].needTip = true;
                this.prizeEffect_0.visible = this.prizeEffect_1.visible = false;
            } else {             //有能领的
                bigAwardCfg = SceneCopyRuneCfg.instance.getAwardCfgByCurrLv(bigAwardLv[0]);
                this.prizeEffect_0.visible = this.prizeEffect_1.visible = true;
                this._bigAwardArr[0].needTip = this._bigAwardArr[1].needTip = false;
            }

            this.lvTxt.text = `第${currLv}关`;
            this.fightTxt.text = `推荐战力:${currCfg[scene_copy_runeFields.recommendFighting]}`;
            this.myfightTxt.text = `我的战力:${PlayerModel.instance.fight}`;
            this.awardHintTxt.text = `${bigAwardCfg[scene_copy_runeFields.level]}层大奖`;
            this.awardItemTipBox_0.visible = this.awardItemTipBox_1.visible = this.runePitBox.visible = this._bigAwardArr[0].visible =
                this._bigAwardArr[1].visible = this.runeNameBox_0.visible = this.runeNameBox_1.visible = this.runeNameBox_2.visible = false;
            let flag: boolean = false;
            let runePitIndex: number = bigAwardCfg[scene_copy_runeFields.slotId];
            if (runePitIndex) {  //有玉荣槽
                this.runePitBox.visible = this.awardItemTipBox_0.visible = this.runeNameBox_2.visible = true;
                this.prizeEffect_0.visible = false;
                this.awardItemTipTxt_0.text = `开启`;
                this.runePitIndexTxt.text = runePitIndex.toString();
                flag = true;
            }
            let runeClassId: number = bigAwardCfg[scene_copy_runeFields.childId];
            if (runeClassId) {  //有玉荣小类
                if (!flag) {    //第一个槽
                    this.awardItemTipBox_0.visible = true;
                    this.prizeEffect_0.visible = false;
                    this.awardItemTipTxt_0.text = `解锁`;
                    this.awardItemShow([runeClassId, 0], 0);
                } else {        //第二个槽
                    this.awardItemTipBox_1.visible = true;
                    this.prizeEffect_1.visible = false;
                    this.awardItemTipTxt_1.text = `解锁`;
                    this.awardItemShow([runeClassId, 0], 1);
                }
            }
            let bigAwardArr: Array<Items> = bigAwardCfg[scene_copy_runeFields.bigAward];
            if (bigAwardArr) {  //有玉荣奖励
                if (bigAwardArr.length == 1) {
                    this.awardItemShow([bigAwardArr[0][ItemsFields.itemId], bigAwardArr[0][ItemsFields.count]], 1);
                } else if (bigAwardArr.length == 2) {
                    this.awardItemShow([bigAwardArr[0][ItemsFields.itemId], bigAwardArr[0][ItemsFields.count]], 0);
                    this.awardItemShow([bigAwardArr[1][ItemsFields.itemId], bigAwardArr[1][ItemsFields.count]], 1);
                }
            }
            let awards: Array<Items> = currCfg[scene_copy_runeFields.tipsAward];
            let awardLen: number = awards.length;
            for (let i: int = 0, len: int = this._rewardArr.length; i < len; i++) {
                this._rewardArr[i].visible = false;
                if (awardLen > i) {
                    this._rewardArr[i].dataSource = [awards[i][ItemsFields.itemId], awards[i][ItemsFields.count], 0, null];
                    this._rewardArr[i].visible = true;
                }
            }
            let widthSpace: number = 35;
            let sumWidth: number = -widthSpace;
            for (let i: int = 0; i < awardLen; i++) {
                sumWidth += this._rewardArr[i].width + widthSpace;
            }
            let startX: number = (this.width - sumWidth) / 2;
            for (let i: int = 0; i < awardLen; i++) {
                if (i == 0) this._rewardArr[i].x = startX;
                else this._rewardArr[i].x = this._rewardArr[i - 1].x + this._rewardArr[i - 1].width + widthSpace;
            }

            let isMaxLv: boolean = RuneCopyModel.instance.finishLv >= SceneCopyRuneCfg.instance.maxLv;

            this.maxLvHintTxt.visible = isMaxLv;
            this.goBtn.visible = !this.maxLvHintTxt.visible;
            this.awardBox_0.visible = this.awardBox_1.visible = !(isMaxLv && !bigAwardLv.length);

            this.dotImg_4.visible = RuneCopyModel.instance.dialCount > 0;
            let dailyAwardState: boolean = RuneCopyModel.instance.isGetDailyAward && RuneCopyModel.instance.finishLv > 0;
            this.dotImg_5.visible = dailyAwardState;
            this.dailyAwardBtn.gray = !dailyAwardState;
        }

        private awardItemShow(item: Items, type: number): void {
            let itemId: number = item[ItemsFields.itemId];
            let count: number = item[ItemsFields.count];
            if (CommonUtil.getItemTypeById(itemId) == ItemMType.Rune && (itemId % 10000 == 0)) {  //如果是玉荣子类
                this._bigAwardArr[type].mouseEnabled = false;
                itemId = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                let name: string = ItemRuneCfg.instance.getCfgById(itemId)[item_runeFields.name];
                itemId++;
                this._nameTxtArr[type].text = `【${name}】`;
                this._bigAwardArr[type].hintTxt.text = ``;
                this._nameBoxArr[type].visible = true;
            } else {
                this._bigAwardArr[type].mouseEnabled = true;
                if (!this._isCanGetAward) {
                    this._bigAwardArr[type].hintTxt.text = ``;
                } else {  //有能领的
                    this._bigAwardArr[type].hintTxt.text = `可领取`;
                    this._awardItemTipBoxArr[type].visible = false;
                }
            }
            this._bigAwardArr[type].dataSource = [itemId, count, 0, null];
            this._bigAwardArr[type].visible = true;
        }

        private changeBtnHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.BIG_TOWER);
            } else if (this._btnGroup.selectedIndex === 1) {
                WindowManager.instance.open(WindowEnum.DAILY_DUNGEON_PANEL);
            }
        }

        private dialBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.DIAL_ALERT);
        }

        private goBtnHandler(): void {
            let currLv: number = this._currCfg[scene_copy_runeFields.level];
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_rune_copy, currLv);
        }

        private getBigAwardBtnHandler(e: Event): void {
            let bigAwardLv: number[] = RuneCopyModel.instance.bigAwardLv;
            if (!bigAwardLv.length) return;
            let obj = e.target as BaseItem;
            let id: number = obj.itemData[ItemFields.ItemId];
            if (id % 10000 == 0) return;  //玉荣小类
            DungeonCtrl.instance.getCopyAward(SCENE_ID.scene_rune_copy, bigAwardLv[0], 1);
        }

        private dailyAwardBtnHandler(): void {
            RuneCopyCtrl.instance.getRuneEveryDayAward();
        }

        private runeEnterBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_INLAY_PANEL);
        }

        //关于
        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20025);
        }

        private creatAwardEffect(parentNode: Node): CustomClip {
            let eff = new CustomClip();
            parentNode.addChildAt(eff, 1);
            eff.pos(-80, -80);
            eff.scale(1.2, 1.2);
            eff.skin = "assets/effect/availability.atlas";
            eff.frameUrls = ["availability/1.png", "availability/2.png", "availability/3.png", "availability/4.png",
                "availability/5.png", "availability/6.png", "availability/7.png", "availability/8.png"];
            eff.durationFrame = 5;
            eff.play();
            eff.loop = true;
            return eff;
        }
    }
}