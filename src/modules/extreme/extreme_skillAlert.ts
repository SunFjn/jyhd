/** 至尊技能弹框*/


namespace modules.extreme {

    import ExtremeUpGradeAlertUI = ui.ExtremeUpGradeAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import CustomClip = modules.common.CustomClip;
    export class ExtremeUpGradeAlert extends ExtremeUpGradeAlertUI {

        private _btnClip: CustomClip;
        public destroy(destroyChild: boolean = true): void {
            super.destroy();
            this._btnClip = this.destroyElement(this._btnClip);
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.createBtnClip()

        }

        protected addListeners(): void {
            super.addListeners();
            this.activateOrUpBtn.on(Event.CLICK, this, this.activateOrUp);
            // PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.activateOrUpBtn.off(Event.CLICK, this, this.activateOrUp);


        }

        private createBtnClip() {
            this._btnClip = new CustomClip();
            this.activateOrUpBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png",
                "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.scaleY = 1.3;
            this._btnClip.scaleX = 1.2;
            this._btnClip.visible = false;
            this._btnClip.pos(-2, -20, true);
        }
        private activateOrUp() {
            ExtremeCtrl.instance.AddZhizhunSkillLevel(this.skilltype, this.skillId)
            // WindowManager.instance.close(WindowEnum.LuxuryEquip_ZhiZun_UPGRADE_ALERT)
            // 刷新
            this.setOpenParam(this.openParam);
        }

        private skillId: number = 0
        private skilltype: number = 0
        public setOpenParam(value): void {
            super.setOpenParam(value);
            let skillId = value[0][0]
            let skillLevel = value[0][1]
            let type = value[1]


            let skillinfo = ExtremeCfg.instance.getSkillUp(skillId, skillLevel + 1, type)
            let cfg: skill = SkillCfg.instance.getCfgById(skillId)
            let nextcfg: skill = SkillCfg.instance.getCfgById(skillId + 1)
            this.conditionTxt.text = ""

            if (!cfg && nextcfg) {
                this.nameTxt.text = nextcfg[skillFields.name]
                this.iconImg.skin = `assets/icon/skill/${nextcfg[skillFields.icon]}.png` // 技能外观
                this.powerTxt.text = `战力：${nextcfg[skillFields.fight]}`
                this.curLvDesc.text = "无"
                this.nextLvDesc.text = nextcfg[skillFields.des]
                this.activateOrUpBtn.label = "激活"
                this.activateOrUpBtn.disabled = false
            } else if (cfg && nextcfg) {
                this.nameTxt.text = cfg[skillFields.name]
                this.iconImg.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png` // 技能外观
                this.powerTxt.text = `战力：${cfg[skillFields.fight]}`
                this.curLvDesc.text = cfg[skillFields.des]
                this.nextLvDesc.text = nextcfg[skillFields.des]
                this.activateOrUpBtn.label = "升级"
                this.activateOrUpBtn.disabled = false
            } else if (cfg && !nextcfg) {
                this.nameTxt.text = cfg[skillFields.name]
                this.iconImg.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png` // 技能外观
                this.powerTxt.text = `战力：${cfg[skillFields.fight]}`
                this.curLvDesc.text = cfg[skillFields.des]
                this.nextLvDesc.text = "无"
                this.activateOrUpBtn.label = "满级"
                this.activateOrUpBtn.disabled = true
            } else {
                this.nameTxt.text = "未配置"
                this.iconImg.skin = `` // 技能外观
                this.powerTxt.text = `战力：0`
                this.curLvDesc.text = "无"
                this.nextLvDesc.text = "无"
                this.activateOrUpBtn.label = "未配置"
                this.activateOrUpBtn.disabled = true
            }
            if (nextcfg) {
                if (!skillinfo) {
                    this.conditionTxt.visible = true
                    this.activateOrUpBtn.disabled = true
                    this.conditionTxt.text = `配置出错`
                    return;
                }
                if (Number(extremeModel.instance.getLevel(skillinfo[0])) >= Number(skillinfo[1])) {
                    // 可以升级
                    this.conditionTxt.visible = false
                    this._btnClip.play()
                    this._btnClip.visible = true;
                } else {
                    // 不可升级
                    this._btnClip.stop()
                    this._btnClip.visible = false;
                    this.conditionTxt.visible = true
                    this.activateOrUpBtn.disabled = true
                    let info = extremeModel.instance.getIcon(skillinfo[0])
                    this.conditionTxt.text = `升级条件：${info[1]} 达到Lv.${skillinfo[1]}`
                }
            }
            this.skillId = skillId
            this.skilltype = type

        }
        onOpened(): void {
            super.onOpened();
           
        }

        close(type?: string, showEffect?: boolean): void {
            if(this._btnClip){
                this._btnClip.stop()
                this._btnClip.visible = false;
            } 
            super.close(type, showEffect);
        }


    }
}