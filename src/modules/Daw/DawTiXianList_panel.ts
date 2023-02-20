/** 都爱玩 提现历史*/

namespace modules.daw {
    import DawTiXianListUI = ui.DawTiXianList1UI;

    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧

    export class DawTiXianList extends DawTiXianListUI {

        private _List: CustomList;
        public destroy(): void {
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._List = new CustomList();
            this._List.scrollDir = 1;

            this._List.itemRender = DawTiXianList_item;

            // this._List.vCount = 7;

            this._List.hCount = 1;

            this._List.width = 571;
            this._List.height = 421;
            this._List.x = 0;
            this._List.y = 0;
            this.list.addChild(this._List);

        }


        protected addListeners(): void {
            super.addListeners();
            this.leftBtn.on(Event.CLICK, this, this.pageBtnClick, [0]);
            this.rightBtn.on(Event.CLICK, this, this.pageBtnClick, [1]);
        }
        private _page: number = 0;
        private _maxPage: number = 0;

        onOpened(): void {
            super.onOpened();
            this.pageText.text = "第0/0页"
            this.nullText.visible = true
            this.updatePage(1)
        }

        /**
       * 换页按钮
       * @param id 0：上页 1：下页
       */
        private pageBtnClick(id: number) {
            id == 0 ? this._page-- : this._page++
            if (this._page < 1) { this._page = 1; return; }
            else if (this._page > this._maxPage) { this._page = this._maxPage; return; }
            this.updatePage(this._page)
        }

        //翻页更新
        public updatePage(page: number): void {

            let s = this;
            window['SDKNet']("api/game/bonus/withdraw/log", { page: page, page_count: 8 }, (data) => {
                if (data.code == 200) {
                    let arr = CommonUtil.PHPArray(data.data.data)
                    for (let index = 0; index < arr.length; index++) {
                        arr[index]['tag'] = "" + (index + 1)
                    }
                    this._List.datas = arr
                    this._page = data.data.page
                    this._maxPage = data.data.total_page
                    this.pageText.text = "第" + this._page + "/" + this._maxPage + "页"

                    if (arr.length == 0) {
                        this.pageText.text = "第0/0页"
                        this.nullText.visible = true
                    } else {
                        this.nullText.visible = false
                    }
                }
            }, this)
        }



        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}