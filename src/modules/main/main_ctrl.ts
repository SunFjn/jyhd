///<reference path="../config/scene_cfg.ts"/>

/** 主界面控制器*/
namespace modules.main {
    import BaseCtrl = modules.core.BaseCtrl;
    import scene = Configuration.scene;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import Button = Laya.Button;
    import CustomClip = modules.common.CustomClip;

    export class MainCtrl extends BaseCtrl {
        private static _instance: MainCtrl;
        public static get instance(): MainCtrl {
            return this._instance = this._instance || new MainCtrl();
        }

        private _exitBtn: Button;
        private _lgt: CustomClip;
        private _lgtBigClip: CustomClip;
        constructor() {
            super();
            this.initLgt();
            this.initLgtBigClip();
        }
        private initLgt() {
            this._lgt = new CustomClip();
            this._lgt.skin = "assets/effect/atemp.atlas";
            this._lgt.frameUrls = ["atemp/1.png", "atemp/4.png", "atemp/8.png", "atemp/2.png", "atemp/6.png", "atemp/3.png", "atemp/5.png", "atemp/7.png"];
            this._lgt.durationFrame = 4;
            this._lgt.loop = false;
            Laya.stage.addChild(this._lgt);
            this._lgt.alpha = 0;
            this._lgt.scale(0.5, 0.5);
            this._lgt.mouseEnabled = false; //取消点击事件 
        }
        private initLgtBigClip() {
            this._lgtBigClip = new CustomClip();
            this._lgtBigClip.skin = "assets/effect/atemp_1.atlas";
            let frames: Array<string> = [];
            for (let index = 0; index < 8; index++) {
                frames.push("atemp_1/eff_" + index + ".png")
            }
            this._lgtBigClip.frameUrls = frames;
            this._lgtBigClip.durationFrame = 4;
            this._lgtBigClip.loop = false;
            Laya.stage.addChild(this._lgtBigClip);
            this._lgtBigClip.alpha = 0;
            //this._lgtBigClip.scale(0.5, 0.5);
            this._lgtBigClip.mouseEnabled = false; //取消点击事件 
        }

        public setup(): void {

        }

        // 进入场景(场景控制器里调用)
        public enterScene(mapId: number): void {
            let cfg: scene = SceneCfg.instance.getCfgById(mapId);
            let type: int = cfg[sceneFields.type];
            if (type === SceneTypeEx.common) {            // 挂机场景
                // 主界面分为多个靠边的面板
                WindowManager.instance.open(WindowEnum.TOP_PANEL);
                WindowManager.instance.open(WindowEnum.BOTTOM_PANEL);
                WindowManager.instance.open(WindowEnum.LEFT_TOP_PANEL);
                WindowManager.instance.open(WindowEnum.LEFT_BOTTOM_PANEL);
                if (!Main.instance.isWXiOSPay) {
                    WindowManager.instance.open(WindowEnum.RIGHT_TOP_PANEL);
                }
                WindowManager.instance.open(WindowEnum.RIGHT_BOTTOM_PANEL);

            } else {              // 副本
                WindowManager.instance.open(WindowEnum.BOTTOM_PANEL);
                WindowManager.instance.open(WindowEnum.LEFT_TOP_PANEL);
                WindowManager.instance.open(WindowEnum.TOP_PANEL);
                WindowManager.instance.open(WindowEnum.LEFT_BOTTOM_PANEL);
                if (!Main.instance.isWXiOSPay) {
                    WindowManager.instance.close(WindowEnum.RIGHT_TOP_PANEL);
                }
                WindowManager.instance.close(WindowEnum.RIGHT_BOTTOM_PANEL);
            }

            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        }

        private onMouseDown(e: Event) {
            let pointX = Laya.MouseManager.instance.mouseX;
            let pointY = Laya.MouseManager.instance.mouseY;
            // console.log("-----------点击效果：" + e.target.constructor.name + "," + e.target.hasOwnProperty(GlobalSecondEffectBtnTag.BTN_KEY) + "," + e.target[GlobalSecondEffectBtnTag.BTN_KEY]);
            if (this.checkItemClickEffect(e)) {
                this.playClickAnim(this._lgtBigClip, pointX, pointY, 180);
            } else {
                this.playClickAnim(this._lgt, pointX, pointY, 180);
            }
        }

        private playClickAnim(clip: CustomClip, desPosX: number, desPosY: number, deltaTime: number) {
            clip.pos(desPosX, desPosY);
            clip.anchorX = clip.anchorY = 0.5;
            clip.play();
            TweenJS.create(clip).to({ alpha: 1 }, deltaTime)
                .easing(utils.tween.easing.quartic.Out)
                .onComplete((): void => {
                    TweenJS.create(clip).to({ alpha: 0 }, deltaTime)
                        // .onComplete(() => {
                        //     this._lgt.stop();
                        // })
                        .start()
                }).start()
        }

        private checkItemClickEffect(event: Event): boolean {
            let isHave = event.target.constructor.name == "Button" || event.target.constructor.name == "BaseItem"
                || event.target.constructor.name == "SkillItem" || event.target.constructor.name == "BagItem"
                || event.target.constructor.name == "GoldBodyItem" || event.target.constructor.name == "MarryItem"
                || event.target.constructor.name == "EnterItem" || event.target.constructor.name == "ActivityIconItem"
                || event.target.constructor.name == "RechargeItem" || event.target.constructor.name == "StoreItem"
                || event.target.constructor.name == "ComposeSelectItem" || event.target.constructor.name == "ComposeItem"
                || event.target.constructor.name == "SEquipmentSiHunItem" || event.target.constructor.name == "ExtremeItem"
                || (event.target.hasOwnProperty(GlobalSecondEffectBtnTag.BTN_KEY) && event.target[GlobalSecondEffectBtnTag.BTN_KEY] == GlobalSecondEffectBtnTag.BTN_VALUE)
            return isHave;
        }
    }
}