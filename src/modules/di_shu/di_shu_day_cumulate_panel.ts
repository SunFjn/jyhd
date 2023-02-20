/**
 *  地鼠累充赠礼 面板
*/
namespace modules.dishu {
    import LimitDayCumulatePanel = modules.limit.LimitDayCumulatePanel

    export class DishuDayCumulatePanel extends LimitDayCumulatePanel {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize()
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
        protected get listItemClass(): typeof limit.LimitDayCumulateItem {
            return DishuDayCumulateItem
        }
    }
}