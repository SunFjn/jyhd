///<reference path="../config/rune_dial_cfg.ts"/>

namespace modules.rune_copy {
    import DialAlertUI = ui.DialAlertUI;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import RuneDialCfg = modules.config.RuneDialCfg;
    import rune_dial = Configuration.rune_dial;
    import rune_dialFields = Configuration.rune_dialFields;
    import Image = Laya.Image;

    export class DialAlert extends DialAlertUI {
        private _angleArr: number[];  //八个最终结果的角度
        private _stopIndex: number;  //开奖的下标
        private _luckAward: BaseItem;
        private _awardArr: Array<BaseItem>;
        private _awardPosArr: Array<[number, number]>;
        private _receivedImgArr: Array<Image>;
        private _isCanClick: boolean;
        private _tweenJS: TweenJS;
        private _luckId: number;

        public destroy(): void {
            this._luckAward = this.destroyElement(this._luckAward);
            this._awardArr = this.destroyElement(this._awardArr);
            this._receivedImgArr = this.destroyElement(this._receivedImgArr);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._angleArr = [0, 45, 90, 135, 180, 225, 270, 315, 360];
            this._stopIndex = 0;
            this._isCanClick = true;

            this._luckAward = new BaseItem();
            this._luckAward.pos(127, 802);
            this.addChild(this._luckAward);

            this._awardPosArr = [[312, 140], [452, 188], [518, 325], [452, 482], [312, 526], [179, 460], [115, 325], [179, 188]];
            this._receivedImgArr = [this.receivedImg_0, this.receivedImg_1, this.receivedImg_2, this.receivedImg_3,
            this.receivedImg_4, this.receivedImg_5, this.receivedImg_6, this.receivedImg_7];

            this._awardArr = new Array<BaseItem>();
            for (let i: int = 0, len: int = 8; i < len; i++) {
                let item = new BaseItem();
                this.addChildAt(item, 5);
                item.pos(this._awardPosArr[i][0], this._awardPosArr[i][1]);
                this._awardArr.push(item);
            }
            this.addChild(this.arrowImg);
        }

        public onOpened(): void {
            super.onOpened();

            this.arrowImg.rotation = this._angleArr[this._stopIndex];
            this.updateView();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.startBtn, Event.CLICK, this, this.startBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DIAL_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DIAL_RESULT_UPDATE, this, this.startTurn);

        }

        private updateView(): void {
            let round: number = RuneCopyModel.instance.round;
            let time: number = RuneCopyModel.instance.dialCount;
            let cfg: rune_dial = RuneDialCfg.instance.getCfgByRound(round);
            let luckId: number = this._luckId = cfg[rune_dialFields.items][0][0];
            let luckCount: number = cfg[rune_dialFields.items][0][1];

            this._luckAward.dataSource = [luckId, luckCount, 0, null];

            for (let i: int = 0, len: int = this._awardArr.length; i < len; i++) {
                let itemId: number = cfg[rune_dialFields.items][i][0];
                let count: number = cfg[rune_dialFields.items][i][1];
                this._awardArr[i].dataSource = [itemId, count, 0, null];
            }

            this.frameImg.visible = false;
            this.frameImg.rotation = 180;
            this.luckTimeTxt.text = `幸运次数:${time}`;
            this.roundTxt.text = `当前轮数:第${RuneCopyModel.instance.round}轮`;
            this.showReceivedFlag();
        }

        private startBtnHandler(): void {
            if (!this._isCanClick) return;
            RuneCopyCtrl.instance.startRuneDial();
            this.frameImg.visible = this._isCanClick = false;
        }

        private startTurn(): void {
            this._stopIndex = RuneCopyModel.instance.dialResult;
            this.arrowImg.rotation = this.arrowImg.rotation % 360;

            if (this._tweenJS) this._tweenJS.stop();
            this._tweenJS =
                TweenJS.create(this.arrowImg).to({ rotation: 2160 + this._angleArr[this._stopIndex] },
                    3000).start().easing(utils.tween.easing.quadratic.InOut).onComplete(() => {
                        this.playComplete();
                        this._tweenJS.stop();
                        this._tweenJS = null;
                    });
        }

        private showReceivedFlag(): void {
            let alreadList: number[] = RuneCopyModel.instance.alreadList;
            let tab: Table<boolean> = {};
            for (let i: int = 0, len: int = alreadList.length; i < len; i++) {
                tab[alreadList[i]] = true;
            }
            for (let i: int = 0, len: int = this._receivedImgArr.length; i < len; i++) {
                this._receivedImgArr[i].visible = tab[i];
            }
        }

        private playComplete(): void {
            CommonUtil.delayedPutInBag();
            if (this._stopIndex == 0) {
                WindowManager.instance.open(WindowEnum.TREASURE_GET_ALERT, [this._luckId]);
            } else {
                this.updateView();
            }
            this.frameImg.visible = this._isCanClick = true;
            this.frameImg.rotation = this.arrowImg.rotation;
        }

        public close(): void {
            if (this._tweenJS) {
                this._tweenJS.stop();
                this._tweenJS = null;
                this.playComplete();
            }
            super.close();
        }
    }
}
