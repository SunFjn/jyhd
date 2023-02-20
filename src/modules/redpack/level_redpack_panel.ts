
/** 等级红包*/
namespace modules.redpack {
    import LevelRedPackViewUI = ui.LevelRedPackViewUI;
    import CustomList = modules.common.CustomList;

    export class LevelRedPackPanel extends LevelRedPackViewUI {
        private _list: CustomList;
        private timeoutID: number;
        private noticeArr: Array<number>;

        constructor() {
            super();

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn_tixian, common.LayaEvent.CLICK, this, this.openWithdraw);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_LEVEL_REDPACK_REMIAN, this, this.refreshRemain);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_LEVEL_REDPACK_ITEM, this, this.refreshItem);
            // this.addAutoRegisteRedPoint(this.chDotImg, ["zzRP", "zzskillRP"]);

        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.vCount = 2;
            this._list.width = 663;
            this._list.height = 652;
            this._list.specialXOffset = 160;

            this._list.itemRender = LevelRedPackItem;
            this._list.x = 28;
            this._list.y = 383;
            this._list.spaceX = 5;
            this._list.spaceY = 100;
            this.addChild(this._list);

            this.noticeArr = [1.00, 1.40, 1.60, 1.80, 1.90, 2.30, 2.00, 2.50, 2.90, 3.20, 3.50, 4.00, 4.30
                , 5.60, 7.00, 7.30, 7.80, 8.00, 8.60, 8.78, 10.84, 12.33, 14.30, 18.88];
        }

        /**
         * 排序和处理
         * 
         * @param arr 数组
         */
        private cusSort(arr: Array<any>) {
            let arr1 = [];
            let arr2 = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].status == 2) {
                    arr2.push(arr[i]);
                } else {
                    arr1.push(arr[i]);
                }
            }

            return arr1.concat(arr2);
        }

        /**
         * 滚动到可领取的位置
         * 
         * @param res 
         * @returns 
         */
        private getScrollToIndex(res) {
            let scrollIndex = 0;
            let list = res.data.red_bags;
            for (let index = 0; index < list.length; index++) {
                const data = list[index];
                if (data.status == 1) {
                    scrollIndex = index;
                    break;
                }
            }
            return scrollIndex;
        }

        protected onOpened(): void {
            super.onOpened();
            SDKNet("api/red/bag/level/config", {}, (res) => {
                console.log(res);
                if (res.code == 200) {
                    // this._list.datas = this.cusSort(res.data.red_bags);
                    this._list.datas = res.data.red_bags;
                    let index: number = this.getScrollToIndex(res);
                    let offset: number = index % 2 == 1 ? -160 : 0;
                    this._list.scrollToIndex(index, offset);
                    this.txt_money.text = res.data.money + " 元";;
                    return;
                }

                modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
            });

            this.runNotice(true);
        }

        /**
         * 播放滚动广播
         * 
         * @param immediately 立即播放
         */
        private runNotice(immediately: boolean = false) {
            let randomTime = (Math.random() * 1000 * 10) + 20 * 1000;
            if (immediately) {
                randomTime = 0;
            }
            this.timeoutID = setTimeout(() => {
                let notice = `恭喜玩家${CommonUtil.getRandomName()}成功获得${this.noticeArr[CommonUtil.getRandomInt(0, this.noticeArr.length - 1)]}元红包~`;
                modules.notice.CustomBroadcastManager.instance.addBroadcast(notice, this);
                this.runNotice();
            }, randomTime);
        }

        /**
         * 打开提现界面
         */
        protected openWithdraw(): void {
            WindowManager.instance.open(WindowEnum.REDPACK_REMAIN_CASH_ALERT, 2);
        }

        /**
         * 刷新红包余额
         * 
         * @param data money add_money
         */
        protected refreshRemain(data: any): void {
            this.txt_money.text = data.money + " 元";
        }

        /**
         * 刷新选择的数据
         */
        // protected refreshItem(): void {
        //     let data = { ...this._list.selectedData };
        //     data.status = 2;
        //     this._list.updateSelectedData = data;
        // }

        public close(): void {
            super.close();
            modules.notice.CustomBroadcastManager.instance.closeBroadcast();
            clearTimeout(this.timeoutID);
        }
        destory() {
            super.destroy();
            clearTimeout(this.timeoutID);
            modules.notice.CustomBroadcastManager.instance.closeBroadcast();
        }
    }
}
