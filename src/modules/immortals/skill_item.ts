namespace modules.immortals {
    import CustomClip = modules.common.CustomClip;
    import SkillIconUI = ui.SkillIconUI;
    import SkillInfo = Protocols.SkillInfo;
    import Event = Laya.Event;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import FeedSkillType = ui.FeedSkillType;

    /** 幻武翅膀 升级技能item */
    export class SkillItem extends SkillIconUI {

        private _skillInfo: SkillInfo;
        private _skillId: number;
        private _type: FeedSkillType;
        private _eff: CustomClip;
        private _stopUpgradeCallBack: Function = null;//不能升级响应
       
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._type = -1;
        }

        public close(): void {
            if (this._eff) {
                this._eff.stop();
            }
            super.close();
        }

        public destroy(): void {
            this._eff = this.destroyElement(this._eff);
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();

            this.on(Event.CLICK, this, this.clickHandler);
        }

        protected removeListeners(): void {

            this.off(Event.CLICK, this, this.clickHandler);

            super.removeListeners();
        }

        public clickHandler(): void {
            if (this._type === -1) return;
            switch (this._type) {
                case FeedSkillType.yiJie:
                case FeedSkillType.yiJieEx:
                case FeedSkillType.XinWuUp:
                case FeedSkillType.doll:
                case FeedSkillType.dollUp:
                    if (WindowManager.instance.isOpened(WindowEnum.MARRY_FEED_SKILL_ALERT)) {
                        WindowManager.instance.close(WindowEnum.MARRY_FEED_SKILL_ALERT);
                    }
                    WindowManager.instance.openDialog(WindowEnum.MARRY_FEED_SKILL_ALERT, [this._skillInfo || [this._skillId, 0, 0], this._type,this._stopUpgradeCallBack]);
                    break;
                default:
                    if (WindowManager.instance.isOpened(WindowEnum.MAGIC_PET_FEED_SKILL_ALERT)) {
                        WindowManager.instance.close(WindowEnum.MAGIC_PET_FEED_SKILL_ALERT);
                    }
                    WindowManager.instance.openDialog(WindowEnum.MAGIC_PET_FEED_SKILL_ALERT, [this._skillInfo || [this._skillId, 0, 0], this._type,this._stopUpgradeCallBack]);
                    break;
            }

        }

        // 培养技能类型(不同功能对应不同类型，弹框数据不同)
        public set type(type: FeedSkillType) {
            this._type = type;
        }

        public set skillId(value: number) {
            this._skillId = value;
            let skillCfg: skill = SkillCfg.instance.getCfgById(value);
            this.iconImg.skin = `assets/icon/skill/${skillCfg[skillFields.icon]}.png`;
        }

        public set skillInfo(value: SkillInfo) {
            this._skillInfo = value;

            if (!value) {                     // 不可激活（可激活和已激活状态服务器都会发）
                this.iconImg.gray = true;
                this.stateImg.visible = this.dotImg.visible = this.levBox.visible = false;
                if (this._eff) {
                    this._eff.visible = false;
                    this._eff.stop();
                }
            } else {
                let lv: int = value[SkillInfoFields.level];
                this.levTxt.text = value[SkillInfoFields.level].toString();
                this.iconImg.gray = lv == 0;
                this.levBox.visible = !this.iconImg.gray;
                if (value[SkillInfoFields.point] > 0) {//可升级
                    if (!this._eff) {
                        this._eff = CommonUtil.creatEff(this, `activityEnter`, 15);
                        this._eff.scale(1.2, 1.2, true);
                        this._eff.pos(-9, -9, true);
                        this._eff.visible = true;
                    }
                    this._eff.play();
                    this.stateImg.visible = this._eff.visible = this.dotImg.visible = true;
                    if (lv === 0) { //一级
                        this.stateImg.skin = `common/txt_xq_kjh.png`;
                    } else {
                        this.stateImg.skin = `common/txt_xq_ksj.png`;
                    }
                } else {
                    if (this._eff) {
                        this._eff.visible = false;
                        this._eff.stop();
                    }
                    this.stateImg.visible = this.dotImg.visible = false;
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