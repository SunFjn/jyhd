/** 现金装备-奇珍异宝 余额明细*/


namespace modules.cashEquip {

    import CashEquipDetailedAlertUI = ui.CashEquipDetailedAlertUI;
    import CustomList = modules.common.CustomList; // List
    import Event = Laya.Event;// 事件
    /*类型*/
    const enum pageType {
        sell = 0,	/*出售*/
        cash,		/*提现*/
    }
    const enum pageBtnType {
        left = 0,	    /*减少*/
        right = 1,		/*增加*/
    }
    export class CashEquipDetailedAlert extends CashEquipDetailedAlertUI {

        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _list: CustomList;
        private type: number = 0
        private page: number = 0
        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.vCount = 20;
            this._list.width = 460;
            this._list.height = 320;
            this._list.itemRender = CashEquipDetailedItem;
            this._list.x = 20;
            this._list.y = 40;
            this.listBox.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.sellPageBtn.on(Event.CLICK, this, this.setBtnStatus, [pageType.sell]);
            this.cashPageBtn.on(Event.CLICK, this, this.setBtnStatus, [pageType.cash]);
            this.leftBtn.on(Event.CLICK, this, this.pageBtnClick, [pageBtnType.left]);
            this.rightBtn.on(Event.CLICK, this, this.pageBtnClick, [pageBtnType.right]);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public setOpenParam(value): void {
            super.setOpenParam(value);
        }

        /**
         * 设置页面切换按钮状态
         * @param id 0：出售 1：提现
         */
        private setBtnStatus(id: number) {
            if (this.type == id) return;
            this.type = id
            CashEquipModel.instance.pageType = id
            this.sellPageBtn.selected = id == pageType.sell;
            this.cashPageBtn.selected = id == pageType.cash;
            this.page = 1
            var that = this
            if (id == pageType.sell) {
                CashEquipModel.instance.sellPageChange(1, (data) => {
                    that.updateList(data)
                })
            } else {
                CashEquipModel.instance.cashPageChange(1, (data) => {
                    that.updateList(data)
                })
            }
        }

        /**
         * 换页按钮
         * @param id 0：上页 1：下页
         */
        private pageBtnClick(id: number) {
            id == pageType.sell ? this.page-- : this.page++
            if (this.page < 1) { this.page = 1; return; }
            else if (this.page > CashEquipModel.instance.pageMax) { this.page = CashEquipModel.instance.pageMax; return; }

            var that = this
            if (this.type == pageType.sell) {
                CashEquipModel.instance.sellPageChange(this.page, (data) => {
                    that.updateList(data)
                })
            } else {
                CashEquipModel.instance.cashPageChange(this.page, (data) => {
                    that.updateList(data)
                })
            }
        }



        onOpened(): void {
            super.onOpened();
            this.type = -1
            this.setBtnStatus(pageType.sell)
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public updateList(data) {
            if (this.page > CashEquipModel.instance.pageMax) {
                this.pageText.text = "第 0/0 页";
                this.listBox.visible = false;
                this.nullText.visible = true
                this.nullText.text = this.type == pageType.sell ? "您还没有装备出售记录哦～" : "您还没有装备提现记录哦～"
            } else {
                this.pageText.text = "第 " + (this.page) + "/" + CashEquipModel.instance.pageMax + " 页";
                this.listBox.visible = true;
                this.nullText.visible = false
                this._list.datas = data.data;
            }

        }

    }
}