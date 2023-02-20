/** 姻缘 共鸣*/


namespace modules.marry {

    import MarryResonanceAlertUI = ui.MarryResonanceAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    export class MarryResonanceAlert extends MarryResonanceAlertUI {


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