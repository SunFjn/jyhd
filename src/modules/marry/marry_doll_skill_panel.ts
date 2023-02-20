/** 
 * 仙娃 技能
*/


namespace modules.marry {
    import MarryDollSkillViewUI = ui.MarryDollSkillViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import LayaEvent = modules.common.LayaEvent;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import BtnGroup = modules.common.BtnGroup;

    export class MarryDollSkillPanel extends MarryDollSkillViewUI {


        constructor() {
            super();
        }
        // 按钮组
        private _btnGroup: BtnGroup;
        protected initialize(): void {
            super.initialize();
            this.titleTxt.color = "#e26139"
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.function1Btn, this.function2Btn, this.function3Btn, this.function4Btn);


        }



        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.function1Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_PANEL, null]);
            this.addAutoListener(this.function2Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Up_PANEL, null]);
            this.addAutoListener(this.function3Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Eat_PANEL, null]);
            this.addAutoListener(this.function4Btn, LayaEvent.CLICK, this, this.openPanl, [WindowEnum.MARRY_CHILDREN_Skill_PANEL, null]);
        }

        private openPanl(id: number) {
            WindowManager.instance.open(id);
        }


        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();

        }

        public close(): void {
            super.close();
        }

        protected resizeHandler(): void {
        }
    }
}