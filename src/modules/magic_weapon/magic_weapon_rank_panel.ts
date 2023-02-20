///<reference path="../magic_pet/magic_pet_upgrade_item.ts"/>
///<reference path="../config/ride_feed_cfg.ts"/>
///<reference path="../config/ride_rank_cfg.ts"/>
///<reference path="../config/ride_refine_cfg.ts"/>
/** 精灵面板*/
namespace modules.magicWeapon {
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import BaseItem = modules.bag.BaseItem;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import MagicPetUpgradeItem = modules.magicPet.MagicPetUpgradeItem;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import BagModel = modules.bag.BagModel;
    import SkillInfo = Protocols.SkillInfo;
    import CommonUtil = modules.common.CommonUtil;
    import PetRank = Protocols.PetRank;
    import PetRankFields = Protocols.PetRankFields;
    import rideRank = Configuration.rideRank;
    import RideRankCfg = modules.config.RideRankCfg;
    import rideRankFields = Configuration.rideRankFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagUtil = modules.bag.BagUtil;
    import ItemFields = Protocols.ItemFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import IllusionModel = modules.illusion.IllusionModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import MagicWeaponRankViewUI = ui.MagicWeaponRankViewUI;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import BtnGroup = modules.common.BtnGroup;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import MagicPetRankViewUI = ui.MagicPetRankViewUI;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import petRankFields = Configuration.petRankFields;

    export class MagicWeaponRankPanel extends MagicPetRankViewUI {
        // 培养、进阶、修炼按钮组
        private _btnGroup: FuncBtnGroup;
        private _HuoQuItemItem: modules.main.HuoQuItemItem;
        //按钮特效 
        private btnClip: CustomClip;
        // 星级
        private _startLv: number;

        // 精灵进阶祝福值进度条
        private _rankProCtrl: ProgressBarCtrl;
        // 材料物品格子
        private _materialItem: BaseItem;
        private _countDiff: number;

        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;
        private _stars: Array<Image>;

        // 进阶技能单元项
        private _upgradeItems: Array<MagicPetUpgradeItem>;

        // 进阶等级
        private _upgradeStar: int;

        private _showId: number;
        private _showIds: number[];
        private _modelShowIndex: number;
        private _nameStr: string;
        private _isCanOpen: boolean;
        private itemArr: Protocols.Item;
        private _tween: TweenJS;
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

            this.centerY = 0;
            this.centerX = 0;

            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.rideFeed, ActionOpenId.rideRank, ActionOpenId.rideMagicShow, ActionOpenId.rideRefine, ActionOpenId.rideFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);
           

            this._rankProCtrl = new ProgressBarCtrl(this.progressBar, 482, this.progressTxt);
            this._startLv = 0;
            this._isCanOpen = false;

            this._materialItem = new BaseItem();
            this.addChild(this._materialItem);
            this._materialItem.scale(0.8, 0.8, true);
            this._materialItem.pos(320, 930, true);

            this._nameTxts = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._valueTxts = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._upImgs = [this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5, this.attrUpImg6];
            this._upTxts = [this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5, this.attrUpTxt6];
            this._stars = [this.starImg1, this.starImg2, this.starImg3, this.starImg4, this.starImg5,
            this.starImg6, this.starImg7, this.starImg8, this.starImg9, this.starImg10];

