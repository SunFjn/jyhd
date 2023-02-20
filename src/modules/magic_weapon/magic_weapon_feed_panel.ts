///<reference path="../magic_pet/magic_pet_upgrade_item.ts"/>
///<reference path="../config/ride_feed_cfg.ts"/>
///<reference path="../config/ride_rank_cfg.ts"/>
///<reference path="../config/ride_refine_cfg.ts"/>
/** 精灵面板*/
namespace modules.magicWeapon {
    import BaseItem = modules.bag.BaseItem;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import PetFeed = Protocols.PetFeed;
    import PetFeedFields = Protocols.PetFeedFields;
    import rideFeed = Configuration.rideFeed;
    import RideFeedCfg = modules.config.RideFeedCfg;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import rideFeedFields = Configuration.rideFeedFields;
    import BagModel = modules.bag.BagModel;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import CommonUtil = modules.common.CommonUtil;
    import RideRankCfg = modules.config.RideRankCfg;
    import SkillItem = modules.immortals.SkillItem;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagUtil = modules.bag.BagUtil;
    import ItemFields = Protocols.ItemFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import IllusionModel = modules.illusion.IllusionModel;
    // import MagicWeaponFeedViewUI = ui.MagicWeaponFeedViewUI;
    import MagicPetFeedViewUI = ui.MagicPetFeedViewUI;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import FeedSkillType = ui.FeedSkillType;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class MagicWeaponFeedPanel extends MagicPetFeedViewUI {
        // 培养、进阶、修炼按钮组
        private _btnGroup: FuncBtnGroup;
        //按钮特效
        private btnClip: CustomClip;

        // 材料物品格子
        private _materialItem: BaseItem;
        private _countDiff: number;

        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;

        private _waveClip: CustomClip;

        // 培养等级
        private _feedLv: int;
        // 培养经验
        private _feedExp: int;
        // 培养最大经验
        private _feedMaxExp: number;
        // 波浪进度
        private _wavePro: number;

        private _showId: number;
        private _showIds: number[];

        // private _showModelClip: AvatarClip;//展示的模型

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
            if (this._waveClip) {
                this._waveClip.removeSelf();
                this._waveClip.destroy();
                this._waveClip = null;
            }
            // if (this._showModelClip) {
            //     this._showModelClip.removeSelf();
            //     this._showModelClip.destroy();
            //     this._showModelClip = null;
            // }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
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


            this._materialItem = new BaseItem();
            this.addChild(this._materialItem);
            this._materialItem.scale(0.8, 0.8, true);
            this._materialItem.pos(155, 984, true);

            this._nameTxts = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._valueTxts = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._upImgs = [this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5, this.attrUpImg6];
            this._upTxts = [this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5, this.attrUpTxt6];

            this._showId = -1;
            this._showIds = RideRankCfg.instance.showIds;

            this.creatEffect();

            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_FAZHEN_BTN, this.methodArrayBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_FEED_ONE_KEY_BTN, this.onekeyBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updateCulture);

            this._btnGroup.on(Event.CHANGE, this, this.changeMenuHandler);
            this.onekeyBtn.on(Event.CLICK, this, this.onekeyHandler);
            this.tipsBtn.on(Event.CLICK, this, this.tipsHandler);
            // this.illusionBtn.on(Event.CLICK, this, this.illusionHandler);

