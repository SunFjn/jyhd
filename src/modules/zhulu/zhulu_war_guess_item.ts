
/**逐鹿竞猜item */
namespace modules.zhulu {
    import ZhuLuWarGuessItemUI = ui.ZhuLuWarGuessItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class ZhuLuWarGuessItem extends ZhuLuWarGuessItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.support1Btn, common.LayaEvent.CLICK, this, this.supportBtnHandler, [1]);
            this.addAutoListener(this.support2Btn, common.LayaEvent.CLICK, this, this.supportBtnHandler, [2]);
            this.addAutoListener(this.support3Btn, common.LayaEvent.CLICK, this, this.supportBtnHandler, [3]);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: any): void {
            super.setData(value);

        }

        //支持战队
        private supportBtnHandler(num: number): void {
            console.log("支持战队:", num);
        }
    }
}