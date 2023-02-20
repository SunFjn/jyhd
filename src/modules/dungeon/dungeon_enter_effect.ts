/** 副本入场动画*/


namespace modules.dungeon {

    import Image = Laya.Image;
    import Layer = ui.Layer;
    import TweenGroup = utils.tween.TweenGroup;

    export class DungeonEnterEffect extends BaseView {
        private _bg: Image;
        private _txtImg: Image;
        private _tweenGroup: TweenGroup;

        protected initialize(): void {
            super.initialize();

            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;
            this._bg = new Image("dungeon/bj_tongyong_4.png");
            this.addChild(this._bg);
            this._txtImg = new Image("dungeon/bj_tongyong_3.png");
            this.addChild(this._txtImg);
            this._txtImg.size(240, 102);
            this._txtImg.anchorX = this._txtImg.anchorY = 0.5;

            this.width = 492;
            this.height = 185;

            this.top = 150;
            this.left = 0;

            this._tweenGroup = new TweenGroup();
        }

        protected onOpened(): void {
            super.onOpened();

            this._bg.pos(-500, 0, true);
            this._txtImg.pos(296, 103, true);
            this._txtImg.visible = false;
            this._txtImg.scale(1, 1, true);
            TweenJS.create(this._bg, this._tweenGroup).to({x: 0}, 300).chain(
                TweenJS.create(this._bg, this._tweenGroup).to({x: -500}, 300).delay(1000)
            ).start();
            TweenJS.create(this._txtImg, this._tweenGroup).delay(300).onComplete((): void => {
                this._txtImg.visible = true;
            }).chain(
                TweenJS.create(this._txtImg, this._tweenGroup).to({scaleX: 1.2, scaleY: 1.2}, 250).chain(
                    TweenJS.create(this._txtImg, this._tweenGroup).to({scaleX: 1, scaleY: 1}, 250).chain(
                        TweenJS.create(this._txtImg, this._tweenGroup).delay(500).to({x: -204}, 300).onComplete((): void => {
                            this.close();
                        })
                    )
                )
            ).start();
        }

        public destroy(destroyChild: boolean = true): void {
            this._tweenGroup = this.destroyElement(this._tweenGroup);
            super.destroy(destroyChild);
        }

        public close(): void {
            this._tweenGroup.removeAll();
            super.close();
        }
    }
}