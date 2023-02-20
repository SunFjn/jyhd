/** 现金装备-奇珍异宝 出售弹窗*/


namespace modules.cashEquip {

    import CashEquipSellAlertUI = ui.CashEquipSellAlertUI;
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧

    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;

    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    export class CashEquipSellAlert extends CashEquipSellAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this.regGuideSpr(GuideSpriteId.BOTTOM_CashEquip_SELLON_BTN, this.sellBtn);


        }

        protected addListeners(): void {
            super.addListeners();
            this.addBtn.on(Event.CLICK, this, this.UpHandler);
            this.subBtn.on(Event.CLICK, this, this.DownHandler);
            this.maxBtn.on(Event.CLICK, this, this.MaxHandler);
            this.sellBtn.on(Event.CLICK, this, this.sell);


        }

        protected removeListeners(): void {
            super.removeListeners();
       
        }

        private _count: number = 0
        private _itemId: number = 0
        private _sellNum: number = 0
        private _gold: number = 0
        public setOpenParam(value): void {
            super.setOpenParam(value);
            let itemId = value[0]
            let count = CashEquipModel.instance.getItemCount(itemId)
            this._itemId = itemId
            this._count = count
            this._sellNum = count > 0 ? 1 : 0
            let cfg: cash_Equip = CashEquipCfg.instance.getCfgId(itemId)
            this.item1.dataSource = [itemId, count, 0, null]
            this.item1.needTip = false
            this._gold = Number(cfg[cash_EquipFields.gold])
            this.setGold(this._sellNum)
        }
        onOpened(): void {
            super.onOpened();
        }

        private setGold(num: number) {
            let _num = num
            if (_num > this._count) {
                _num = this._count
                SystemNoticeManager.instance.addNotice("已达最大出售数量!", true);
            }
            if (_num < 0) _num = 0
            if (_num < 1 && this._count > 0) _num = 1
            this._sellNum = _num
            this.inputTxt.text = this._sellNum.toString();
            let gold = (this._sellNum * (this._gold * (10000 * 10000))) / (10000 * 10000)
            this.goldTxt.text = gold + "元"
        }



        private UpHandler(): void {
            this.setGold(this._sellNum + 1)
        }

        private DownHandler(): void {
            this.setGold(this._sellNum - 1)
        }

        private MaxHandler(): void {
            this.setGold(this._count)
        }

        private sell() {
            if (this._sellNum <= 0) {
                SystemNoticeManager.instance.addNotice("出售数量为0!", true);
                return;
            }
            if (this._sellNum > this._count) {
                SystemNoticeManager.instance.addNotice("出售数量错误!", true);
                return;
            }


            CashEquipCtrl.instance.SellCashEquip(this._itemId, this._sellNum)
            WindowManager.instance.close(WindowEnum.CashEquip_Sell_Alert)
        }


        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}