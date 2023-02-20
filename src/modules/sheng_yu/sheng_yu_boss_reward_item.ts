///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
/** 背包道具单元项*/
namespace modules.sheng_yu {
    import BaseItem = modules.bag.BaseItem;

    export class ShenYuRewradItem extends BaseItem {
        constructor() {
            super();
            this.height = 122;
        }

        protected initialize(): void {
            super.initialize();
            this.nameVisible = false;
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
                value = [value[Protocols.ItemFields.ItemId], 1, 0, null];
                super.setDataSource(value);
            }
        }

        public destroy(): void {
            super.destroy(true);
        }
    }
}