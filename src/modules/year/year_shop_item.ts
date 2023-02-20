///<reference path="../limit/limit_shop_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitShopItem = modules.limit.LimitShopItem
 
    export class YearShopItem extends LimitShopItem {
        constructor(){
            super()
            
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
    }
}