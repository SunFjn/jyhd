/** 获取到红包*/
namespace modules.redpack {
    import LayaEvent = modules.common.LayaEvent;
    import RedPackGetedAlertUI = ui.RedPackGetedAlertUI;

    export class RedPackGetedAlert extends RedPackGetedAlertUI {
        /** 提现配置类型 1等级分红 2等级红包 3超级红包 */
        private operateType: number = 1;
        private getedData: any;
        private config_id: number;
        private is_double: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn_geted, LayaEvent.CLICK, this, this.getHandler);
            this.addAutoListener(this.btn_directGeted, LayaEvent.CLICK, this, this.getHandler);
            this.addAutoListener(this.btn_double, LayaEvent.CLICK, this, this.goRecharge);
            // GlobalData.dispatcher.on(CommonEventType.HEADER_DATA_UPDATE, this, this.openHead);
            // this.addAutoRegisteRedPoint(this.headRPImg, ["HeadCanActiveRP"]);
        }

        /**
         * 前往充值界面
         */
        goRecharge() {
            this.close();
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }

        /**
         * 领取按钮处理
         */
        getHandler() {
            if (this.operateType == 1 || this.operateType == 2) {
                this.close();
            }
            if (this.operateType == 3) {
                SDKNet("api/red/bag/high/level/receive", { api_type: "POST", config_id: this.config_id, is_double: this.is_double }, (res) => {
                    console.log(res);
                    if (res.code == 200) {
                        GlobalData.dispatcher.event(CommonEventType.UPDATE_SUPER_REDPACK_REMIAN, res.data);
                        GlobalData.dispatcher.event(CommonEventType.UPDATE_SUPER_REDPACK_ITEM);
                        modules.notice.SystemNoticeManager.instance.addNotice("领取成功!");
                        this.close();
                        return;
                    }
                    modules.notice.SystemNoticeManager.instance.addNotice(res.error, true);
                })
            }
        }

        setOpenParam(value: any) {
            console.log("value::", value);
            this.getedData = value;
            this.operateType = value.type;
        }

        onOpened(): void {
            super.onOpened();

            // 提现配置类型 1等级分红 2等级红包 3超级红包 
            if (this.operateType == 1) {
                this.box_doublegeted.visible = false;
                this.box_showdouble.visible = false;
                this.box_geted.visible = true;
                this.btn_geted.skin = "redpack_common/btn_qd.png";
                this.txt_amount.text = this.getedData.money + "元";
            } else if (this.operateType == 2) {
                this.box_doublegeted.visible = false;
                this.box_showdouble.visible = false;
                this.box_geted.visible = true;
                this.txt_amount.text = this.getedData.add_money + "元";
                this.btn_geted.skin = "redpack_common/btn_qd.png";
            } else if (this.operateType == 3) {
                this.btn_geted.skin = "redpack_common/btn_lq.png";
                let is_double = this.is_double = this.getedData.is_double;
                // 需要判断是否翻倍
                if (is_double) {
                    this.box_doublegeted.visible = true;
                    this.box_showdouble.visible = false;
                    this.box_geted.visible = false;
                    this.txt_amount.text = (+this.getedData.money) * 2 + "元";
                } else {
                    this.box_doublegeted.visible = false;
                    this.box_showdouble.visible = true;
                    this.box_geted.visible = true;
                    this.txt_amount.text = this.getedData.money + "元";
                    // 98元的默认一倍显示
                    if (this.getedData.money == 98) {
                        this.box_doublegeted.visible = false;
                        this.box_showdouble.visible = false;
                        this.box_geted.visible = true;
                    }
                }

                this.config_id = this.getedData.config_id;
            }
        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

    }
}