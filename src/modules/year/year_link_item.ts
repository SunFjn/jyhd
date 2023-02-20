///<reference path="../limit/limit_link_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitLinkItem = modules.limit.LimitLinkItem

    export class YearLinkItem extends LimitLinkItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
    }
}