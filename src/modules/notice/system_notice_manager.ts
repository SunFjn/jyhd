/** 系统提示管理器*/

///<reference path="../../utils/tween/tween.ts"/>

namespace modules.notice {
    import TweenJS = utils.tween.TweenJS;
    import Layer = ui.Layer;

    export class SystemNoticeManager {
        private static _instance: SystemNoticeManager;
        public static get instance(): SystemNoticeManager {
            return this._instance = this._instance || new SystemNoticeManager();
        }

        private _panel: SystemNoticePanel;

        private _tween: TweenJS;

        constructor() {
        }

        public addNotice(txt: string | Array<Array<string>>, isError: boolean = false, layer: Layer = Layer.EFFECT_LAYER, remainTime: number = 1000): void {
            if (!this._panel) this._panel = new SystemNoticePanel();
            // LayerManager.instance.addToEffectLayer(this._panel);
            LayerManager.instance.getLayerById(layer).addChild(this._panel);
            // Tween.clearTween(this._panel);
            let txtStr = "";
            let _class = typeof (txt);
            if (_class.toString() == "string") {
                txtStr = <string>txt;
            } else {
                for (let index = 0; index < txt.length; index++) {
                    let element = txt[index];
                    txtStr += element;
                }
            }
            this._panel.setTxt(txtStr, isError ? modules.common.CommonUtil.getColorByQuality(5) : modules.common.CommonUtil.getColorByQuality(1), isError);
            this._panel.pos(CommonConfig.viewWidth - this._panel.width >> 1, 500, true);
            // this._panel.alpha = 1;

            this.tween(remainTime);
        }

        private tween(remainTime: number): void {
            if (this._tween) {
                this._tween.stop();
                this._panel.y = 500;
                // this._tween.start();
            }
            //  else {
            this._tween = TweenJS.create(this._panel).to({y: 440}, 80).chain(
                TweenJS.create(this._panel).to({y: 380}, 80).delay(remainTime).onComplete(this.removeHandler.bind(this))
            ).combine(true).start();
            // }
            // Tween.to(this._panel, {y:440}, 80, Ease.linearNone, Handler.create(this, this.disappearHandler));
        }

        // private disappearHandler():void{
        //     Tween.to(this._panel, {y:380}, 80, Ease.linearNone, Handler.create(this, this.removeHandler), 1000);
        // }

        private removeHandler(): void {
            this._panel.removeSelf();
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
        }
    }
}