/**逐鹿首领战积分排行item */
namespace modules.zhulu {
    import ZhuLuBlessedAwardDisplayItemUI = ui.ZhuLuBlessedAwardDisplayItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import zhuluBlessedAwardDisplay = Configuration.zhuluBlessedAwardDisplay;
    import zhuluBlessedAwardDisplayFields = Configuration.zhuluBlessedAwardDisplayFields;

    export class ZhuLuBlessedAwardDisplayItem extends ZhuLuBlessedAwardDisplayItemUI {

        protected addListeners(): void {
            super.addListeners();

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: zhuluBlessedAwardDisplay): void {
            super.setData(value);
            let name: string = value[zhuluBlessedAwardDisplayFields.name];
            let type: number = value[zhuluBlessedAwardDisplayFields.type];
            let desc: string = value[zhuluBlessedAwardDisplayFields.describe];
            let itemData: Array<Items> = value[zhuluBlessedAwardDisplayFields.award];

            this.blessedTxt.text = name;
            this.descTxt.text = desc;
            this.blessedImg.skin=`blessed/image_test_${type}.png`;

            this.item1.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [itemData[1][ItemsFields.itemId], itemData[1][ItemsFields.count], 0, null];
            this.item3.dataSource = [itemData[2][ItemsFields.itemId], itemData[2][ItemsFields.count], 0, null];
            this.item4.dataSource = [itemData[3][ItemsFields.itemId], itemData[3][ItemsFields.count], 0, null];
        }
    }
}