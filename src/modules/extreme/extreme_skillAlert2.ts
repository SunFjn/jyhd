/** 至尊技能 唯我独尊 弹框*/


namespace modules.extreme {

    import ExtremeGradeAlertUI = ui.ExtremeGradeAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    export class ExtremeGradeAlert extends ExtremeGradeAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.instructionsHTML1.style.fontFamily = "SimHei";
            this.instructionsHTML1.style.align = "left";
            this.instructionsHTML1.style.fontSize = 20;
            this.instructionsHTML1.innerHTML = "无"
            this.instructionsHTML1.width = 420
            this.instructionsHTML1.color = "#1F974C"

            this.instructionsHTML2.style.fontFamily = "SimHei";
            this.instructionsHTML2.style.align = "left";
            this.instructionsHTML2.style.fontSize = 20;
            this.instructionsHTML2.innerHTML = "无"
            this.instructionsHTML2.width = 420
            this.instructionsHTML2.color = "#60412C"
        }

        protected addListeners(): void {
            super.addListeners();


            // PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
        }

        protected removeListeners(): void {
            super.removeListeners();


        }




        public setOpenParam(value): void {
            super.setOpenParam(value);
            let skillLevel = value[0]
            let nextSkillId = value[1]
            let skillId = nextSkillId - 1

            let cfg: skill = SkillCfg.instance.getCfgById(skillId)
            let nextcfg: skill = SkillCfg.instance.getCfgById(nextSkillId)
            if (skillLevel > 0) {
                this.powerTxt.text = "战力：" + cfg[skillFields.fight];
            } else {
                this.powerTxt.text = "战力：" + 0;
            }


            if (cfg) this.instructionsHTML1.innerHTML = cfg[skillFields.des]

            if (nextcfg) this.instructionsHTML2.innerHTML = nextcfg[skillFields.des]

            this.titleTXt.text = !cfg ? nextcfg[skillFields.name] : cfg[skillFields.name]
            if(skillLevel>=20){
                this.titleTXt.text=nextcfg[skillFields.name]
                this.instructionsHTML2.innerHTML="无"
            }

            let lev = extremeModel.instance.getKingSkill();
            // 升级条件：至尊装备所有部位达到2阶
            this.desTxt.text = lev != -1 ? `升级条件：至尊装备所有部位达到${lev}阶` : ``
        }
        onOpened(): void {
            super.onOpened();

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}