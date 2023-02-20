///<reference path="../../game/map/map_sprite_layer.ts"/>
namespace game.misc {
    import Rectangle = Laya.Rectangle;
    import SceneModel = modules.scene.SceneModel;

    export class ViewBounds {
        private _outerArea: Rectangle;
        private _innerArea: Rectangle;
        private _viewport: Rectangle;
        private _area: Rectangle;

        private _width: number;
        private _height: number;

        private _tileWidth: number;
        private _tileHeight: number;

        private _offsetX: number;
        private _offsetY: number;

        private _cols: number;
        private _rows: number;

        private _negativeY: boolean;

        private _force: boolean;

        constructor(negativeY: boolean) {
            this._offsetX = this._offsetY = 0;
            this._tileWidth = this._tileHeight = 0;
            this._cols = this._rows = 0;
            this._force = true;
            this._viewport = new Rectangle();
            this._outerArea = new Rectangle();
            this._innerArea = new Rectangle();
            this._area = new Rectangle();
            this._negativeY = negativeY;
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        public get cols(): number {
            return this._cols;
        }

        public get rows(): number {
            return this._rows;
        }

        public get viewport(): Rectangle {
            return this._viewport;
        }

        public set viewport(value: Rectangle) {
            this._viewport.copyFrom(value);
            this.updateInnerArea();
        }

        public reset(x: number, y: number, width: number, height: number, tileWidth: number, tileHeight: number): void {
            this._width = width;
            this._height = height;
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._outerArea.setTo(x, y, width, height);
            this._cols = width / tileWidth;
            this._rows = height / tileHeight;
            this.updateInnerArea();
        }

        protected updateInnerArea(): void {
            let w = this._viewport.width;
            let h = this._viewport.height;

            this._innerArea.setTo(
                this._outerArea.x + (w >> 1),
                this._outerArea.y + (h >> 1),
                this._outerArea.width - w,
                this._outerArea.height - h
            );
            this._force = true;
        }

        public updateOffset(x: number, y: number): void {
            this._negativeY && (y = -y);

            if (x < this._innerArea.x) {
                x = this._innerArea.x;
            } else if (x > this._innerArea.right && !SceneModel.instance.isHangupScene) {
                x = this._innerArea.right;
            }

            if (y < this._innerArea.y) {
                y = this._innerArea.y;
            } else if (y > this._innerArea.bottom) {
                y = this._innerArea.bottom;
            }
            
            x = x | 0;
            y = y | 0;

            if (x == this._offsetX && y == this._offsetY) {
                return;
            }

            this._force = true;
            this._offsetX = x;
            this._offsetY = y;
        }

        protected updateViewArea(): void {
            this._force = false;
            let w = this._viewport.width >> 1;
            let h = this._viewport.height >> 1;
            let tw = this._tileWidth;
            let th = this._tileHeight;
            //规范化坐标
            let left = (this._offsetX - w) / tw | 0;
            let right = (this._offsetX + w + tw - 1) / tw | 0;
            let top = (this._offsetY - h) / th | 0;
            let bottom = (this._offsetY + h + th - 1) / th | 0;

            // 挂机场景轮循
            // if (SceneModel.instance.isHangupScene) left = left % 7;
            if (SceneModel.instance.isHangupScene) left = left % game.map.MapSpriteLayer.mapClos;

            this._area.setTo(left, top, right - left, bottom - top);
        }

        public get force(): boolean {
            return this._force;
        }

        public get viewArea(): Rectangle {
            if (this._force) {
                this.updateViewArea();
            }

            return this._area;
        }

        public get offsetX(): number {
            return this._offsetX;
        }

        public get offsetY(): number {
            return this._negativeY ? -this._offsetY : this._offsetY;
        }
    }
}