            RedPointCtrl.instance.registeRedPoint(this.cultureRP, ["weaponFeedSkillRP", "weaponFeedMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.advancedRP, ["weaponRankSkillRP", "weaponRankMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.practiceRP, ["weaponRefineMaterialRP"]);
            RedPointCtrl.instance.registeRedPoint(this.methodArrayRP, ["weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.hhDotImg, ["weaponIllusionRP"]);
        }

        protected removeListeners(): void {

            GlobalData.dispatcher.off(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updateCulture);

            this._btnGroup.off(Event.CHANGE, this, this.changeMenuHandler);
            this.onekeyBtn.off(Event.CLICK, this, this.onekeyHandler);
            this.tipsBtn.off(Event.CLICK, this, this.tipsHandler);
            // this.illusionBtn.off(Event.CLICK, this, this.illusionHandler);

            RedPointCtrl.instance.retireRedPoint(this.cultureRP);
            RedPointCtrl.instance.retireRedPoint(this.advancedRP);
            RedPointCtrl.instance.retireRedPoint(this.practiceRP);
            RedPointCtrl.instance.retireRedPoint(this.methodArrayRP);
            RedPointCtrl.instance.retireRedPoint(this.hhDotImg);
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();
            this.cultureBtn.label = "强化"
            this.advancedBtn.label = "进化"
            this.practiceBtn.label = "附魔"
            this.methodArrayBtn.label = "精灵造物"
            MagicPetModel.instance.panelType = 0;

            this.btnClip.play();

            this._feedLv = -1;
            this._feedExp = -1;
            this._btnGroup.selectedIndex = 0;

            this._waveClip.play();
        }

        public close(): void {
            super.close();
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
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

        private changeMenuHandler(): void {
            if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
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
            this.updateCulture();
        }

        // 一键培养/祝福
        private onekeyHandler(): void {
            if (this._countDiff >= 0) {
                MagicWeaponCtrl.instance.feedRide();        // 一键培养
            } else {
                BagUtil.openLackPropAlert(this._materialItem.itemData[ItemFields.ItemId], -this._countDiff);
            }
        }

        // 设置波浪进度
        public get wavePro(): number {
            return this._wavePro;
        }

        public set wavePro(value: number) {
            this._wavePro = value;
            this._waveClip.y = (1 - value) * 125;
            this.feedNumTxt.text = `${Math.floor(this._feedMaxExp * value)}/${this._feedMaxExp}`;
        }

        // 更新培养
        private updateCulture(): void {

            this._showId = IllusionModel.instance.rideMagicShowId ? IllusionModel.instance.rideMagicShowId : this._showIds[0];

            let feed: PetFeed = MagicWeaponModel.instance.feed;
            let exp: number = feed[PetFeedFields.exp];
            let lv: number = feed[PetFeedFields.level];

            let cfg: rideFeed = RideFeedCfg.instance.getPetFeedCfgByLv(lv);
            let nextCfg: rideFeed = RideFeedCfg.instance.getPetFeedCfgByLv(lv + 1);
            let maxExp: number = cfg[PetFeedFields.exp];
            this._feedMaxExp = maxExp;


            this._skeletonClip.reset(0, this._showId);
            this._skeletonClip.resetScale(AvatarAniBigType.weapon, 0.55);

            if (this._feedLv === -1) {       // -1代表刚打开面板，不用缓动
                this.wavePro = exp / maxExp;
            } else {
                if (lv > this._feedLv) {      // 跨级先缓动至满，再设置为当前值
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                    this._tween && this._tween.stop();
                    this._tween = TweenJS.create(this).to({ wavePro: 1 }, this._waveClip.y / 125 * 500).onComplete((): void => {
                        this.wavePro = 0;
                        this._tween = TweenJS.create(this).to({ wavePro: exp / maxExp }, (1 - exp / maxExp) * 500).start();
                    }).start();
                } else if (exp > this._feedExp) {      // 同级缓动至当前值
                    this._tween && this._tween.stop();
                    this._tween = TweenJS.create(this).to({ wavePro: exp / maxExp }, (1 - exp / maxExp) * 500).start();
                }
            }

            // this.feedNumTxt.text = `${exp}/${maxExp}`;
            this.levelClip.text = lv.toString();

            this._feedLv = lv;
            this._feedExp = exp;
            this._waveClip.y = (1 - exp / maxExp) * 125;

            // 设置属性加成
            this.setAttrs(cfg, nextCfg);
            // comm

            // 更新消耗道具
            let itemInfo: Array<number> = cfg[rideFeedFields.items];
            let item: Protocols.Item = [itemInfo[0], 0, 0, null];
            this._materialItem.dataSource = item;
            let count = BagModel.instance.getItemCountById(itemInfo[0]);
            this._countDiff = count - itemInfo[1];
            //消耗道具 颜色判定修改
            let colorStr = "#ff7462";
            if (count < itemInfo[1]) {
                this._materialItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this._materialItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            }
            let needExp: number = cfg[rideFeedFields.exp] - exp;
            let needCount: number = Math.ceil(needExp / itemInfo[2]);
            this.btnClip.visible = BagModel.instance.getItemCountById(itemInfo[0]) >= needCount;

            // 更新战力
            this.powerNum.value = feed[PetFeedFields.fighting].toString();

            let nextSkillCfg: rideFeed = RideFeedCfg.instance.getNextSkillCfgByLv(lv);
            if (nextSkillCfg) {
                this.needLvTxt.text = `${nextSkillCfg[rideFeedFields.level] - lv}级`;
                let name: string = config.SkillCfg.instance.getCfgById(nextSkillCfg[rideFeedFields.skill][0])[Configuration.skillFields.name];
                let nextSkillLv: number = nextSkillCfg[rideFeedFields.skill][1];
                this.skillNameTxt.text = `【${name}】${nextSkillLv}级`;
                CommonUtil.chainArr([this.desTxt_0, this.needLvTxt, this.desTxt_1, this.skillNameTxt], 5);
            } else {
                this.tipBox.visible = false;
            }

            // 设置技能
            let skillPureIds: Array<number> = RideFeedCfg.instance.skillIds;
            let skillItems: Array<SkillItem> = [this.skill0, this.skill1, this.skill2];
            let skillInfos: Array<SkillInfo> = feed[PetFeedFields.skillList];
            for (let i: int = 0, len = skillPureIds.length; i < len; i++) {
                if (skillItems.length > i) {
                    skillItems[i].skillId = skillInfos.length > i && skillInfos[i][SkillInfoFields.level] > 0 ?
                        skillInfos[i][SkillInfoFields.skillId] : CommonUtil.getSkillIdByPureIdAndLv(skillPureIds[i], 1);
                    skillItems[i].skillInfo = skillInfos.length > i ? skillInfos[i] : null;
                    skillItems[i].type = FeedSkillType.magicWeapon;
                    skillItems[i].stopUpgradeCallBack = () => {
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                    };
                }
            }

            let isMaxLv: boolean = !nextCfg;
            this.expBg.visible = this.expFg.visible = this.con.visible = this.feedNumTxt.visible = this.expTxt.visible = !isMaxLv;
            this._materialItem.visible = this.onekeyBtn.visible = !isMaxLv;
            this.feedMaxLvTxt.visible = isMaxLv;
        }

        // 筛选能够升级Skill
        private filterOneSkillItem(): SkillItem {
            let skillItems: Array<SkillItem> = [this.skill0, this.skill1, this.skill2];
            for (let i: int = 0, len = skillItems.length; i < len; i++) {
                if (skillItems.length > i) {
                    let skillItem: SkillItem = skillItems[i];
                    if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                        return skillItem;
                    }
                }
            }
            return null;
        }


        // 设置属性加成列表
        private setAttrs(cfg: rideFeed, nextCfg: rideFeed) {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                rideFeedFields.attrs
            );
        }

        private tipsHandler(): void {
            CommonUtil.alertHelp(20020);
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

            this._waveClip = new CustomClip();
            this.con.addChildAt(this._waveClip, 0);
            this.con.scale(0.72, 0.72);
            this._waveClip.skin = "assets/effect/wave.atlas";
            this._waveClip.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png", "wave/5.png", "wave/6.png", "wave/7.png"];
            this._waveClip.durationFrame = 5;
            this._waveClip.play();
            this._waveClip.pos(0, 124, true);

        }

    }
}