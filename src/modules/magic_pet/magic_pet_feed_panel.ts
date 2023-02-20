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
///<reference path="../common/func_btn_group.ts"/>

/**
 *  宠物面板*/
namespace modules.magicPet {
    import petFeed = Configuration.petFeed;
    import petFeedFields = Configuration.petFeedFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import BaseItem = modules.bag.BaseItem;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import PetFeedFields = Protocols.PetFeedFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import WindowEnum = ui.WindowEnum;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import PetRankCfg = modules.config.PetRankCfg;
    import PetFeedCfg = modules.config.PetFeedCfg;
    import SkillItem = modules.immortals.SkillItem;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import IllusionModel = modules.illusion.IllusionModel;
    import MagicPetFeedViewUI = ui.MagicPetFeedViewUI;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import FeedSkillType = ui.FeedSkillType;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class MagicPetFeedPanel extends MagicPetFeedViewUI {

        // 按钮组
        private _btnGroup: FuncBtnGroup;
        //按钮特效
        private btnClip: CustomClip;

        // 培养材料
        private _feedItem: BaseItem;
        private _feedNumDiff: number;
        // 培养等级
        private _feedLv: int;
        // 培养经验
        private _feedExp: int;
        // 培养最大经验
        private _feedMaxExp: number;
        // 波浪进度
        private _wavePro: number;

        private _nameTxts: Array<Text>;
        private _valueTxts: Array<Text>;
        private _upImgs: Array<Image>;
        private _upTxts: Array<Text>;

        private _waveClip: CustomClip;

        // private _showModelClip: AvatarClip;//展示的模型
        private _showId: number;
        private _showIds: number[];

        private _tween: TweenJS;
        private _skeletonClip: SkeletonAvatar;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this.btnClip = this.destroyElement(this.btnClip);
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._feedItem = this.destroyElement(this._feedItem);
            this._nameTxts = this.destroyElement(this._nameTxts);
            this._valueTxts = this.destroyElement(this._valueTxts);
            this._upImgs = this.destroyElement(this._upImgs);
            this._upTxts = this.destroyElement(this._upTxts);
            this._waveClip = this.destroyElement(this._waveClip);
            // this._showModelClip = this.destroyElement(this._showModelClip);
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.petFeed, ActionOpenId.petRank, ActionOpenId.petMagicShow, ActionOpenId.petRefine, ActionOpenId.petFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);
          
            this.centerY = 0;
            this.centerX = 0;

            this._feedNumDiff = 0;
            this._showId = -1;
            this._showIds = PetRankCfg.instance.showIds;

            this._feedItem = new BaseItem();
            this.addChild(this._feedItem);
            this._feedItem.scale(0.8, 0.8, true);
            this._feedItem.pos(155, 984, true);

            this._nameTxts = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._valueTxts = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._upImgs = [this.attrUpImg1, this.attrUpImg2, this.attrUpImg3, this.attrUpImg4, this.attrUpImg5, this.attrUpImg6];
            this._upTxts = [this.attrUpTxt1, this.attrUpTxt2, this.attrUpTxt3, this.attrUpTxt4, this.attrUpTxt5, this.attrUpTxt6];

            this.creatEffect();

