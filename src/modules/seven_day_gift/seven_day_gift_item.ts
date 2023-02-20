namespace modules.sevenDayGift {

    import SevenGiftItemUI = ui.SevenGiftItemUI;
    import seven_dayFields = Configuration.seven_dayFields;
    import seven_day = Configuration.seven_day;
    import ItemsFields = Configuration.ItemsFields;
    import half_month = Configuration.half_month;
    import GiftState = Protocols.GiftState;
    import half_monthFields = Configuration.half_monthFields;
    import Items = Configuration.Items;
    import GiftStateFields = Protocols.GiftStateFields;
    import Rectangle = Laya.Rectangle;
    import HalfMonthGiftModel = modules.halfMonthGift.HalfMonthGiftModel;
    import UpdateHalfMonthInfoFields = Protocols.UpdateHalfMonthInfoFields;
    import UpdateSevenDayFields = Protocols.UpdateSevenDayFields;

    export class SevenDayGiftItem extends SevenGiftItemUI {
        private _type: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.receiveImg.visible = false;
            this.selected = false;
            this.dotImg.visible = false;
        }

        //设置第七个
        public setSevenItem(): void {
            // this.frameImg.width = 307;
            // this.frameImg.x = -84;
            // this.hitArea = new Rectangle(-84, 0, 307, 196);
        }


        public set selected(value: boolean) {
            // this.frameImg.alpha = value ? 1 : 0;
            // this.frameImg.mouseEnabled = !value;
            // this.item.mouseEnabled = value;
        }

        // 1七日礼2半月礼
        public set type(value: number) {
            this._type = value;
        }

        public set cfg(value: seven_day | half_month) {
            let items: Array<Items>;
            if (this._type === 1) {
                items = value[seven_dayFields.award];
                this.item.dataSource = [items[0][ItemsFields.itemId], items[0][ItemsFields.count], 0, null];
                if (value[seven_dayFields.day] === 7) {
                    this.setSevenItem();
                }
            } else if (this._type === 2) {
                items = value[half_monthFields.award];
                this.item.dataSource = [items[0][ItemsFields.itemId], items[0][ItemsFields.count], 0, null];
                if (value[half_monthFields.day] === 14) {
                    this.setSevenItem();
                }
            }
        }

        public set data(value: GiftState) {
            this.receiveImg.visible = value[GiftStateFields.state] === 1;

            let day: number;
            if (this._type === 1) {
                day = SevenDayGiftModel.instance.sevenDayInfo[UpdateSevenDayFields.day];
                this.dotImg.visible = (day >= value[GiftStateFields.day]) && value[GiftStateFields.state] === 0;
            } else if (this._type === 2) {
                day = HalfMonthGiftModel.instance.halfMonthInfo[UpdateHalfMonthInfoFields.day];
                this.dotImg.visible = day >= value[GiftStateFields.day] && value[GiftStateFields.state] === 0;
            }

            // 第几天显示
            if (this.receiveImg.visible == false && this.dotImg.visible == false) {
                this.dayTxt.visible = true;
                this.dayTxt.text = `第${value[GiftStateFields.day]}天`;
            } else {
                this.dayTxt.visible = false;
            }
        }
    }
}
