
/**战队特权技能渲染节点 */
namespace modules.clan {
    import ClanBuildItemUI = ui.ClanBuildItemUI;
    import clan_buildDesc = Configuration.clan_buildDesc;
    import clan_buildDescFields = Configuration.clan_buildDescFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class ClanBuildItem extends ClanBuildItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.donayeBtnHandler);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: clan_buildDesc): void {
            super.setData(value);
            let itemData: Items = value[clan_buildDescFields.price];
            this.item.dataSource = [itemData[ItemsFields.itemId], itemData[ItemsFields.count], 0, null];
            this.nameTxt.text = value[clan_buildDescFields.donateName];
            this.descTxt.text = value[clan_buildDescFields.desc];
            let limitBuy: Array<number> = value[clan_buildDescFields.limitBuy];
            let limit: number = limitBuy[1];
            let youHaveCount: number = value[clan_buildDescFields.remainCount];
            //youHaveCount如果无限制则表示你拥有多少个，有限制则表示你能送几次
            let haveDesc: string;
            if (limit == 0) {
                haveDesc = "拥有:" + youHaveCount;
            } else {
                haveDesc = youHaveCount + "/" + limit;
            }
            this.ownTxt.text = haveDesc;
        }

        //捐献
        private donayeBtnHandler(): void {
            let itemid: number = this._data[clan_buildDescFields.id];
            ClanCtrl.instance.clanDonateReqest([itemid]);
        }
    }
}