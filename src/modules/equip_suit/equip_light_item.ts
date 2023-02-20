/////<reference path="../$.ts"/>
/** 装备点亮item */
namespace modules.equipSuit {
    import BagItem = modules.bag.BagItem;
    import ItemFields = Protocols.ItemFields;

    export class EquipLightItem extends BagItem {

        private _tween: TweenJS;

        protected initialize(): void {
            super.initialize();

            this._nameTxt.y = 100;
            this._nameTxt.fontSize = 15;

            this.needTip = false;
            this.addImg.scale(0.8, 0.8, true);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this, common.LayaEvent.CLICK, this, this.handler);
        }

        public set state(param: LightState) {
            if (param == LightState.can) {
                this.isbtnClipIsPlayer = this.lockBtn.visible = false;
                this.addImg.visible = true;
                if (!this._tween) {
                    this._tween = TweenJS.create(this.addImg).yoyo(true).repeat(Number.POSITIVE_INFINITY);
                }
                if (!this._tween.isPlaying) {
                    this._tween.to({ scaleX: 1, scaleY: 1 }, 300).start();
                }
            } else if (param == LightState.cant) {
                this.lockBtn.visible = true;
                this.isbtnClipIsPlayer = false;
                this.disableImgScale();
            } else {
                this.lockBtn.visible = false;
                this.disableImgScale();
                this.isbtnClipIsPlayer = this.setCustomClip(2);
                this.isbtnClipIsPlayer = true;
                this._nameTxt.visible = false;
            }
            let part: EquipCategory = CommonUtil.getPartById(this.itemData[ItemFields.ItemId]);
            let partName: string = CommonUtil.getNameByPart(part);
            this._nameTxt.text = partName;
            this._nameTxt.color = `white`;
        }

        private disableImgScale() {
            this.addImg.visible = false;
            this.addImg.scale(0.8, 0.8, true);
            this._tween && this._tween.stop();
        }

        private handler(): void {
            let itemId: number = this.itemData[Protocols.ItemFields.ItemId];
            let part: EquipCategory = EquipSuitModel.instance.selectPart = CommonUtil.getPartById(itemId);
            EquipSuitCtrl.instance.lightenUp([EquipSuitModel.instance.selectId, part]);
        }

        public close(): void {
            this.disableImgScale();
            super.close();
        }

        public destroy(): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            super.destroy();
        }
    }
}