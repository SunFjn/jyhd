///<reference path="../limit/limit_Cumulate_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitCumulateItem = modules.limit.LimitCumulateItem

    export class YearCumulateItem extends LimitCumulateItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
    }
}