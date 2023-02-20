/** 姻缘 刻印*/



namespace modules.marry {

    import MarryEngravingAlertUI = ui.MarryEngravingAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;

    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class MarryEngravingAlert extends MarryEngravingAlertUI {


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
        }
   
        protected removeListeners(): void {
            super.removeListeners();


        }



        public setOpenParam(value): void {
            super.setOpenParam(value);


        }
        onOpened(): void {
            super.onOpened();

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}