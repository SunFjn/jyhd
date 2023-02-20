/** 红包余额提现*/
namespace modules.redpack {
    import LayaEvent = modules.common.LayaEvent;
    import RedPackRemianWithdrawAlertUI = ui.RedPackRemianWithdrawAlertUI;

    export class RedPackRemianWithdrawAlert extends RedPackRemianWithdrawAlertUI {
        /** 提现配置类型 1等级分红 2等级红包 3超级红包 */
        private operateType: number = 1;
        private choice_id: number = -1;
        private btnArr: Array<any>;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.btnArr = [this.btn_config0, this.btn_config1, this.btn_config2, this.btn_config3, this.btn_config4, this.btn_config5];
            this.btnArr.forEach(element => {
                element.visible = false;
            });
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn_record, LayaEvent.CLICK, this, this.openRecord);
            this.addAutoListener(this.btn_config0, LayaEvent.CLICK, this, this.selectedShift, [0]);
            this.addAutoListener(this.btn_config1, LayaEvent.CLICK, this, this.selectedShift, [1]);
            this.addAutoListener(this.btn_config2, LayaEvent.CLICK, this, this.selectedShift, [2]);
            this.addAutoListener(this.btn_config3, LayaEvent.CLICK, this, this.selectedShift, [3]);
            this.addAutoListener(this.btn_config4, LayaEvent.CLICK, this, this.selectedShift, [4]);
            this.addAutoListener(this.btn_config5, LayaEvent.CLICK, this, this.selectedShift, [5]);

            this.addAutoListener(this.btn_zfb, LayaEvent.CLICK, this, this.withdrawHandler, [2]);
            this.addAutoListener(this.btn_wx, LayaEvent.CLICK, this, this.withdrawHandler, [1]);
            // GlobalData.dispatcher.on(CommonEventType.HEADER_DATA_UPDATE, this, this.openHead);
            // this.addAutoRegisteRedPoint(this.headRPImg, ["HeadCanActiveRP"]);
        }

        /**
         * 选择提现档位
         * 
         * @param index 档位、按钮索引
         */
        private selectedShift(index: number) {
            this.choice_id = this.btnArr[index]["choice_id"];
            this.btnArr.forEach(element => element.selected = false);
            this.btnArr[index].selected = true;
        }

        /**
         * 提现
         * 
         * @param type 1微信  2支付宝
         */
        public withdrawHandler(type: number): void {
            let apiAddress: string;
            switch (this.operateType) {
                case 1: apiAddress = "api/red/bag/game/level/income/withdraw/apply"; break;
                case 2: apiAddress = "api/red/bag/level/withdraw/apply"; break;
                case 3: apiAddress = "api/red/bag/high/level/apply/withdraw"; break;
            }

            // 跳转到支付宝绑定
            if (this.btn_zfb.gray && type == 2) {
                let sdk_token = window["dawSDK"].user_token;
                let game_id = window["dawSDK"].game_id;
                let channel = window["dawSDK"].daw_channel;
                window.location.href = `https://v3.h5.haowusong.com/api/H5sdkNew/auth_alipay.html?token=${sdk_token}&game_id=${game_id}&channel=${channel}&android_id=0`;
                return;
            }

            SDKNet(apiAddress, { config_id: this.choice_id, api_type: "POST", pay_type: type }, (res) => {
                console.log(this.operateType, "withdraw res::", res);
                if (res.code == 200) {
                    modules.notice.SystemNoticeManager.instance.addNotice("提交提现申请成功!");
                    this.txt_remain.text = res.data.money + "元";

                    switch (this.operateType) {
                        case 1:
                            GlobalData.dispatcher.event(CommonEventType.UPDATE_REDPACK_BONUS_REMIAN, res.data);
                            break;
                        case 2:
                            GlobalData.dispatcher.event(CommonEventType.UPDATE_LEVEL_REDPACK_REMIAN, res.data);
                            break;
                        case 3:
                            GlobalData.dispatcher.event(CommonEventType.UPDATE_SUPER_REDPACK_REMIAN, res.data);
                            break;
                    }
                    return;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
            })
        }

        /**
         * 设置打开时穿入的参数
         * 
         * @param type 类型 1等级分红 2等级红包 3超级红包
         */
        public setOpenParam(type: number): void {
            super.setOpenParam(type);
            this.operateType = type;
        }


        onOpened(): void {
            super.onOpened();
            let apiAddress: string;
            switch (this.operateType) {
                case 1: apiAddress = "api/red/bag/game/level/income/withdraw/config"; break;
                case 2: apiAddress = "api/red/bag/level/withdraw/config"; break;
                case 3: apiAddress = "api/red/bag/high/level/withdraw/config"; break;
            }

            SDKNet(apiAddress, {}, (res) => {
                console.log(this.operateType, "withdraw res::", res);
                if (res.code == 200) {
                    this.txt_total.text = res.data.total_money + "元";
                    this.txt_remain.text = res.data.money + "元";
                    let config_len = res.data.withdraw_config.length;
                    res.data.withdraw_config = res.data.withdraw_config.sort((a, b) => a.money - b.money);
                    this.btnArr.forEach((btn, index) => {
                        btn.visible = index < config_len;
                        if (index < config_len) {
                            btn.label = res.data.withdraw_config[index].money + "元";
                            btn["choice_id"] = res.data.withdraw_config[index].id;
                        }
                    });
                    // 是否绑定了微信和支付宝
                    this.btn_zfb.gray = res.data.is_bind_alipay != 1;
                    this.btn_wx.gray = res.data.is_bind_wechat != 1;
                    // 默认选择第一个金额
                    this.selectedShift(0);
                    return;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
            })
        }



        /**
         * 打开提现记录界面
         */
        openRecord(): void {
            this.close();
            WindowManager.instance.open(WindowEnum.REDPACK_WITHDRAW_DETIAL_ALERT, this.operateType);
        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

    }
}