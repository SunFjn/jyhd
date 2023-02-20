/** 通用成功特效控制器*/

namespace modules.effect {
    import BaseCtrl = modules.core.BaseCtrl;

    export class SuccessEffectCtrl extends BaseCtrl {
        private static _instance: SuccessEffectCtrl;
        public static get instance(): SuccessEffectCtrl {
            return this._instance = this._instance || new SuccessEffectCtrl();
        }

        private _panel: SuccessEffect;
        private _panel2: SuccessEffect2;
        constructor() {
            super();

            this._panel = new SuccessEffect();
            this._panel2 = new SuccessEffect2();


        }

        public setup(): void {

        }

        public play(txtUrl: string): void {
            this._panel.txtUrl = txtUrl;
            LayerManager.instance.addToEffectLayer(this._panel);
            this._panel.play();
        }


        public play2(txtUrl: string): void {
            this._panel2.txtUrl = txtUrl;
            LayerManager.instance.addToEffectLayer(this._panel2);
            this._panel2.play();
        }
    }
}