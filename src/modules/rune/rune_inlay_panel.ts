///<reference path="../rune_copy/rune_copy_model.ts"/>
///<reference path="../config/rune_refine_cfg.ts"/>


namespace modules.rune {
    import RuneInlayViewUI = ui.RuneInlayViewUI;
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;
    import BtnGroup = modules.common.BtnGroup;
    import Handler = Laya.Handler;
    import Event = Laya.Event;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import runeRefineFields = Configuration.runeRefineFields;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import Node = Laya.Node;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import CommonUtil = modules.common.CommonUtil;
    import UnsnatchRunePlaceReply = Protocols.UnsnatchRunePlaceReply;
    import UnsnatchRunePlaceReplyFields = Protocols.UnsnatchRunePlaceReplyFields;

    export class RuneInlayPanel extends RuneInlayViewUI {

        private _unlockPitByLayer: Table<number>; //槽位对应开启层数
        private _runePitArr: Array<RunePit>;
        private _pitGroup: BtnGroup;
        private _attNameTxts: Array<Text>;
        private _attTxtArr: Array<Text>;
        private _attUpTxtArr: Array<Text>;
        private _attUpImgArr: Array<Image>;
        private _upBtnClip: CustomClip;  //升级按钮特效
        private _replaceBtnClip: CustomClip;  //替换按钮特效
        private _runeClip: CustomClip; //玉荣槽特效

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;

            this.conIconImg.skin = CommonUtil.getIconById(91740001, true);

            this.allTxt.underline = this.resolveTxt.underline = this.exchangeTxt.underline = true;

            let tips: Array<string> = RuneModel.instance.tips;
            this._unlockPitByLayer = {};
            for (let i: int = 0, len: int = tips.length; i < len; i++) {
                let intArr: string[] = tips[i].split("#");
                this._unlockPitByLayer[parseInt(intArr[0].substr(1))] = parseInt(intArr[1].substr(0, intArr[1].length - 1));
            }

            this._runePitArr = new Array<RunePit>();
            this._runePitArr = [this.runeItem_1, this.runeItem_2, this.runeItem_3, this.runeItem_4, this.runeItem_5,
            this.runeItem_6, this.runeItem_7, this.runeItem_8, this.runeItem_9, this.runeItem_10];
            for (let i: int = 0, len: int = this._runePitArr.length; i < len; i++) {
                this._runePitArr[i].type = i + 1;
            }

            this._pitGroup = new BtnGroup();
            this._pitGroup.canSelectHandler = Handler.create(this, this.canSelectHandler, null, false);
            this._pitGroup.setBtns(this.runeItem_1, this.runeItem_2, this.runeItem_3, this.runeItem_4, this.runeItem_5,
                this.runeItem_6, this.runeItem_7, this.runeItem_8, this.runeItem_9, this.runeItem_10);

            this._attNameTxts = [this.attNameTxt_0, this.attNameTxt_1, this.attNameTxt_2];
            this._attTxtArr = [this.attValueTxt_0, this.attValueTxt_1, this.attValueTxt_2];
            this._attUpTxtArr = [this.proUpTxt_0, this.proUpTxt_1, this.proUpTxt_2];
            this._attUpImgArr = [this.proUpImg_0, this.proUpImg_1, this.proUpImg_2];

            this._runeClip = new CustomClip();
            this.addChildAt(this._runeClip, 4);
            this._runeClip.skin = "assets/effect/YinYangYu.atlas";
            this._runeClip.frameUrls = ["YinYangYu/0.png", "YinYangYu/1.png", "YinYangYu/2.png", "YinYangYu/3.png", "YinYangYu/4.png",
                "YinYangYu/5.png", "YinYangYu/6.png", "YinYangYu/7.png"];
            this._runeClip.durationFrame = 5;
            this._runeClip.loop = true;
            this._runeClip.scale(1.33, 1.33);
            this._runeClip.pos(185, 300);

            this._upBtnClip = this.creatBtnEff(this.upGradeBtn);
            this._replaceBtnClip = this.creatBtnEff(this.replaceBtn);
        }

