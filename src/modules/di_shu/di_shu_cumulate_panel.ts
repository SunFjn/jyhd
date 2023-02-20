/**
 *  地鼠累充赠礼 面板
*/
namespace modules.dishu {
    import LimitCumulatePanel = modules.limit.LimitCumulatePanel

    export class DishuCumulatePanel extends LimitCumulatePanel {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize()
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
        protected get listItemClass(): typeof limit.LimitCumulateItem {
            return DishuCumulateItem
        }
    }
}