namespace modules.sign {

    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import idCount = Configuration.idCount;
    import idCountFields = Configuration.idCountFields;
    import sign_rewardFields = Configuration.sign_rewardFields;
    import LayaEvent = modules.common.LayaEvent;

    export class SignAwardItem extends ui.SignAwardItemUI {
        private state: number;
        private _addSignClip: CustomClip;
        private _itemData: Item;
        private _index: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this._addSignClip = this.destroyElement(this._addSignClip);
            super.destroy(destroyChild);
        }


        protected initialize(): void {
            super.initialize();
            this._addSignClip = new CustomClip();
            this.addChildAt(this._addSignClip, this.getChildIndex(this.icon));
            this._addSignClip.pos(-75, -75, true);
            this._addSignClip.skin = "assets/effect/state.atlas";
            this._addSignClip.frameUrls = ["state/0.png", "state/1.png", "state/2.png", "state/3.png", "state/4.png", "state/5.png", "state/6.png", "state/7.png"];
            this._addSignClip.durationFrame = 5;
            this._addSignClip.play();
            this._addSignClip.visible = false;
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg = value[0];
            let tipsAward: idCount = cfg[sign_rewardFields.addAward][0];
            let id = tipsAward[idCountFields.id];
            let count = tipsAward[idCountFields.count];

            this.state = value[1];
            this._index = value[2];
            this.count.text = count.toString();
            this.icon.skin = CommonUtil.getIconById(id);
            this.dayNum.text = cfg[sign_rewardFields.count] + "天";
            // this.icon.skin`assets/icon/ui/${this._addCountArr[addNumber][sign_rewardFields.icon]}.png`
            this._itemData = [id, 0, 0, null];
            switch (this.state) {
                case 0: {
                    this.signImg.visible = false;
                    this._addSignClip.visible = false;
                }
                    break;
                case 1: {
                    this.signImg.visible = false;
                    this._addSignClip.visible = true;
                }
                    break;
                case 2: {
                    this._addSignClip.visible = false;
                    this.signImg.visible = true;
                }
                    break;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, LayaEvent.CLICK, this, this.addSignHandler);
        }

        private addSignHandler() {
            if (this.state != 1) {//不可签时
                BagUtil.openBagItemTip(this._itemData);
            } else {
                Channel.instance.publish(UserFeatureOpcode.GetSignAward, [this._index]);
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this._addSignClip.play();

        }

        public close(): void {
            super.close();
            this._addSignClip.stop();
        }

    }
}