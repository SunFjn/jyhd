/////<reference path="../$.ts"/>
/** 职位弹框item */
namespace modules.faction {
    import FactionPostLimitsItemUI = ui.FactionPostLimitsItemUI;

    export class FactionPostLimitsItem extends FactionPostLimitsItemUI {

        private _txts: Laya.Text[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._txts = [this.flagTxt_3, this.flagTxt_0, this.flagTxt_1, this.flagTxt_2];
        }

        public setData(limits: boolean[]): void {
            this.nameTxt.text = FactionUtil.limitShowNames[this.index];
            for (let i: int = 0, len: int = limits.length; i < len; i++) {
                this._txts[i].text = limits[i] ? `√` : `×`;
                this._txts[i].color = limits[i] ? `#168a17` : `#ff3e3e`;
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._txts) {
                for (let e of this._txts) {
                    e.removeSelf();
                    e.destroy();
                }
                this._txts = null;
            }
            super.destroy(destroyChild);
        }
    }
}
