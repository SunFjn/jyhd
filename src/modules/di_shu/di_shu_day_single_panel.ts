/**
 *  地鼠累充赠礼 面板
*/
namespace modules.dishu {
    import LimitDaySinglePanel = modules.limit.LimitDaySinglePanel

    export class DishuDaySinglePanel extends LimitDaySinglePanel {
        constructor() {
            super();
            
        }
        protected initialize(): void {
            super.initialize()
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
        protected get listItemClass(): typeof limit.LimitDaySingleItem {
            return DishuDaySingleItem
        }
    }
}