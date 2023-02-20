/** svip秒杀*/
namespace modules.recharge {
    import LayaEvent = modules.common.LayaEvent;
    import RechargeSvipSaleAlertUI = ui.RechargeSvipSaleAlertUI;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import recharge = Configuration.recharge;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import FirstPayCfg = modules.config.FirstPayCfg;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class RechargeSvipSaleAlert extends RechargeSvipSaleAlertUI {
        private current_shift: number;
        private item_arr: Array<BaseItem>;
        private itemPoss: Table<Array<Array<number>>>;
        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();
            this.item_arr = [this.item1, this.item2, this.item3, this.item4];
            this.current_shift = 181;
            this.changeBuyShift(this.current_shift);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_RECHARGE_INFO, this, this.refreshShow);
            this.addAutoListener(this.btn_181, common.LayaEvent.CLICK, this, this.changeBuyShift, [181]);
            this.addAutoListener(this.btn_182, common.LayaEvent.CLICK, this, this.changeBuyShift, [182]);
            this.addAutoListener(this.btn_183, common.LayaEvent.CLICK, this, this.changeBuyShift, [183]);

            this.addAutoListener(this.btn_buy, common.LayaEvent.CLICK, this, this.buyCurrentHandler, [false]);
            this.addAutoListener(this.btn_buyAll, common.LayaEvent.CLICK, this, this.buyAllHandler);
        }


        /**
         * 点击档位按钮
         * 
         * @param shfit 档位
         */
        private changeBuyShift(shfit: number) {
            this.current_shift = shfit;
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(shfit);
            let price: number = cfg[rechargeFields.price];
            // 购买礼包中的奖励
            let rewards: Array<Items> = cfg[rechargeFields.reward];
            this.itemPoss = null;
            this.itemPoss = { 3: [[181, 504], [315, 504], [454, 504]], 4: [[131, 504], [248, 504], [368, 504], [481, 504]] };
            for (let i: int = 0; i < this.item_arr.length; i++) {
                if (i < rewards.length) {
                    this.item_arr[i].dataSource = [rewards[i][ItemsFields.itemId], rewards[i][ItemsFields.count], 0, null];
                    this.item_arr[i].pos(this.itemPoss[rewards.length][i][0], this.itemPoss[rewards.length][i][1]);
                }
                this.item_arr[i].visible = i < rewards.length;
            }
            this.setChooseParam();
            // 描述信息
            this.txt_origin.text = "原价:" + price * 10 + "元";
            // 是否购买过当前档位或168元档位
            let buyStatus: boolean = RechargeModel.instance.getSVipSaleBuyStatus(shfit);
            let buyAll: boolean = RechargeModel.instance.getSVipSaleBuyStatus(184);
            this.btn_buy.disabled = buyStatus || buyAll;

            // 购买过任一档次则禁用购买168的按钮
            this.btn_buyAll.disabled = RechargeModel.instance.alreadyBuyAnyoneShift;;

            // 按钮显示当前金额
            this.btn_buy.label = price + "元秒杀";
        }

        /**
         * 设置选中参数
         */
        private setChooseParam() {
            let btn: Laya.Button = this["btn_" + this.current_shift];
            this.btn_181._childs[0].visible = false;
            this.btn_182._childs[0].visible = false;
            this.btn_183._childs[0].visible = false;
            this.btn_181.skin = "svip/image_wxz.png";
            this.btn_182.skin = "svip/image_wxz.png";
            this.btn_183.skin = "svip/image_wxz.png";
            btn._childs[0].visible = true;
            btn.skin = "svip/image_xz.png";
        }

        /**
         * 购买指定档位的礼包
         */
        private buyCurrentHandler(buyAll: boolean = false) {
            let buyShift: number = this.current_shift;
            if (buyAll) {
                buyShift = 184;
            }
            let canBuy: boolean = RechargeModel.instance.getSVipSaleCanBuyStatus(buyShift);
            if (!canBuy) {
                if (FirstPayModel.instance.totalRechargeMoney < FirstPayCfg.instance.getCfgDefaultData()[Configuration.first_payFields.money]
                    && FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                    WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                } else {
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                }
                SystemNoticeManager.instance.addNotice("SVIP等级不足,请充值");
                this.close();
                return;
            }
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(buyShift);
            if (Main.instance.isWXiOSPay) {
                wxiOSPayHandler();
            } else {
                PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            }
        }

        /**
         * 购买168元档位的，即购买全部礼包
         */
        private buyAllHandler() {
            this.buyCurrentHandler(true);
        }

        /**
         * 刷新视图
         */
        private refreshShow() {
            this.changeBuyShift(this.current_shift);
        }

        onOpened(): void {
            super.onOpened();
            this.refreshShow();
        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public destroy(): void {
            this.itemPoss = null;
            for (const iterator of this.item_arr) {
                iterator.destroy();
            }
            this.item_arr = null;
            super.destroy();

        }
    }
}