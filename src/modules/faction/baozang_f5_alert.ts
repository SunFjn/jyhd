/////<reference path="../$.ts"/>
/** 宝藏刷新弹框 */
namespace modules.faction {
    import FactionCtrl = modules.faction.FactionCtrl;
    import BaozangF5AlertUI = ui.BaozangF5AlertUI;

    export class BaozangF5Alert extends BaozangF5AlertUI {

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.sureBtn, common.LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.backBtn, common.LayaEvent.CLICK, this, this.close);
            this.addAutoListener(this.flagBtn, common.LayaEvent.CLICK, this, this.flagBtnHandler);
        }

        private flagBtnHandler(): void {
            this.flagBtn.selected = !this.flagBtn.selected;
            FactionModel.instance.isTipF5Alert = !this.flagBtn.selected;
        }

        private sureBtnHandler(): void {
            FactionCtrl.instance.f5Box();
            this.close();
        }

    }
}