namespace modules.common {
    import VirtualrockerItemUI = ui.VirtualrockerItemUI;
    import Event = Laya.Event;
    import Point = Laya.Point;
    import GameCenter = game.GameCenter;
    export class VirtualrockerItem extends VirtualrockerItemUI {
        /** 是否按下摇杆的柄 */
        private _isPressHandler: boolean = false;
        /** 摇杆的中心点 */
        private _centerPoint: Point = new Point();
        /** 摇杆柄的局部位置 */
        private _localPoint: Point = new Point();
        /** 摇杆柄的局部位置相对于stage在水平方向上的增量 */
        private _deltaX: number = 0;
        private _deltaY: number = 0;

        /** 摇杆方向, 包含尺度(0 - 1) */
        public dir: Point = new Point();
        public direction: number = -1 // 方向结果
        private _radius: number = 75
        constructor() {
            super();
            this.rockerRegion.alpha = 0;

        }
        private init() {
            this.bottom = 0
            this.size(CommonConfig.viewWidth, CommonConfig.viewHeight)
            this.centerX = 0
            this._centerPoint.setTo(this.rockerBg.pivotX, this.rockerBg.pivotY);
        }
        //启动虚拟摇杆 
        public start() {
            this.init();
            this.addAutoListener(this.rockerRegion, common.LayaEvent.MOUSE_DOWN, this, this.onTouchBegin);
            this.addAutoListener(Laya.stage, common.LayaEvent.MOUSE_UP, this, this.onTouchEnd);
            this.addAutoListener(Laya.stage, common.LayaEvent.MOUSE_OUT, this, this.onTouchEnd); // 超出范围
            // this.addAutoListener(this.rockerRegion, common.LayaEvent.MOUSE_OUT, this, this.onTouchEnd); // 超出范围
            this.addAutoListener(Laya.stage, common.LayaEvent.MOUSE_MOVE, this, this.onTouchMove);
            // GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resize);
            // this.resize();
        }
        // public resize(): void {
        //     this.width = CommonConfig.viewWidth;
        //     this.height = CommonConfig.viewHeight;
        // }
        //触摸开始，显示虚拟摇杆
        private onTouchBegin(e: Event) {
            if (this._isPressHandler) return;
            this._isPressHandler = true;
            this._downTime = Browser.now();
            this._downTarget = e.currentTarget;

        }
        //触摸结束，隐藏虚拟摇杆
        private onTouchEnd(e: Event) {
            if (!this._isPressHandler) return;
            this._isPressHandler = false;
            this.rockerBg.pos(this.rockerRegion.width / 2, this.rockerRegion.height / 2);
            this.rocker.pos(this._centerPoint.x, this._centerPoint.y);
            this.dir = new Point();
            this.rockerBg.visible = false;
            if (!!this._downTarget && this._downTarget !== e.currentTarget) {
                let offsetT: number = Browser.now() - this._downTime;
                if (offsetT < 300) {
                    let pointX = Laya.MouseManager.instance.mouseX;
                    let pointY = Laya.MouseManager.instance.mouseY;
                    PlayerModel.instance.selectTargetType = SelectTargetType.Dummy;
                    game.GameCenter.instance.world.publish("stageClick", pointX, pointY);
                }
            }
            this.event('rocker_end')
        }
        private onTouchMove(e: Event) {
            if (!this._isPressHandler) return;
            this._downTarget = null;
            let p = this.globalToLocal(new Point(e.stageX, e.stageY))
            if (!this.rockerBg.visible) {
                this.rockerBg.pos(p.x, p.y - this.rockerRegion.y); // 让摇杆追随玩家手指
                this._deltaX = this.rockerRegion.x + this.rockerBg.x - this.rockerBg.pivotX;
                this._deltaY = this.rockerRegion.y + this.rockerBg.y - this.rockerBg.pivotY;
                this.rockerBg.visible = true;
                PlayerModel.instance.selectTargetType = SelectTargetType.Dummy;
            }

            /** 移动摇杆柄 */
            this._localPoint.x = p.x - this._deltaX;
            this._localPoint.y = p.y - this._deltaY;

            if (MapUtils.calcDistanceEx(this._localPoint, this._centerPoint) > this._radius) { // 超过摇杆半径时处理
                this._localPoint.setTo(this._localPoint.x - this._centerPoint.x, this._localPoint.y - this._centerPoint.y);
                this._localPoint.normalize();
                this.dir.setTo(this._localPoint.x, this._localPoint.y);
                this._localPoint.setTo(this._centerPoint.x + this._localPoint.x * this._radius, this._centerPoint.y + this._localPoint.y * this._radius);
            } else {
                this.dir.setTo((this._localPoint.x - this._centerPoint.x) / this._radius, (this._localPoint.y - this._centerPoint.y) / this._radius);
            }
            this.rocker.pos(this._localPoint.x, this._localPoint.y);
            this.direction = this.getDirection(MapUtils.getAngleByPoint(this._centerPoint, this._localPoint));
            this.event('rocker_move')

        }

        private getDirection(angle) {
            let result = -1
            // if (angle >= 315 || angle <= 45) {
            //     // 右
            //     result = 3
            // } else if (angle >= 45 && angle <= 135) {
            //     // 下
            //     result = 1
            // } else if (angle >= 135 && angle <= 225) {
            //     // 左
            //     result = 2
            // } else {
            //     // 上
            //     result = 0
            // }
            // 上下左右 0 1 2 3 左上左下右上右下 4 5 6 7
            if (angle <= 22.5 && angle >= 0 || angle <= 360 && angle >= 337.5)
                result = 3
            else if (angle <= 67.5 && angle >= 22.5)
                result = 7
            else if (angle <= 112.5 && angle >= 67.5)
                result = 1
            else if (angle <= 157.5 && angle >= 112.5)
                result = 5
            else if (angle <= 202.5 && angle >= 157.5)
                result = 2
            else if (angle <= 247.5 && angle >= 202.5)
                result = 4
            else if (angle <= 292.5 && angle >= 247.5)
                result = 0
            else if (angle <= 337.5 && angle >= 292.5)
                result = 6

            return result

        }



    }
}