
/** 超级兑换*/
namespace modules.redpack {
    import SuperRedPackCashViewUI = ui.SuperRedPackCashViewUI;

    export class SuperRedPackCashPanel extends SuperRedPackCashViewUI {
        private count: number;
        private money: number;
        private txtArr: Array<any>;
        private btnExArr: Array<any>;
        private cashIDArr: Array<number>;
        private currentIndex: number;
        private noticeArr: Array<number>;
        private timeoutID: number;

        constructor() {
            super();

        }

        protected addListeners(): void {
            super.addListeners();


            this.addAutoListener(this.btn_cashRecord, common.LayaEvent.CLICK, this, this.openRecord);
            this.addAutoListener(this.btn_cash1, common.LayaEvent.CLICK, this, this.cashHandler, [0]);
            this.addAutoListener(this.btn_cash2, common.LayaEvent.CLICK, this, this.cashHandler, [1]);
            this.addAutoListener(this.btn_cash5, common.LayaEvent.CLICK, this, this.cashHandler, [2]);
            this.addAutoListener(this.btn_cash10, common.LayaEvent.CLICK, this, this.cashHandler, [3]);
            this.addAutoListener(this.btn_cash20, common.LayaEvent.CLICK, this, this.cashHandler, [4]);
            this.addAutoListener(this.btn_cash50, common.LayaEvent.CLICK, this, this.cashHandler, [5]);
        }

        /**
         * 兑换
         * @param index 按钮索引
         */
        protected cashHandler(index: number): void {
            this.currentIndex = index;
            let config_id: number = this.cashIDArr[index];
            SDKNet("api/red/bag/high/level/exchange", { api_type: "POST", config_id }, (res) => {
                console.log("cash exchange", res);
                if (res.code == 400) {
                    modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
                } else if (res.code == 200) {
                    this.money = res.data.money;
                    this.txt_amount.text = this.money + "元";

                    let remianCount = --this.btnExArr[this.currentIndex].remain_count;
                    this.txtArr[this.currentIndex].text = `可兑换${remianCount}次`;
                    this.btnExArr[this.currentIndex].gray = remianCount <= 0;

                    modules.notice.SystemNoticeManager.instance.addNotice("兑换成功!");
                } else {
                    console.log("unknow", res);
                }
            })
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this.txtArr = [this.txt_remain1, this.txt_remain2, this.txt_remain5, this.txt_remain10, this.txt_remain20, this.txt_remain50];
            this.btnExArr = [this.btn_cash1, this.btn_cash2, this.btn_cash5, this.btn_cash10, this.btn_cash20, this.btn_cash50];
            this.noticeArr = [1, 2, 5, 10, 20, 50];
        }

        protected onOpened(): void {
            super.onOpened();
            SDKNet("api/red/bag/high/level/exchange/config", {}, (res) => {
                console.log("super redpack exchange res::", res);
                if (res.code == 200) {
                    RedPackModel.instance.create_time = res.data.create_time;
                    this.money = res.data.money;
                    this.txt_amount.text = this.money + "元";
                    this.txt_getedAmount.text = res.data.total_money + "元";

                    this.cashIDArr = [];
                    let index: number = 0
                    for (const key in res.data.exchange_config_list) {
                        const single = res.data.exchange_config_list[key];
                        let remianCount = single.exchange_num;
                        this.txtArr[index].text = `可兑换${remianCount}次`;

                        this.btnExArr[index].gray = remianCount <= 0;
                        this.btnExArr[index].remain_count = remianCount;
                        this.cashIDArr.push(single.id);
                        index++;
                    }

                    this.count = RedPackModel.instance.remain_time;
                    Laya.timer.loop(1000, this, this.countTimer);
                    this.countTimer();
                    return;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
            })

            this.count = RedPackModel.instance.remain_time;
            Laya.timer.loop(1000, this, this.countTimer);
            this.countTimer();
            this.runNotice(true);
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
                let notice = `恭喜玩家${CommonUtil.getRandomName()}成功兑换${this.noticeArr[CommonUtil.getRandomInt(0, 5)]}元额度!`;
                modules.notice.CustomBroadcastManager.instance.addBroadcast(notice, this);
                this.runNotice();
            }, randomTime);
        }


        /**
         * 打开兑换记录界面
         */
        openRecord(): void {
            WindowManager.instance.open(WindowEnum.REDPACK_CASH_RECORD_ALERT);
        }

        destory() {
            super.destroy();
            clearTimeout(this.timeoutID);
            modules.notice.CustomBroadcastManager.instance.closeBroadcast();
            Laya.timer.clear(this, this.countTimer);
        }

        close() {
            super.close();
            clearTimeout(this.timeoutID);
            modules.notice.CustomBroadcastManager.instance.closeBroadcast();
            Laya.timer.clear(this, this.countTimer);
        }
    }
}
