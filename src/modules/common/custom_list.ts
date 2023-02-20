/** 自定义列表*/


namespace modules.common {
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Rectangle = Laya.Rectangle;
    type itemWH = [number, number];

    export enum showType {
        ALPHA = 0,
        WIDTH = 1,
        HEIGHT = 2,
    }
    //事件是 SELECT
    export class CustomList extends Sprite {

        public static create(dir: string, x: number, y: number, width: number, height: number, itemRender: any, space: number = 5, OtherDirCount: number = 1): CustomList {
            let list: CustomList = new CustomList();
            list.scrollDir = dir == 'v' ? 1 : 2;
            list.pos(x, y);
            list.size(width, height);
            dir == 'v' ? list.hCount = OtherDirCount : list.vCount = OtherDirCount;
            dir == 'v' ? list.spaceY = space : list.spaceX = space;
            list.itemRender = itemRender;
            return list;
        }
        // 滚动方向，1竖向（默认），2横向
        private _scrollDir: int;
        // 横向数量
        private _hCount: int;
        // 纵向数量
        private _vCount: int;
        // 数据
        private _datas: Array<any>;
        // 单元项
        private _items: Array<ItemRender>;
        // 横向间距
        private _spaceX: number;
        // 纵向间距
        private _spaceY: number;
        // 单元项类
        private _itemRender: any;
        // 单元项宽高
        private _itemWH: itemWH;
        // 选中数据
        private _selectedData: any;
        // 选中的单元项
        private _selectedItem: ItemRender;
        // 选中索引
        private _selectedIndex: int = -1;
        // 滚动位置
        private _scrollPos: number;
        // 当前滚动位置的的索引(目前只写了单列的计算)
        private _curIndex: number;
        // 滚动索引发生变化时回调
        private _scrollCallback: Function;

        private _lastIndex: number;
        private _specialXOffset: number;

        /** 整体item 相对于list的内上边距偏移 */
        private padding_top: number = 0;
        /** 整体item 相对于list的内左边距偏移 */
        private padding_left: number = 0;

        // 容器
        private _con: Sprite;

        private _lastPos: number = 0;
        private _dPos: number = 0;


        private _downX: number;
        private _downY: number;
        private _downTime: number;
        private _downTarget: Sprite;

        private _recordY: number;
        private _recordX: number;

        // private _signature: string;
        private _autoX: boolean = false
        private _autoY: boolean = false
        // 惯性滚动
        private _gxScroll: number;
        // 按下时间
        private _lastTime: number;

        //回弹效果参数
        /**
         * 回弹速度
         */
        private _kickBackTime: number = 200
        /**
         * 越界后移动效率 越小越慢
         */
        private _boundSpeed: number = 0.2
        /**
        * 是否开启回弹
        */
        public _switchKickBack: boolean = true

        private _kick_back_tween

        constructor() {
            super();

            this._scrollDir = 1;
            this._spaceX = this._spaceY = 0;
            this._scrollPos = 0;
            this._hCount = this._vCount = 1;
            this._gxScroll = 0;

            this._con = new Sprite();
            this.addChild(this._con);

            this.on(Event.DISPLAY, this, this.displayHandler);
            this.on(Event.UNDISPLAY, this, this.undisplayHandler);

            this._items = new Array<ItemRender>();

            this._recordX = this._recordY = 0;

            this._curIndex = 0;
            this._specialXOffset = 0;
            this._lastIndex = -1;
            // this._signature = new Error().stack;
        }

