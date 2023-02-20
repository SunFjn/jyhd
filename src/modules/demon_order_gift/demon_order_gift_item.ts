/* 七日活动任务item */
namespace modules.demonOrderGift {
    import DemonOrderGiftItemUI = ui.DemonOrderGiftItemUI;
    import demon_order_giftItem = Configuration.demon_order_giftItem
    import demon_order_giftItemFields = Configuration.demon_order_giftItemFields;
    import ItemsFields = Configuration.ItemsFields;

    export class DemonOrderGiftItem extends DemonOrderGiftItemUI {

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: demon_order_giftItem): void {
            super.setData(value);
            this.lb_day.text = value[demon_order_giftItemFields.day].toString();
            this.bgImg.skin = value[demon_order_giftItemFields.icon];
            this.unlockImg.visible = value[demon_order_giftItemFields.receives][0] == 0;// value[demon_order_giftItemFields.receives][0] == 2
            if (DemonOrderGiftModel.instance.flagInfo == 1) {
                this.moshenUnlock.visible = value[demon_order_giftItemFields.receives][1] == 0;
            } else {
                this.moshenUnlock.visible = true
            }
            
            if(value[demon_order_giftItemFields.receives][0] == 2) {
                this.isGot1.visible = true;
            } else {
                this.isGot1.visible = false;
            }

            if(value[demon_order_giftItemFields.receives][1] == 2) {
                this.isGot2.visible = this.isGot3.visible = true;
            } else {
                this.isGot2.visible = this.isGot3.visible = false;
            }

            let item1 = value[demon_order_giftItemFields.freeItem][0];
            let item2 = value[demon_order_giftItemFields.items][0];
            let item3 = value[demon_order_giftItemFields.items][1];
            this.award1.dataSource = [item1[ItemsFields.itemId], item1[ItemsFields.count], 0, null];
            this.award2.dataSource = [item2[ItemsFields.itemId], item2[ItemsFields.count], 0, null];
            this.award3.dataSource = [item3[ItemsFields.itemId], item3[ItemsFields.count], 0, null];
        }
    }
}