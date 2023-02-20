namespace modules.payRank {
    import PayRankItemUI = ui.PayRankItemUI;
    import ConsumeRank = Protocols.ConsumeRank;
    import ConsumeRankFields = Protocols.ConsumeRankFields;
    import ConsumeRankCfg = modules.config.ConsumeRankCfg;
    import consume_rankFields = Configuration.consume_rankFields;
    import consume_rank = Configuration.consume_rank;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;

    export class PayRankItem extends PayRankItemUI {

        protected setData(value: any): void {
            super.setData(value);
            let rank: ConsumeRank = value;
            let rankNum: number = this.index + 1;

            if (rankNum === 1) {
                this.commonRank.visible = false;
                this.rank.skin = "common/zs_tongyong_7.png";
            } else if (rankNum === 2) {
                this.commonRank.visible = false;
                this.rank.skin = "common/zs_tongyong_8.png";
            } else if (rankNum === 3) {
                this.commonRank.visible = false;
                this.rank.skin = "common/zs_tongyong_9.png";
            } else {
                this.rank.visible = false;
                this.commonRank.visible = true;
                this.rankClip.value = `${rankNum}`;
            }
            if (rank) {
                this.waitingBox.visible = false;
                this.roleName.visible = true;
                this.payYB.visible = true;
                this.roleName.text = rank[ConsumeRankFields.name];
                this.payYB.text = "消费代币券:" + rank[ConsumeRankFields.consume];
            } else {
                this.waitingBox.visible = true;
                this.roleName.visible = false;
                this.payYB.visible = false;
            }
            let cfg: consume_rank = ConsumeRankCfg.instance.getCfgByRank(this.index);
            let awards: Array<Item> = CommonUtil.formatItemData(cfg[consume_rankFields.award]);
            let items: Array<BaseItem> = [this.item1, this.item2, this.item3];
            let requestNumber = cfg[consume_rankFields.consume];
            this.requestYB.text = CommonUtil.bigNumToString(requestNumber);
            this.other.x = this.requestYB.x + this.requestYB.width;
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                if (i >= awards.length) {
                    items[i].visible = false;
                } else {
                    items[i].visible = true;
                    items[i].dataSource = awards[i];
                }
            }
        }
    }
}