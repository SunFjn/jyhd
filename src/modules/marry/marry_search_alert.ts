/** 姻缘 搜索*/

///<reference path="../config/blend_cfg.ts"/>


namespace modules.marry {

    import MarrySearchAlertUI = ui.MarrySearchAlertUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class MarrySearchAlert extends MarrySearchAlertUI {


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
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.sendSearch);
        }


        private sendSearch() {
            if (this.nameTxt.text.length == 0) {
                modules.notice.SystemNoticeManager.instance.addNotice("不能为空", true);
                return;
            }
            let name = this.nameTxt.text
            MarryCtrl.instance.GetMarryWallList(name);
            this.nameTxt.text = "";
            this.close();
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