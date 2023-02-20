
/**
 * 活动排行 请求
*/
namespace modules.limit {
    import BaseItem = modules.bag.BaseItem;
    import limit_xunbao_rankFields = Configuration.limit_xunbao_rankFields;
    import ItemsFields = Configuration.ItemsFields;
    import LimitXunbaoRankInfo = Protocols.LimitXunbaoRankInfo;
    import LimitXunbaoRankInfoFields = Protocols.LimitXunbaoRankInfoFields;
    import LimitRankCfg = modules.config.LimitRankCfg;


    export class LimitRankItem extends ui.LimitRankItemUI {

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        private _showItem: Array<BaseItem>;
        protected initialize(): void {
            super.initialize();
            this._showItem = [
                this.itemBase1,
                this.itemBase2,
                this.itemBase3,
                this.itemBase4,
                this.itemBase5,
            ]

        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected addListeners(): void {
            //负责按钮等控件的事件的监听
            super.addListeners();

        }

        protected removeListeners(): void {
            //负责取消按钮等控件监听的事件
            super.removeListeners();

        }

        public onOpened(): void {


        }
        private _rank: number = 0
        protected setData(value: any): void {
            let rank = value as number;
            this._rank = rank;
            let cfg = LimitRankCfg.instance.getFishRankCfg(rank)
            let items = CommonUtil.fillItems(cfg[limit_xunbao_rankFields.Items], 5, 0)
            for (let index = 0; index < this._showItem.length; index++) {
                let bagItem: BaseItem = this._showItem[index];
                if (bagItem) {
                    if (items.length > index && items[index]) {
                        bagItem.dataSource = [items[index][ItemsFields.itemId], items[index][ItemsFields.count], 0, null];
                        bagItem.visible = true;
                    } else {
                        bagItem.visible = false;
                    }
                }
            }
            this.rankTxt.text = `第${rank}名`
            let info: LimitXunbaoRankInfo = LimitRankModel.instance.rankList(this.bigtype)[rank] || null
            if (info) {
                this.nameTxt.text = info[LimitXunbaoRankInfoFields.name]
                this.numTxt.text = info[LimitXunbaoRankInfoFields.param].toString()
                this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(info[LimitXunbaoRankInfoFields.occ] + info[LimitXunbaoRankInfoFields.occ])}`;
            } else {
                this.nameTxt.text = "虚位以待…";
                this.numTxt.text = `至少${cfg[limit_xunbao_rankFields.condition_show]}`;
                this.headImg.skin = null;
            }

        }
    }
}
