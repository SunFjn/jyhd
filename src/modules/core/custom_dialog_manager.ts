/** 自定义弹窗管理器*/
///<reference path="../../utils/tween/tween.ts"/>

namespace modules.core {
    import Box = Laya.Box;
    import Component = Laya.Component;
    import DialogManager = Laya.DialogManager;
    import Event = Laya.Event;
    import Handler = Laya.Handler;
    import easing = utils.tween.easing;
    import TweenJS = utils.tween.TweenJS;

    export class CustomDialogManager extends DialogManager {
        constructor() {
            super();

            this.popupEffectHandler = Handler.create(this, this.popupEffect, null, false);
            this.closeEffectHandler = Handler.create(this, this.closeEffect, null, false);
        }

        private _closeOnSide(): void {
            var dialog: Laya.Dialog = this.getChildAt(this.numChildren - 1) as Laya.Dialog;
            if (dialog instanceof BaseDialog && !(<BaseDialog>dialog).closeOnSide) return;
            if (dialog instanceof Laya.Dialog) dialog.close("side", false);
        }

        /**@private 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，如果不想有任何效果，可以赋值为null*/
        public popupEffect = (dialog: Laya.Dialog): void => {
            this.doOpen(dialog);
            return;
            // dialog.scaleX = 0.1;
            // dialog.scaleY = 0.1;
            // TweenJS.create(dialog).to({
            //     scaleX: 1,
            //     scaleY: 1
            // }, 300).easing(easing.back.Out).onComplete(this.doOpen).start();
        };

        /**@private 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，如果不想有任何效果，可以赋值为null*/
        public closeEffect = (dialog: Laya.Dialog, type: string): void => {
            this.doClose(dialog, type);
            return;
            // TweenJS.create(dialog).to({scaleX: 0, scaleY: 0}, 300).easing(easing.elastic.Out).onComplete((): void => {
            //     this.doClose(dialog, type);
            // }).start();
        };

        /**设置锁定界面，如果为空则什么都不显示*/
        public setLockView(value: Component): void {
            if (!this.lockLayer) {
                this.lockLayer = new Box();
                this.lockLayer.mouseEnabled = true;
                this.lockLayer.size(CommonConfig.viewWidth, CommonConfig.viewHeight);
            }
            this.lockLayer.removeChildren();
            if (value) {
                value.centerX = value.centerY = 0;
                this.lockLayer.addChild(value);
            }
        }

        /**@private */
        private _onResize(e: Event = null): void {
            var width: number = this.maskLayer.width = CommonConfig.viewWidth;
            var height: number = this.maskLayer.height = CommonConfig.viewHeight;
            if (this.lockLayer) this.lockLayer.size(width, height);

            this.maskLayer.graphics.clear();
            this.maskLayer.graphics.drawRect(0, 0, width, height, UIConfig.popupBgColor);
            this.maskLayer.alpha = UIConfig.popupBgAlpha;

            for (var i: int = this.numChildren - 1; i > -1; i--) {
                var item: Laya.Dialog = this.getChildAt(i) as Laya.Dialog;
                if (item.popupCenter) this._centerDialog(item);
            }

            // this.size(width, height);
        }

        private _centerDialog(dialog: Laya.Dialog): void {
            dialog.x = Math.round(((CommonConfig.viewWidth - dialog.width) >> 1) + dialog.pivotX);
            dialog.y = Math.round(((CommonConfig.viewHeight - dialog.height) >> 1) + dialog.pivotY);
        }

    }
}
