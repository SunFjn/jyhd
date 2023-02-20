///<reference path="../wing/wing_model.ts"/>
///<reference path="../wing/wing_ctrl.ts"/>

namespace modules.immortals {
    import ImmortalsUpGradeAlertUI = ui.ImmortalsUpGradeAlertUI;
    import Event = Laya.Event;
    import SkillCfg = modules.config.SkillCfg;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import WingCfg = modules.config.WingCfg;
    import wing_feedFields = Configuration.wing_feedFields;
    import WingCtrl = modules.wing.WingCtrl;
    import shenbing_feed = Configuration.shenbing_feed;
    import wing_feed = Configuration.wing_feed;
    import shenbing_feedFields = Configuration.shenbing_feedFields;
    import WingModel = modules.wing.WingModel;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import Dictionary = Laya.Dictionary;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;

    export class ImmortalsUpgradeAlert extends ImmortalsUpGradeAlertUI {

        private _id: int;
        private _skillInfo: SkillInfo;
        private _tLv: int;
        private _type: int;
        //按钮特效
        private btnClip: CustomClip;

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
            this.activateOrUpBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.play();
            this.btnClip.loop = true;
            this.btnClip.pos(-5, -10);
            this.btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();

            this.activateOrUpBtn.on(Event.CLICK, this, this.func);
            GlobalData.dispatcher.on(CommonEventType.SHENBING_UPDATE, this, this.updateSkillInfo);
            GlobalData.dispatcher.on(CommonEventType.WING_UPDATE, this, this.updateSkillInfo);
            GlobalData.dispatcher.on(CommonEventType.SBSHENGJI_UPDATE, this, this.showEffect);
            GlobalData.dispatcher.on(CommonEventType.XYSHENGJI_UPDATE, this, this.showEffect);
        }

        protected removeListeners(): void {
            this.activateOrUpBtn.off(Event.CLICK, this, this.func);
            GlobalData.dispatcher.off(CommonEventType.SHENBING_UPDATE, this, this.updateSkillInfo);
            GlobalData.dispatcher.off(CommonEventType.WING_UPDATE, this, this.updateSkillInfo);
            GlobalData.dispatcher.off(CommonEventType.SBSHENGJI_UPDATE, this, this.showEffect);
            GlobalData.dispatcher.off(CommonEventType.XYSHENGJI_UPDATE, this, this.showEffect);
            super.removeListeners();
        }

