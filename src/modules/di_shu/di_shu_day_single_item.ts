///<reference path="../limit/limit_day_single_item.ts"/>

/**
 * 
*/
namespace modules.dishu {
    import LimitDaySingleItem = modules.limit.LimitDaySingleItem

    export class DishuDaySingleItem extends LimitDaySingleItem {
        constructor() {
            super();
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
    }
}