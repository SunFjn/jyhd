/** 获取到红包*/
namespace modules.redpack {
    import LayaEvent = modules.common.LayaEvent;
    import RedpackGetTipsAlertUI = ui.RedpackGetTipsAlertUI;
    import CustomClip = modules.common.CustomClip;

    export class RedpackGetTipsAlert extends RedpackGetTipsAlertUI {
        private _btnClip: CustomClip;
        /** 1等级分红 2等级红包 3超级红包  */
        private _type: number;

        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();
            this._btnClip = CommonUtil.creatEff(this.btn_enter, `btn_light`, 15);
            this._btnClip.pos(-11, -18);
            this._btnClip.scale(1.27, 1.27);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn_enter, LayaEvent.CLICK, this, this.enterView);
            this.addAutoListener(this.btn_notshow, LayaEvent.CLICK, this, this.notShow);
        }

        /**
         * 不显示红包
         */
        private notShow() {
            RedPackModel.instance.showGetedTipsAlert = false;
            this.close();
        }

        /**
         * 根据可获取状态进入指定界面
         */
        private enterView() {
            switch (this._type) {
                case 1:
                    WindowManager.instance.open(WindowEnum.REDPACK_LEVEL_BONUS_PANEL);
                    break;
                case 2:
                    WindowManager.instance.open(WindowEnum.REDPACK_LEVEL_PANEL);
                    break;
                case 3:
                    WindowManager.instance.open(WindowEnum.SUPRER_REDPACK_PANEL);
                    break;
                default:
                    modules.notice.SystemNoticeManager.instance.addNotice("打开红包界面参数异常!" + this._type, true);
                    break;
            }
            this.close();
        }

        setOpenParam(type: any) {
            // type:   1等级分红 2等级红包 3超级红包 
            this._type = type;
        }

        onOpened(): void {
            super.onOpened();
            CustomClip.thisPlay(this._btnClip);

        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public destroy(): void {
            super.destroy();
            this._btnClip = this.destroyElement(this._btnClip);
        }
    }
}