///<reference path="../limit/limit_reap_item.ts"/>

/**
 * 
*/
namespace modules.dishu {
    import LimitReapItem = modules.limit.LimitReapItem

    export class DishuReapItem extends LimitReapItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
    }
}