/** N选一礼包单元项里的背包格子*/



namespace modules.commonAlert{
    import BagItem = modules.bag.BagItem;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import IMsgFields = Protocols.IMsgFields;
    import ItemEquipCfg = modules.config.ItemEquipCfg;

    export class ManualGiftBagItem extends BagItem{
        protected setDataSource(value: Protocols.Item) {
            super.setDataSource(value);
            let item: Item = value;
            if (item == null) {
                return;
            }
            let id = item[ItemFields.ItemId];
            let bagId = CommonUtil.getBagIdById(id);
            if(bagId === BagId.equipType) {
                let part = CommonUtil.getPartById(id);
                let playerEquip = PlayerModel.instance.getEquipByPart(part);
                let itemScore = ItemEquipCfg.instance.getItemCfgById(id)[Configuration.item_equipFields.notGeneratedScore][0];
                let equipScore = playerEquip ? ItemEquipCfg.instance.getItemCfgById(playerEquip[ItemFields.ItemId])[Configuration.item_equipFields.notGeneratedScore][0] : 0;
                if (equipScore < itemScore) {
                    this.upImgVisible = true;
                } else {
                    this.upImgVisible = false;
                }
            }
        }
    }
}