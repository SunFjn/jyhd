/** 通用成功特效，文字图片可以更换*/


namespace modules.effect {
    import CustomClip = modules.common.CustomClip;
    import Image = Laya.Image;
    import Event = Laya.Event;

    export class SuccessEffect extends BaseView {
        // 特效
        private _effect: CustomClip;
        // 美术字图片
        private _txtImg: Image;
        private _tween: TweenJS;
        private _skeleton: Laya.Skeleton;

        private enterFirst:boolean = false;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.width = 800;
            this.height = 400;

            this.top = 140;
            this.centerX = 0;

            this.mouseEnabled = false;

            this._effect = new CustomClip();
            this.addChild(this._effect);
            let frameUrls: Array<string> = [];
            for (let i: int = 0, len: int = 8; i < len; i++) {
                frameUrls.push(`assets/effect/success/${i}.png`);
            }
            this._effect.pos(228, 130);
            this._effect.frameUrls = frameUrls;
            this._effect.durationFrame = 5;
            this._effect.loop = false;
            this._effect.zOrder = 10;

            this._txtImg = new Image();
            this._txtImg.anchorX = this._txtImg.anchorY = 0.5;
            this._txtImg.pos(400, 226, true);
            this.initEffectBg();
        }

        private initEffectBg() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this._skeleton.pos(400, 252);
            this._skeleton.zOrder = -1
            this.addChild(this._skeleton);
            this._skeleton.load("assets/effect/success/uitx1.sk",Laya.Handler.create(this,()=>{
                this._skeleton.play(0,false)
                this._skeleton.playbackRate(0.5);
                this.enterFirst = true;
            }));
        }

        public play(): void {
            if (this._tween) this._tween.stop();
            this._txtImg.removeSelf();
            this._effect.on(Event.COMPLETE, this, this.effectCompleteHandler);
            this.addChild(this._effect);
            this._effect.play();
            Laya.timer.frameOnce(this._effect.durationFrame, this, this.delayHandler);
            if (this.enterFirst) {
                this._skeleton.play(0, false);
            }
        }

        private delayHandler(): void {
            this._txtImg.alpha = 1;
            this.addChildAt(this._txtImg, 0);
        }

        public set txtUrl(value: string) {
            this._txtImg.skin = value;
        }

        private effectCompleteHandler(): void {
            this._effect.off(Event.COMPLETE, this, this.effectCompleteHandler);
            this._tween = TweenJS.create(this._txtImg).to({alpha: 0}, 300).onComplete(this.txtDisapper.bind(this)).start();
        }

        private txtDisapper(): void {
            this._txtImg.skin = "";
            this._txtImg.removeSelf();
            this.close();
        }

        public close(): void {
            this._effect.stop();
            this._effect.off(Event.COMPLETE, this, this.effectCompleteHandler);
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            this._txtImg = this.destroyElement(this._txtImg);
            this._effect = this.destroyElement(this._effect);
            if (this._skeleton) {
                this._skeleton = this.destroyElement(this._skeleton);
            }
        }
    }
}