            this._showId = -1;
            this._showIds = RideRankCfg.instance.showIds;
            this._modelShowIndex = 0;
            this._nameStr = "一二三四五六七八九十";
            this.creatEffect();

            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_RANK_ONE_KEY_BTN, this.onekeyBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_FAZHEN_BTN, this.methodArrayBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updateRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_PAY_UPDATE, this, this.isShowHuoQu);
            this._btnGroup.on(Event.CHANGE, this, this.changeMenuHandler);
            this.onekeyBtn.on(Event.CLICK, this, this.onekeyHandler);
            this.switchBtn.on(Event.CLICK, this, this.changePetSkin);
            this.tipsBtn.on(Event.CLICK, this, this.tipsHandler);

            this.nextBtn.on(Event.CLICK, this, this.selectSkin, [1]);
            this.lastBtn.on(Event.CLICK, this, this.selectSkin, [0]);

            this.addAutoListener(this.ziDongBtn, Event.CLICK, this, this.ziDongBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_WEAPON_ZIDONG, this, this.showZiDongBtn);
            RedPointCtrl.instance.registeRedPoint(this.cultureRP, ["weaponFeedSkillRP", "weaponFeedMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.advancedRP, ["weaponRankSkillRP", "weaponRankMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.practiceRP, ["weaponRefineMaterialRP"]);
            RedPointCtrl.instance.registeRedPoint(this.methodArrayRP, ["weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]);

            RedPointCtrl.instance.registeRedPoint(this.hhDotImg, ["weaponIllusionRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();

            GlobalData.dispatcher.off(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updateRank);

            this._btnGroup.off(Event.CHANGE, this, this.changeMenuHandler);
            this.onekeyBtn.off(Event.CLICK, this, this.onekeyHandler);
            this.switchBtn.off(Event.CLICK, this, this.changePetSkin);
            this.tipsBtn.off(Event.CLICK, this, this.tipsHandler);

            this.nextBtn.off(Event.CLICK, this, this.selectSkin);
            this.lastBtn.off(Event.CLICK, this, this.selectSkin);

            RedPointCtrl.instance.retireRedPoint(this.cultureRP);
            RedPointCtrl.instance.retireRedPoint(this.advancedRP);
            RedPointCtrl.instance.retireRedPoint(this.practiceRP);
            RedPointCtrl.instance.retireRedPoint(this.methodArrayRP);
            RedPointCtrl.instance.retireRedPoint(this.hhDotImg);
        }

        private selectSkin(bool: int): void {

            let showStars: number[] = RideRankCfg.instance.showStars;
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
                if (showId != 4001) {
                    this.switchBtn.visible = false;
                }

            } else {
                this.setStarLv(this._upgradeStar);
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this.cultureBtn.label = "强化"
            this.advancedBtn.label = "进化"
            this.practiceBtn.label = "附魔"
            this.methodArrayBtn.label = "精灵造物"
            MagicPetModel.instance.panelType = 0;
            this.btnClip.play();
            //this._magicClip.play();
            this._upgradeStar = -1;
            this._btnGroup.selectedIndex = 1;
            this.searchFirstShowModel();
            this.isShowHuoQu();
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

        private updateBag(): void {
            this.changeMenuHandler();
        }

        private changeMenuHandler(): void {

            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FEED_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.WEAPON_ILLUSION_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 3) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_REFINE_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 4) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FAZHEN_PANEL);
                return;
            }

            this.updateRank();
        }

        // 一键培养/祝福
        private onekeyHandler(): void {
            if (MagicWeaponModel.instance._bollZiDong) {
                MagicWeaponCtrl.instance.rankRide();
            }
            else {
                if (this._countDiff >= 0) {
                    MagicWeaponCtrl.instance.rankRide();            // 一键进阶
                } else {
                    BagUtil.openLackPropAlert(this._materialItem.itemData[ItemFields.ItemId], -this._countDiff);
                }
            }

        }

        // 打开幻化界面
        private illusionHandler(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.rideMagicShow)) {
                WindowManager.instance.open(WindowEnum.WEAPON_ILLUSION_PANEL);
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.rideMagicShow), true);
            }
        }

        // 更新升阶
        private updateRank(): void {

            this._showId = IllusionModel.instance.rideMagicShowId ? IllusionModel.instance.rideMagicShowId : this._showIds[0];

            // 更新星级
            let rank: PetRank = MagicWeaponModel.instance.rank;
            let star = rank[PetRankFields.star];

            // 更新进度条
            let blessing = rank[PetRankFields.blessing];
            let cfg: rideRank = RideRankCfg.instance.getPetRankCfgBySt(star);
            let nextCfg: rideRank = RideRankCfg.instance.getPetRankCfgBySt(star + 1);
            let maxBlessing = cfg[rideRankFields.blessing];

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
                this._tween = TweenJS.create(this._rankProCtrl,).to({ value: this._rankProCtrl.maxValue }, (1 - this._rankProCtrl.value / this._rankProCtrl.maxValue) * 400).onComplete((): void => {
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

            // 更新战力
            this.powerNum.value = rank[PetRankFields.fighting].toString();

            // 属性加成
            this.setAttrs(cfg, nextCfg);

            // 更新消耗道具
            let itemInfo: Array<number> = cfg[rideRankFields.items];
            let item: Protocols.Item = [itemInfo[0], 0, 0, null];
            this._materialItem.dataSource = item;
            this.itemArr = item;
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
            // 技能
            if (!this._upgradeItems) {
                this._upgradeItems = new Array<MagicPetUpgradeItem>();
                let skillIds: Array<number> = RideRankCfg.instance.skillIds;
                for (let i: int = 0, len: int = skillIds.length; i < len; i++) {
                    let skillItem: MagicPetUpgradeItem = new MagicPetUpgradeItem();
                    this._upgradeItems.push(skillItem);
                    skillItem.cfg = RideRankCfg.instance.getCfgBySkillId(skillIds[i]);
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
            let skillInfos: Array<SkillInfo> = rank[PetRankFields.skillList];
            for (let i: int = 0, len: int = this._upgradeItems.length; i < len; i++) {
                this._upgradeItems[i].skillInfo = skillInfos && skillInfos.length > i ? skillInfos[i] : null;
            }

            let isMaxLv: boolean = !nextCfg;       // 满级
            this.blessTxt.visible = this.progressBg.visible = this.progressBar.visible = this.progressTxt.visible = !isMaxLv;
            this._materialItem.visible = this.onekeyBtn.visible = !isMaxLv;
            this.maxLvTxt.visible = isMaxLv;

            this.showStar(this._showIds[this._modelShowIndex]);
            if (Math.floor(star / 10) > Math.floor(this._startLv / 10) && (star % 10) == 1) {
                this.searchFirstShowModel();
                if (this._isCanOpen) {
                    // WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [this._showIds[this._modelShowIndex], 5]);
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

            let showStars: number[] = RideRankCfg.instance.showStars;
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
            this._skeletonClip.reset(0, showId);
            this._skeletonClip.resetScale(AvatarAniBigType.weapon, 0.55);
            this._skeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW, false);

            this.petNameTxt.text = `${this._nameStr[maxShowIndex]}阶·${modelCfg[ExteriorSKFields.name]}`;
        }

        // 设置属性加成列表
        private setAttrs(cfg: rideRank, nextCfg: rideRank) {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                rideRankFields.attrs
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

        private changePetSkin(): void {
            MagicWeaponCtrl.instance.changeRideShow(this._showIds[this._modelShowIndex]);
        }

        private tipsHandler(): void {
            CommonUtil.alertHelp(20021);
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
                let shuju = modules.main.tipDateCtrl.instance.getDateByPartAndLevel(1, xingJi);
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
        //自动购买
        private ziDongBtnHandler(): void {
            if (MagicWeaponModel.instance._bollZiDong) {
                MagicWeaponModel.instance._bollZiDong = false;
                this.ziDongBtn.selected = false;
            }
            else {
                if (MagicWeaponModel.instance._bollTips) {
                    MagicWeaponModel.instance._bollZiDong = true;
                    this.ziDongBtn.selected = true;
                }
                else {
                    WindowManager.instance.openDialog(WindowEnum.MAGICWEAPON_AUTOMATICPAY_ALERT, this.itemArr);
                }
            }
        }
        public showZiDongBtn() {
            if (MagicWeaponModel.instance._bollZiDong) {
                this.ziDongBtn.selected = true;
            }
            else {
                this.ziDongBtn.selected = false;
            }
        }
        private creatEffect() {

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

            // this._magicClip = new CustomClip();
            // this._magicClip.skin = "assets/effect/magic.atlas";
            // this._magicClip.frameUrls = ["magic/0.png", "magic/1.png", "magic/2.png", "magic/3.png", "magic/4.png", "magic/5.png", "magic/6.png", "magic/7.png"];
            // this._magicClip.durationFrame = 7;
            // this._magicClip.play();
            // this._magicClip.pos(-6, -6);
            // this._magicClip.loop = true;

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.rankBox.addChildAt(this._modelClip, 2);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.y = 350;
        }

    }
}