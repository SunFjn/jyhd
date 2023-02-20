/** 通用文本弹框*/


namespace modules.commonAlert {
    import Event = Laya.Event;
    import CommonTxtAlertUI = ui.CommonTxtAlertUI;
    import Handler = Laya.Handler;
    import LayaEvent = modules.common.LayaEvent;
    import Sprite = Laya.Sprite;
    import NoMoreNoticeId = ui.NoMoreNoticeId;

    export const enum OkInfoFields {
        handler,
        btnLabel,
    }
    export type OkInfo = [Handler?, string?];

    const enum CancelInfoFields {
        handler,
        btnLabel,
        isBind,
    }
    export type CancelInfo = [Handler?, string?, boolean?];

    const enum TipTxtInfoFields {
        txt,
        color,
    }
    export type TipTxtInfo = [string, string];

    const enum InwardParamsFields {
        title = 0,
        content = 1,
        okInfo = 2,
        cancelInfo = 3,
        isShowHint = 4,
        tipTxtInfo = 5,
        noticeId = 6,
    }
    export type InwardParams = [string, string, OkInfo, CancelInfo, boolean, TipTxtInfo, NoMoreNoticeId];

    export class CommonTxtAlert extends CommonTxtAlertUI {

        private _okHandler: Handler;
        private _cancelHandler: Handler;

        private _minHWithBtn: number;
        private _minHWithoutBtn: number;
        private _hasBtn: boolean;

        private _noticeId: NoMoreNoticeId;

        /**
         * * * * * * * *
         * 滚动功能代码 起
         * * * * * * * *
         */
        private _lastPos: number = 0;
        private _scrollDir: int;
        private _y_max: number;
        /**
         * * * * * * * *
         * 滚动功能代码 终于
         * * * * * * * *
         */

        constructor() {
            super();
            // 1 上下 其他左右  滚动功能代码 仅下一行
            this._scrollDir = 1;
        }