        protected onOpened(): void {
            super.onOpened();
            this._upBtnClip.play();
            this._replaceBtnClip.play();
            this._runeClip.play();

            this.searchFrist();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._pitGroup, Event.CHANGE, this, this.selectPitchPit);
            this.addAutoListener(this.allTxt, Event.CLICK, this, this.runeAllViewBtnHandler);
            this.addAutoListener(this.resolveTxt, Event.CLICK, this, this.resolveTxtHandler);
            this.addAutoListener(this.replaceBtn, Event.CLICK, this, this.replaceBtnHandler);
            this.addAutoListener(this.upGradeBtn, Event.CLICK, this, this.upGradeBtnHandler);
            this.addAutoListener(this.runeCopyBtn, Event.CLICK, this, this.runeCopyBtnHandler);
            this.addAutoListener(this.runeTreasureBtn, Event.CLICK, this, this.runeTreasureBtnHandler);
            this.addAutoListener(this.exchangeTxt, Event.CLICK, this, this.exchangeTxtHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_UPDATE, this, this.updataView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_INALY_SUCCEED, this, this.selectPit);
        }

        private updataView(): void {
            console.log("update rune!!!");

            //提示语显示
            let currLayer: number = RuneCopyModel.instance.finishLv;

            this.conBox.visible = false;
            for (let key in this._unlockPitByLayer) {
                let layer: number = this._unlockPitByLayer[key];

                if (currLayer < layer) {
                    this.conBox.visible = true;
                    this.conTxt.text = `通关未央幻境${layer}层开启下个镶嵌槽`;
                    break;
                }
            }

            //总战力显示
            let attNum: number = 0;
            for (let key in RuneModel.instance.slots) {
                let runeId: number = RuneModel.instance.slots[key];
                let cfg: runeRefine = RuneRefineCfg.instance.getCfgById(runeId);
                attNum += cfg[runeRefineFields.fighting];
            }
            this.fightMsz.value = attNum.toString();


            let selectPitIndex: number = this._pitGroup.selectedIndex;
            let currInlayId: number = RuneModel.instance.slots[selectPitIndex + 1];
            if (currInlayId == undefined) {
                selectPitIndex = -1;
                this._pitGroup.selectedIndex = -1;
            }
            this.noRuneBox.visible = selectPitIndex == -1;
            this.haveRuneBox.visible = !this.noRuneBox.visible;

            if (selectPitIndex != -1 && currInlayId) {
                let dimId: number = (currInlayId * 0.0001 >> 0) * 10000;  //模糊Id
                let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                let cfg: runeRefine = RuneRefineCfg.instance.getCfgById(currInlayId);
                let nextCfg: runeRefine = RuneRefineCfg.instance.getCfgById(currInlayId + 1);
                let lv: number = currInlayId % 10000;
                let currQuality: number = CommonUtil.getItemQualityById(currInlayId);

                this.currNameTxt.text = `${dimCfg[item_runeFields.name]}`;
                this.currLvTxt.text = `Lv.${lv}`;
                this.curRuneIcon.skin = CommonUtil.getIconById(dimId);
                // this.currLvTxt.color = this.currNameTxt.color = CommonUtil.getColorById(currInlayId);

                let pitType: number = 0;
                if (selectPitIndex > 7) pitType = 1;
                let runeItems: Item[] = RuneModel.instance.canInlayRunes(pitType);
                let othersType: Table<number> = pitType == 0 ? RuneModel.instance.commonPitTypeRecode : RuneModel.instance.specialPitTypeRecode;
                let currType: number = CommonUtil.getStoneTypeById(currInlayId);
                this._replaceBtnClip.visible = false;
                for (let i: int = 0, len: int = runeItems.length; i < len; i++) {
                    let id: number = runeItems[i][ItemFields.ItemId];
                    let type: number = CommonUtil.getStoneTypeById(id);
                    if (othersType[type] && type != currType) continue;
                    dimId = (id * 0.0001 >> 0) * 10000;  //模糊Id
                    dimCfg = config.ItemRuneCfg.instance.getCfgById(dimId);
                    let needUnLockLv: number = dimCfg[item_runeFields.layer];
                    let quality: number = CommonUtil.getItemQualityById(id);
                    if (currLayer < needUnLockLv || quality < currQuality) continue;
                    let lv: number = id % 10000;
                    let currlv: number = currInlayId % 10000;
                    if (type == currType) {
                        if ((quality == currQuality && lv > currlv) || quality > currQuality) {  //相同类型 品质相同等级高或者 品质高
                            this._replaceBtnClip.visible = true;
                            break;
                        }
                    }
                }

                common.AttrUtil.setAttrTxts(
                    cfg,
                    nextCfg,
                    this._attNameTxts,
                    this._attTxtArr,
                    this._attUpImgArr,
                    this._attUpTxtArr,
                    runeRefineFields.attrs
                );

                if (nextCfg) { //有下一级
                    this.maxLvTxt.visible = false;
                    this.maxLvBox.visible = true;
                    this.replaceBtn.x = 160;
                    //消耗品 按钮特效
                    let currExp: number = RuneModel.instance.exp;
                    let needExp: number = cfg[runeRefineFields.refineItem][ItemsFields.count];
                    this.currExpTxt.text = currExp.toString();
                    this.needExpTxt.text = `/${needExp}`;

                    let initX: number = (this.width - this.currExpTxt.width - this.needExpTxt.width) / 2;
                    this.currExpTxt.x = initX;
                    this.needExpTxt.x = this.currExpTxt.x + this.currExpTxt.width + 1;
                    this.conIconImg.x = initX - (this.conIconImg.width);

                    this.currExpTxt.color = currExp < needExp ? "#ff3e3e" : "#2d1a1a";
                    this._upBtnClip.visible = currExp >= needExp;
                } else {
                    this.replaceBtn.x = 265;
                    this.maxLvTxt.visible = true;
                    this.maxLvBox.visible = false;
                }
            }
        }

        private searchFrist(): void {
            let index: number = RuneModel.instance.firstSelect;
            if (!RuneModel.instance.isSearchFirst) {
                this.updataView();
            } else {
                this.selectPit(index);
            }
        }

        private canSelectHandler(nextIndex: number): boolean {
            ++nextIndex;
            let currLayer: number = RuneCopyModel.instance.finishLv;
            let isHaveRune: number = RuneModel.instance.slots[nextIndex];

            if (currLayer >= this._unlockPitByLayer[nextIndex]) {
                RuneModel.instance.currClickPit = nextIndex;
            }
            if (currLayer < this._unlockPitByLayer[nextIndex] || !isHaveRune) {
                GlobalData.dispatcher.event(CommonEventType.RUNE_INALY_SELECT, --nextIndex);
                return false;
            }
            return true;
        }

        private selectPit(index: number): void {
            this._pitGroup.selectedIndex = index - 1;
            this.selectPitchPit();
        }

        private selectPitchPit(): void {
            let oldIndex: number = this._pitGroup.oldSelectedIndex;
            let currIndex: number = this._pitGroup.selectedIndex;
            if (this._runePitArr[oldIndex]) this._runePitArr[oldIndex].frameImg.visible = false;
            GlobalData.dispatcher.event(CommonEventType.RUNE_INALY_SELECT, currIndex);
            this.updataView();
        }

        private creatBtnEff(node: Node): CustomClip {
            let eff = CommonUtil.creatEff(node, `btn_light`, 15);
            eff.pos(-5, -18);
            eff.scale(1, 1.25);
            eff.visible = false;
            return eff;
        }

        public destroy(destroyChild: boolean = true): void {
            this._runePitArr = this.destroyElement(this._runePitArr);
            this._pitGroup = this.destroyElement(this._pitGroup);
            this._attNameTxts = this.destroyElement(this._attNameTxts);
            this._attTxtArr = this.destroyElement(this._attTxtArr);
            this._attUpTxtArr = this.destroyElement(this._attUpTxtArr);
            this._attUpImgArr = this.destroyElement(this._attUpImgArr);
            this._upBtnClip = this.destroyElement(this._upBtnClip);
            this._replaceBtnClip = this.destroyElement(this._replaceBtnClip);
            this._runeClip = this.destroyElement(this._runeClip);
            super.destroy(destroyChild);
        }

        private runeAllViewBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_ALL_ALERT);
        }

        private resolveTxtHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_RESOLVE_ALERT);
        }

        private replaceBtnHandler(): void {
            RuneModel.instance.currClickPit = RuneModel.instance.pitchRune;
            WindowManager.instance.open(WindowEnum.RUNE_BAG_ALERT, RuneModel.instance.pitchRune);
        }

        private upGradeBtnHandler(): void {
            RuneCtrl.instance.runeRefine([this._pitGroup.selectedIndex + 1]);
        }

        private runeCopyBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_COPY_PANEL);
        }

        private runeTreasureBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.TREASURE_RUNE_PANEL);
        }

        private exchangeTxtHandler(): void {
            WindowManager.instance.open(WindowEnum.TREASURE_CHANGE, 3);
        }
    }
}