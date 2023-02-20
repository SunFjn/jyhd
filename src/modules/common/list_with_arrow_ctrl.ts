/** 列表箭头控制器*/


namespace modules.common {
    import Button = Laya.Button;
    import Event = Laya.Event;

    export class ListWithArrowCtrl {
        private _list: CustomList;
        private _preBtn: Button;
        private _nextBtn: Button;

        // 滚动距离
        private _scrollDis: number;

        constructor(list: CustomList, preBtn: Button, nextBtn: Button) {
            this._list = list;
            this._preBtn = preBtn;
            this._nextBtn = nextBtn;

            this._scrollDis = 10;
        }

        public addListeners(): void {
            this._preBtn.on(Event.CLICK, this, this.preHandler);
            this._nextBtn.on(Event.CLICK, this, this.nextHandler);
        }

        public removeListeners(): void {
            this._preBtn.off(Event.CLICK, this, this.preHandler);
            this._nextBtn.off(Event.CLICK, this, this.nextHandler);
        }

        public get scrollDis(): number {
            return this._scrollDis;
        }

        public set scrollDis(value: number) {
            this._scrollDis = value;
        }

        private preHandler(): void {
            // this._list.scroll(-this._scrollDis);
            TweenJS.create(this._list).to({ scrollPos: this._list.scrollPos - this._scrollDis }, 200).start();
        }

        private nextHandler(): void {
            // this._list.scroll(this._scrollDis);
            TweenJS.create(this._list).to({ scrollPos: this._list.scrollPos + this._scrollDis }, 200).start();
        }

        public destroy(): void {
            this._list = null;
            this._preBtn = null;
            this._nextBtn = null;
        }
    }
}