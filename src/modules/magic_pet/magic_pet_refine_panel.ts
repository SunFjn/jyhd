///<reference path="../offline/offline_profit_alert.ts"/>
///<reference path="../common/common_util.ts"/>
///<reference path="./magic_pet_feed_skill_alert.ts"/>
///<reference path="../common_alert/attr_alert.ts"/>
///<reference path="../config/pet_refine_cfg.ts"/>
///<reference path="../common/custom_clip.ts"/>
///<reference path="../effect/success_effect_ctrl.ts"/>
///<reference path="../config/pet_feed_cfg.ts"/>
///<reference path="../config/pet_rank_cfg.ts"/>
///<reference path="../bottom_tab/bottom_tab_ctrl.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>

/**
 *  宠物面板*/
namespace modules.magicPet {
    import petRefine = Configuration.petRefine;
    import petRefineFields = Configuration.petRefineFields;
    import Event = Laya.Event;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import BaseItem = modules.bag.BaseItem;
    import BagModel = modules.bag.BagModel;
    import BtnGroup = modules.common.BtnGroup;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import PetRefineCfg = modules.config.PetRefineCfg;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import PetRefineFields = Protocols.PetRefineFields;
    import RefineInfo = Protocols.RefineInfo;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import WindowEnum = ui.WindowEnum;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import MagicPetRefineViewUI = ui.MagicPetRefineViewUI;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import TypesAttr = Protocols.TypesAttr;
    import LayaEvent = modules.common.LayaEvent;

    export class MagicPetRefinePanel extends MagicPetRefineViewUI {

        // 按钮组
        private _btnGroup: FuncBtnGroup;
        // 修炼类型组
        private _typeGroup: BtnGroup;

        //按钮特效
        private btnClip: CustomClip;

        //修炼红点
        private _redDotImgs: Array<Image>;

        // 修炼总属性
        private _attr: Array<TypesAttr>;
        // 修炼战力
        private _fighting: number;
        private _refineLv: number;
        // 修炼材料
        private _refineItem: BaseItem;
        private _refineNumDiff: number;

        // private _upGradeEff: CustomClip; //升级特效
        private _beadBtns: Laya.Button[]

        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;

