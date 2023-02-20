///<reference path="../limit/limit_Reap_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitReapItem = modules.limit.LimitReapItem

    export class YearReapItem extends LimitReapItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get smallType(): LimitTaskSmallType {
            return LimitTaskSmallType.money;
        }
    }
}