        private showEffect(): void {

            let dic: Dictionary = this._type == 0 ? ImmortalsModel.instance.skillList : WingModel.instance.skillList;
            for (let i: int = 0, len: int = dic.keys.length; i < len; i++) {
                if (this._id == dic.keys[i] && dic.get(this._id)[MagicShowInfoFields.star] > 1)
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                else if (this._id == dic.keys[i] && dic.get(this._id)[MagicShowInfoFields.star] == 1)
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong5.png");
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.btnClip.play();
            this._skillInfo = value[0];
            this._type = value[1];
            this._tLv = -1;
            this.updateSkill();
        }

        private updateSkillInfo(): void {

            if (!this._skillInfo) return;
            let dic: Dictionary = this._type == 0 ? ImmortalsModel.instance.skillList : WingModel.instance.skillList;

            let skillInfos: Array<SkillInfo> = new Array<SkillInfo>();
            for (let i: int = 0, len: int = dic.keys.length; i < len; i++) {
                skillInfos[i] = dic.get(dic.keys[i]);
            }
            let tPureId: int = CommonUtil.getSkillPureIdById(this._skillInfo[SkillInfoFields.skillId]);
            for (let i: int = 0, len: int = skillInfos.length; i < len; i++) {
                let pureId: int = CommonUtil.getSkillPureIdById(skillInfos[i][SkillInfoFields.skillId]);
                if (pureId === tPureId) {
                    this._skillInfo = skillInfos[i];
                    this.updateSkill();
                    break;
                }
            }
        }

        private updateSkill(): void {

            this.titleTXt.text = this._type == 0 ? "幻武技能" : "翅膀技能";
            let lv: int = this._skillInfo[SkillInfoFields.level];
            let skillId: int = this._skillInfo[SkillInfoFields.skillId];
            this._id = skillId;
            let pureId: int = CommonUtil.getSkillPureIdById(skillId);
            skillId = lv === 0 ? CommonUtil.getSkillIdByPureIdAndLv(pureId, 1) : skillId;
            let nextSkillId: int = CommonUtil.getSkillIdByPureIdAndLv(pureId, lv + 1);
            let cfg: skill = SkillCfg.instance.getCfgById(skillId);
            let nextCfg = SkillCfg.instance.getCfgById(nextSkillId);
            let lvTable: Table<shenbing_feed | wing_feed>;
            lvTable = this._type == 0 ? ImmortalsCfg.instance.getShengjiLvTableBySkillId(pureId) : WingCfg.instance.getShengjiLvTableBySkillId(pureId);
            this.iconImg.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png`;
            this.nameTxt.text = `${cfg[skillFields.name]}  Lv.${lv}`;
            this.powerTxt.text = `战力：${lv === 0 ? 0 : lvTable[lv][this._type === 0 ? shenbing_feedFields.skill : wing_feedFields.skill][2]}`;
            this.conditionTxt.visible = true;
            this.activateOrUpBtn.visible = true;
            if (lv === 0) {       // 未激活
                this.curLvDesc.text = "无";
                this.activateOrUpBtn.label = "激活";
                this.conditionTxt.text = this._type == 0 ? `激活条件：幻武等级 Lv.${ImmortalsCfg.instance.getActLevBySkillId(skillId)}` : `激活条件：翅膀等级 Lv.${lvTable[1][wing_feedFields.level]}`;
                this.conditionTxt.color = "#ED1100";
                this.nextLvDesc.text = nextCfg[skillFields.des];
            } else {
                this.curLvDesc.text = cfg[skillFields.des];
                this.activateOrUpBtn.label = "升级";
                if (!lvTable[lv + 1]) {         // 没有下一级代表已满级
                    this.activateOrUpBtn.visible = false;
                    this.conditionTxt.text = `已满级`;
                    this.conditionTxt.color = "#00AD35";
                    this.nextLvDesc.text = "已达最大等级";
                } else {
                    this.conditionTxt.text = this._type == 0 ? `升级条件：幻武等级 Lv.${ImmortalsCfg.instance.getUpLevBySkillIdAndSkillLev(skillId)}` : `升级条件：翅膀等级 Lv.${lvTable[lv + 1][wing_feedFields.level]}`;
                    this.conditionTxt.color = "#ED1100";
                    this.nextLvDesc.text = nextCfg[skillFields.des];
                }

                if (lv === 1 && this._tLv === 0) {   // 从0到1代表激活
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong5.png");
                } else if (lv !== this._tLv && this._tLv !== -1) {     // 升级
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
                }
            }
            /* this._tLv = lv;
             // 下一级
           /* skillId = CommonUtil.getSkillIdByPureIdAndLv(pureId, lv + 1);
              cfg = SkillCfg.instance.getCfgByTypeAndId(skillId);
           /* if (!cfg) {           // 没有下一级
                  this.nextLvDesc.text = "已达最大等级";
                  this.conditionTxt.visible = false;
              } else {
                  this.nextLvDesc.text = cfg[skillFields.des];
              }*/

            if (this._skillInfo[SkillInfoFields.point] > 0) {
                this.activateOrUpBtn.mouseEnabled = this.btnClip.visible = true;
                this.conditionTxt.visible = this.activateOrUpBtn.gray = false;
            } else {
                this.activateOrUpBtn.mouseEnabled = this.btnClip.visible = false;
                this.conditionTxt.visible = this.activateOrUpBtn.gray = true;
            }
        }

        private func(): void {
            if (this._type == 0)
                ImmortalsCtrl.instance.skillLev([this._id]);
            else
                WingCtrl.instance.skillLev([this._id]);
        }
    }
}