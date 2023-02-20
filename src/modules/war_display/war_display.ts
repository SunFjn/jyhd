namespace modules.warDisplay {

    import WarDisplayUI = ui.WarDisplayUI;
    import CustomClip = modules.common.CustomClip;
    import PlayerModel = modules.player.PlayerModel;
    import TweenGroup = utils.tween.TweenGroup;

    export class WarDisplay extends WarDisplayUI {
        private _addWarEffect: CustomClip;  //战力提升特效
        private _explodeEffect: CustomClip;  //爆炸特效

        private _tweenGroup: TweenGroup;
        private _loopCount: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerY = 135;
            this.centerX = 0;
            this.layer = ui.Layer.EFFECT_LAYER;

            this._addWarEffect = new CustomClip();
            this._addWarEffect.visible = false;
            this._addWarEffect.loop = false;
            this._addWarEffect.skin = "assets/effect/addWarEffect.atlas";
            this._addWarEffect.frameUrls = [
                "addWarEffect/1.png", "addWarEffect/2.png",
                "addWarEffect/3.png", "addWarEffect/4.png",
                "addWarEffect/5.png", "addWarEffect/6.png"];
            this._addWarEffect.pos(10, -20);
            this.bgImage.addChild(this._addWarEffect);

            this._explodeEffect = new CustomClip();
            this._explodeEffect.visible = false;
            this._explodeEffect.loop = false;
            this._explodeEffect.skin = "assets/effect/explodeEffect.atlas";
            this._explodeEffect.frameUrls = [
                "explodeEffect/1.png", "explodeEffect/2.png",
                "explodeEffect/3.png", "explodeEffect/4.png",
                "explodeEffect/5.png", "explodeEffect/6.png",
                "explodeEffect/7.png", "explodeEffect/8.png"];
            this._explodeEffect.pos(-54, 0);
            this._explodeEffect.durationFrame = 3;
            this.addChild(this._explodeEffect);

            this._tweenGroup = new TweenGroup();
        }

        protected onOpened(): void {
            super.onOpened();

            this.moveEnter();
            this._explodeEffect.visible = false;
            this._addWarEffect.visible = false;
            this.bgImage.scaleX = this.bgImage.scaleY = 1;
            this._addWarEffect.scaleX = this._addWarEffect.scaleY = 1;
            // 打开面板时播放放大缩小特效
            TweenJS.create(this.bgImage, this._tweenGroup)
                .to({
                    scaleX: 1.2,
                    scaleY: 1.2
                }, 100)
                .start().yoyo(true)
                .onComplete((): void => {
                    this._addWarEffect.play();
                    this._addWarEffect.visible = true;
                    TweenJS.create(this._addWarEffect, this._tweenGroup)
                        .to({ scaleX: 1.2, scaleY: 1.2 }, 100);
                });

            this.initWar();
            this.tweenFight();
        }

        private moveEnter() {
            let preX = this.x;
            this.x = preX + 200;
            TweenJS.create(this).to({ x: preX }, 12)
                .easing(utils.tween.easing.circular.InOut)
                .start()
        }

        public close(): void {
            super.close();
            this._tweenGroup.removeAll();
            this._explodeEffect.visible = false;
            this._explodeEffect.stop();
            this._addWarEffect.visible = false;
            this._addWarEffect.stop();
        }

        // 初始化战力
        public initWar() {
            let curFight: number = PlayerModel.instance.fight;
            let preFight: number = PlayerModel.instance.beforefight;
            this.warnum.value = curFight.toString();
            this.addwarnum.value = "+" + (curFight - preFight).toString();
            this.addwarnum.visible = false;
            this.addwarnum.y = 0;
        }

        // 缓动战力
        private tweenFight(): void {
            // this.warnum.visible = false;
            this._loopCount = 0;
            Laya.timer.loop(50, this, this.loopFight);
        }

        private loopFight(): void {
            let fightStr: string = this.warnum.value;
            let tmpStr: string = "";
            for (let i: int = 0, len: int = fightStr.length; i < len; i++) {
                tmpStr += (parseInt(fightStr[i]) + 1) % 10;
            }
            this.warnum.value = tmpStr;
            this._loopCount++;
            if (this._loopCount === 10) {
                Laya.timer.clear(this, this.loopFight);
                // 播放增加战力缓动
                this.addwarnum.visible = true;
                this._explodeEffect.visible = true;
                this._explodeEffect.play();
                TweenJS.create(this.addwarnum, this._tweenGroup).to({ y: -20 }, 500).start().onComplete((): void => {
                    Laya.timer.once(500, this, this.close);
                });
            }
        }

        public updataWar(): void {
            this._tweenGroup.removeAll();
            Laya.timer.clearAll(this);
            this._explodeEffect.visible = false;
            this._explodeEffect.stop();
            this.initWar();
            this.tweenFight();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            this._tweenGroup = this.destroyElement(this._tweenGroup);
            this._explodeEffect = this.destroyElement(this._explodeEffect);
            this._addWarEffect = this.destroyElement(this._addWarEffect);
        }
    }
}