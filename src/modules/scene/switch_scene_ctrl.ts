/** 转场动画*/


namespace modules.scene {
    import Sprite = Laya.Sprite;
    import Texture = Laya.Texture;

    export class SwitchSceneCtrl {
        private static _instance: SwitchSceneCtrl;
        public static get instance(): SwitchSceneCtrl {
            return this._instance = this._instance || new SwitchSceneCtrl();
        }

        private _bgTop: Laya.Sprite;
        private _bgBottom: Laya.Sprite;
        private _bgLockTop: Laya.Sprite;
        private _bgLockBottom: Laya.Sprite;
        private _bgKeyOn: Laya.Sprite;
        private _bgKeyDown: Laya.Sprite;
        private _bgBase: Laya.Sprite;
        private _bgCloud: Laya.Sprite;
        private _bgBlack: Laya.Sprite;

        private topImg: string;
        private bottomImg: string;
        private lockTopImg: string;
        private lockBottomImg: string;
        private keyOn: string;
        private keyDown: string;
        private base: string;
        private cloud: string;
        private black: string;


        private _play: boolean = false;
        constructor() {

        }

        public tweenCloudEnter() {
            if (this._play) return;
            // this.openTheDoor();
            this.openTheBlackBg();
        }

        public tweenCloudLeave(): void {
            // this.closeTheDoor()
        }

        public clearBg() {
            // console.log("过场动画资源清理");
            this.clearImg(this._bgTop);
            this.clearImg(this._bgLockTop);
            this.clearImg(this._bgKeyOn);
            this.clearImg(this._bgBottom);
            this.clearImg(this._bgLockBottom);
            this.clearImg(this._bgKeyDown);
            this.clearImg(this._bgBase);
            this.clearImg(this._bgCloud);
            this.clearImg(this._bgBlack);
            this._play = false
        }

        private clearImg(spr: Laya.Sprite) {
            if (!spr) return;
            spr.removeSelf();
            spr.graphics.clear();
        }

