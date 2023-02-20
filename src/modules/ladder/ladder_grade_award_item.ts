/** 天梯段位奖励单元项*/


namespace modules.ladder {
    import LadderGradeAwardItemUI = ui.LadderGradeAwardItemUI;
    import tianti = Configuration.tianti;
    import tiantiFields = Configuration.tiantiFields;
    import Items = Configuration.Items;
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import TiantiCfg = modules.config.TiantiCfg;

    export class LadderGradeAwardItem extends LadderGradeAwardItemUI {
        private _baseItems: Array<BaseItem>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._baseItems = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6];
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg: tianti = value;
            this.gradeTxt.text = `${cfg[tiantiFields.name]}晋升奖励`;
            let nextCfg: tianti = TiantiCfg.instance.getCfgById(cfg[tiantiFields.id] + 1);
            let items: Array<Items> = nextCfg ? nextCfg[tiantiFields.promoteAwards] : [];
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                this._baseItems[i].visible = true;
                this._baseItems[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
            }
            for (let i: int = items.length, len: int = this._baseItems.length; i < len; i++) {
                this._baseItems[i].visible = false;
            }
        }
    }
}