            this.regGuideSpr(GuideSpriteId.MGAIC_PET_FEED_ONE_KEY_BTN, this.onekeyBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_FEED_BTN, this.cultureBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_PET_FAZHEN_BTN, this.methodArrayBtn);

        }

        // 添加按钮回调
        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.tipsBtn, common.LayaEvent.CLICK, this, this.tipsHandler);
            this.addAutoListener(this.onekeyBtn, common.LayaEvent.CLICK, this, this.onekeyBtnHandler);
            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeMagicPetHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_PET_INITED, this, this.initPanel);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);

            this.addAutoRegisteRedPoint(this.cultureRP, ["petFeedSkillRP", "petFeedMatRP"]);
            this.addAutoRegisteRedPoint(this.advancedRP, ["petRankSkillRP", "petRankMatRP"]);
            this.addAutoRegisteRedPoint(this.practiceRP, ["petRefineMaterialRP"]);
            this.addAutoRegisteRedPoint(this.methodArrayRP, ["magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP"]);
            this.addAutoRegisteRedPoint(this.hhDotImg, ["petIllusionRP"]);
        }

        // 初始化宠物面板
        private initPanel(): void {
            if (this._btnGroup.selectedIndex == -1) return;
            this.updateCulturePanel();
        }

        // 更新宠物信息
        private updatePetInfo(): void {
            if (this._btnGroup.selectedIndex == -1) return;
            this.updateCulturePanel();
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

            this.btnClip.play();
            this._waveClip.play();
            this._feedLv = -1;
            this._feedExp = -1;
            this._btnGroup.selectedIndex = 0;
        }

        public close(): void {
            if (this._tween) {
                this._tween.stop();
            }
            super.close();
        }

        // 切换宠物标签:培养/进阶/修炼
        private changeMagicPetHandler(): void {

            if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_RANK_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.PET_ILLUSION_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 3) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_REFINE_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 4) {
                WindowManager.instance.open(WindowEnum.MAGIC_PET_FAZHEN_PANEL);
                return;
            }
            this.updateCulturePanel();
        }

        // 打开幻化界面
        private illusionHandler(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.petMagicShow)) {
                WindowManager.instance.open(WindowEnum.PET_ILLUSION_PANEL);
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.petMagicShow), true);
            }
        }
        // 宠物界面Tips
        private tipsHandler(): void {
            CommonUtil.alertHelp(20001);
        }

        // 一键培养
        private onekeyBtnHandler(): void {
            if (this._feedNumDiff >= 0) {
                MagicPetCtrl.instance.feedPet();
            } else {
                BagUtil.openLackPropAlert(this._feedItem.itemData[ItemFields.ItemId], -this._feedNumDiff);
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

        // 更新培养面板
        private updateCulturePanel(): void {

            this._showId = IllusionModel.instance.magicShowId ? IllusionModel.instance.magicShowId : this._showIds[0];
            this.onekeyBtn.visible = true;

            let exp: number = MagicPetModel.instance._curExp;
            let lv: number = MagicPetModel.instance._curLv;

            let cfg: petFeed = PetFeedCfg.instance.getPetFeedCfgByLv(lv);
            let nextCfg: petFeed = PetFeedCfg.instance.getPetFeedCfgByLv(lv + 1);
            let maxExp: number = cfg[PetFeedFields.exp];
            this._feedMaxExp = maxExp;

            this._skeletonClip.reset(this._showId);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.8);

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
                    this._tween = TweenJS.create(this).to({ wavePro: exp / maxExp }, (1 - exp / maxExp) * 500).onComplete((): void => {
                    }).start();
                }
            }

            // this.feedNumTxt.text = `${exp}/${maxExp}`;
            this.levelClip.text = lv.toString();

            this._feedLv = lv;
            this._feedExp = exp;
            this._waveClip.y = (1 - exp / maxExp) * 125;

            // 设置属性加成
            this.setAttrs(cfg, nextCfg);

            // 更新消耗道具
            let itemInfo: Array<number> = cfg[petFeedFields.items];
            let item: Protocols.Item = [itemInfo[0], 0, 0, null];
            this._feedItem.dataSource = item;
            let count = BagModel.instance.getItemCountById(itemInfo[0]);
            //消耗道具 颜色判定修改
            let colorStr = "#ff7462";
            if (count < itemInfo[1]) {
                this._feedItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            } else {
                colorStr = "#ffffff";
                this._feedItem.setNum(`${count}/${itemInfo[1]}`, colorStr);
            }

            this._feedNumDiff = count - itemInfo[1];
            let needExp: number = cfg[petFeedFields.exp] - exp;
            let needCount: number = Math.ceil(needExp / itemInfo[2]);
            this.btnClip.visible = BagModel.instance.getItemCountById(itemInfo[0]) >= needCount;

            this.powerNum.value = MagicPetModel.instance.feed[PetFeedFields.fighting].toString();

            let nextSkillCfg: petFeed = PetFeedCfg.instance.getNextSkillCfgByLv(lv);
            if (nextSkillCfg) {
                this.needLvTxt.text = `${nextSkillCfg[petFeedFields.level] - lv}级`;
                let name: string = config.SkillCfg.instance.getCfgById(nextSkillCfg[petFeedFields.skill][0])[Configuration.skillFields.name];
                let nextSkillLv: number = nextSkillCfg[petFeedFields.skill][1];
                this.skillNameTxt.text = `【${name}】${nextSkillLv}级`;
                CommonUtil.chainArr([this.desTxt_0, this.needLvTxt, this.desTxt_1, this.skillNameTxt], 5);
            } else {
                this.tipBox.visible = false;
            }

            // 设置技能
            let skillPureIds: Array<number> = PetFeedCfg.instance.skillIds;
            let skillItems: Array<SkillItem> = [this.skill0, this.skill1, this.skill2];
            let skillInfos: Array<SkillInfo> = MagicPetModel.instance.feedSkills;
            for (let i: int = 0, len = skillPureIds.length; i < len; i++) {
                if (skillItems.length > i) {
                    skillItems[i].skillId = skillInfos.length > i && skillInfos[i][SkillInfoFields.level] > 0 ?
                        skillInfos[i][SkillInfoFields.skillId] : CommonUtil.getSkillIdByPureIdAndLv(skillPureIds[i], 1);
                    skillItems[i].skillInfo = skillInfos.length > i ? skillInfos[i] : null;
                    skillItems[i].type = FeedSkillType.magicPet;
                    skillItems[i].stopUpgradeCallBack = ()=>{
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                     };
                }
            }

            if (!nextCfg) {       // 已满级
                this.expBg.visible = this.expFg.visible = this.con.visible = this.feedNumTxt.visible = this.expTxt.visible = false;
                this._feedItem.visible = this.onekeyBtn.visible = false;
                this.feedMaxLvTxt.visible = true;
            } else {
                this.expBg.visible = this.expFg.visible = this.con.visible = this.feedNumTxt.visible = this.expTxt.visible = true;
                this._feedItem.visible = this.onekeyBtn.visible = true;
                this.feedMaxLvTxt.visible = false;
            }
        }

        // 筛选能够升级Skill
        private filterOneSkillItem():SkillItem{
            let skillItems: Array<SkillItem> = [this.skill0, this.skill1, this.skill2];
            for (let i: int = 0, len = skillItems.length; i < len; i++) {
                if (skillItems.length > i) {
                    let skillItem:SkillItem = skillItems[i];
                    if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                        return skillItem;
                    }
                }
            }
            return null;
        }

        // 设置属性加成列表
        private setAttrs(cfg: petFeed, nextCfg: petFeed) {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameTxts,
                this._valueTxts,
                this._upImgs,
                this._upTxts,
                petFeedFields.attrs
            );
        }

        private creatEffect(): void {
            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this.addChildAt(this._skeletonClip, 3);
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
            this.con.scale(0.72, 0.72)
            this._waveClip.skin = "assets/effect/wave.atlas";
            this._waveClip.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png", "wave/5.png", "wave/6.png", "wave/7.png"];
            this._waveClip.durationFrame = 5;
            this._waveClip.play();
            this._waveClip.pos(0, 125, true);

        }
    }
}