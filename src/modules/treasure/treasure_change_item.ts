namespace modules.treasure {
    import xunbao_exchangeFields = Configuration.xunbao_exchangeFields;
    import idCountFields = Configuration.idCountFields;
    import Event = laya.events.Event;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import xunbao_exchange = Configuration.xunbao_exchange;
    import CustomClip = modules.common.CustomClip;

    export class TreasureChangeItem extends ui.TreasureChangeItemUI {
        private _type: number;
        private _id: number;
        private _cfg: xunbao_exchange;
        private _visible: boolean;
        private _upClip: CustomClip;

        public destroy(destroyChild: boolean = true): void {
            this._upClip = this.destroyElement(this._upClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.triggerT.visible = false;

            this._upClip = new CustomClip();
            this.addChild(this._upClip);
            this._upClip.skin = "assets/effect/btn_light.atlas";
            this._upClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._upClip.durationFrame = 5;
            this._upClip.pos(144, 75, true);
            this._upClip.scale(1, 1.05);
            this._upClip.play();
            this._upClip.visible = true;
        }

        protected setData(value: any): void {
            super.setData(value);
            this._cfg = value;
            let exchangeItem = this._cfg[xunbao_exchangeFields.exchangeItem];
            let condition = this._cfg[xunbao_exchangeFields.condition];
            this._id = this._cfg[xunbao_exchangeFields.id];
            this._type = this._cfg[xunbao_exchangeFields.type];
            this.item.dataSource = [exchangeItem[idCountFields.id], exchangeItem[idCountFields.count], 0, null];
            this.itemName.text = this.item._nameTxt.text;
            this.currencyIcon.visible = this._type == 3;
            this.updateCoupon();
            if (this._type == 3) {
                this.priceTxt.text = `` + condition[idCountFields.count];
                this.priceTxt.x = 225;
            }
            else {
                this.priceTxt.text = condition[idCountFields.count] + "积分";
                this.priceTxt.x = 180;
            }

        }

        public updateCoupon(): void {
            let condition = this._cfg[xunbao_exchangeFields.condition];
            let coupon = TreasureModel.instance.getCoupon(this._type);
            if (coupon < condition[idCountFields.count]) {
                this.priceTxt.color = CommonUtil.getColorByQuality(5);
                this._upClip.visible = false;
                this._upClip.stop();
            } else {
                this.priceTxt.color = "#2d2d2d";
                if (this._visible == true) {
                    this._upClip.visible = true;
                    this._upClip.play();
                } else {
                    this._upClip.visible = false;
                    this._upClip.stop();
                }
            }
        }

        protected onOpened(): void {
            super.onOpened();
            if (this._upClip.visible) this._upClip.play();
        }

        public close(): void {
            super.close();
            this._upClip.stop();
        }

        protected addListeners(): void {
            super.addListeners();
            this.puchaseBtn.on(Event.CLICK, this, this.puchaseHandler);
            this.trigger.on(Event.CLICK, this, this.triggerHandler);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_XUNBAOINFO, this, this.updateCoupon);
            GlobalData.dispatcher.on(CommonEventType.XUNBAO_HINTLIST, this, this.updateHint);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.puchaseBtn.off(Event.CLICK, this, this.puchaseHandler);
            this.trigger.off(Event.CLICK, this, this.triggerHandler);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_XUNBAOINFO, this, this.updateCoupon);
            GlobalData.dispatcher.off(CommonEventType.XUNBAO_HINTLIST, this, this.updateHint);
        }

        private puchaseHandler() {
            TreasureCtrl.instance.exchange(this._type, this._id);
        }

        private triggerHandler() {
            let hintList: Array<number> = TreasureModel.instance.getHintList(this._type);
            if (hintList.indexOf(this._id) != -1) {
                hintList.splice(hintList.indexOf(this._id), 1);
                Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeHint, [this._type, hintList]);
            } else {
                hintList.push(this._id);
                Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeHint, [this._type, hintList]);
            }
            this.updateHint();
        }


        private updateHint() {
            let hintList: Array<number> = TreasureModel.instance.getHintList(this._type);
            if (hintList.indexOf(this._id) != -1) {
                this._visible = true;
            } else {
                this._visible = false;
            }
            if (this._visible == false) {
                this.triggerT.visible = false;
                this.triggerF.visible = true;
            } else {
                this.triggerF.visible = false;
                this.triggerT.visible = true;
            }
            this.updateCoupon();
        }
    }
}
