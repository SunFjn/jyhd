namespace modules.main {
    import Event = Laya.Event;

    export class HuoQuItemItem extends ui.HuoQuItemUI {
        private _date: Array<number>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected onOpened(): void {
            super.onOpened();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (modules.day_pay.DayPayModel.instance.giveState != 2) {
                this.close();
                return;
            }
            if (!value) {
                return;

            }
            this._date = value;
            console.log("value:  ", value);
            let dangCi = this._date[2];
            let scoreItems = this._date[3];
            console.log("scoreItems:   " + scoreItems);
            this.item1.dataSource = [scoreItems, 1, 0, null];
            this.nameText.text = CommonUtil.getNameByItemId(scoreItems);
        }

        protected addListeners(): void {
            super.addListeners();
            this.huoQuBtn.on(Event.CLICK, this, this.huoQuBtnHandler);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.huoQuBtn.off(Event.CLICK, this, this.huoQuBtnHandler);
        }

        public huoQuBtnHandler() {
            if (modules.day_pay.DayPayModel.instance.giveState == 2) {
                WindowManager.instance.open(WindowEnum.DAY_PAY_PANEL, this._date[2] - 1);
                WindowManager.instance.close(WindowEnum.MAGIC_PET_RANK_PANEL);
                WindowManager.instance.close(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}