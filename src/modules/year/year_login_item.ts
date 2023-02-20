///<reference path="../limit/limit_Reap_item.ts"/>

/**
 * 
*/
namespace modules.year {
    import LimitReapItem = modules.limit.LimitReapItem

    export class YearLoginItem extends LimitReapItem {
            constructor(){
                super()
                this.sureBtn.visible =false
                this.receivedImg.visible =false
            }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get smallType(): LimitTaskSmallType {
            return LimitTaskSmallType.day;
        }
    }
}