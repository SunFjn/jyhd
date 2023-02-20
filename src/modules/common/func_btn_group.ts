/** 按钮组，只有一个被选中*/



namespace modules.common {

    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class FuncBtnGroup extends BtnGroup {

        //按钮组携带的功能ID
        private _funcId: number[];

        constructor() {
            super();

            this._funcId = [];
        }

        public setFuncIds(...ids: number[]): void {
            this._funcId = ids;
        }

        protected btnClickHandler(i: int): void {

            if (this._funcId.length) {
                let funcId: number = this._funcId[i];
                if (funcId !== ActionOpenId.begin) {  // 判断功能是否开启
                    if (!FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                        SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(funcId), true);
                        return;
                    }
                }
            }
            super.btnClickHandler(i);
        }


    }
}