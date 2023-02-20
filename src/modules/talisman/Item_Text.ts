namespace modules.talisman {
    export class ItemText extends ui.TalismanTextItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: any): void {
            super.setData(value);
            this.nowName.text = value[0];
            this.nextName.text = value[1];
            this.nextName.color = value[2];
        }
    }
}