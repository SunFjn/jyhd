/** 最后一击奖励弹框*/


namespace modules.dungeon {
    import LastHitAwardAlertUI = ui.LastHitAwardAlertUI;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;

    export class LastHitAwardAlert extends LastHitAwardAlertUI {
        private _bagItem: BaseItem;
        private _duration: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._bagItem = new BaseItem();
            this.addChild(this._bagItem);
            this._bagItem.pos(282, 266, true);
            this._bagItem.nameVisible = false;

            this.anchorX = this.anchorY = 0.5;
            this.zOrder = 11;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let items: Array<Protocols.Item> = value;
            this._bagItem.dataSource = items[0];
        }

        public onOpened(): void {
            super.onOpened(false);

            this._duration = 3000;
            this.loopHandler();

            this.showAlert();
        }

        private showAlert() {
            this._bagItem.visible = false;
            this.scaleX = 0;
            let tempY = this.y;
            this.y = tempY + 60;
            TweenJS.create(this).to({ scaleX: 1 }, 200)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    this._bagItem.visible = true;
                })
                .start()

            TweenJS.create(this).to({ y: tempY }, 80)
                .start()
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }
    }
}