/** 奇遇商店单元项*/


namespace modules.adventure {
    import TreasureChangeItemUI = ui.TreasureChangeItemUI;
    import CustomClip = modules.common.CustomClip;
    import adventure_exchangeFields = Configuration.adventure_exchangeFields;

    export class AdventureShopItem extends TreasureChangeItemUI {
        private _upClip: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            // this.triggerT.visible = false;
            this._upClip = new CustomClip();
            this._upClip.pos(this.puchaseBtn.x - 6, this.puchaseBtn.y - 16, true);
            this._upClip.skin = "assets/effect/btn_light.atlas";
            this._upClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._upClip.durationFrame = 5;
            this._upClip.scale(0.98, 1);

            this.currencyIcon.visible = true;
            this.currencyIcon.skin = CommonUtil.getIconById(MoneyItemId.adventurePoint, true);
            this.priceTxt.align = "left";
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.puchaseBtn, Laya.Event.CLICK, this, this.puchaseHandler);
            this.addAutoListener(this.trigger, Laya.Event.CLICK, this, this.hintHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_HINT_LIST_UPDATE, this, this.updateHint);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ADVENTURE_POINT_UPDATE, this, this.updatePoint);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateHint();
            this.updatePoint();
        }

        protected setData(value: any): void {
            super.setData(value);
            let itemInfo: Array<number> = value[adventure_exchangeFields.exchangeItem];
            this.item.dataSource = [itemInfo[0], itemInfo[1], 0, null];
            this.itemName.text = this.item._nameTxt.text;
            this.itemName.color = this.item._nameTxt.color;

            this.priceTxt.text = value[adventure_exchangeFields.condition][1] + "";
            this.priceTxt.width = this.priceTxt.textWidth;
            let offsetX: number = 150 + (166 - this.priceTxt.width - 34) * 0.5;
            this.currencyIcon.x = offsetX;
            this.priceTxt.x = this.currencyIcon.x + 60;
        }

        // 兑换
        private puchaseHandler(): void {
            AdventureCtrl.instance.adventureExchange(this._data[adventure_exchangeFields.id]);
        }

        private hintHandler(): void {
            let hints: Array<number> = AdventureModel.instance.hintList || [];
            let id: number = this._data[adventure_exchangeFields.id];
            let index: int = hints.indexOf(id);
            if (index === -1) {       // 没有就加
                hints.push(id);
                AdventureCtrl.instance.setAdventureHint(hints);
                AdventureModel.instance.hintList = hints;
            } else {      // 有就删
                hints.splice(index, 1);
                AdventureCtrl.instance.setAdventureHint(hints);
                AdventureModel.instance.hintList = hints;
            }
        }

        // 更新提醒列表
        private updateHint(): void {
            let hints: Array<number> = AdventureModel.instance.hintList || [];
            this.triggerT.visible = hints.indexOf(this._data[adventure_exchangeFields.id]) !== -1;

            this.updateEffect();
        }

        // 更新奇遇点
        private updatePoint(): void {
            this.updateEffect();

            let point: number = AdventureModel.instance.point || 0;
            this.priceTxt.color = point >= this._data[adventure_exchangeFields.condition][1] ? "#2d2d2d" : "#ff3e3e";
        }

        private updateEffect(): void {
            let point: number = AdventureModel.instance.point || 0;
            // if (this.triggerT.visible && point >= this._data[adventure_exchangeFields.condition][1]) {
            this.addChild(this._upClip);
            this._upClip.play();
            // } else {
            //     this._upClip.removeSelf();
            //     this._upClip.stop();
            // }
        }

        public destroy(destroyChild: boolean = true): void {
            this._upClip = this.destroyElement(this._upClip);
            super.destroy(destroyChild);
        }
    }
}