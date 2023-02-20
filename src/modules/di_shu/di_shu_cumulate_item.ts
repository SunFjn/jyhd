///<reference path="../limit/limit_cumulate_item.ts"/>

/**
 * 
*/
namespace modules.dishu {
    import LimitCumulateItem = modules.limit.LimitCumulateItem

    export class DishuCumulateItem extends LimitCumulateItem {

        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
    }
}