        private _refineTypeNames: Array<string>;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this.btnClip) {
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._typeGroup) {
                this._typeGroup.destroy();
                this._typeGroup = null;
            }
            // this._upGradeEff = this.destroyElement(this._upGradeEff);
            super.destroy(destroyChild);
        }
        protected initialize(): void {
            super.initialize();
            this._beadBtns = [this.type0Btn, this.type1Btn, this.type2Btn, this.type3Btn]
            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.petFeed, ActionOpenId.petRank, ActionOpenId.petMagicShow, ActionOpenId.petRefine, ActionOpenId.petFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);

            this._typeGroup = new BtnGroup();
            this._typeGroup.setBtns(this.type0Btn, this.type1Btn, this.type2Btn, this.type3Btn);

            this.sumAttrBtn.underline = true;

            this.centerY = 0;
            this.centerX = 0;

            this._refineNumDiff = 0;

            this._refineItem = new BaseItem();
            this.refineBox.addChild(this._refineItem);
            this._refineItem.scale(0.8, 0.8, true);
            this._refineItem.pos(292, 831, true);

            this._nameTxts = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._valueTxts = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._upImgs = [this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5, this.attrUpImg6];
            this._upTxts = [this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5, this.attrUpTxt6];

            this._refineTypeNames = ["悟性", "潜能", "根骨", "灵体"];

            this._redDotImgs = [this.redDotImg_0, this.redDotImg_1, this.redDotImg_2, this.redDotImg_3];

            this.creatEffect();

            this.regGuideSpr(GuideSpriteId.MAGIC_PET_FEED_BTN, this.cultureBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_FAZHEN_BTN, this.methodArrayBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_REFINE_ONE_KEY_BTN, this.onekeyBtn);
        }

        // 添加按钮回调
        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.MAGIC_PET_INITED, this, this.initPanel);
            GlobalData.dispatcher.on(CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);

            this.tipsBtn.on(Event.CLICK, this, this.tipsHandler);
            this.onekeyBtn.on(Event.CLICK, this, this.onekeyBtnHandler);
            this.sumAttrBtn.on(Event.CLICK, this, this.onSumAttrHandler);
            this._btnGroup.on(Event.CHANGE, this, this.changeMagicPetHandler);
            // this.addAutoListener(this._upGradeEff, LayaEvent.COMPLETE, this, this.closeEff);


            this._typeGroup.on(Event.CHANGE, this, this.updateRefinePanel);
            this._typeGroup.selectedIndex = 0;

            RedPointCtrl.instance.registeRedPoint(this.cultureRP, ["petFeedSkillRP", "petFeedMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.advancedRP, ["petRankSkillRP", "petRankMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.practiceRP, ["petRefineMaterialRP"]);
            RedPointCtrl.instance.registeRedPoint(this.methodArrayRP, ["magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.hhDotImg, ["petIllusionRP"]);
        }

        // 删除按钮回调
        protected removeListeners(): void {
            super.removeListeners();

            GlobalData.dispatcher.off(CommonEventType.MAGIC_PET_INITED, this, this.initPanel);
            GlobalData.dispatcher.off(CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo);
            GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.updateBag);

            this.tipsBtn.off(Event.CLICK, this, this.tipsHandler);
            this.onekeyBtn.off(Event.CLICK, this, this.onekeyBtnHandler);
            this.sumAttrBtn.off(Event.CLICK, this, this.onSumAttrHandler);
            this._btnGroup.off(Event.CHANGE, this, this.changeMagicPetHandler);
            this._typeGroup.off(Event.CHANGE, this, this.updateRefinePanel);

            RedPointCtrl.instance.retireRedPoint(this.cultureRP);
            RedPointCtrl.instance.retireRedPoint(this.advancedRP);
            RedPointCtrl.instance.retireRedPoint(this.practiceRP);
            RedPointCtrl.instance.retireRedPoint(this.methodArrayRP);
        }

        // 初始化宠物面板
        private initPanel(): void {
            this.searchOneType();
        }

        // 更新宠物信息
        private updatePetInfo(): void {
            this.playpGradeEff(this._typeGroup.selectedIndex)
            this.searchOneType();
        }

        private updateBag(): void {
            this.changeMagicPetHandler();
        }

        protected onOpened(): void {
            super.onOpened();
            this.cultureBtn.label = "喂养"
            this.advancedBtn.label = "进化"
            this.practiceBtn.label = "宝珠"
            this.methodArrayBtn.label = "宠物装饰"
            this.title.skin = "magic_pet/txt_cw.png";

            this.bead_Name1.text = "凯恩的宝珠";
            this.bead_Name2.text = "黄龙的宝珠";
            this.bead_Name3.text = "卡赞的宝珠";
            this.bead_Name4.text = "艾肯的宝珠";
            this.bead_01.skin = "assets/icon/item/10004.png"
            this.bead_02.skin = "assets/icon/item/10005.png"
            this.bead_03.skin = "assets/icon/item/10006.png"
            this.bead_04.skin = "assets/icon/item/10007.png"
            MagicPetModel.instance.panelType = 1;
            // this._upGradeEff.visible = false;

            this.btnClip.play();
            this._btnGroup.selectedIndex = 3;
            this.searchOneType();
        }

        // 切换宠物标签:培养/进阶/修炼
        private changeMagicPetHandler(): void {

            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_FEED_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_RANK_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.PET_ILLUSION_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 4) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_FAZHEN_PANEL);
                return;
            }

            this.refineConTxt.visible = false;
        }

        // 宠物界面Tips
        private tipsHandler(): void {
            CommonUtil.alertHelp(20003);
        }

        // 一键培养/祝福
        private onekeyBtnHandler(): void {
            if (this._refineNumDiff >= 0) {
                MagicPetCtrl.instance.riseRefinePet(this._typeGroup.selectedIndex);
            } else {
                BagUtil.openLackPropAlert(this._refineItem.itemData[ItemFields.ItemId], -this._refineNumDiff);
            }
        }

        // 更新修炼面板
        private updateRefinePanel(): void {

            this.switchType();
            // 修炼列表
            let infos: Array<RefineInfo> = MagicPetModel.instance._refine[PetRefineFields.list];
            // 战力
            this._fighting = MagicPetModel.instance._refine[PetRefineFields.fighting];
            // 总属性
            this._attr = MagicPetModel.instance._refine[PetRefineFields.attr];

            let txts: Array<Text> = [this.type0Txt, this.type1Txt, this.type2Txt, this.type3Txt];
            for (let j: int = 0; j < txts.length; j++) {
                let type: int = j;
                let lv: int = 0;
                for (let i: int = 0; i < infos.length; i++) {
                    if (type === infos[i][RefineInfoFields.type]) {
                        lv = infos[i][RefineInfoFields.level];
                        break;
                    }
                }
                txts[j].text = `${lv}/${PetRefineCfg.instance.getMaxLvByLv(type, lv)}`;
                if (type === this._typeGroup.selectedIndex)
                    this._refineLv = lv;
                let cfg: petRefine = PetRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                let itemId: number = cfg[petRefineFields.items][0];
                let needNum: number = cfg[petRefineFields.items][1];
                let count = BagModel.instance.getItemCountById(itemId);
                if (cfg[petRefineFields.humanLevel] < PlayerModel.instance.level
                    && (count - needNum) >= 0
                    && lv != PetRefineCfg.instance.getMaxLvByLv(type, lv)) {
                    this._redDotImgs[j].visible = true;
                } else {
                    this._redDotImgs[j].visible = false;
                }
            }

            // 属性加成
            let cfg: petRefine = PetRefineCfg.instance.getCfgByTypeAndLv(this._typeGroup.selectedIndex, this._refineLv);
            let nextCfg: petRefine = PetRefineCfg.instance.getCfgByTypeAndLv(this._typeGroup.selectedIndex, this._refineLv + 1);
            this.setAttrs(cfg, nextCfg);

            this.powerNum.value = MagicPetModel.instance._refine[PetRefineFields.fighting].toString();

            // 更新消耗道具
            let itemInfo: Array<number> = cfg[petRefineFields.items];
            let item: Protocols.Item = [itemInfo[0], 0, 0, null];
            this._refineItem.dataSource = item;
            let count = BagModel.instance.getItemCountById(itemInfo[0]);
            //消耗道具 颜色判定修改
            let colorStr = "#ff7462";
            if (count < itemInfo[1]) {
                this._refineItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this._refineItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            }
            this._refineNumDiff = count - itemInfo[1];
            this.btnClip.visible = this._refineNumDiff >= 0;
            this._refineItem.visible = true;


            if (!nextCfg) {           // 达到最大等级
                this.refineConTxt.text = `已满级`;
                this.refineConTxt.fontSize = 30;
                this.refineConTxt.color = "#00AD35";
                this.refineConTxt.y = 912;
                this.refineConTxt.visible = true;
                this._refineItem.visible = this.onekeyBtn.visible = false;
            } else if (cfg[petRefineFields.humanLevel] > PlayerModel.instance.level) {
                this.refineConTxt.text = `${this._refineTypeNames[this._typeGroup.selectedIndex]}修炼已达上限，主角达到${cfg[petRefineFields.humanLevel]}级可突破上限。`;
                this.refineConTxt.fontSize = 24;
                this.refineConTxt.color = "#FF0000";
                this.refineConTxt.y = 915;
                this.refineConTxt.visible = true;
                this.onekeyBtn.visible = false;
            } else {
                this.refineConTxt.visible = false;
                this.onekeyBtn.visible = true;
            }
        }

        private switchType(): void {
            switch (this._typeGroup.selectedIndex) {
                case 0:         // 悟性
                    this.selectedImg.pos(this.type0Btn.x, this.type0Btn.y);
                    break;
                case 1:         // 潜能
                    this.selectedImg.pos(this.type1Btn.x, this.type1Btn.y);
                    break;
                case 2:         // 根骨
                    this.selectedImg.pos(this.type2Btn.x, this.type2Btn.y);
                    break;
                case 3:         // 灵体
                    this.selectedImg.pos(this.type3Btn.x, this.type3Btn.y);
                    break;
            }
        }

        //修炼第一个红点类型
        private searchOneType(): void {

            let infos: Array<RefineInfo> = MagicPetModel.instance._refine[PetRefineFields.list];


            //判断下当前选中 是否可以升级如果可以 不切换
            let type: int = this._typeGroup.selectedIndex;
            let lv: int = 0;
            for (let i: int = 0; i < infos.length; i++) {
                if (type === infos[i][RefineInfoFields.type]) {
                    lv = infos[i][RefineInfoFields.level];
                    break;
                }
            }

            let cfg: petRefine = PetRefineCfg.instance.getCfgByTypeAndLv(type, lv);
            let itemId: number = cfg[petRefineFields.items][0];
            let needNum: number = cfg[petRefineFields.items][1];
            let count = BagModel.instance.getItemCountById(itemId);
            if (cfg[petRefineFields.humanLevel] < PlayerModel.instance.level
                && (count - needNum) >= 0
                && lv != PetRefineCfg.instance.getMaxLvByLv(type, lv)) {
                this._typeGroup.selectedIndex = this._typeGroup.selectedIndex;
                return;
            }


            let txts: Array<Text> = [this.type0Txt, this.type1Txt, this.type2Txt, this.type3Txt];
            for (let j: int = 0; j < txts.length; j++) {
                let type: int = j;
                let lv: int = 0;
                for (let i: int = 0; i < infos.length; i++) {
                    if (type === infos[i][RefineInfoFields.type]) {
                        lv = infos[i][RefineInfoFields.level];
                        break;
                    }
                }
                let cfg: petRefine = PetRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                let itemId: number = cfg[petRefineFields.items][0];
                let needNum: number = cfg[petRefineFields.items][1];
                let count = BagModel.instance.getItemCountById(itemId);
                if (cfg[petRefineFields.humanLevel] < PlayerModel.instance.level
                    && (count - needNum) >= 0
                    && lv != PetRefineCfg.instance.getMaxLvByLv(type, lv)) {
                    this._typeGroup.selectedIndex = j;
                    return;
                }
            }
            this._typeGroup.selectedIndex = this._typeGroup.selectedIndex;
        }

        // 设置属性加成列表
        private setAttrs(cfg: petRefine, nextCfg: petRefine) {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                petRefineFields.attrs
            );

            // let lineNum: int = (t - 1) / 2 >> 0;
            // let tY: number = lineNum === 0 ? 794 : lineNum === 1 ? 776 : 756;
            // for (let i: int = 0, len: int = t; i < len; i++) {
            //     this._nameTxts[i].y = this._valueTxts[i].y = this._upTxts[i].y = tY + (i / 2 >> 0) * 38;
            //     this._upImgs[i].y = this._nameTxts[i].y - 5;
            // }
        }

        // 打开修炼总属性弹窗
        private onSumAttrHandler(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["宠物附魔总属性",
                    this._fighting,
                    this._attr,
                    PetRefineCfg.instance.attrIndices
                ]);
        }

        private creatEffect(): void {
            this.btnClip = new CustomClip();
            this.onekeyBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.play();
            this.btnClip.loop = true;
            this.btnClip.pos(-5, -14);
            this.btnClip.scale(0.96, 1);
            this.btnClip.visible = false;
            //升级特效
            // this._upGradeEff = CustomClip.createAndPlay("assets/effect/activate.atlas", "activate", 4, false, false);
            // this.refineBox.addChild(this._upGradeEff);
            // this._upGradeEff.visible = false;
        }
        private playpGradeEff(index: number): void {
            // this._upGradeEff.visible = true;
            // this._upGradeEff.play();
            // this._upGradeEff.pos(this._beadBtns[index].x - 128, this._beadBtns[index].y - 128)
        }
        private closeEff(): void {
            // this._upGradeEff.visible = false;
        }
    }
}