///<reference path="../limit/limit_Day_Cumulate_item.ts"/>

/**
 * 
*/
namespace modules.dishu {
    import LimitDayCumulateItem = modules.limit.LimitDayCumulateItem

    export class DishuDayCumulateItem extends LimitDayCumulateItem {
        constructor() {
            super();
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
    }
}