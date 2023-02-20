/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.cashEquip {
    import CashEquipTiXianUI = ui.CashEquipTiXianUI;
    import CustomList = modules.common.CustomList;

    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Event = laya.events.Event;
    export class CashEquipTiXianPanl extends CashEquipTiXianUI {
        private _List: CustomList;
        constructor() {
            super();

        }

        public destroy(): void {

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._List = new CustomList();
            this._List.scrollDir = 1;
            this._List.itemRender = CashEquipTxItem;
            this._List.vCount = 7;
            this._List.hCount = 3;
            this._List.width = 580;
            this._List.height = 370;
            this._List.x = 0;
            this._List.y = 0;
            this.list.addChild(this._List);


        }

        protected addListeners(): void {
            super.addListeners();
            this.btnTixian.on(Event.CLICK, this, this.sendTiXian, [1]);
            this.btnTixian2.on(Event.CLICK, this, this.sendTiXian, [2]);
            this.imglist.on(Event.CLICK, this, this.openList);
            this._List.on(Event.SELECT, this, this.selectHandler);
        }

        private selectHandler(): void {
            console.log("选择了", this._List.selectedIndex)
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        private count: number = 0
        onOpened(): void {
            super.onOpened();
            this.OpenUI()
        }
        private _netData = [];
        private OpenUI() {
            let s = this;
            window['SDKNet']("api/game/recovery/change/log", { page: 1, page_count: 8 }, (data) => {
                if (data.code == 200) {
                    s.moneyTxt.text = Number(data.data.money) + "元"
                    s.moneyHisTxt.text = Number(data.data.total_sell_money) + "元"
                }
            })
            window['SDKNet']("api/game/recovery/withdraw/config", {}, (data) => {
                if (data.code == 200) {
                    let arr = CommonUtil.PHPArray(data.data.withdraw_config)
                    this._netData = []
                    for (let i = 0; i < arr.length; i++) {
                        this._netData.push({
                            tag: i,
                            money: arr[i].money,
                            config: arr[i]
                        })
                    }
                    s.updataUI();

                }
            })






        }
        private updataUI() {
            this._List.datas = this._netData
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }





        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        private sendTiXian(type) {
            if (this._netData.length <= 0) {
                SystemNoticeManager.instance.addNotice('提现列表为空', true);
                return;
            }
            if (this._List.selectedIndex <= -1) {
                SystemNoticeManager.instance.addNotice('请选择提现金额', true);
                return;
            }

            console.log("前往提现", this._netData[this._List.selectedIndex])

            let arr = {
                api_type: "POST",
                pay_type: type,
                config_id: this._netData[this._List.selectedIndex].config.id,
                method: "tixian"
            }

            window['SDKNet']("api/game/recovery/withdraw/apply", arr, (data) => {
                if (data.code == 200) {
                    SystemNoticeManager.instance.addNotice("提现申请成功", false);
                } else {
                    SystemNoticeManager.instance.addNotice(data.error, true);
                }
                this.OpenUI()
            })
        }
        private openList() {
            WindowManager.instance.openDialog(WindowEnum.CashEquip_Sell_List_Alert)
        }
    }
}