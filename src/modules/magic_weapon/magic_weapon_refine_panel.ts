///<reference path="../magic_pet/magic_pet_upgrade_item.ts"/>
///<reference path="../config/ride_feed_cfg.ts"/>
///<reference path="../config/ride_rank_cfg.ts"/>
///<reference path="../config/ride_refine_cfg.ts"/>

/** 精灵面板*/
namespace modules.magicWeapon {
    import BtnGroup = modules.common.BtnGroup;
    import BaseItem = modules.bag.BaseItem;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;
    import rideRefine = Configuration.rideRefine;
    import PetRefine = Protocols.PetRefine;
    import RefineInfo = Protocols.RefineInfo;
    import PetRefineFields = Protocols.PetRefineFields;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import RideRefineCfg = modules.config.RideRefineCfg;
    import rideRefineFields = Configuration.rideRefineFields;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagUtil = modules.bag.BagUtil;
    import ItemFields = Protocols.ItemFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import MagicWeaponRefineViewUI = ui.MagicWeaponRefineViewUI;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import TypesAttr = Protocols.TypesAttr;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import MagicPetRefineViewUI = ui.MagicPetRefineViewUI;
    import LayaEvent = modules.common.LayaEvent;

    export class MagicWeaponRefinePanel extends MagicPetRefineViewUI {
        // 培养、进阶、修炼按钮组
        private _btnGroup: FuncBtnGroup;
        // 修炼类型组
        private _typeGroup: BtnGroup;
        //修炼红点
        private _redDotImgs: Array<Image>;
        //按钮特效
        private btnClip: CustomClip;

        // 材料物品格子
        private _materialItem: BaseItem;
        private _countDiff: number;

        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;

        private _refineTypeNames: Array<string>;
        // 修炼总属性
        private _attr: Array<TypesAttr>;
        // 修炼战力
        private _fighting: number;
        private _refineLv: number;

        // private _upGradeEff: CustomClip; //升级特效
        private _beadBtns: Laya.Button[]

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

            this.centerY = 0;
            this.centerX = 0;

            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.rideFeed, ActionOpenId.rideRank, ActionOpenId.rideMagicShow, ActionOpenId.rideRefine, ActionOpenId.rideFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);

            this._beadBtns = [this.type0Btn, this.type1Btn, this.type2Btn, this.type3Btn]

            this._typeGroup = new BtnGroup();
            this._typeGroup.setBtns(this.type0Btn, this.type1Btn, this.type2Btn, this.type3Btn);

            this.sumAttrBtn.underline = true;

            this._materialItem = new BaseItem();
            this.addChild(this._materialItem);
            this._materialItem.scale(0.8, 0.8, true);
            this._materialItem.pos(317, 897, true);

            this._nameTxts = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._valueTxts = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._upImgs = [this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5, this.attrUpImg6];
            this._upTxts = [this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5, this.attrUpTxt6];

            this._redDotImgs = [this.redDotImg_0, this.redDotImg_1, this.redDotImg_2, this.redDotImg_3];

            this._refineTypeNames = ["器灵·锐", "器灵·御", "器灵·攻", "器灵·迅"];

