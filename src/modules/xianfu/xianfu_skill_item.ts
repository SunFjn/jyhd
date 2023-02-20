///<reference path="../config/xianfu_skill_cfg.ts"/>
/** 仙府-家园技能item */
namespace modules.xianfu {
    import SkillIconUI = ui.SkillIconUI;
    import xianfu_skill = Configuration.xianfu_skill;
    import XianfuSkillCfg = modules.config.XianfuSkillCfg;
    import xianfu_skillFields = Configuration.xianfu_skillFields;
    import CustomClip = modules.common.CustomClip;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;

    export class XianfuSkillItem extends SkillIconUI {

        private _eff: CustomClip;
        private _id: number;

        public addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, common.LayaEvent.CLICK, this, this.handler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.update);
        }

        public set info(skillId: number) {
            this._id = skillId;
            this.update();
        }

        private update(): void {
            let skillLv: number = this._id % 100 >> 0;
            let skillCfg: skill = SkillCfg.instance.getCfgById(this._id);
            let icon: string = skillCfg[skillFields.icon];
            this.iconImg.skin = `assets/icon/skill/${icon}.png`;
            let xianfuLv: number = XianfuModel.instance.lv;
            let nextCfg: xianfu_skill = XianfuSkillCfg.instance.getCfgBySkillId(this._id + 1);
            let skillNeedLv: number = nextCfg ? nextCfg[xianfu_skillFields.level] : null;
            this.levTxt.text = skillLv.toString();
            this.iconImg.gray = skillLv == 0;
            this.levBox.visible = !this.iconImg.gray;
            if (nextCfg && xianfuLv >= skillNeedLv) { //可激活或升级
                if (!skillLv) { //可激活
                    this.stateImg.skin = `common/txt_xq_kjh.png`;
                    this.state = true;
                } else {
                    if (nextCfg) {//可升级
                        this.stateImg.skin = `common/txt_xq_ksj.png`;
                        this.state = true;
                    } else {
                        this.state = false;
                    }
                }
            } else {
                this.state = false;
            }
        }

        private set state(b: boolean) {
            if (b) {
                if (!this._eff) {
                    this._eff = CommonUtil.creatEff(this, `activityEnter`, 15);
                    this._eff.scale(1.2, 1.2, true);
                    this._eff.pos(-9, -9, true);
                    this._eff.visible = true;
                }
                this._eff.play();
                this.stateImg.visible = this._eff.visible = this.dotImg.visible = true;
            } else {
                if (this._eff) {
                    this._eff.visible = false;
                    this._eff.stop();
                }
                this.stateImg.visible = this.dotImg.visible = false;
            }
        }

        private handler(): void {
            WindowManager.instance.open(WindowEnum.XIANFU_SKILL_ALERT, this._id);
        }

        public destroy(): void {
            this._eff = this.destroyElement(this._eff);
            super.destroy();
        }
    }
}