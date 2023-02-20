namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import Property = game.role.Property;
    import Sprite = Laya.Sprite;
    import Image = Laya.Image;
    import Texture = Laya.Texture;

    export class ShadowComponent extends EntityComponent<WorldMessage, World> {
        private _sprite: Sprite;
        private _elements: Map<number, [Property, Image, boolean, number]>
        private static _imagePool: Image[];
        private _texture: Texture;

        constructor(owner: World, url: string) {
            super(owner);
            let sprite = new Sprite();
            this._sprite = sprite
            this._sprite.name = "脚底焦点层";
            this._sprite = sprite;
            this._elements = new Map<number, [Property, Image, boolean, number]>();
            ShadowComponent._imagePool = [];
            Laya.loader.load("assets/image/shadow.png", Handler.create(this, this.onTileComplete));
        }
        private onTileComplete(): void {
            this._texture = Laya.loader.getRes("assets/image/shadow.png")
        }


        public setup(): void {
            this.owner.publish("addToLayer", LayerType.Background, this._sprite);
            this.owner.on("castShadow2D", this, this.castShadow2D);
            this.owner.on("leaveScene", this, this.leaveScene);
        }

        public teardown(): void {

            this._sprite.removeSelf();
            this.owner.off("castShadow2D", this, this.castShadow2D);
            this.owner.off("leaveScene", this, this.leaveScene);
        }

        public destory(): void {
            this._sprite.destroy();

        }

        private getImagePool() {
            let image: Image;
            if (ShadowComponent._imagePool.length == 0) {
                image = new Image();
            } else {
                image = ShadowComponent._imagePool.shift();
            }

            if (!this._texture) {
                console.error("脚底焦点加载失败")
            } else {
                image.source = this._texture
            }

            return image;
        }
        private pushImagePool(image: Image) {
            image.pos(0, 0);
            ShadowComponent._imagePool.push(image)
        }

        private castShadow2D(isAdd: boolean, scale: number, element: Property): void {
            if (element.get('avatarSK') == undefined) {
                return;
            }
            let id = element.get('id');
            let dataId = id;
            if (element.get('isPet')) {//宠物Id和玩家Id一样，为了区分宠物主角id*=2
                dataId = id * 2;
            }
            let guangHuanId = (element.get("exterior") && element.get("exterior").length == 7) ? element.get("exterior")[6] : 0;
            if (isAdd && (!guangHuanId || guangHuanId && modules.rename.SetCtrl.instance.isHideSelfGuangHuan)) {//有光环,不要阴影
                let image = this.getImagePool();
                this._elements.set(dataId, [element, image, true, id])
                this._sprite.addChild(image)
                image.anchorX = 0.5;
                image.anchorY = 0.5;
                image.scale(scale, scale, true);
            } else {
                if (!this._elements.has(dataId)) return;
                this._elements.get(dataId)[2] = false;
                let item = this._elements.get(dataId);
                let image = item[1];
                image.removeSelf();
                this.pushImagePool(image);
                item[1] = null;
                this._elements.delete(dataId);
            }
        }

        private leaveScene(): void { }

        public update(): void {
            this._elements.forEach((value, id) => {

                if (value[0] !== undefined && !value[0].get("levitation")) { // 浮空时阴影不变化
                    let pos = value[0].get('avatarSK').getSKPositon();
                    value[1].pos(pos.x, pos.y)
                    if (id / 2 == value[3]) {//宠物Id和玩家Id一样，为了区分宠物主角id*=2
                        value[1].pos(pos.x - 40, pos.y - 40)
                    }
                }
            })
        }
    }
}
