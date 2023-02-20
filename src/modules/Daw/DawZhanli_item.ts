
/** 战力分红子项*/

namespace modules.daw {
    export class DawZhanLiItem extends ui.DawZhanLiItemUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();

        }
        public onOpened(): void {
            super.onOpened();

        }
        protected setData(value: any): void {
            super.setData(value);
            let s = this;
            console.log("value", value)
            s.rankpowr.text = "" + value.powr
            s.txtTag.text = value.tag
            s.rankname.text = value.name


        }
        private sureBtnHandler() {

        }
        private gotoBtnHandler() {
            //跳转面板或场景

        }
        private createEffect() {

        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}