        private displayHandler(): void {
            this._con.on(Event.MOUSE_DOWN, this, this.downHandler);
            this._con.on(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private undisplayHandler(): void {
            this._con.off(Event.MOUSE_DOWN, this, this.downHandler);
            this._con.off(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private downHandler(): void {
            this.clearGx();
            this._lastPos = this._scrollDir === 1 ? this._con.mouseY : this._con.mouseX;
            this._dPos = this._scrollDir === 1 ? this.mouseY : this.mouseX;
            this._lastTime = GlobalData.serverTime;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offset: number = e.delta * -8;
            this.scroll(offset, false);
        }

        private moveHandler(): void {
            let offset: number = this._lastPos - (this._scrollDir === 1 ? this._con.mouseY : this._con.mouseX);
            this.scroll(offset, false);
            this._lastPos = this._scrollDir === 1 ? this._con.mouseY : this._con.mouseX;
        }


        private upHandler(): void {
            if (GlobalData.serverTime - this._lastTime < 200) {
                let offset: number = this._dPos - (this._scrollDir === 1 ? this.mouseY : this.mouseX);
                if (Math.abs(offset) > 5 && Math.abs(this._gxScroll) <= 5) {
                    this._gxScroll = offset;
                    Laya.timer.frameLoop(1, this, this.gxScroll);
                }
            }
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
            this.kickBack()
        }
        /**
         * 越界回弹
         */
        private kickBack() {
            if (this.destroyed) {
                return
            }
            let rect: Rectangle = this._con.scrollRect;
            if (this._scrollDir === 1) {
                if (rect.y < 0) {
                    this._kick_back_tween = TweenJS.create(this._con.scrollRect).to({ y: 0 }, this._kickBackTime)
                        .easing(utils.tween.easing.linear.None)
                        .onComplete(() => {
                            this._scrollPos = 0;
                        })
                        .start()

                } else if (rect.y > this._con.height - this.height && this._con.height - this.height >= 0) {
                    this._kick_back_tween = TweenJS.create(this._con.scrollRect).to({ y: this._con.height - this.height }, this._kickBackTime)
                        .easing(utils.tween.easing.linear.None)
                        .onComplete(() => {
                            this._scrollPos = this._con.height - this.height;
                        })
                        .start()
                }
            } else {
                if (rect.x < 0) {
                    this._kick_back_tween = TweenJS.create(this._con.scrollRect).to({ x: 0 }, this._kickBackTime)
                        .easing(utils.tween.easing.linear.None)
                        .onComplete(() => {
                            this._scrollPos = 0;
                        })
                        .start()
                } else if (rect.x > this._con.width - this.width && this._con.width - this.width >= 0) {
                    this._kick_back_tween = TweenJS.create(this._con.scrollRect).to({ x: this._con.width - this.width }, this._kickBackTime)
                        .easing(utils.tween.easing.linear.None)
                        .onComplete(() => {
                            this._scrollPos = this._con.width - this.width;
                        })
                        .start()
                }
            }
        }

        // 滚动回调
        public set scrollCallback(foo: Function) {
            this._scrollCallback = foo;
        }

        public get scrollCallback(): Function {
            return this._scrollCallback;
        }

        // 当前滚动位置索引
        public get curIndex(): number {
            return this._curIndex;
        }

        public get conWidth(): number {
            return this._con.width;
        }

        public get conHeight(): number {
            return this._con.height;
        }

        /**
         * 设置整体的item与list的左和上的内边距
         * 
         * @param left_padding 与左侧的内边距
         * @param top_padding 与顶部的内边距
         */
        public setPadding(left_padding: number = 0, top_padding: number = 0) {
            this.padding_top = top_padding;
            this.padding_left = left_padding;
        }
        /**
         * 控制按钮
         * @type {Array<Laya.Button>}
         */
        private _scrollBtn: Array<Laya.Button>;

        public set scrollBtn(btn: Array<Laya.Button>) {
            this._scrollBtn = btn
            if (btn.length > 0) btn[0].visible = false
        }

        /**
         * 控制按钮显/隐
         * @param c <左/上（头）, 右/下（尾）>
         * @param s
         */
        private scrollBtnShow(c: number, s: boolean) {
            if (!this._scrollBtn) return;
            this._scrollBtn[c].visible = s;
        }

        // 清除惯性定时器
        private clearGx() {
            this._gxScroll = 0;
            this.kickBack()
            Laya.timer.clear(this, this.gxScroll);
        }

        // 惯性定时器回调
        private gxScroll() {
            if (Math.abs(this._gxScroll) <= 5)
                return this.clearGx();
            this._gxScroll *= 0.95;
            this.scroll(this._gxScroll);
        }

        /**
         *  滚动偏移（相对于当前滚动位置的偏移）
         * @param offset 
         * @param isInertia 是否是惯性调用 为true不能越界
         * @returns 
         */
        public scroll(offset: number, isInertia: boolean = true): void {
            let rect: Rectangle = this._con.scrollRect;
            if (this._scrollDir === 1 ? this._con.height < this.height : this._con.width < this.width) return;
            if (this._switchKickBack) {
                // 纵向
                if (this._scrollDir === 1) {
                    if (rect.y < 0) {
                        if (offset <= 0) {
                            rect.y = rect.y + this._boundSpeed * offset;
                        } else {
                            rect.y = rect.y + offset
                        }
                    } else if (rect.y > this._con.height - this.height) { //右侧越界
                        if (offset >= 0) {
                            rect.y = rect.y + this._boundSpeed * offset;
                        } else {
                            rect.y = rect.y + offset
                        }
                    } else {
                        rect.y = rect.y + offset;
                    }

                    if (rect.y < 0) {
                        this.scrollBtnShow(0, false);
                    }
                    else if (rect.y > this._con.height - this.height) {
                        this.scrollBtnShow(1, false);
                    } else {
                        this.scrollBtnShow(0, true);
                        this.scrollBtnShow(1, true);
                    }
                    if (isInertia) {
                        if (rect.y < 0) {
                            rect.y = 0
                        } else if (rect.y > this._con.height - this.height) {
                            rect.y = this._con.height - this.height
                        }
                    }
                    this._scrollPos = rect.y
                }
                // 横向
                else if (this._scrollDir === 2) {
                    //左侧越界
                    if (rect.x < 0) {
                        if (offset <= 0) {
                            rect.x = rect.x + this._boundSpeed * offset;
                        } else {
                            rect.x = rect.x + offset
                        }
                    } else if (rect.x > this._con.width - this.width) { //右侧越界
                        if (offset >= 0) {
                            rect.x = rect.x + this._boundSpeed * offset;
                        } else {
                            rect.x = rect.x + offset
                        }
                    } else {
                        rect.x = rect.x + offset
                    }

                    if (rect.x < 0) {
                        // rect.x = 0;
                        this.scrollBtnShow(0, false);
                    }
                    else if (rect.x > this._con.width - this.width) {
                        // rect.x = this._con.width - this.width;
                        this.scrollBtnShow(1, false);
                    } else {
                        this.scrollBtnShow(0, true);
                        this.scrollBtnShow(1, true);
                    }
                    if (isInertia) {
                        if (rect.x < 0) {
                            rect.x = 0
                        } else if (rect.x > this._con.width - this.width) {
                            rect.x = this._con.width - this.width
                        }
                    }
                    this._scrollPos = rect.x;
                }
            } else {
                // 纵向
                if (this._scrollDir === 1) {
                    rect.y = rect.y + offset;
                    if (rect.y < 0) {
                        rect.y = 0;
                        this.scrollBtnShow(0, false);
                    }
                    else if (rect.y > this._con.height - this.height) {
                        rect.y = this._con.height - this.height;
                        this.scrollBtnShow(1, false);
                    } else {
                        this.scrollBtnShow(0, true);
                        this.scrollBtnShow(1, true);
                    }
                    this._scrollPos = rect.y;
                }
                // 横向
                else if (this._scrollDir === 2) {
                    rect.x = rect.x + offset;
                    if (rect.x < 0) {
                        rect.x = 0;
                        this.scrollBtnShow(0, false);
                    }
                    else if (rect.x > this._con.width - this.width) {
                        rect.x = this._con.width - this.width;
                        this.scrollBtnShow(1, false);
                    } else {
                        this.scrollBtnShow(0, true);
                        this.scrollBtnShow(1, true);
                    }
                    this._scrollPos = rect.x;
                }
            }

            this.calcCurrentIndex();
            this._con.scrollRect = rect;
        }

        // 计算当前滚动位置的索引(目前只写了单列的计算)
        private calcCurrentIndex(): void {
            if (this._itemWH != null) {
                // 纵向
                if (this._scrollDir === 1) {
                    this._curIndex = (this._scrollPos / (this._itemWH[1] + this._spaceY)) >> 0;
                }
                // 横向
                else if (this._scrollDir === 2) {
                    this._curIndex = (this._scrollPos / (this._itemWH[0] + this._spaceX)) >> 0;
                }

                // console.log("当前位置索引：", this.curIndex);

                // 执行回调
                if (this._scrollCallback != null && this._lastIndex != this._curIndex) {
                    this._lastIndex = this._curIndex;
                    this._scrollCallback(this._curIndex);
                }
            }
        }

        // 滚动至某位置
        public scrollTo(pos: number): void {
            if (this._scrollDir === 1 ? this._con.height < this.height : this._con.width < this.width) {
                this._scrollPos = 0;
                return;
            }
            let rect: Rectangle = this._con.scrollRect;
            if (this._scrollDir === 1) {
                rect.y = pos;
                if (rect.y < 0) rect.y = 0;
                else if (rect.y > this._con.height - this.height) {
                    rect.y = this._con.height - this.height;
                }
                this._scrollPos = rect.y;
            } else if (this._scrollDir === 2) {
                rect.x = pos;
                if (rect.x < 0) rect.x = 0;
                else if (rect.x > this._con.width - this.width) {
                    rect.x = this._con.width - this.width;
                }
                this._scrollPos = rect.x;
            }
            this.calcCurrentIndex();
            this._con.scrollRect = rect;
        }

        // 滚动方向
        public get scrollDir(): int {
            return this._scrollDir;
        }

        public set scrollDir(value: int) {
            this._scrollDir = value;
        }

        // 滚动位置
        public get scrollPos(): number {
            return this._scrollPos;
        }

        public set scrollPos(value: number) {
            this.scrollTo(value);
        }

        /**
         * 滚动到索引
         * 
         * @param index 索引
         * @param offset 位置偏移
         */
        public scrollToIndex(index: number, offset: number = 0): void {
            let item: ItemRender = this._items[index];
            if (item) {
                if (this._scrollDir === 1) {          // 竖向
                    this.scrollTo(item.y + offset)
                } else if (this._scrollDir === 2) {        // 横向
                    this.scrollTo(item.x + offset);
                }
            }
        }

        /** 设置横向数量 */
        public get hCount(): int {
            return this._hCount;
        }

        /** 横向滚动时第二列x的偏移值,特殊情况才会用到 */
        public set specialXOffset(val: number) {
            this._specialXOffset = val;
        }

        public set hCount(value: int) {
            this._hCount = value;
        }

        // 设置纵向数量
        public get vCount(): int {
            return this._vCount;
        }

        public set vCount(value: int) {
            this._vCount = value;
        }

        public get items(): Array<ItemRender> {
            return this._items;
        }

        // 数据
        public get datas(): Array<any> {
            return this._datas;
        }

        /**
         *  更新选中item的数据
         */
        public set updateSelectedData(data: any) {
            this.selectedItem.data = data;
            // 更新数据列表中的数据
            this._datas[this.selectedIndex] = data;
            this._selectedData = data;
        }

        /**
         *  更新指定的item的数据 -待测试
         */
        public updateItemData(index: number, data: any) {
            for (let i = 0; i < this._items.length; i++) {
                const item = this._items[i];
                if (item.index == index) {
                    item.data = data;
                    break;
                }
            }
        }

        public set datas(value: Array<any>) {
            this._datas = value;

            this._con.removeChildren();
            if (!value || !this._items) return;
            this._recordX = this._recordY = 0;

            // 全部创建（可优化）
            let w: number = 0;
            let h: number = 0;
            let maxW: number = 0;
            let maxH: number = 0;

            if (this._scrollDir === 1 && this._hCount == 1) this._vCount = value.length;
            if (this._scrollDir === 2 && this._vCount == 1) this._hCount = value.length;
            let auto = false;
            for (let i: int = 0, len: int = value.length; i < len; i++) {
                let item: ItemRender = this._items[i];
                if (!item) {
                    item = new this._itemRender();
                    this._items[i] = item;

                    // 存取单元项宽高
                    if (this._itemWH == null || this._itemWH == undefined) {
                        this._itemWH = [item.width, item.height];
                    }
                    // item.on(Event.CLICK, this, this.itemClickHandler);

                    // 原生点击事件不准确
                    item.on(Event.MOUSE_DOWN, this, this.itemDownHandler);
                    item.on(Event.MOUSE_UP, this, this.itemUpHandler);
                }
                if (this._autoX && !auto) {
                    // 自动计算横间距
                    auto = true;
                    let offsetX = this._width - item.width
                    offsetX = Math.ceil((offsetX / (this._hCount - 1)) * 10) / 10
                    this._spaceX = offsetX - item.width
                }
                item.index = i;
                item.data = value[i];

                w = item.width;
                h = item.height;
                let tempX = 0;
                if (this._scrollDir === 1) {      // 竖向
                    if (i % this._hCount === 0) {     // 换行重置x记录坐标和最大高度
                        this._recordY += maxH + (i === 0 ? 0 : this._spaceY);
                        maxH = h;
                        this._recordX = 0;
                    } else {
                        this._recordX += w + this._spaceX;
                        maxH = h > maxH ? h : maxH;
                    }
                    item.pos(this._recordX + this.padding_left, this._recordY + this.padding_top, true);
                } else if (this._scrollDir === 2) {        // 横向
                    if (i % this._vCount === 0) {     // 换行重置y记录坐标和最大宽度
                        this._recordX += maxW + (i === 0 ? 0 : this._spaceX);
                        this._recordY = 0
                        maxW = w;
                    } else {
                        tempX = this._specialXOffset;
                        this._recordY += h + this._spaceY;
                        maxW = w > maxW ? w : maxW;
                    }

                    // 这个不知道谁写的，上面的是以前的
                    // if (i % this._hCount === 0) {     // 换行Y++高度 X重置
                    //     this._recordX = 0;
                    //     this._recordY += maxH + (i === 0 ? 0 : this._spaceY);
                    //     maxH = h;
                    //     maxW = w;
                    // } else {
                    //     this._recordX += w + this._spaceX;
                    // }

                    item.pos(this._recordX + tempX + this.padding_left, this._recordY + this.padding_top, true);
                }

                this._con.addChild(item);
            }

            this._con.scrollRect = new Rectangle(0, 0, this.width, this.height);
            if (this._scrollDir === 1) {      // 竖向
                this._con.size(this._recordX + w + this.padding_left * 2, this._recordY + maxH + this.padding_top * 2);
            } else if (this._scrollDir === 2) {        // 横向
                this._con.size(this._recordX + maxW + this.padding_left * 2, this._recordY + h + this.padding_top * 2);
            }

            this.calcCurrentIndex();
        }

        private itemDownHandler(e: Event): void {
            this._downX = this.mouseX;
            this._downY = this.mouseY;
            this._downTime = Browser.now();
            this._downTarget = e.currentTarget;
        }

        private itemUpHandler(e: Event): void {
            if (this._downTarget !== e.currentTarget) return;
            // 偏移小于5且时间小于125才认为是单击
            let offsetX: number = this.mouseX - this._downX;
            let offsetY: number = this.mouseY - this._downY;
            let offsetT: number = Browser.now() - this._downTime;
            if (offsetX < 5 && offsetX > -5 && offsetY < 5 && offsetY > -5 && offsetT < 300) {
                this.itemClickHandler(e);
            }
        }

        // 横向间距
        public get spaceX(): number {
            return this._spaceX;
        }

        public set spaceX(value: number) {
            this._spaceX = value;
        }

        // 纵向间距
        public get spaceY(): number {
            return this._spaceY;
        }

        public set spaceY(value: number) {
            this._spaceY = value;
        }

        // 单元项类
        public set itemRender(value: any) {
            this._itemRender = value;
        }

        // 单元项类-重置
        public set reSetItemRender(value: any) {
            this._items = new Array<ItemRender>();
            this.itemRender = value;
        }

        // 选中数据
        public get selectedData(): any {
            return this._selectedData;
        }

        public set selectedData(value: any) {
            this.selectedIndex = this._datas.indexOf(value);
        }

        // 选中单元项
        public get selectedItem(): ItemRender {
            return this._selectedItem;
        }

        public set selectedItem(value: ItemRender) {
            this.selectedIndex = this._items.indexOf(value);
        }

        // 选中索引
        public get selectedIndex(): int {
            return this._selectedIndex;
        }

        public set selectedIndex(value: int) {
            // if(this._selectedIndex === value) return;
            this._selectedIndex = value;
            if (this._selectedItem) this._selectedItem.selected = false;
            this._selectedItem = this._items ? this._items[this._selectedIndex] : null;
            if (this._selectedItem) this._selectedItem.selected = true;
            this._selectedData = this._datas ? this._datas[this._selectedIndex] : null;

            this.event(Event.SELECT);
        }

        private itemClickHandler(e: Event): void {
            let item: ItemRender = e.currentTarget as ItemRender;
            if (item.selectEnable) this.selectedItem = item;
        }

        // 重布局
        public relayout(): void {
            this._recordX = this._recordY = 0;
            let w: number = 0;
            let h: number = 0;
            let maxW: number = 0;
            let maxH: number = 0;
            let len = this._datas.length;
            if (this._scrollDir === 1 && this._hCount == 1) this._vCount = len;
            if (this._scrollDir === 2 && this._vCount == 1) this._hCount = len;
            for (let i: int = 0, len: int = this._datas.length; i < len; i++) {
                let item: ItemRender = this._items[i];
                if (!item) {
                    break;
                }
                w = item.width;
                h = item.height;
                let tempX = 0;
                if (this._scrollDir === 1) {      // 竖向
                    if (i % this._hCount === 0) {     // 换行重置x记录坐标和最大高度
                        this._recordY += maxH + (i === 0 ? 0 : this._spaceY);
                        maxH = h;
                        this._recordX = 0;
                    } else {
                        this._recordX += w + this._spaceX;
                        maxH = h > maxH ? h : maxH;
                    }
                    item.pos(this._recordX + this.padding_left, this._recordY + this.padding_top, true);
                } else if (this._scrollDir === 2) {        // 横向
                    if (i % this._vCount === 0) {     // 换行重置y记录坐标和最大宽度
                        this._recordX += maxW + (i === 0 ? 0 : this._spaceX);
                        maxW = w;
                    } else {
                        tempX = this._specialXOffset;
                        this._recordY += h + this._spaceY;
                        maxW = w > maxW ? w : maxW;
                    }
                    // if (i % this._hCount === 0) {     // 换行Y++高度 X重置
                    //     this._recordX = 0;
                    //     this._recordY += maxH + (i === 0 ? 0 : this._spaceY);
                    //     maxH = h;
                    //     maxW = w;
                    // } else {
                    //     this._recordX += w + this._spaceX;
                    // }
                    item.pos(this._recordX + tempX + this.padding_left, this._recordY + this.padding_top, true);
                }
            }
            if (this._scrollDir === 1) {      // 竖向
                this._con.size(this._recordX + w + this.padding_left * 2, this._recordY + maxH + this.padding_top * 2);
            } else if (this._scrollDir === 2) {        // 横向
                this._con.size(this._recordX + maxW + this.padding_left * 2, this._recordY + h + this.padding_top * 2);
            }
        }

        public get getListH(): number {
            return this._con.height;
        }
        public destroy(destroyChild: boolean = true) {
            this.undisplayHandler();
            if (this._kick_back_tween) {
                this._kick_back_tween.stop();
            }
            Laya.timer.clear(this, this.gxScroll);
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
            if (this._datas) {
                // this._datas.length = 0;
                this._datas = null;
            }
            if (this._items) {
                for (let e of this._items) {
                    // this._items[i].off(Event.CLICK, this, this.itemClickHandler);
                    e.off(Event.MOUSE_DOWN, this, this.itemDownHandler);
                    e.off(Event.MOUSE_UP, this, this.itemUpHandler);
                    e.destroy(true);
                }
                this._items = null;
            }

            super.destroy(destroyChild);

        }
        // 列表弹出方式1为渐变式，23为弹出式
        public static showListAnim(type: showType, list: common.CustomList) {
            if (!list || list.items.length == 0) return;
            switch (type) {
                case showType.ALPHA:
                    CustomList.showListAlpha(list);
                    break;
                case showType.WIDTH:
                    CustomList.showListOutWidth(list);
                    break;
                case showType.HEIGHT:
                    CustomList.showListOutHeight(list);
                    break;
                default:
                    break;
            }
        }

        private static showListAlpha(list: common.CustomList) {
            for (const m of list.items) {
                m.alpha = 0;
            }
            let delta = 0;
            for (const m of list.items) {
                TweenJS.create(m).to({ alpha: 1 }, 200)
                    .delay(delta)
                    .start()
                delta += 100;
            }
        }

        private static showListOutHeight(list: common.CustomList) {
            for (const m of list.items) {
                m.y += list.height;
            }
            let delta = 0;
            for (const n of list.items) {
                let tempY = n.y;
                TweenJS.create(n).to({ y: tempY - list.height }, 300)
                    .easing(utils.tween.easing.circular.Out)
                    .delay(delta)
                    .start()
                delta += 60;
            }
        }

        private static showListOutWidth(list: common.CustomList) {
            for (const m of list.items) {
                m.x += list.width;
            }
            let delta = 0;
            for (const n of list.items) {
                let tempX = n.x;
                TweenJS.create(n).to({ x: tempX - list.width }, 200)
                    .easing(utils.tween.easing.circular.In)
                    .delay(delta)
                    .start()
                delta += 40;
            }
        }

        // 设置自动计算
        public get autoX(): boolean {
            return this._autoX;
        }

        public set autoX(value: boolean) {
            this._autoX = value;
        }
    }
}