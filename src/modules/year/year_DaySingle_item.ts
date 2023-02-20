///<reference path="../limit/limit_Day_Single_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitDaySingleItem = modules.limit.LimitDaySingleItem

    export class YearDaySingleItem extends LimitDaySingleItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
    }
}