        protected initialize(): void {
            super.initialize();
            this.contentTxt.color = "#454545";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.valign = "middle";
            this.contentTxt.style.lineHeight = 28;
            this.contentTxt.mouseEnabled = false;

            this._minHWithBtn = 152;
            this._minHWithoutBtn = 232;
            this._hasBtn = true;
            this._lastPos = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.noticeBtn, LayaEvent.CLICK, this, this.noticeHandler);
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okHandler);
            this.addAutoListener(this.cancelBtn, LayaEvent.CLICK, this, this.cancelHandler);

        }

        /**
         * * * * * * * *
         * 滚动功能代码 起
         * * * * * * * *
         */
        private downHandler(): void {
            this._lastPos = this._scrollDir === 1 ? this.mouseY : this.mouseX;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offset: number = e.delta * -8;
            this.scroll(offset);
        }

        private moveHandler(): void {
            let offset: number = this._lastPos - (this._scrollDir === 1 ? this.mouseY : this.mouseX);
            this.scroll(offset);
            // console.log('vtz:offset',offset);
            this._lastPos = this._scrollDir === 1 ? this.mouseY : this.mouseX;
        }

        public scroll(offset: number): void {
            if (this._scrollDir !== 1) {
                return
            }
            let move_to = this.contentTxt.y - offset;
            if (move_to < -this._y_max) {
                move_to = -this._y_max;
            } else if (move_to > 0) {
                move_to = 0;
            }
            this.contentTxt.y = move_to;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }

        /**
         * * * * * * * *
         * 滚动功能代码 起
         * * * * * * * *
         */

        private okHandler(): void {
            this.close();
            if (this._okHandler) this._okHandler.run();
        }

        private cancelHandler(): void {
            this.close();
            if (this._cancelHandler) this._cancelHandler.run();
        }

        public setOpenParam(value: InwardParams): void {
            super.setOpenParam(value);

            this.title = value[InwardParamsFields.title];
            let okInfo: OkInfo = value[InwardParamsFields.okInfo];
            if (okInfo) {
                let okHandler: Handler = okInfo[OkInfoFields.handler];
                this._okHandler = okHandler;
                let okLabel: string = okInfo[OkInfoFields.btnLabel];
                this.okBtn.label = okLabel ? okLabel : `确定`;
            }
            let cancelInfo: CancelInfo = value[InwardParamsFields.cancelInfo];
            if (cancelInfo) {
                let cancelHandler: Handler = cancelInfo[CancelInfoFields.handler];
                this._cancelHandler = cancelHandler;
                let cancelLabel: string = cancelInfo[CancelInfoFields.btnLabel];
                this.cancelBtn.label = cancelLabel ? cancelLabel : `取消`;
                let isBind: boolean = cancelInfo[CancelInfoFields.isBind];
                if (isBind) {
                    this.addAutoListener(this.closeBtn, common.LayaEvent.CLICK, this, this.cancelHandler);
                }
            }

            let tipInfo: TipTxtInfo = value[InwardParamsFields.tipTxtInfo];
            // 不显示按钮状态下，borderImg最小宽高不一样
            this.tipTxt.visible = false;
            if (okInfo && cancelInfo) {
                this.okBtn.visible = this.cancelBtn.visible = true;
                this.okBtn.x = 356;
            } else if (tipInfo) {
                this.okBtn.visible = this.cancelBtn.visible = false;
                this.tipTxt.visible = true;
                this.tipTxt.text = tipInfo[TipTxtInfoFields.txt];
                this.tipTxt.color = tipInfo[TipTxtInfoFields.color];
            } else if (okInfo && !cancelInfo) {
                this.okBtn.visible = true;
                this.cancelBtn.visible = false;
                this.okBtn.x = 236;
            } else if (!okInfo && !cancelInfo) {
                this.okBtn.visible = this.cancelBtn.visible = false;
            }
            this._hasBtn = !!okInfo || !!cancelInfo || !!tipInfo;

            this.content = value[1];
            this.hintTxt.visible = this.closeOnSide = value[InwardParamsFields.isShowHint];

            this._noticeId = value[InwardParamsFields.noticeId];
            this.noticeBtn.visible = this.noticeTxt.visible = this._noticeId !== NoMoreNoticeId.none;
            this.noticeBtn.selected = GlobalData.noMoreNoticeArr[this._noticeId];
        }

        public set title(value: string) {
            this.titleTxt.text = value;
        }

        public set content(value: string) {
            this.contentTxt.innerHTML = value;
            // 自适应
            let contentW: number = this.contentTxt.contextWidth;
            let contentH: number = this.contentTxt.contextHeight;
            this.cententPanel.height = contentH;
            // 横向居中
            this.cententPanel.x = 76 + (512 - contentW >> 1);
            // 纵向居中
            let minH: number = this._hasBtn ? this._minHWithBtn : this._minHWithoutBtn;
            if (contentH < minH - 36) {
                this.height = this.bgImg.height = 404;
                this.borderImg.height = minH;
                this.cententPanel.y = 110 + (minH - contentH >> 1);
            } else {
                if (contentH > 715) {
                    this.cententPanel.height = 715;
                    /**
                     * * * * * * * *
                     * 滚动功能代码 起
                     * * * * * * * *
                     */
                    this._y_max = contentH - this.cententPanel.height;
                    this.addAutoListener(this, LayaEvent.MOUSE_DOWN, this, this.downHandler);
                    this.addAutoListener(this, LayaEvent.MOUSE_WHEEL, this, this.wheelHandler);
                    /**
                     * * * * * * * *
                     * 滚动功能代码 终
                     * * * * * * * *
                     */
                    contentH = 715;
                }
                this.borderImg.height = contentH + 36;
                this.height = this.bgImg.height = this.borderImg.height + (this._hasBtn ? 252 : 172);
                this.cententPanel.y = this.borderImg.y + 18;
            }
            this.hintTxt.y = this.bgImg.height + 35;
        }

        private noticeHandler(): void {
            if (this._noticeId === NoMoreNoticeId.none) return;
            this.noticeBtn.selected = !this.noticeBtn.selected;
            GlobalData.noMoreNoticeArr[this._noticeId] = this.noticeBtn.selected;
        }
    }
}