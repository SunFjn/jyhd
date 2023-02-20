/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.chat {
    import PlayerInfoTxtItemUI = ui.PlayerInfoTxtItemUI;

    export class PlayerInfoTxtItem extends PlayerInfoTxtItemUI {

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

        public onOpened(): void {
            super.onOpened();

        }

        public setData(value: any): void {

            value = value as [string, number, number];
            let name: string = value[0];

            this.attTxt_0.text = `${name}激活数量:`;
            this.attTxt_1.text = `${name}总战力:`;
            this.valueTxt_0.text = value[1].toString();
            this.valueTxt_1.text = value[2].toString();
        }

        public close(): void {
            super.close();
        }
    }
}