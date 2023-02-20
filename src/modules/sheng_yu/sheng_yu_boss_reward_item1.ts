
/** 背包道具单元项*/
namespace modules.sheng_yu {
    import BaseItem = modules.bag.BaseItem;

    export class ShenYuRewradItem1 extends BaseItem {
        constructor() {
            super();
            this.height = 122;
        }

        protected initialize(): void {
            super.initialize();
            this.nameVisible = true;
            this.needTip = true;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setDataSource(value: Protocols.Item) {
            if (value) {
                value[Protocols.ItemFields.uid] = 0;
                super.setDataSource(value);
            }
        }

        public destroy(): void {
            super.destroy(true);
        }
    }
}