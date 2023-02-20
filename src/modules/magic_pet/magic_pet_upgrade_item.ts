/** 宠物进阶技能单元项*/
namespace modules.magicPet {
    import CustomClip = modules.common.CustomClip;
    import petRank = Configuration.petRank;
    import petRankFields = Configuration.petRankFields;
    import skillFields = Configuration.skillFields;
    import Event = Laya.Event;
    import SkillCfg = modules.config.SkillCfg;
    import SkillInfo = Protocols.SkillInfo;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import MagicPetUpgradeItemUI = ui.MagicPetUpgradeItemUI;

    export class MagicPetUpgradeItem extends MagicPetUpgradeItemUI {
        private _skillInfo: SkillInfo;
        private _skillId: number;
        private _eff: CustomClip;
        private _stopUpgradeCallBack: Function = null;//不能升级响应

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        public close(): void {
            if (this._eff) {
                this._eff.stop();
            }
            super.close();
        }

        public destroy(): void {
            if (this._eff) {
                this._eff.destroy(true);
                this._eff = null;
            }
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();
            this.on(Event.CLICK, this, this.clickHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.off(Event.CLICK, this, this.clickHandler);
        }

        public clickHandler(): void {
            if (WindowManager.instance.isOpened(WindowEnum.MAGIC_PET_UPGRADE_SKILL_ALERT)) {
                WindowManager.instance.close(WindowEnum.MAGIC_PET_UPGRADE_SKILL_ALERT);
            }
            WindowManager.instance.openDialog(WindowEnum.MAGIC_PET_UPGRADE_SKILL_ALERT, [this._skillInfo || [this._skillId, 0, 0],this._stopUpgradeCallBack]);
        }

        public set cfg(value: petRank) {
            this._skillId = value[petRankFields.skill][0];
            this.iconImg.skin = `assets/icon/skill/${SkillCfg.instance.getCfgById(this._skillId)[skillFields.icon]}.png`;
        }

        public set skillInfo(value: SkillInfo) {
            this._skillInfo = value;
            if (!value) {         // 不可激活（可激活和已激活状态服务器都会发）
                this.iconImg.gray = true;
                this.stateImg.visible = this.tipsImg.visible = false;
                if (this._eff) {
                    this._eff.visible = false;
                    this._eff.stop();
                }
            } else {
                this.iconImg.gray = this._skillInfo[SkillInfoFields.level] === 0;

                if (value[SkillInfoFields.point] > 0) { //可升级
                    if (!this._eff) {
                        this._eff = modules.common.CommonUtil.creatEff(this, `activityEnter`, 15);
                        this._eff.visible = true;
                        this._eff.scale(1.2, 1.2, true);
                        this._eff.pos(-9, -9, true);
                    }
                    this._eff.play();
                    this.stateImg.visible = this._eff.visible = this.tipsImg.visible = true;
                    if (this._skillInfo[SkillInfoFields.level] === 0) { //一级
                        this.stateImg.skin = `common/txt_xq_kjh.png`;
                    } else {
                        this.stateImg.skin = `common/txt_xq_ksj.png`;
                    }
                } else {
                    if (this._eff) {
                        this._eff.visible = false;
                        this._eff.stop();
                    }
                    this.stateImg.visible = this.tipsImg.visible = false;
                }
            }
        }
        public get skillInfo():SkillInfo{
            return this._skillInfo;
         }
    
         public set stopUpgradeCallBack(value: Function) {
             this._stopUpgradeCallBack = value;
         }
    }
}