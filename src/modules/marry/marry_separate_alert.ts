/** 姻缘 分离*/


namespace modules.marry {

    import MarrySeparateAlertUI = ui.MarrySeparateAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import MarryMemberFields = Protocols.MarryMemberFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import blend = Configuration.blend;
    export class MarrySeparateAlert extends MarrySeparateAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();


        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.openTips);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.sendSeparate);
        }
        private openTips() {
            CommonUtil.alertHelp(70003)
        }

        protected removeListeners(): void {
            super.removeListeners();


        }

        private sendSeparate() {

            MarryCtrl.instance.MarryDissolution();
            this.close()

        }

        public setOpenParam(value): void {
            super.setOpenParam(value);


        }
        onOpened(): void {
            super.onOpened();

            if (!MarryModel.instance.intimacyer[MarryMemberFields.isPublisher]) {
                this.descTxt.text = "您是结缘者，可无条件解除关系";
            } else {
                let cfg: blend = BlendCfg.instance.getCfgById(70115);
                this.descTxt.text = cfg[blendFields.stringParam][0]
            }


        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}