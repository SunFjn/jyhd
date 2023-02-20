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
    import petRank = Configuration.petRank;
    import petRankFields = Configuration.petRankFields;
    import Event = Laya.Event;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import BaseItem = modules.bag.BaseItem;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import PetRankFields = Protocols.PetRankFields;
    import SkillInfo = Protocols.SkillInfo;
    import WindowEnum = ui.WindowEnum;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import PetRankCfg = modules.config.PetRankCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import IllusionModel = modules.illusion.IllusionModel;
    import MagicPetRankViewUI = ui.MagicPetRankViewUI;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SkillInfoFields = Protocols.SkillInfoFields;

    export class MagicPetRankPanel extends MagicPetRankViewUI {
        private _HuoQuItemItem: modules.main.HuoQuItemItem;
        // 按钮组
        private _btnGroup: FuncBtnGroup;

        //按钮特效
        private btnClip: CustomClip;

        // 星级
        private _startLv: number;

        // 宠物进阶祝福值进度条
        private _rankProCtrl: ProgressBarCtrl;

        private _showId: number;
        private _showIds: number[];
        // 进阶材料
        private _upgradeItem: BaseItem;
        private _upgradeNumDiff: number;
        // 进阶等级
        private _upgradeStar: int;

        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;
        private _stars: Array<Image>;

        /** 进阶技能单元项*/
        private _upgradeItems: Array<MagicPetUpgradeItem>;

        // private _magicClip: CustomClip;

        // private _modelClip: AvatarClip;
        private _modelShowIndex: number;
        private _nameStr: string;
        private _isCanOpen: boolean;

        private _tween: TweenJS;
        private itemArr: Protocols.Item;
        private _skeletonClip: SkeletonAvatar;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            if (this.btnClip) {
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            // if (this._magicClip) {
            //     this._magicClip.removeSelf();
            //     this._magicClip.destroy();
            //     this._magicClip = null;
            // }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this._upgradeItems) {
                for (let index = 0; index < this._upgradeItems.length; index++) {
                    let element = this._upgradeItems[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._upgradeItems.length = 0;
                this._upgradeItems = null;
            }
            if (this._HuoQuItemItem) {
                this._HuoQuItemItem = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.petFeed, ActionOpenId.petRank, ActionOpenId.petMagicShow, ActionOpenId.petRefine, ActionOpenId.petFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);
           
            this._rankProCtrl = new ProgressBarCtrl(this.progressBar, 482, this.progressTxt);
            this._startLv = 0;

            this._isCanOpen = false;
            this.centerY = 0;
            this.centerX = 0;

            this._upgradeNumDiff = 0;

            this._upgradeItem = new BaseItem();
            this.rankBox.addChild(this._upgradeItem);
            this._upgradeItem.scale(0.8, 0.8, true);
            this._upgradeItem.pos(320, 930, true);

            this._nameTxts = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._valueTxts = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._upImgs = [this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5, this.attrUpImg6];
            this._upTxts = [this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5, this.attrUpTxt6];

            this._stars = [this.starImg1, this.starImg2, this.starImg3, this.starImg4, this.starImg5,
            this.starImg6, this.starImg7, this.starImg8, this.starImg9, this.starImg10];

            this._showId = -1;
            this._showIds = PetRankCfg.instance.showIds;
            this._modelShowIndex = 0;
            this._nameStr = "一二三四五六七八九十";

            this.creatEffect();

            this.regGuideSpr(GuideSpriteId.MAGIC_PET_FEED_BTN, this.cultureBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_FAZHEN_BTN, this.methodArrayBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_RANK_ONE_KEY_BTN, this.onekeyBtn);
        }

        // 添加按钮回调
        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_PAY_UPDATE, this, this.isShowHuoQu);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_PET_INITED, this, this.initPanel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_PET_ZIDONG, this, this.showZiDongBtn);

            this.addAutoListener(this.ziDongBtn, Event.CLICK, this, this.ziDongBtnHandler);
            this.addAutoListener(this.tipsBtn, Event.CLICK, this, this.tipsHandler);
            this.addAutoListener(this.onekeyBtn, Event.CLICK, this, this.onekeyBtnHandler);
            this.addAutoListener(this.switchBtn, Event.CLICK, this, this.changePetSkin);
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.changeMagicPetHandler);
            this.addAutoListener(this.nextBtn, Event.CLICK, this, this.selectSkin, [1]);
            this.addAutoListener(this.lastBtn, Event.CLICK, this, this.selectSkin, [0]);

            this.addAutoRegisteRedPoint(this.cultureRP, ["petFeedSkillRP", "petFeedMatRP"]);
            this.addAutoRegisteRedPoint(this.advancedRP, ["petRankSkillRP", "petRankMatRP"]);
            this.addAutoRegisteRedPoint(this.practiceRP, ["petRefineMaterialRP"]);
            this.addAutoRegisteRedPoint(this.methodArrayRP, ["magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP"]);
            this.addAutoRegisteRedPoint(this.hhDotImg, ["petIllusionRP"]);
        }

        private selectSkin(bool: int): void {

            let showStars: number[] = PetRankCfg.instance.showStars;
            let showId: number = -1;

            let maxShowIndex: number = 0;
            for (let i: int = 0, len: int = showStars.length; i < len; i++) {
                if (this._upgradeStar <= showStars[i]) {
                    maxShowIndex = i;
                    break;
                } else {
                    maxShowIndex = len - 1;
                }
            }
            this.lastBtn.visible = this.nextBtn.visible = true;

            if (bool) {           //向右切换
                showId = this._showIds[++this._modelShowIndex];
                this.nextBtn.visible = this._modelShowIndex < this._showIds.length - 1;
                if (this._modelShowIndex >= maxShowIndex) {
                    this.nextBtn.gray = true;
                    this.nextBtn.mouseEnabled = false;
                } else {
                    this.nextBtn.gray = false;
                    this.nextBtn.mouseEnabled = true;
                }
            } else {
                showId = this._showIds[--this._modelShowIndex];
                this.lastBtn.visible = this._modelShowIndex > 0;
                this.nextBtn.gray = false;
                this.nextBtn.mouseEnabled = true;
            }
            this.selectShowModel(showId, this._modelShowIndex);
            this.showStar(showId);
        }

        private showStar(showId: number): void {
            let starIndex: number = Math.floor(this._upgradeStar / 10);
            if (starIndex != 10) {
                let num: number = (this._upgradeStar / 10).toString().length;
                if (num == 1) {
                    starIndex--;
                }
            } else {
                starIndex--;
            }

            if (showId == this._showId) {
                this.useImg.visible = true;
                this.switchBtn.visible = false;
            } else {
                this.useImg.visible = false;
                this.switchBtn.visible = true;
            }

            if (this._modelShowIndex < starIndex) {
                this.setStarLv(10);
            } else if (this._modelShowIndex > starIndex) {
                this.setStarLv(0);
                if (showId != 2001) {
                    this.switchBtn.visible = false;
                }
            } else {
                this.setStarLv(this._upgradeStar);
            }

        }

        // 初始化宠物面板
        private initPanel(): void {
            if (this._btnGroup.selectedIndex == -1) return;
            this.updateAdvancedPanel();
        }

        // 更新宠物信息
        private updatePetInfo(): void {
            if (this._btnGroup.selectedIndex == -1) return;
            this.updateAdvancedPanel();

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
            MagicPetModel.instance.panelType = 1;
            this.title.skin="magic_pet/txt_cw.png";
            // this._magicClip.play();
            this.btnClip.play();
            this._upgradeStar = -1;
            this._btnGroup.selectedIndex = 1;
            this.searchFirstShowModel();
            this.showZiDongBtn();
        }

        public close(): void {
            super.close();
            if (this._tween) {
                this._tween.stop();
            }
            if (this._HuoQuItemItem) {
                this._HuoQuItemItem = null;
            }
        }

        // 切换宠物标签:培养/进阶/修炼
        private changeMagicPetHandler(): void {

            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_FEED_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.PET_ILLUSION_PANEL);
                return;
            }  else if (this._btnGroup.selectedIndex == 3) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_REFINE_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 4) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_FAZHEN_PANEL);
                return;
            }

            this.onekeyBtn.visible = true;
            this.updateAdvancedPanel();
        }


        //自动购买
        private ziDongBtnHandler(): void {
            if (MagicPetModel.instance._bollZiDong) {
                MagicPetModel.instance._bollZiDong = false;
                this.ziDongBtn.selected = false;
            }
            else {
                if (MagicPetModel.instance._bollTips) {
                    MagicPetModel.instance._bollZiDong = true;
                    this.ziDongBtn.selected = true;
                }
                else {
                    WindowManager.instance.openDialog(WindowEnum.MAGICPET_AUTOMATICPAY_ALERT, this.itemArr);
                }
            }
        }
        public showZiDongBtn() {
            if (MagicPetModel.instance._bollZiDong) {
                this.ziDongBtn.selected = true;
            }
            else {
                this.ziDongBtn.selected = false;
            }
        }

        // 宠物界面Tips
        private tipsHandler(): void {
            CommonUtil.alertHelp(20002);

        }

        // 一键培养/祝福
        private onekeyBtnHandler(): void {
            if (MagicPetModel.instance._bollZiDong) {
                MagicPetCtrl.instance.rankPet();
            }
            else {
                if (this._upgradeNumDiff >= 0) {
                    MagicPetCtrl.instance.rankPet();
                } else {
                    BagUtil.openLackPropAlert(this._upgradeItem.itemData[ItemFields.ItemId], -this._upgradeNumDiff);
                }
            }
        }

        // 打开幻化界面
        private illusionHandler(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.petMagicShow)) {
                WindowManager.instance.open(WindowEnum.PET_ILLUSION_PANEL);
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.petMagicShow), true);
            }
        }

        // 设置星级显示（服务器获取）
        private setStarLv(star: number): void {
            if (star !== 0) {
                star = star % 10;
                if (star === 0) star = 10;
            }
            for (var i = 0; i < 10; i++) {
                this._stars[i].skin = i < star ? "common/icon_tongyong_8.png" : "common/icon_tongyong_7.png";
            }
        }

        // 更新进阶面板
        private updateAdvancedPanel() {

            this._showId = IllusionModel.instance.magicShowId ? IllusionModel.instance.magicShowId : this._showIds[0];

            // 更新星级
            let star = MagicPetModel.instance._star;

            // 更新进度条
            let blessing = MagicPetModel.instance._blessing;
            let cfg: petRank = PetRankCfg.instance.getPetRankCfgBySt(star);
            let nextCfg: petRank = PetRankCfg.instance.getPetRankCfgBySt(star + 1);
            let maxBlessing = cfg[PetRankFields.blessing];

            if (this._upgradeStar !== -1 && star !== this._upgradeStar) {
                if (Math.floor(star / 10) > Math.floor(this._startLv / 10) && (star % 10) == 1) {
                } else {
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong3.png");
                }
                if (this._tween) {
                    this._tween.stop();
                    this._tween = null;
                }
                // 升星的话经验缓动至满
                this._tween = TweenJS.create(this._rankProCtrl).to({ value: this._rankProCtrl.maxValue }, (1 - this._rankProCtrl.value / this._rankProCtrl.maxValue) * 400).onComplete((): void => {
                    this._rankProCtrl.maxValue = maxBlessing;
                    this._rankProCtrl.value = blessing;
                }).start();
            } else if (blessing > this._rankProCtrl.value) {
                if (this._tween) {
                    this._tween.stop();
                    this._tween = null;
                }
                this._tween = TweenJS.create(this._rankProCtrl).to({ value: blessing }, 400).start();
            } else {
                this._rankProCtrl.maxValue = maxBlessing;
                this._rankProCtrl.value = blessing;
            }

            this._upgradeStar = star;

            this.powerNum.value = MagicPetModel.instance.rank[PetRankFields.fighting].toString();

            // 属性加成
            this.setAttrs(cfg, nextCfg);

            // 更新消耗道具
            let itemInfo: Array<number> = cfg[petRankFields.items];
            let item: Protocols.Item = [itemInfo[0], 0, 0, null];
            this._upgradeItem.dataSource = item;
            this.itemArr = item;
            let count = BagModel.instance.getItemCountById(itemInfo[0]);

            //消耗道具 颜色判定修改
            let colorStr = "#ff7462";
            if (count < itemInfo[1]) {
                this._upgradeItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this._upgradeItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            }
            this._upgradeNumDiff = count - itemInfo[1];
            this.btnClip.visible = this._upgradeNumDiff >= 0;
            // 技能
            if (!this._upgradeItems) {
                this._upgradeItems = new Array<MagicPetUpgradeItem>();
                let skillIds: Array<number> = PetRankCfg.instance.skillIds;
                for (let i: int = 0, len: int = skillIds.length; i < len; i++) {
                    let skillItem: MagicPetUpgradeItem = new MagicPetUpgradeItem();
                    this._upgradeItems.push(skillItem);
                    skillItem.cfg = PetRankCfg.instance.getCfgBySkillId(skillIds[i]);
                    this.rankBox.addChild(skillItem);
                    skillItem.pos(100 + i * 120, 760, true);
                    skillItem.stopUpgradeCallBack = ()=>{
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                     };
                }
            }
            let skillInfos: Array<SkillInfo> = MagicPetModel.instance.upgradeSkills;
            for (let i: int = 0, len: int = this._upgradeItems.length; i < len; i++) {
                this._upgradeItems[i].skillInfo = skillInfos && skillInfos.length > i ? skillInfos[i] : null;
            }

            if (!nextCfg) {       // 满级
                this.blessTxt.visible = this.progressBg.visible = this.progressBar.visible = this.progressTxt.visible = false;
                this._upgradeItem.visible = this.onekeyBtn.visible = false;
                this.maxLvTxt.visible = true;
            } else {
                this.blessTxt.visible = this.progressBg.visible = this.progressBar.visible = this.progressTxt.visible = true;
                this._upgradeItem.visible = this.onekeyBtn.visible = true;
                this.maxLvTxt.visible = false;
            }

            this.showStar(this._showIds[this._modelShowIndex]);

            if (Math.floor(star / 10) > Math.floor(this._startLv / 10) && (star % 10) == 1) {
                this.searchFirstShowModel();
                if (this._isCanOpen) {
                    // WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._showIds[this._modelShowIndex], 6]);                    
                }
                this._startLv = star;
            }
            this._isCanOpen = true;
            this.isShowHuoQu();
        }

        // 筛选能够升级Skill
        private filterOneSkillItem():MagicPetUpgradeItem{
            for (let i: int = 0, len = this._upgradeItems.length; i < len; i++) {
                if (this._upgradeItems.length > i) {
                    let skillItem:MagicPetUpgradeItem = this._upgradeItems[i];
                    if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                        return skillItem;
                    }
                }
            }
            return null;
        }

        private searchFirstShowModel(): void {

            let showStars: number[] = PetRankCfg.instance.showStars;
            let maxShowIndex: number = 0;

            for (let i: int = 0, len: int = showStars.length; i < len; i++) {
                if (this._upgradeStar <= showStars[i]) {
                    maxShowIndex = i ? i - 1 : 0;
                    break;
                } else if (this._upgradeStar == showStars[len - 1]) {
                    maxShowIndex = len - 1;
                } else {
                    maxShowIndex = len - 1;
                }
            }
            let showId: number = this._showIds[maxShowIndex];
            this.nextBtn.gray = false;
            this.nextBtn.mouseEnabled = true;
            for (let i: int = 0, len: int = this._showIds.length; i < len; i++) {
                if (showId == this._showIds[i]) {
                    this._modelShowIndex = i;
                    this.nextBtn.visible = i < this._showIds.length - 1;
                    this.lastBtn.visible = i > 0;
                    break;
                }
            }
            this.selectShowModel(showId, maxShowIndex);
            this.showStar(this._showIds[this._modelShowIndex]);
        }

        private selectShowModel(showId: number, maxShowIndex: number): void {
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            this._skeletonClip.reset(showId);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.8);

            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.DAIJI);
            // this._modelClip.reset(showId);
            // this._modelClip.setActionType(ActionType.SHOW, 0);
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] ? modelCfg[ExteriorSKFields.scale] : 1;
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            this.petNameTxt.text = `${this._nameStr[maxShowIndex]}阶·${modelCfg[ExteriorSKFields.name]}`;
        }

        // 设置属性加成列表
        private setAttrs(cfg: petRank, nextCfg: petRank) {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                petRankFields.attrs
            );

            // let tY: number = 756;
            // for (let i: int = 0, len: int = t; i < len; i++) {
            //     this._nameTxts[i].y = this._valueTxts[i].y = this._upTxts[i].y = tY + (i / 2 >> 0) * 38;
            //     this._upImgs[i].y = this._nameTxts[i].y - 5;
            // }
            // for (let i: int = t, len: int = this._nameTxts.length; i < len; i++) {
            //     this._nameTxts[i].visible = this._valueTxts[i].visible = this._upImgs[i].visible = this._upTxts[i].visible = false;
            // }
        }

        // 更换升阶外观
        public changePetSkin(): void {
            MagicPetCtrl.instance.changePetShow(this._showIds[this._modelShowIndex]);
        }

        /**
         * 判断是否显示获取界面
         */
        public isShowHuoQu() {
            if (modules.day_pay.DayPayModel.instance.giveState == 2) {
                let openDay = modules.player.PlayerModel.instance.openDay;
                let xingNum = this._upgradeStar;
                xingNum = xingNum > 0 ? xingNum - 1 : xingNum;
                let xingJi: number = Math.floor(xingNum / 10) + 1;
                let shuju = modules.main.tipDateCtrl.instance.getDateByPartAndLevel(2, xingJi);
                if (shuju) {
                    let bollll = modules.day_pay.DayPayModel.instance.getStateBydangCi(shuju[2] - 1);
                    if (openDay == shuju[1]) {
                        if (bollll) {
                            if (!this._HuoQuItemItem) {
                                this._HuoQuItemItem = new modules.main.HuoQuItemItem();
                                this.addChild(this._HuoQuItemItem);
                                this._HuoQuItemItem.pos(96, 885);
                                this._HuoQuItemItem.visible = true;
                                this._HuoQuItemItem.setOpenParam(shuju);
                            } else {
                                this._HuoQuItemItem.setOpenParam(shuju);
                            }
                            return;
                        }
                    }
                }
                if (this._HuoQuItemItem) {
                    this._HuoQuItemItem.visible = false;
                }
            }
        }

        private creatEffect(): void {
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(360, 480);

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
        }
    }
}