        /**
         * 
         * @param frontImg 需要改变的转动或移动img图片(仅仅是旋转类型图片)
         * @param wid img宽度
         * @param hei img高度
         * @param rotate 转动角度
         * @param enterTime 进入时间
         * @param lockTime 转动时间
         * @param leaveTime 退出时间
         */
        private createImg(texture: string, frontImg: Laya.Sprite, wid: number, hei: number, rotate: number, enterTime: number, lockTime: number, leaveTime: number) {
            frontImg.graphics.drawTexture(Laya.loader.getRes(texture), 0, 0, wid, hei);
            frontImg.pivotX = wid / 2;
            frontImg.pivotY = hei / 2;
            frontImg.pos(Laya.stage.width / 2, -hei / 2);

            TweenJS.create(frontImg).to({ y: Laya.stage.height / 2 }, enterTime)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(frontImg).to({ rotation: rotate }, lockTime)
                        .onComplete((): void => {
                            TweenJS.create(frontImg).to({ y: -hei / 2 }, leaveTime)
                                .easing(utils.tween.easing.circular.InOut)
                                .start()
                        })
                        .start()
                }).start()
        }

        private openTheDoor() {
            this._play = true;
            this.topImg = "door_open/door_top.png";
            this.bottomImg = "door_open/door_bottom.png";
            this.lockTopImg = "door_open/lock_top.png";
            this.lockBottomImg = "door_open/lock_bottom.png"
            this.keyDown = "door_open/key_down.png"
            this.keyOn = "door_open/key_on.png";
            this.base = "door_open/base.png"
            this.cloud = "door_open/cloud.png";

            //设置舞台背景色
            Laya.stage.bgColor = "#ffffff";
            //先加载图片资源，在图片资源加载成功后，通过回调方法绘制图片并添加到舞台
            Laya.loader.load([this.topImg, this.bottomImg, this.lockTopImg, this.lockBottomImg, this.keyDown, this.keyOn, this.base, this.cloud], (Laya.Handler.create(this, this.graphicsImg)));
        }

        public openTheBlackBg() {
            this.black = "door_open/black.png";
            Laya.stage.bgColor = "#ffffff";
            Laya.loader.load([this.black], (Laya.Handler.create(this, this.graphicsBg)));
        }

        private graphicsBg() {
            let enterTime = 800;
            let leaveTime = 800;
            let lockTime = 260;
            let width = Laya.stage.width;
            let height = Laya.stage.height;
            this._bgBlack = new Laya.Sprite();
            this._bgBlack.graphics.drawTexture(Laya.loader.getRes(this.black), 0, 0, width, height);
            // this._bgBlack.scaleX = this._bgBlack.scaleY = 1.2;
       
            this._bgBlack.alpha = 0.9;

            Laya.stage.addChild(this._bgBlack);
            TweenJS.create(this._bgBlack).to({ alpha: 0 }, enterTime)
                .delay(lockTime)
                .easing(utils.tween.easing.linear.None)
                .start()

            setTimeout(() => {
                this.clearBg();
            }, lockTime + enterTime);
        }

        private graphicsImg() {
            let lockTime = 900;// 锁定时间ms
            let enterTime = 300;// 进入时间
            let leaveTime = 300;// 退出时间

            let width = Laya.stage.width;
            let height = Laya.stage.height;
            this._bgTop = new Laya.Sprite();
            this._bgBottom = new Laya.Sprite();
            this._bgLockTop = new Laya.Sprite();
            this._bgLockBottom = new Laya.Sprite();
            this._bgBase = new Laya.Sprite();
            this._bgKeyDown = new Laya.Sprite();
            this._bgCloud = new Laya.Sprite();
            this._bgKeyOn = new Laya.Sprite();
            //获取图片资源，绘制到画布
            this._bgTop.graphics.drawTexture(Laya.loader.getRes(this.topImg), 0, -height / 2, width, height / 2);
            this._bgBottom.graphics.drawTexture(Laya.loader.getRes(this.bottomImg), 0, height * 3 / 2, width, height / 2);
            this._bgLockTop.graphics.drawTexture(Laya.loader.getRes(this.lockTopImg), (width / 2) - 300, -300, 600, 300);
            this._bgLockBottom.graphics.drawTexture(Laya.loader.getRes(this.lockBottomImg), (width / 2) - 300, -300, 600, 300);

            //添加到舞台
            Laya.stage.addChild(this._bgBottom);
            Laya.stage.addChild(this._bgTop);
            Laya.stage.addChild(this._bgLockBottom);
            Laya.stage.addChild(this._bgLockTop);
            Laya.stage.addChild(this._bgBase);
            Laya.stage.addChild(this._bgKeyDown);
            Laya.stage.addChild(this._bgCloud);
            Laya.stage.addChild(this._bgKeyOn);
            
            this.createImg(this.base, this._bgBase, 464, 464, 60, enterTime, lockTime, leaveTime);
            this.createImg(this.cloud, this._bgCloud, 418, 418, -90, enterTime, lockTime, leaveTime);
            this.createImg(this.keyDown, this._bgKeyDown, 320, 320, 180, enterTime, lockTime, leaveTime);
            this.createImg(this.keyOn, this._bgKeyOn, 170, 170, -200, enterTime, lockTime, leaveTime);

            TweenJS.create(this._bgTop).to({ y: height / 2 }, enterTime)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(this._bgTop).to({ y: 0 }, leaveTime)
                        .delay(lockTime)
                        .easing(utils.tween.easing.circular.InOut)
                        .start()
                }).start()

            TweenJS.create(this._bgBottom).to({ y: -height }, enterTime)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(this._bgBottom).to({ y: -height / 2 }, leaveTime)
                        .delay(lockTime)
                        .easing(utils.tween.easing.circular.InOut)
                        .start()
                }).start()

            TweenJS.create(this._bgLockTop).to({ y: (height / 2) }, enterTime)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(this._bgLockTop).to({ y: 0 }, leaveTime)
                        .delay(lockTime)
                        .easing(utils.tween.easing.circular.InOut)
                        .start()
                }).start()

            TweenJS.create(this._bgLockBottom).to({ y: height / 2 + 300 }, enterTime)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(this._bgLockBottom).to({ y: height + 300 }, leaveTime)
                        .delay(lockTime)
                        .easing(utils.tween.easing.circular.InOut)
                        .start()
                }).start()

            setTimeout(() => {
                this.clearBg();
            }, enterTime + leaveTime + lockTime);
        }
    }
}