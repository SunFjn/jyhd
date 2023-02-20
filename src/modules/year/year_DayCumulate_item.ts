///<reference path="../limit/limit_Day_Cumulate_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitDayCumulateItem = modules.limit.LimitDayCumulateItem

    export class YearDayCumulateItem extends LimitDayCumulateItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
    }
}