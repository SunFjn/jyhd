
/** 等级分红*/
namespace modules.redpack {
    import LevelBonusViewUI = ui.LevelBonusViewUI;

    export class LevelBonusPanel extends LevelBonusViewUI {
        btnArr: Array<any>;
        bgArr: Array<any>;
        effArr: Array<any>;
        descArr: Array<any>;
        levelArr: Array<number> = [80, 300, 1300];
        money: number = 0;
        private timeoutID: number;
        private noticeArr: Array<number>;

        constructor() {
            super();

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn_withdraw, common.LayaEvent.CLICK, this, this.openWithdraw);
            this.addAutoListener(this.btn_80, common.LayaEvent.CLICK, this, this.getBonus, [0]);
            this.addAutoListener(this.btn_300, common.LayaEvent.CLICK, this, this.getBonus, [1]);
            this.addAutoListener(this.btn_1300, common.LayaEvent.CLICK, this, this.getBonus, [2]);
            this.addAutoListener(this.btn_withdraw, common.LayaEvent.CLICK, this, this.openWithdraw);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_REDPACK_BONUS_REMIAN, this, this.refreshRemain);
            // this.addAutoRegisteRedPoint(this.chDotImg, ["zzRP", "zzskillRP"]);

        }

        /**
         * 刷新红包余额
         * 
         * @param data money withdraw_money
         */
        protected refreshRemain(data: any): void {
            this.money = data.money;
            this.txt_money.text = this.money + " 元";
        }

        /**
         * 领取等级红包
         * 
         * @param index 按钮索引
         */
        protected getBonus(index: any): void {
            let config_id = this.btnArr[index]["config_id"];
            SDKNet("api/red/bag/game/level/income", { api_type: "POST", config_id }, (res) => {
                if (res.code == 400) {
                    modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
                    return;
                } else if (res.code == 200) {
                    this.money += res.data.money;
                    this.txt_money.text = this.money + " 元";
                    this.btnArr[index].mouseEnabled = false;
                    this.btnArr[index].skin = "level_redpack/btn_ylq.png";
                    this.bgArr[index].skin = "level_redpack/image_lb_bg0.png";
                    this.effArr[index].visible = false;
                    RedPackModel.instance.updateSingleLevelBonusState(this.levelArr[index], 2)
                    WindowManager.instance.open(WindowEnum.REDPACK_GETED_ALERT, { ...res.data, type: 1 });
                    // modules.notice.SystemNoticeManager.instance.addNotice("领取成功!", true);
                } else {
                    console.log("unknow", res);
                }
            })
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;
            this.btnArr = [this.btn_80, this.btn_300, this.btn_1300];
            this.effArr = [this.eff_80, this.eff_300, this.eff_1300];
            this.bgArr = [this.item_bg_80, this.item_bg_300, this.item_bg_1300];
            this.descArr = [this.txt_desc80, this.txt_desc300, this.txt_desc1300];
            this.noticeArr = [0.30, 0.50, 0.80, 1.00, 1.40, 1.60, 1.80, 1.90, 2.30, 2.00, 2.50, 2.90, 3.20, 3.50, 4.00, 4.30
                , 5.60, 7.00, 7.30, 7.80, 8.00, 8.60, 8.78, 9.12, 9.15, 9.70, 9.72, 10.00, 11.35, 18.20, 20.12, 15.30, 30.00, 32.00];
        }

        /**
         * 打开提现界面
         */
        protected openWithdraw(): void {
            WindowManager.instance.open(WindowEnum.REDPACK_REMAIN_CASH_ALERT, 1);
        }

        protected onOpened(): void {
            super.onOpened();
            SDKNet("api/red/bag/game/level/income", {}, (res) => {
                if (res.code == 200) {
                    this.levelArr = [];
                    this.money = res.data.money;
                    this.txt_money.text = this.money + " 元";;
                    res.data.income_data = res.data.income_data.sort((a, b) => a.level - b.level);
                    for (let index = 0; index < res.data.income_data.length; index++) {
                        const singleData = res.data.income_data[index];
                        this.levelArr.push(singleData.level);
                        // 状态 0:不可领取 1:待领取 2:已领取
                        this.effArr[index].visible = singleData.status == 1;
                        this.btnArr[index].mouseEnabled = singleData.status == 1;
                        this.btnArr[index]["config_id"] = singleData.id;
                        switch (singleData.status) {
                            case 0:
                                this.btnArr[index].skin = "level_redpack/btn_wdc.png";
                                this.bgArr[index].skin = "level_redpack/image_lb_bg1.png";
                                break;
                            case 1:
                                this.btnArr[index].skin = "level_redpack/btn_lq.png";
                                this.bgArr[index].skin = "level_redpack/image_lb_bg1.png";
                                break;
                            case 2:
                                this.btnArr[index].skin = "level_redpack/btn_ylq.png";
                                this.bgArr[index].skin = "level_redpack/image_lb_bg0.png";
                                break;
                        }
                        // 玩家等级
                        let level = PlayerModel.instance.level;
                        if (level >= singleData.level) {
                            this.descArr[index].text = `您当前等级已达${singleData.level}级`
                        } else {
                            this.descArr[index].text = `您当前等级未达到${singleData.level}级`
                        }
                    }

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
