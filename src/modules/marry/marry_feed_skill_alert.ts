///<reference path="../config/pet_feed_cfg.ts"/>
///<reference path="../magic_weapon/magic_weapon_model.ts"/>
///<reference path="../magic_weapon/magic_weapon_ctrl.ts"/>
///<reference path="../fashion/fashion_model.ts"/>
///<reference path="../config/immortals_cfg.ts"/>
///<reference path="../config/wing_cfg.ts"/>
///<reference path="../config/fashion_feed_cfg.ts"/>
///<reference path="../fashion/fashion_ctrl.ts"/>
///<reference path="../immortals/immortals_ctrl.ts"/>
///<reference path="../wing/wing_ctrl.ts"/>
///<reference path="../tian_zhu/tian_zhu_model.ts"/>
///<reference path="../config/tian_zhu_feed_cfg.ts"/>
///<reference path="../tian_zhu/tian_zhu_ctrl.ts"/>
///<reference path="../immortals/immortals_model.ts"/>
///<reference path="../wing/wing_model.ts"/>


namespace modules.marry {
    import petFeedFields = Configuration.petFeedFields;
    import skillFields = Configuration.skillFields;
    import Event = Laya.Event;
    import CommonUtil = modules.common.CommonUtil;
    import SkillCfg = modules.config.SkillCfg;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import MarryFeedSkillAlertUI = ui.MarryFeedSkillAlertUI;
    import skill = Configuration.skill;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import PetFeedCfg = modules.config.PetFeedCfg;
    import petFeed = Configuration.petFeed;
    import PetFeedFields = Protocols.PetFeedFields;
    import rideFeed = Configuration.rideFeed;
    import RideFeedCfg = modules.config.RideFeedCfg;
    import rideFeedFields = Configuration.rideFeedFields;
    import MagicWeaponCtrl = modules.magicWeapon.MagicWeaponCtrl;
    import CustomClip = modules.common.CustomClip;
    import FashionModel = modules.fashion.FashionModel;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import shenbing_feed = Configuration.shenbing_feed;
    import WingCfg = modules.config.WingCfg;
    import wing_feed = Configuration.wing_feed;
    import fashion_feed = Configuration.fashion_feed;
    import FashionFeedCfg = modules.config.FashionFeedCfg;
    import shenbing_feedFields = Configuration.shenbing_feedFields;
    import wing_feedFields = Configuration.wing_feedFields;
    import fashion_feedFields = Configuration.fashion_feedFields;
    import FeedSkillType = ui.FeedSkillType;
    import FashionCtrl = modules.fashion.FashionCtrl;
    import ImmortalsCtrl = modules.immortals.ImmortalsCtrl;
    import WingCtrl = modules.wing.WingCtrl;
    import TianZhuModel = modules.tianZhu.TianZhuModel;
    import UpdateTianZhuInfoFields = Protocols.UpdateTianZhuInfoFields;
    import tianzhu_feed = Configuration.tianzhu_feed;
    import TianZhuFeedCfg = modules.config.TianZhuFeedCfg;
    import tianzhu_feedFields = Configuration.tianzhu_feedFields;
    import TianZhuCtrl = modules.tianZhu.TianZhuCtrl;
    import ImmortalsModel = modules.immortals.ImmortalsModel;
    import WingModel = modules.wing.WingModel;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;

    export class MarryFeedSkillAlert extends MarryFeedSkillAlertUI {

        private _skillInfo: SkillInfo;
        private _tLv: int;
        //按钮特效
        private btnClip: CustomClip;
        private _type: number;           // 0精灵，1宠物，2幻武，3翅膀，4时装，5神兽
        private stopUpgradeCallBack:Function = null;//不能升级响应

        constructor() {
            super();
        }

        public destroy(): void {
            if (this.btnClip) {
                this.btnClip.stop();
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this.btnClip = new CustomClip();
            this.btn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-9, -18);
            this.btnClip.scale(1.05,1.2)
            this.btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, Event.CLICK, this, this.activateOrUpHandler);

