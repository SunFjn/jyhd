/////<reference path="../$.ts"/>
/** 仙府-家园技能详情弹框 */
namespace modules.xianfu {
    import MagicPetFeedSkillAlertUI = ui.MagicPetFeedSkillAlertUI;
    import CustomClip = modules.common.CustomClip;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import xianfu_skill = Configuration.xianfu_skill;
    import XianfuSkillCfg = modules.config.XianfuSkillCfg;
    import xianfu_skillFields = Configuration.xianfu_skillFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;

    export class XianfuSkillAlert extends MagicPetFeedSkillAlertUI {

        private _eff: CustomClip;
        private _id: number;

        protected initialize(): void {
            super.initialize();

            this.titleTxt.text = `家园技能`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_SKILL_UPDATE, this, this.updateId);
        }

        private btnHandler(): void {
            XianfuModel.instance.selectSkill = this._id;
            XianfuCtrl.instance.promoteXianFuSkill(this._id);
        }

        public setOpenParam(id: number): void {
            super.setOpenParam(id);

            this._id = id;
        }

        public onOpened(): void {
            super.onOpened();

            this.updateId();
            this.updateView();
        }

        private updateId(): void {
            let list: number[] = XianfuModel.instance.skillList;
            if (!list) return;
            for (let id of list) {
                let pureId: number = CommonUtil.getSkillPureIdById(id);
                let tempId: number = CommonUtil.getSkillPureIdById(this._id);
                if (pureId == tempId) {
                    this._id = id;
                    this.updateView();
                    break;
                }
            }
        }

        private updateView(): void {
            let skillLv: number = this._id % 100 >> 0;
            let skillCfg: skill = SkillCfg.instance.getCfgById(this._id);
            let nextSkillCfg: skill = SkillCfg.instance.getCfgById(this._id + 1);
            let icon: string = skillCfg[skillFields.icon];
            this.iconImg.skin = `assets/icon/skill/${icon}.png`;
            let name: string = skillCfg[skillFields.name];
            this.nameTxt.text = `${name}  Lv.${skillLv}`;
            let fight: number = skillCfg[skillFields.fight];
            this.powerTxt.text = `战力：${skillLv === 0 ? 0 : fight}`;

            let nextCfg: xianfu_skill = XianfuSkillCfg.instance.getCfgBySkillId(this._id + 1);
            let needLv: number = nextCfg ? nextCfg[xianfu_skillFields.level] : null;
            let xianfuLv: number = XianfuModel.instance.lv;

            if (nextCfg && xianfuLv >= needLv) {
                if (!skillLv) { //可激活
                    this.btn.visible = true;
                    this.btn.label = "激活";
                    this.playEff();
                    this.curLvDesc.text = "无";
                    this.nextLvDesc.text = nextSkillCfg[skillFields.des];
                    this.conditionTxt.visible = false;
                } else {
                    this.curLvDesc.text = skillCfg[skillFields.des];
                    if (nextCfg) {//可升级
                        this.btn.visible = true;
                        this.btn.label = "升级";
                        this.conditionTxt.visible = false;
                        this.playEff();
                        this.nextLvDesc.text = nextSkillCfg[skillFields.des];
                    } else {
                        this.fullLv();
                    }
                }
            } else { //不可升级
                this.curLvDesc.text = skillCfg[skillFields.des];
                if (nextCfg) {
                    this.btn.gray = true;
                    this.btn.mouseEnabled = false;
                    this.conditionTxt.text = `激活条件：家园达到 Lv.${needLv}`;
                    this.conditionTxt.color = "#ff3e3e";
                    this.conditionTxt.visible = true;
                    this.stopEff();
                    this.nextLvDesc.text = nextSkillCfg[skillFields.des];
                } else {
                    this.fullLv();
                }
            }
        }

        private fullLv(): void {
            this.btn.visible = false;
            this.conditionTxt.text = `已满级`;
            this.conditionTxt.color = "#168a17";
            this.conditionTxt.visible = true;
            this.nextLvDesc.text = "已达最大等级";
            this.stopEff();
        }

        private playEff(): void {
            if (!this._eff) {
                this._eff = CommonUtil.creatEff(this.btn, 'btn_light', 15);
                this._eff.pos(-5, -20);
                this._eff.scale(1,1.3)
            }
            this._eff.play();
            this._eff.visible = true;
            this.btn.gray = false;
            this.btn.mouseEnabled = true;
        }

        private stopEff(): void {
            if (this._eff) {
                this._eff.play();
                this._eff.visible = false;
            }
        }

        public destroy(): void {
            this._eff = this.destroyElement(this._eff);
            super.destroy();
        }
    }
}