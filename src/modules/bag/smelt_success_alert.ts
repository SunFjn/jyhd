/**获取物品弹窗 */


namespace modules.bag {
    import SmeltSuccessAlertUI = ui.SmeltSuccessAlertUI;
    import Item = Protocols.Item;
    import GuideModel = modules.guide.GuideModel;

    export class SmeltSuccessAlert extends SmeltSuccessAlertUI {
        private _propItem: Array<BaseItem>;
        private _posY: number = 166;
        private _posX3: number = 290;
        private _posX1: number = 155;
        private _interX: number = 125;
        private _posX2: number = 225;
        private _fourY: number = 178;
        private _posX4: number = 162;
        private _moreY: number = 134;
        private _inter: number = 90;

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();
            GuideModel.instance.registeUI(GuideSpriteId.BAG_SMELT_SUCCESS_ALERT_CLOSE_BTN, this.closeBtn);
        }

        protected removeListeners(): void {
            super.removeListeners();
            GuideModel.instance.removeUI(GuideSpriteId.BAG_SMELT_SUCCESS_ALERT_CLOSE_BTN);
        }

        public setOpenParam(value: any): void {
            if (!value) {
                return;
            }
            this._propItem = new Array<BaseItem>();
            let showNum = value[0] as Array<Item>;
            this.titleTxt.text = value[1] as string;
            let len = showNum.length;
            let x = 0;
            let scale = 0;
            let interX = 0;
            let interY = 0;
            let y = 0;
            if (len <= 3) {
                this.smeltShowTxt.visible = true;
                this.borderImg.visible = true;
                if (len == 1) {
                    x = this._posX3;
                } else if (len == 2) {
                    x = this._posX2;
                } else {
                    x = this._posX1;
                }
                scale = 1;
                y = this._posY;
                interX = this._interX;
            } else {
                this.smeltShowTxt.visible = false;
                this.borderImg.visible = false;
                scale = 0.8;
                x = this._posX4;
                interX = this._inter;
                interY = this._inter;
                if (len == 4) {
                    y = this._fourY;
                } else {
                    y = this._moreY;
                }
            }
            for (let i = 0; i < len; i++) {
                this._propItem[i] = new BaseItem();
                this.addChild(this._propItem[i]);
                let endx = x + (i % 4) * interX;
                let endY = y + Math.floor(i / 4) * interY;
                this._propItem[i].pos(endx, endY);
                this._propItem[i].scale(scale, scale);
                this._propItem[i].dataSource = showNum[i];
            }
        }

        public onClosed(): void {
            super.onClosed();
            if (this._propItem) {
                for (let i = 0; i < this._propItem.length; i++) {
                    this.removeChild(this._propItem[i]);
                }
            }
        }

        public destroy(): void {
            this._propItem = this.destroyElement(this._propItem);
            super.destroy();
        }
    }
}