            // // 0精灵，1宠物，2幻武，3翅膀，4时装，5神兽 6义戒
            // if (this._type === FeedSkillType.magicWeapon) {
            //     this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updateInfo);
            // } else if (this._type === FeedSkillType.magicPet) {
            //     this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_PET_UPDATE, this, this.updateInfo);
            // } else if (this._type === FeedSkillType.immortals) {
            //     this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENBING_UPDATE, this, this.updateInfo);
            // } else if (this._type === FeedSkillType.wing) {
            //     this.addAutoListener(GlobalData.dispatcher, CommonEventType.WING_UPDATE, this, this.updateInfo);
            // } else if (this._type === FeedSkillType.fashion) {
            //     this.addAutoListener(GlobalData.dispatcher, CommonEventType.FASHION_INFO_UPDATE, this, this.updateInfo);
            // } else if (this._type === FeedSkillType.tianZhu) {
            //     this.addAutoListener(GlobalData.dispatcher, CommonEventType.TIAN_ZHU_INFO_UPDATE, this, this.updateInfo);
            // }

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_Keepsake_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_Keepsake_GRADE_UPDATE, this, this.updateInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_DOLL_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_DOLL_GRADE_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_DOLL_EAT_UPDATE, this, this.updateInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_RING_UPDATE, this, this.updateInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_INFO_UPDATE, this, this.updateInfo);


        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._tLv = -1;
            this._skillInfo = value[0];
            this._type = value[1];
            if (value.length > 2) {
                this.stopUpgradeCallBack = value[2];
            }
        }

        onOpened(): void {
            super.onOpened();

            console.log('研发测试_chy: MarryFeedSkillAlert',);
            this.updateSkillInfo();
        }

        private updateInfo(): void {
            console.log('研发测试_chy: MarryFeedSkillAlert updateInfo', this._skillInfo);
            if (!this._skillInfo) return;
            let lv: int = this._skillInfo[SkillInfoFields.level];
            let skillId: int = this._skillInfo[SkillInfoFields.skillId];
            let point: int = this._skillInfo[SkillInfoFields.point];
            let pureId: int = CommonUtil.getSkillPureIdById(skillId);
            this._skillInfo = [
                CommonUtil.getSkillIdByPureIdAndLv(pureId, MarryModel.instance.getSkillLevel(pureId)),
                MarryModel.instance.getSkillLevel(pureId),
                MarryModel.instance.getUpLevelStart(this._type, lv, CommonUtil.getSkillIdByPureIdAndLv(pureId, MarryModel.instance.getSkillLevel(pureId)))
            ]
            this.updateSkillInfo();
            // let skills: Array<SkillInfo>;
            // if (this._type === FeedSkillType.magicWeapon) {
            //     skills = MagicWeaponModel.instance.feed[PetFeedFields.skillList];
            // } else if (this._type === FeedSkillType.magicPet) {
            //     skills = MagicPetModel.instance.feedSkills;
            // } else if (this._type === FeedSkillType.immortals) {
            //     skills = ImmortalsModel.instance.feedSkills;
            // } else if (this._type === FeedSkillType.wing) {
            //     skills = WingModel.instance.feedSkills;
            // } else if (this._type === FeedSkillType.fashion) {
            //     skills = FashionModel.instance.fashionInfo[UpdateFashionInfoFields.feedSkillList];
            // } else if (this._type === FeedSkillType.tianZhu) {
            //     skills = TianZhuModel.instance.tianZhuInfo[UpdateTianZhuInfoFields.feedSkillList];
            // }
            // let tPureId: int = CommonUtil.getSkillPureIdById(this._skillInfo[SkillInfoFields.skillId]);
            // for (let i: int = 0, len: int = skills.length; i < len; i++) {
            //     let pureId: int = CommonUtil.getSkillPureIdById(skills[i][SkillInfoFields.skillId]);
            //     if (pureId === tPureId) {
            //         this._skillInfo = skills[i];
            //         this.updateSkillInfo();
            //         break;
            //     }
            // }
            if (this._skillInfo[SkillInfoFields.point] == 0 && this.stopUpgradeCallBack) {
                this.stopUpgradeCallBack();
            }
        }


        private updateSkillInfo(): void {
            let lv: int = this._skillInfo[SkillInfoFields.level];
            let skillId: int = this._skillInfo[SkillInfoFields.skillId];
            let point: int = this._skillInfo[SkillInfoFields.point];
            let pureId: int = CommonUtil.getSkillPureIdById(skillId);
            skillId = lv === 0 ? CommonUtil.getSkillIdByPureIdAndLv(pureId, 1) : skillId;
            let cfg: skill = SkillCfg.instance.getCfgById(skillId);
            this.iconImg.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png`;
            this.nameTxt.text = `${cfg[skillFields.name]}  Lv.${lv}`;
            //let lvTable: Table<petFeed | rideFeed | shenbing_feed | wing_feed | fashion_feed | tianzhu_feed>;
            let title: string;
            let skillIndex: number;
            let levelIndex: number;
            let str: string;
            let str2: string;
            let power: number
            let isUp: boolean = false
            let isScience = false;//是否消耗材料
            let upCfg;
            if (this._type === FeedSkillType.yiJie) {
                title = "戒指技能";
                power = SkillCfg.instance.getCfgById(skillId)[skillFields.fight];
                str = "戒指等级";
                if (lv == 0) {
                    isScience = false;
                    str2 = MarryRingCfg.instance.getSkillOpen(pureId) + "";
                    isUp = MarryModel.instance.getRingLevel() >= MarryRingCfg.instance.getSkillOpen(pureId)
                } else {
                    isScience = true;
                    console.log('研发测试_chy:pureId', pureId, lv);
                    let item = MarryRingCfg.instance.getSkillCfg(pureId, lv);

                    if (!MarryRingCfg.instance.getSkillCfg(pureId, lv + 1)) {
                        str2 = "已满级"
                    } else {
                        console.log('研发测试_chy:item', item);
                        if (item.length) {
                            str2 = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) + "/" + item[ItemsFields.count];
                            this.conditionImg.skin = CommonUtil.getIconById(item[ItemsFields.itemId], false)
                            isUp = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) >= item[ItemsFields.count]
                        }
                    }


                }

                //消耗材料
                //lvTable = RideFeedCfg.instance.getLvTableBySkillId(pureId);
                // skillIndex = rideFeedFields.skill;
                // levelIndex = rideFeedFields.level;

            } else if (this._type === FeedSkillType.yiJieEx) {
                title = "戒指技能";
                power = SkillCfg.instance.getCfgById(skillId)[skillFields.fight];
                //消耗材料 和 戒指
                isScience = true;
                let item = MarryRingCfg.instance.getSkillCfg(pureId, lv);
                // str2 = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) + "/" + item[ItemsFields.count];
                // this.conditionImg.skin = CommonUtil.getIconById(item[ItemsFields.itemId], false)

                if (!MarryRingCfg.instance.getSkillCfg(pureId, lv + 1)) {
                    str2 = "已满级"
                } else {

                    console.log('研发测试_chy:item', item);
                    str2 = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) + "/" + item[ItemsFields.count];
                    this.conditionImg.skin = CommonUtil.getIconById(item[ItemsFields.itemId], false)
                    isUp = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) >= item[ItemsFields.count]
                    if (lv == 0 && point > 0) {
                        isUp = true
                        isScience = false
                    } else if (lv == 0) {
                        isScience = false
                        isUp = false
                        str2 = null
                    }

                }




            } else if (this._type === FeedSkillType.XinWuUp) {
                title = "宝匣进阶技能";
                power = SkillCfg.instance.getCfgById(skillId)[skillFields.fight];
                //消耗材料
                if (lv == 0) {
                    isScience = false;
                    let item = MarryKeepsakeCfg.instance.getSkillOpen(pureId)
                    let itemCfg = CommonUtil.getItemCfgById(item[0]);
                    str = itemCfg[item_materialFields.name].toString();
                    str2 = item[1] + "";
                    isUp = MarryModel.instance.getKeepsakeLevel2(item[0]) >= item[1]
                } else {
                    isScience = true;
                    let item = MarryKeepsakeCfg.instance.getSkillCfg(pureId, lv);
                    if (!MarryKeepsakeCfg.instance.getSkillCfg(pureId, lv + 1)) {
                        str2 = "已满级"
                    } else {
                        str2 = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) + "/" + item[ItemsFields.count];
                        this.conditionImg.skin = CommonUtil.getIconById(item[ItemsFields.itemId], false)
                        isUp = MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) >= item[ItemsFields.count]
                    }


                }
            } else if (this._type === FeedSkillType.doll) {
                title = "仙娃技能";
                str = "仙龄等级";
                power = SkillCfg.instance.getCfgById(skillId)[skillFields.fight];
                let levelCfg = MarryDollCfg.instance.getSkillCfg(pureId)
                if (lv == 0) {

                    str2 = levelCfg[1][1] + "";
                    isUp = MarryModel.instance.getDollLevel(levelCfg[1][0]) >= levelCfg[1][1]

                } else if (!levelCfg[lv + 1]) {

                    str2 = "已满级"

                } else {

                    str2 = levelCfg[lv + 1][1] + "";
                    isUp = MarryModel.instance.getDollLevel(levelCfg[lv + 1][0]) >= levelCfg[lv + 1][1]
                }


                //lvTable = WingCfg.instance.getShengjiLvTableBySkillId(pureId);
                // skillIndex = wing_feedFields.skill;
                // levelIndex = wing_feedFields.level;

            } else if (this._type === FeedSkillType.dollUp) {
                title = "仙娃进阶技能";
                power = SkillCfg.instance.getCfgById(skillId)[skillFields.fight];
                str = "进阶等级";
                let levelCfg = MarryDollCfg.instance.getSkillCfg(pureId)
                if (lv == 0) {

                    str2 = levelCfg[1][2] + "";
                    isUp = MarryModel.instance.getDollClassLevel(levelCfg[1][0]) >= levelCfg[1][2]

                } else if (!levelCfg[lv + 1]) {

                    str2 = "已满级"

                } else {

                    str2 = levelCfg[lv + 1][2] + "";
                    isUp = MarryModel.instance.getDollClassLevel(levelCfg[lv + 1][0]) >= levelCfg[lv + 1][2]
                    console.log('研发测试_chy:仙娃进阶技能', MarryModel.instance.getDollClassLevel(levelCfg[lv + 1][0]), levelCfg[lv + 1][2], levelCfg[lv + 1]);
                }

            }
            // else if (this._type === FeedSkillType.tianZhu) {
            //     title = "神兽技能";
            //     //lvTable = TianZhuFeedCfg.instance.getLvTableBySkillId(pureId);
            //     // skillIndex = tianzhu_feedFields.skill;
            //     // levelIndex = tianzhu_feedFields.level;
            //     str = "神兽等级";
            // }
            this.titleTxt.text = title;
            if (lv <= 0) power = 0;
            this.powerTxt.text = `战力：${power}`;
            this.btn.visible = this.conditionTxt.visible = true;

            skillId = CommonUtil.getSkillIdByPureIdAndLv(pureId, lv + 1);
            let tempCfg = SkillCfg.instance.getCfgById(skillId);
            if (!tempCfg) {           // 没有下一级
                //this.conditionTxt.visible = false;
            } else {
                this.nextLvDesc.text = tempCfg[skillFields.des];
            }
            this.conditionTxt2.text = str2
            this.conditionTxt.visible = true
            if (isScience) {
                this.imgBox.visible = true;
                this.textBox.visible = false;
            } else {
                this.imgBox.visible = false;
                this.textBox.visible = true;
                if (str2 == null) this.textBox.visible = false;
            }

            if (str2 == undefined) {
                this.imgBox.visible = false;
            }

            if (lv === 0) {       // 未激活
                this.curLvDesc.text = "无";
                this.btn.label = "激活";
                this.conditionTxt.text = `激活条件：${str} Lv.${str2}`;

                this.conditionTxt.color = "#ED1100";

            } else {
                this.curLvDesc.text = cfg[skillFields.des];
                this.btn.label = "升级";

                if (str2 == "已满级") {         // 没有下一级代表已满级
                    this.btn.visible = false;
                    this.conditionTxt.text = `已满级`;
                    this.conditionTxt.color = "#00AD35";
                    this.nextLvDesc.text = "已达最大等级";
                    this.imgBox.visible = false;
                    this.textBox.visible = true;
                } else {
                    this.conditionTxt.text = `升级条件：${str} Lv.${str2}`;
                    this.conditionTxt.color = "#ED1100";
                }

                // if (lv === 1 && this._tLv === 0) {   // 从0到1代表激活
                //     SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong5.png");
                // } else if (lv !== this._tLv && this._tLv !== -1) {     // 升级
                //     SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                // }
            }
            // this._tLv = lv;
            this.conditionTxt2.color = isUp ? "#00AD35" : "#ED1100"
            if (isUp) {
                this.btnClip.visible = true;
                this.btnClip.play();
                this.btn.gray = false;
                this.btn.mouseEnabled = true;
                this.conditionTxt.visible = false
            } else {
                this.btnClip.visible = false;
                this.btnClip.stop();
                this.btn.gray = true;
                this.btn.mouseEnabled = false;
            }
            this._isUp = isUp;
        }
        private _isUp: boolean = false;
        private activateOrUpHandler() {
            let lv: int = this._skillInfo[SkillInfoFields.level];
            let skillId: int = this._skillInfo[SkillInfoFields.skillId];
            let pureId: int = CommonUtil.getSkillPureIdById(skillId);
            if (this._type === FeedSkillType.yiJie) {
                MarryCtrl.instance.AddMarryRingFeedSkillLevel(skillId)
            } else if (this._type === FeedSkillType.yiJieEx) {
                let item = MarryRingCfg.instance.getSkillCfg(pureId, lv);

                if (lv != 0 && MarryModel.instance.getItemCountById(item[ItemsFields.itemId]) <= 0) {
                    WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [item[ItemsFields.itemId], 0, true]);
                } else {
                    MarryCtrl.instance.AddMarryRingFeedSkillLevel(skillId)
                }


            } else if (this._type === FeedSkillType.XinWuUp) {
                MarryCtrl.instance.AddMarryKeepsakeGradeSkillLevel(skillId)
            } else if (this._type === FeedSkillType.doll) {
                MarryCtrl.instance.AddMarryDollFeedSkillLevel(skillId)
            }
            else if (this._type === FeedSkillType.dollUp) {
                MarryCtrl.instance.AddMarryDollGradeSkillLevel(skillId)
            }

            // this.close();
            // if (this._skillInfo[SkillInfoFields.point] > 0) {
            //     let skillId: number = this._skillInfo[SkillInfoFields.skillId];
            //     if (this._type === FeedSkillType.magicWeapon) {        //精灵
            //         MagicWeaponCtrl.instance.addRideSkillLevel(skillId, 1);
            //     } else if (this._type === FeedSkillType.magicPet) {  // 宠物
            //         MagicPetCtrl.instance.skillUp(skillId, 1);
            //     } else if (this._type === FeedSkillType.immortals) {       // 幻武
            //         ImmortalsCtrl.instance.skillLev([skillId]);
            //     } else if (this._type === FeedSkillType.wing) {            // 翅膀
            //         WingCtrl.instance.skillLev([skillId]);
            //     } else if (this._type === FeedSkillType.fashion) {         // 时装
            //         FashionCtrl.instance.addFashionSkillLevel(skillId);
            //     } else if (this._type === FeedSkillType.tianZhu) {         // 神兽
            //         TianZhuCtrl.instance.addTianZhuSkillLevel(skillId);
            //     }
            // }


        }
    }
}