/**单人boss单元项*/
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.rotary_table_soraing {
    import Point = Laya.Point;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import PayRewardNote = Protocols.PayRewardNote;
    import PayRewardNoteFields = Protocols.PayRewardNoteFields;
    export class RotaryTableSoaringMyRecordItem extends ui.PayRewardMyRecordItemUI {
        private _startPos: Point;
        private _interval: number;
        private _imgWidth: number;
        private _spaceX: number;
        private _cfg: Array<any>;
        private _challengeCount: number;
        private _resurrectiontime: number;
        private _count: number;
        private _scale: number;
        private _challengeClip: CustomClip;
        private _items: Array<BaseItem>;
        private _instructionsID: number;
        private _actionOpenId: number;
        private _state: number;//当前活动状态
        private _date: PayRewardNote;
        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._challengeClip) {
                this._challengeClip.removeSelf();
                this._challengeClip.destroy();
                this._challengeClip = null;
            }
            if (this._items) {
                for (let index = 0; index < this._items.length; index++) {
                    let element = this._items[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._items.length = 0;
                this._items = null;
            }
            super.destroy(destroyChild);
        }
        protected initialize(): void {
            super.initialize();
            this._startPos = new Point(151, 69);
            this._imgWidth = 100;
            this._spaceX = 20;
            this._interval = 103;
            this._cfg = new Array<any>();
            this._resurrectiontime = null;
            this._challengeCount = null;
            this._scale = 0.8;
        }
        protected addListeners(): void {
            super.addListeners();
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected onOpened(): void {
            super.onOpened();
            this.showText();
        }
        public close(): void {
            super.close();
        }
        protected setData(PayRewardNote: any): void {
            super.setData(PayRewardNote);
            this._date = PayRewardNote;
        }
        /**
         * 顯示文本 和是否已領取
         */
        public showText() {
            let count = this._data[PayRewardNoteFields.count];
            let itemId = this._data[PayRewardNoteFields.itemId];
            let itemName = modules.common.CommonUtil.getNameByItemId(itemId);
            let itemColor = CommonUtil.getColorById(itemId);
            var html: string = "<span style='color:#585858;font-size: 26px'>天赐鸿福,</span>";
            html += "<span style='color:#585858;font-size: 26px'>抽奖获得了</span>";
            html += `<span style='color:${itemColor};font-size: 26px'>${itemName}*${count}</span>`;
            this.recordHtml.style.fontFamily = "SimHei";
            this.recordHtml.style.align = "left";
            this.recordHtml.innerHTML = html;
        }
    }
}