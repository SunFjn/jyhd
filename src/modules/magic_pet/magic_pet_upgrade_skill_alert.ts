///<reference path="../config/ride_rank_cfg.ts"/>

/** 宠物进阶技能弹框*/
namespace modules.magicPet {
    import petRank = Configuration.petRank;
    import petRankFields = Configuration.petRankFields;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import Event = Laya.Event;
    import SkillCfg = modules.config.SkillCfg;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import MagicPetUpgradeSkillAlertUI = ui.MagicPetUpgradeSkillAlertUI;
    import CommonUtil = modules.common.CommonUtil;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import PetRankCfg = modules.config.PetRankCfg;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;
    import rideRank = Configuration.rideRank;
    import RideRankCfg = modules.config.RideRankCfg;
    import rideRankFields = Configuration.rideRankFields;
    import MagicWeaponCtrl = modules.magicWeapon.MagicWeaponCtrl;
    import PetRankFields = Protocols.PetRankFields;
    import CustomClip = modules.common.CustomClip;

    export class MagicPetUpgradeSkillAlert extends MagicPetUpgradeSkillAlertUI {

        private _skillInfo: SkillInfo;
        private btnClip: CustomClip;
        private stopUpgradeCallBack:Function = null;//不能升级响应

        constructor() {
            super();
        }

        public destroy(): void {
            if (this.btnClip) {
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this.btnClip = new CustomClip();
            this.activeBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.play();
            this.btnClip.loop = true;
            this.btnClip.pos(-5, -19);
            this.btnClip.scale(1, 1.3);
            this.btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.activeBtn.on(Event.CLICK, this, this.activeHandler);

            GlobalData.dispatcher.on(CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo);
            GlobalData.dispatcher.on(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updatePetInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.activeBtn.on(Event.CLICK, this, this.activeHandler);

            GlobalData.dispatcher.off(CommonEventType.MAGIC_PET_UPDATE, this, this.updatePetInfo);
            GlobalData.dispatcher.off(CommonEventType.MAGIC_WEAPON_UPDATE, this, this.updatePetInfo);
        }

        private activeHandler(): void {
            let panelType: int = MagicPetModel.instance.panelType;
            if (panelType === 0) {
                MagicWeaponCtrl.instance.addRideSkillLevel(this._skillInfo[SkillInfoFields.skillId], 2);
            } else {
                MagicPetCtrl.instance.skillUp(this._skillInfo[SkillInfoFields.skillId], 2);
            }
        }

        private updatePetInfo(): void {
            if (!this._skillInfo) return;
            let panelType: int = MagicPetModel.instance.panelType;
            let skillInfos: Array<SkillInfo> = panelType === 0 ? MagicWeaponModel.instance.rank[PetRankFields.skillList] : MagicPetModel.instance.upgradeSkills;
            let tPureId: int = CommonUtil.getSkillPureIdById(this._skillInfo[SkillInfoFields.skillId]);
            for (let i: int = 0, len: int = skillInfos.length; i < len; i++) {
                let pureId: int = CommonUtil.getSkillPureIdById(skillInfos[i][SkillInfoFields.skillId]);
                if (pureId === tPureId) {
                    // 进阶技能只有一级，不相等即代表激活（激活时播放特效，关闭面板）
                    if (skillInfos[i][SkillInfoFields.level] > this._skillInfo[SkillInfoFields.level]) {
                        SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong5.png");
                        this.close();
                    }
                    break;
                }
            }

            if (this._skillInfo[SkillInfoFields.point] > 0 && this.stopUpgradeCallBack) {
                this.stopUpgradeCallBack();
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.btnClip.play();
            let panelType: int = MagicPetModel.instance.panelType;
            this._skillInfo = value[0];
            let skillId: int = this._skillInfo[SkillInfoFields.skillId];
            if (this._skillInfo[SkillInfoFields.level] === 0 && this._skillInfo[SkillInfoFields.point] === 1) {
                skillId = this._skillInfo[SkillInfoFields.skillId] + 1;
            }
            let cfg: skill = SkillCfg.instance.getCfgById(skillId);
            this.iconImg.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png`;
            this.nameTxt.text = cfg[skillFields.name];
            let upgradeCfg: petRank | rideRank;
            if (panelType === 0) {
                upgradeCfg = RideRankCfg.instance.getCfgBySkillId(skillId);
                this.titleTxt.text = "精灵进化技能";
            } else if (panelType === 1) {
                upgradeCfg = PetRankCfg.instance.getCfgBySkillId(skillId);
                this.titleTxt.text = "宠物进化技能";
            }
            this.powerTxt.text = `战力：${upgradeCfg[panelType === 0 ? rideRankFields.skill : petRankFields.skill][2]}`;
            this.descTxt.text = cfg[skillFields.des];
            this.descTxt.height = this.descTxt.textHeight;
            this.descTxt.y = 230 + (100 - this.descTxt.height >> 1);
            this.conditionTxt.visible = true;
            if (this._skillInfo[SkillInfoFields.level] > 0) {         // 已激活
                this.activeBtn.visible = false;
                this.conditionTxt.text = "已激活";
                this.conditionTxt.color = "#00AD35";
                this.height = this.bgImg.height = 416;
                this.tipTxt.y = 420;
            } else {
                this.activeBtn.visible = true;
                this.height = this.bgImg.height = 504;
                this.tipTxt.y = 498;
                let numStrs: string = "一二三四五六七八九十";
                let star: number = upgradeCfg[panelType === 0 ? rideRankFields.star : petRankFields.star];
                let grade: number = Math.ceil(star * 0.1);
                let lv: number = star % 10;
                lv = lv === 0 ? 10 : lv;
                this.conditionTxt.text = `激活条件：${panelType === 0 ? "精灵进阶" : "宠物进阶"} ${numStrs[grade - 1]}阶${numStrs[lv - 1]}星`;
                this.conditionTxt.color = "#ED1100";
            }

            if (this._skillInfo[SkillInfoFields.point] > 0) {
                this.btnClip.visible = true;
                this.activeBtn.gray = false;
                this.activeBtn.mouseEnabled = true;
                this.conditionTxt.visible = false;
            } else {
                this.btnClip.visible = false;
                this.activeBtn.gray = true;
                this.activeBtn.mouseEnabled = false;
            }

            if (value.length > 1) {
                this.stopUpgradeCallBack = value[1];
            }
        }
    }
}