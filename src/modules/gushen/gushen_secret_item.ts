/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import GushenTabUI = ui.GushenTabUI;
    import gushen = Configuration.gushen;

    export class GuShenSecretItem extends GushenTabUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            // this.addAutoListener();
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();

            this._updateView();
        }

        public setDataSource(value: gushen, index: int): void {
            if (value == null) {
                this.iconImg.skin = "";
                this.titleText.text = "";
                this.iconImg.skin = `common/dt_tongyong_0.png`;
            } else {

            }
        }

        public setData(value: any): void {

        }

        private _updateView(): void {

        }

        public setTopItem(): void {
            //this.titleText=
        }

        public close(): void {
            super.close();
        }
    }
}