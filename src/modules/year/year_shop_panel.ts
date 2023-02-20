/**
 *  地鼠消费赠礼 面板
*/
namespace modules.year {
    import LimitShopPanel = modules.limit.LimitShopPanel

    export class YearShopPanel extends LimitShopPanel {
        constructor(){
            super()
            
        }
        protected initialize(): void {
            super.initialize()

        this.HeadLink.skin = "common/txt_xbjm_xsyz.png"
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get listItemClass(): typeof limit.LimitShopItem {

            return YearShopItem
        }
    }
}