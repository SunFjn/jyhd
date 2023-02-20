/////<reference path="../$.ts"/>
/** 仙女item */
namespace modules.fairy {
    import FairyItemUI = ui.FairyItemUI;
    import FairyCfg = modules.config.FairyCfg;

    export class FairyItem extends FairyItemUI {

        private _moveTween: TweenJS;
        private _shadeTween: TweenJS;
        private _yPoss: number[];
        private _endTime: number;

        protected initialize(): void {
            super.initialize();

            this._moveTween = TweenJS.create(this);
            this._shadeTween = TweenJS.create(this);

            this._yPoss = [];
            for (let i: int = 0; i < 7; i++) {
                this._yPoss.push(80 * i);
            }

            this._endTime = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this, Laya.Event.CLICK, this, this.imgsClickHandler, [-1]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAIRY_UPDATE, this, this.updateView);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let fairyId: number = FairyModel.instance.fairyId;
            this.bgImg.skin = `fairy/seltectd_hsxv_xv${fairyId}.png`;
            this.fairyImg.skin = `fairy/image_hsxv_xv${fairyId}.png`;

            if (FairyModel.instance.sendState == 1) { //护送中
                this._endTime = FairyModel.instance.endTime;
                this.timeTxt.text = CommonUtil.timeStampToMMSS(this._endTime);
                if (!this._moveTween.isPlaying && !this._shadeTween.isPlaying) {
                    this.mineFairyShow();
                }
            } else {
                this.visible = false;
            }
        }

        private loopHandler(): void {
            if (this._endTime - GlobalData.serverTime <= 0) {
                this.visible = false;
                return;
            } else {
                this.timeTxt.text = CommonUtil.timeStampToMMSS(this._endTime);
            }
        }

        private mineFairyShow(): void {
            let endTime: number = FairyModel.instance.endTime - GlobalData.serverTime;
            endTime = (endTime / 1000 >> 0) * 1000 - 500;
            if (endTime <= 0) return;
            let needTime: number = FairyCfg.instance.getCfgById(FairyModel.instance.fairyId)[Configuration.fairyFields.onceTime];
            this.alpha = 1;
            this.visible = true;
            let goingTime: number;
            let per: number; //百分比
            if (endTime > needTime) {  //大于一次过屏
                per = (endTime % needTime) / needTime;
            } else {
                per = endTime / needTime;
            }
            this.x = 670 * (1 - per) - 70;
            goingTime = per * needTime;
            this.y = this._yPoss[Math.floor(Math.random() * this._yPoss.length)];
            this.zOrder = this.y;
            this._moveTween.to({ x: 600 }, goingTime).start().onComplete(() => {
                this.alpha = 1;
                this._shadeTween.to({ alpha: 0 }, 1000).start().onComplete(() => {
                    this.alpha = 1;
                    this.visible = false;
                    this.x = -70;
                    this.mineFairyShow();
                });
                FairyCtrl.instance.getFairyEscortList();
            });
        }

        private imgsClickHandler(index: number): void {
            let value = FairyModel.instance.escortList[index];
            WindowManager.instance.open(WindowEnum.FAIRY_SEND_ALERT, value);
        }

        public destroy(): void {
            this._moveTween = null;
            this._shadeTween = null;
            super.destroy();
        }

        public close(): void {
            super.close();
            this._moveTween.stop();
            this._shadeTween.stop();
        }
    }
}