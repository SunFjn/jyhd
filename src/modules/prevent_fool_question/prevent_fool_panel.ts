

namespace modules.prevent_fool_question{
    import PreventFoolView=ui.PreventFoolViewUI;
    import LayaEvent = modules.common.LayaEvent;
    export class PreventFoolPanel extends PreventFoolView  {

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this.completeTxt.visible=false;
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn,LayaEvent.CLICK, this, this.handler);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.PREVENTFOOL_UPDATE,this,this.judegeComplete);
        }

        protected onOpened(): void {
            this.judegeComplete();
            super.onOpened();

        }
        private handler():void{
            WindowManager.instance.open(WindowEnum.PREVENT_FOOL_ALERT);
        }
        private judegeComplete():void{
            if(PreventFoolModel.instance.completeQuestion()) {
                this.btn.visible = this.tipTxt.visible = this.countTxt.visible = this.yuanbao.visible = false;
                this.completeTxt.visible = true;
            }
        }
    }
}