
/** 超级红包面板*/
namespace modules.redpack {
    import SuperRedPackViewUI = ui.SuperRedPackViewUI;
    import CustomList = modules.common.CustomList;

    export class SuperRedPackPanel extends SuperRedPackViewUI {
        private _list: CustomList;
        private count: number;
        private timeoutID: number;
        private noticeArr: Array<number>;

        constructor() {
            super();

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn_help, common.LayaEvent.CLICK, this, this.openHelpView);
            this.addAutoListener(this.btn_wothdraw, common.LayaEvent.CLICK, this, this.openWithdraw);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SUPER_REDPACK_REMIAN, this, this.refreshRemain);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SUPER_REDPACK_ITEM, this, this.refreshItem);
            // this.addAutoRegisteRedPoint(this.chDotImg, ["zzRP", "zzskillRP"]);

        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 671;
            this._list.height = 570;

            this._list.itemRender = SuperRedPackItem;
            this._list.x = 24;
            this._list.y = 537;
            this._list.spaceY = 10;
            this.addChild(this._list);

            this.htxt_desc.color = "#454545";
            this.htxt_desc.style.fontFamily = "SimHei";
            this.htxt_desc.style.fontSize = 22;
            this.htxt_desc.style.valign = "middle";
            this.htxt_desc.style.lineHeight = 28;
            this.htxt_desc.mouseEnabled = false;
            this.htxt_desc.width = 250;

            this.noticeArr = [98, 20, 40, 60, 120, 80, 160, 100, 200, 150, 300, 400, 800, 500];
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
            SDKNet("api/red/bag/high/level/config", {}, (res) => {
                console.log("super redpack res::", res);
                if (res.code == 200) {
                    // this._list.datas = this.cusSort(res.data.red_bags);
                    this._list.datas = res.data.red_bags;
                    this._list.scrollToIndex(this.getScrollToIndex(res));
                    this.txt_money.text = res.data.money;
                    RedPackModel.instance.create_time = res.data.create_time;
                    RedPackModel.instance.player_recharge_money = res.data.player_recharge_money;

                    // 不需要初始化检测
                    res.notNeedInitCheck = true;
                    RedPackModel.instance.superRedPackRPInit = res;

                    this.count = RedPackModel.instance.remain_time;
                    Laya.timer.loop(1000, this, this.countTimer);
                    this.countTimer();
                    this.setTips();
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


        private countTimer() {
            this.count -= 1000;
            if (this.count <= 0) {
                this.txt_remainTime.text = "活动已结束!"
                Laya.timer.clear(this, this.countTimer);
            } else {
                this.txt_remainTime.text = CommonUtil.showTimeFormat(this.count);
            }
        }

        /**
         * 刷新红包余额
         * 
         * @param data money add_money
         */
        protected refreshRemain(data: any): void {
            this.txt_money.text = data.money;
        }

        /**
         * 刷新选择的数据
         */
        protected refreshItem(): void {
            let data = { ...this._list.selectedData };
            data.status = 2;
            this._list.updateSelectedData = data;
        }


        /**
         * 设置提示语
         */
        private setTips() {
            let level = this.calcLevel();
            let tips: string;
            switch (level) {
                case 0: tips = "累计充值满<span style='color:rgb(201,99,0);size:38'>98元</span>可解锁超级红包哦~"; break;
                case 1: tips = "累计充值满<span style='color:rgb(201,99,0);size:38'>126元</span>可翻倍领取剩余红包哦~"; break;
                case 2: tips = "每天都可以使用余额兑换成代币券哦~"; break;
                case 3: tips = "还有两天活动就要结束了,赶紧去升级领取红包吧~"; break;
                case 4: tips = "活动结束后，剩余未提现的金额将会兑换成代币券发放至主人邮件~"; break;
            }
            this.htxt_desc.innerHTML = tips;
        }

        /**
         * 计算提示语等级
         */
        private calcLevel(): number {
            let remain_day = RedPackModel.instance.remain_day;
            if (remain_day <= 5) return 3;
            if (remain_day <= 2) return 4;

            let recharge98 = (+RedPackModel.instance.player_recharge_money) >= 98;
            let recharge126 = (+RedPackModel.instance.player_recharge_money) >= 126;

            if (!recharge98) return 0;
            if (recharge98 && !recharge126) return 1;
            if (recharge98 && recharge126) return 2;
        }


        /**
         * 打开提现界面
         */
        protected openWithdraw(): void {
            WindowManager.instance.open(WindowEnum.REDPACK_REMAIN_CASH_ALERT, 3);
        }


        /**
         * 打开规则界面
         */
        protected openHelpView(): void {
            WindowManager.instance.open(WindowEnum.REDPACK_HELP_ALERT);
        }


        public close(): void {
            super.close();
            modules.notice.CustomBroadcastManager.instance.closeBroadcast();
            Laya.timer.clear(this, this.countTimer);
            clearTimeout(this.timeoutID);
        }

        destory() {
            super.destroy();
            clearTimeout(this.timeoutID);
            modules.notice.CustomBroadcastManager.instance.closeBroadcast();
            Laya.timer.clear(this, this.countTimer);
        }
    }
}