            this.creatEffect();

            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_FAZHEN_BTN, this.methodArrayBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_REFINE_ONE_KEY_BTN, this.onekeyBtn);
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.searchOneType);

            this._btnGroup.on(Event.CHANGE, this, this.changeMenuHandler);
            this.onekeyBtn.on(Event.CLICK, this, this.onekeyHandler);
            this.sumAttrBtn.on(Event.CLICK, this, this.sumAttrHandler);
            this._typeGroup.on(Event.CHANGE, this, this.updateRefine);
            this._typeGroup.selectedIndex = 0;
            this.tipsBtn.on(Event.CLICK, this, this.tipsHandler);
            // this.addAutoListener(this._upGradeEff, LayaEvent.COMPLETE, this, this.closeEff);

            RedPointCtrl.instance.registeRedPoint(this.cultureRP, ["weaponFeedSkillRP", "weaponFeedMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.advancedRP, ["weaponRankSkillRP", "weaponRankMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.practiceRP, ["weaponRefineMaterialRP"]);
            RedPointCtrl.instance.registeRedPoint(this.methodArrayRP, ["weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.hhDotImg, ["weaponIllusionRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();

            GlobalData.dispatcher.off(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.searchOneType);

            this._btnGroup.off(Event.CHANGE, this, this.changeMenuHandler);
            this.onekeyBtn.off(Event.CLICK, this, this.onekeyHandler);
            this.sumAttrBtn.off(Event.CLICK, this, this.sumAttrHandler);
            this._typeGroup.off(Event.CHANGE, this, this.updateRefine);
            this.tipsBtn.off(Event.CLICK, this, this.tipsHandler);

            RedPointCtrl.instance.retireRedPoint(this.cultureRP);
            RedPointCtrl.instance.retireRedPoint(this.advancedRP);
            RedPointCtrl.instance.retireRedPoint(this.practiceRP);
            RedPointCtrl.instance.retireRedPoint(this.methodArrayRP);
            RedPointCtrl.instance.retireRedPoint(this.hhDotImg);
        }

        protected onOpened(): void {
            super.onOpened();
            this.cultureBtn.label = "强化"
            this.advancedBtn.label = "进化"
            this.practiceBtn.label = "附魔"
            this.methodArrayBtn.label = "精灵造物"

            this.bead_Name1.text = "精灵之羽";
            this.bead_Name2.text = "精灵之泪";
            this.bead_Name3.text = "精灵之冠";
            this.bead_Name4.text = "精灵之誓";

            this.bead_01.skin = "assets/icon/item/10010.png"
            this.bead_02.skin = "assets/icon/item/10011.png"
            this.bead_03.skin = "assets/icon/item/10012.png"
            this.bead_04.skin = "assets/icon/item/10013.png"
            MagicPetModel.instance.panelType = 0;
            // this._upGradeEff.visible = false;

            this.btnClip.play();

            this.searchOneType();

            this._btnGroup.selectedIndex = 3;
        }


        private changeMenuHandler(): void {
            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FEED_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.WEAPON_ILLUSION_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 4) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FAZHEN_PANEL);
            }
            this.refineConTxt.visible = false;
        }

        // 一键培养/祝福
        private onekeyHandler(): void {

            if (this._countDiff >= 0) {
                MagicWeaponCtrl.instance.riseRideRefine(this._typeGroup.selectedIndex);        // 修炼
            } else {
                BagUtil.openLackPropAlert(this._materialItem.itemData[ItemFields.ItemId], -this._countDiff);
            }
        }

        private sumAttrHandler(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["翅膀附魔总属性",
                    this._fighting,
                    this._attr,
                    RideRefineCfg.instance.attrIndices
                ]);
        }

        // 打开幻化界面
        private illusionHandler(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.rideMagicShow)) {
                WindowManager.instance.open(WindowEnum.WEAPON_ILLUSION_PANEL);
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.rideMagicShow), true);
            }
        }

        // 更新修炼
        private updateRefine(): void {
            this.playpGradeEff(this._typeGroup.selectedIndex)
            this.switchType();

            // 修炼列表
            let refine: PetRefine = MagicWeaponModel.instance.refine;
            let infos: Array<RefineInfo> = refine[PetRefineFields.list];
            // 战力
            this._fighting = refine[PetRefineFields.fighting];
            // 总属性
            this._attr = refine[PetRefineFields.attr];

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
                txts[j].text = `${lv}/${RideRefineCfg.instance.getMaxLvByLv(type, lv)}`;
                if (type === this._typeGroup.selectedIndex)
                    this._refineLv = lv;
                let cfg: rideRefine = RideRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                let itemId: number = cfg[rideRefineFields.items][0];
                let needNum: number = cfg[rideRefineFields.items][1];
                let count = BagModel.instance.getItemCountById(itemId);
                if (cfg[rideRefineFields.humanLevel] < PlayerModel.instance.level
                    && (count - needNum) >= 0
                    && lv != RideRefineCfg.instance.getMaxLvByLv(type, lv)) {
                    this._redDotImgs[j].visible = true;
                } else {
                    this._redDotImgs[j].visible = false;
                }
            }
            // 属性加成
            let cfg: rideRefine = RideRefineCfg.instance.getCfgByTypeAndLv(this._typeGroup.selectedIndex, this._refineLv);
            let nextCfg: rideRefine = RideRefineCfg.instance.getCfgByTypeAndLv(this._typeGroup.selectedIndex, this._refineLv + 1);
            this.setAttrs(cfg, nextCfg);

            // 更新战力
            this.powerNum.value = refine[PetRefineFields.fighting].toString();

            // 更新消耗道具
            let itemInfo: Array<number> = cfg[rideRefineFields.items];
            let item: Protocols.Item = [itemInfo[0], 0, 0, null];
            this._materialItem.dataSource = item;
            let count = BagModel.instance.getItemCountById(itemInfo[0]);
            this._countDiff = count - itemInfo[1];
            this.btnClip.visible = this._countDiff >= 0;
            //消耗道具 颜色判定修改
            let colorStr = "#ff7462";
            if (count < itemInfo[1]) {
                this._materialItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this._materialItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            }
            this._materialItem.visible = true;

            if (!nextCfg) {           // 达到最大等级
                this.refineConTxt.text = `已满级`;
                this.refineConTxt.fontSize = 30;
                this.refineConTxt.color = "#00AD35";
                this.refineConTxt.y = 912;
                this.refineConTxt.visible = true;
                this._materialItem.visible = this.onekeyBtn.visible = false;
            } else if (cfg[rideRefineFields.humanLevel] > PlayerModel.instance.level) {
                this.refineConTxt.text = `${this._refineTypeNames[this._typeGroup.selectedIndex]}修炼已达上限，主角达到${cfg[rideRefineFields.humanLevel]}级可突破上限。`;
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

            // 修炼列表
            let refine: PetRefine = MagicWeaponModel.instance.refine;
            let infos: Array<RefineInfo> = refine[PetRefineFields.list];

            //判断下当前选中 是否可以升级如果可以 不切换
            let type: int = this._typeGroup.selectedIndex;
            let lv: int = 0;
            for (let i: int = 0; i < infos.length; i++) {
                if (type === infos[i][RefineInfoFields.type]) {
                    lv = infos[i][RefineInfoFields.level];
                    break;
                }
            }
            let cfg: rideRefine = RideRefineCfg.instance.getCfgByTypeAndLv(type, lv);
            let itemId: number = cfg[rideRefineFields.items][0];
            let needNum: number = cfg[rideRefineFields.items][1];
            let count = BagModel.instance.getItemCountById(itemId);
            if (cfg[rideRefineFields.humanLevel] < PlayerModel.instance.level
                && (count - needNum) >= 0
                && lv != RideRefineCfg.instance.getMaxLvByLv(type, lv)) {
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
                let cfg: rideRefine = RideRefineCfg.instance.getCfgByTypeAndLv(type, lv);
                let itemId: number = cfg[rideRefineFields.items][0];
                let needNum: number = cfg[rideRefineFields.items][1];
                let count = BagModel.instance.getItemCountById(itemId);
                if (cfg[rideRefineFields.humanLevel] < PlayerModel.instance.level
                    && (count - needNum) >= 0
                    && lv != RideRefineCfg.instance.getMaxLvByLv(type, lv)) {
                    this._typeGroup.selectedIndex = j;
                    return;
                }
            }
            this._typeGroup.selectedIndex = this._typeGroup.selectedIndex;
        }

        // 设置属性加成列表
        private setAttrs(cfg: rideRefine, nextCfg: rideRefine) {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                rideRefineFields.attrs
            );
        }

        private tipsHandler(): void {

            CommonUtil.alertHelp(20022);
        }


        private creatEffect() {

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