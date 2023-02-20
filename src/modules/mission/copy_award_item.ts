namespace modules.mission {
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = common.CustomClip;
    import Image = Laya.Image;

    export class CopyAwardItem extends BaseItem {

        private _eff: CustomClip;
        private _img: Image;

        constructor() {
            super();
        }

        public setDataSource(value: Protocols.Item): void {
            super.setDataSource(value);

            let id: number = this._itemData[Protocols.ItemFields.ItemId];
            let lClass: number = Math.floor(id / 100000);
            let lv: number = id % 100;
            if (lClass == 906 && lv >= 9) { //秘术
                if (!this._eff) {
                    this._eff = modules.common.CommonUtil.creatEff(this, `light`, 7);
                    this._eff.pos(4, 4, true);
                }
                if (!this._img) {
                    this._img = new Image(`common/txt_dhgt_ms.png`);
                    this.addChild(this._img);
                }
                this._eff.play();
                this._eff.visible = this._img.visible = true;
            } else {
                if (this._img) {
                    this._img.visible = false;
                }
                if (this._eff) {
                    this._eff.visible = false;
                    this._eff.stop();
                }
            }
        }

        public close(): void {
            if (this._eff) {
                this._eff.stop();
            }
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._img) {
                this._img.destroy(true);
                this._img = null;
            }
            if (this._eff) {
                this._eff.destroy(true);
                this._eff = null;
            }
            super.destroy();
        }
    }
}