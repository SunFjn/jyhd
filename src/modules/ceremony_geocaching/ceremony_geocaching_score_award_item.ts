namespace modules.ceremony_geocaching {
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import CelebrationHuntScoreRewardShowFields = Protocols.CelebrationHuntScoreRewardShowFields;
    import CelebrationHuntScoreRewardShow = Protocols.CelebrationHuntScoreRewardShow;

    export class CeremonyGeocachingScoreAwardItem extends ui.CeremonyGeocachingScoreAwardItemUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
        }
        protected addListeners(): void {
            super.addListeners();
            //这里绑定 更新 事件
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_MYLIST, this, this.showUI);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_QULIST, this, this.showUI);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected setData(value: CelebrationHuntScoreRewardShow): void {
            super.setData(value);
            let itemData = value[CelebrationHuntScoreRewardShowFields.Items];
            let desc = value[CelebrationHuntScoreRewardShowFields.desc];

            this.StatementHTML.innerHTML = desc;
            this.item.dataSource = [itemData[ItemsFields.itemId], itemData[ItemsFields.count], 0, null];
        }

        public close(): void {
            super.close();
        }
    }
}
