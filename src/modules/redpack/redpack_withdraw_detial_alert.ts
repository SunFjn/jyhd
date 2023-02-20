/** 红包兑换提现明细记录*/
namespace modules.redpack {
    import LayaEvent = modules.common.LayaEvent;
    import RedPackWithdrawDetialAlertUI = ui.RedPackWithdrawDetialAlertUI;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import head = Configuration.head;
    import headFields = Configuration.headFields;
    import Text = Laya.Text;
    import Image = Laya.Image;

    export class RedPackWithdrawDetialAlert extends RedPackWithdrawDetialAlertUI {
        /** 提现配置类型 1等级分红 2等级红包 3超级红包 */
        private operateType: number = 1;
        private maxPage: number;
        private currentPage: number;
        private apiAddress: string;

        constructor() {
            super();
        }
        // 按钮组
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 454;
            this._list.height = 345;
            this._list.hCount = 1;
            this._list.itemRender = RedPackReocrdItem;
            this._list.x = 73;
            this._list.y = 150;
            this._list.spaceY = 10;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn_next, LayaEvent.CLICK, this, this.turnPage, [true]);
            this.addAutoListener(this.btn_last, LayaEvent.CLICK, this, this.turnPage, [false]);
            // GlobalData.dispatcher.on(CommonEventType.HEADER_DATA_UPDATE, this, this.openHead);
            // this.addAutoRegisteRedPoint(this.headRPImg, ["HeadCanActiveRP"]); 
        }

        /**
         * 翻页
         * 
         * @param next  下一页
         */
        turnPage(next: boolean) {
            if (next) {
                if (this.currentPage + 1 <= this.maxPage) {
                    this.requestPageData(++this.currentPage);
                    this.box_page.mouseEnabled = false;
                }
                return;
            }
            if (this.currentPage - 1 >= 1) {
                this.requestPageData(--this.currentPage);
                this.box_page.mouseEnabled = false;
            }
        }

        setOpenParam(type: number) {
            console.log("withdraw detial type::", type);
            this.operateType = type;

            switch (type) {
                case 1: this.apiAddress = "api/red/bag/game/level/income/withdraw/log"; break;   // 等级分红 提现日志
                case 2: this.apiAddress = "api/red/bag/level/withdraw/log"; break;               // 等级红包 提现日志
                case 3: this.apiAddress = "api/red/bag/high/level/withdraw/log"; break;          // 超级红包 提现日志
            }
        }

        onOpened(): void {
            super.onOpened();
            this.requestPageData();
        }

        /**
         * 请求数据
         * 
         * @param currentPage 页码
         */
        private requestPageData(currentPage: number = 1) {
            SDKNet(this.apiAddress, { page: currentPage }, (res) => {
                this.box_page.mouseEnabled = true;
                console.log(this.operateType, "withdraw detial res::", res);
                if (res.code == 200) {
                    this.txt_page.text = res.data.page + "/" + res.data.total_page;
                    this._list.datas = res.data.data;
                    this.maxPage = res.data.total_page;
                    this.currentPage = res.data.page;
                    this.box_page.visible = res.data.total_page != 0;

                    // 置灰
                    this.btn_next.gray = res.data.page >= res.data.total_page;
                    this.btn_last.gray = res.data.page <= 1;
                    return;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
            })
        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

    }
}