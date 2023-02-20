/////<reference path="../$.ts"/>
/** 仙府-家园右下面板 */
namespace modules.xianfu {
    import XianfuRightBottomViewUI = ui.XianfuRightBottomViewUI;
    import Event = Laya.Event;

    export class XianfuRightBottomPanel extends XianfuRightBottomViewUI {

        private _girlTween: TweenJS;
        private _wordBoxTween: TweenJS;
        private _grilWords: string[];
        private _wordTime: number;
        private _eventIds: number[];

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.bottom = 540;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;

            this._eventIds = [];

            this.wordTxt.color = "#2d2d2d";
            this.wordTxt.style.fontFamily = "SimHei";
            this.wordTxt.style.fontSize = 24;
            this.wordTxt.style.valign = "middle";
            this.wordTxt.style.wordWrap = true;

            this._girlTween = TweenJS.create(this.girlBtn);
            this._wordBoxTween = TweenJS.create(this.wordBox);

            this._grilWords = config.BlendCfg.instance.getCfgById(27014)[Configuration.blendFields.stringParam];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.girlBtn, Event.CLICK, this, this.girlBtnHandler);
            this.addAutoListener(this.handBookBtn, Event.CLICK, this, this.handBookBtnHandler);
            this.addAutoRegisteRedPoint(this.handbookRPImg, ["xianfuBlueHandBookRP", "xianfuVioletHandBookRP", "xianfuOrangeHandBookRP", "xianfuRedHandBookRP"]);
        }

        public onOpened(): void {
            super.onOpened();

            this.checkOperaEvent();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        private initWord(): void {
            this.wordTxt.innerHTML = `<span style="color:rgb(56,54,53)">主人，点我可以查看</span><span style="color:rgb(191,79,3)">家园升级、任务、风水</span><span style="color:rgb(56,54,53)">和总览哦</span>`;
            this.wordTxtCenterY();
            this.girlBtn.scale(0, 0);
            this.wordBox.x = this.wordBox.width;
            this._girlTween.to({scaleX: 1, scaleY: 1}, 500).start().onComplete(() => {
                this._wordBoxTween.to({x: 0}, 500).start();
                this._wordTime = 2000;
                Laya.timer.loop(1000, this, this.wordShow);
            });
        }

        private wordShow(): void {
            if (this._wordTime <= 0) {
                if (this._eventIds.length > 0) {
                    let id: number = this._eventIds.shift();
                    this.wordTxt.innerHTML = this._grilWords[id];
                    this.wordTxtCenterY();
                    this._wordTime = 2000;
                    return;
                }
                Laya.timer.once(15000, this, this.checkOperaEvent);
                this.wordBox.x = this.wordBox.width;
                Laya.timer.clear(this, this.wordShow);
                return;
            } else {
                this._wordTime -= 1000;
            }
        }

        private wordTxtCenterY(): void {
            this.wordTxt.style.height = this.wordTxt.contextHeight;
            this.wordTxt.y = (this.wordBox.height - this.wordTxt.height) / 2;
        }

        //检测所有的操作事件
        private checkOperaEvent(): void {
            this._eventIds.length = 0;
            //仙府-家园外优先出神秘商人外的事件
            let eventId: number = XianfuModel.instance.checkEventRP();
            if (eventId !== XianFuEvent.none) {
                this._eventIds.push(eventId - 1);
            }

            //类型5
            if (XianfuModel.instance.julingEvent) {
                this._eventIds.push(XianfuModel.instance.julingEvent);
            }
            //类型6
            if (XianfuModel.instance.lianzhiEvent) {
                this._eventIds.push(XianfuModel.instance.lianzhiEvent);
            }
            //类型7 
            if (XianfuModel.instance.lianzhiHaveTime) {
                this._eventIds.push(XianfuModel.instance.lianzhiHaveTime);
            }
            //类型8 
            if (XianfuModel.instance.petEvent) {
                this._eventIds.push(XianfuModel.instance.petEvent);
            }
            //类型9 灵兽阁有灵兽休息且有游历次数时（未开启不算）
            if (XianfuModel.instance.petHaveTime) {
                this._eventIds.push(XianfuModel.instance.petHaveTime);
            }
            //类型10 仙府-家园可升级
            if (XianfuModel.instance.checkShengjiRP()) {
                this._eventIds.push(10);
            }
            //类型11 仙府-家园任务可领取
            if (XianfuModel.instance.checkTaskRP()) {
                this._eventIds.push(11);
            }
            //类型12 风水可激活/升级
            if (XianfuModel.instance.checkArticleRP()) {
                this._eventIds.push(12);
            }

            if (this._eventIds.length > 0) {
                // 策划需求 直接关闭
                // this.initWord();
            }
        }

        private girlBtnHandler(): void {   // 变强
            WindowManager.instance.open(WindowEnum.XIANFU_SHENGJI_PANEL);
        }

        private handBookBtnHandler(): void { // 图鉴
            WindowManager.instance.open(WindowEnum.XIANFU_HAND_BOOK_BLUE_PANEL);
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.checkOperaEvent);
            Laya.timer.clear(this, this.wordShow);
            this._girlTween.stop();
            this._wordBoxTween.stop();
            this.girlBtn.scale(0, 0);
            this.wordBox.x = this.wordBox.width;
        }

        public destroy(): void {
            super.destroy();

            this._wordBoxTween = null;
            this._girlTween = null;
        }
    }
}