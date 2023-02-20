/**
 *  地鼠消费赠礼 面板
*/
namespace modules.year {
    import LimitReapPanel = modules.limit.LimitReapPanel

    export class YearReapPanel extends LimitReapPanel {

        
        protected initialize(): void {
            super.initialize()

        this.bannerLink.skin = "cumulate/image_xfzl_bg.png"
        this.HeadLink.skin = "cumulate/txt_xbjm_xfzl.png"
        this.fishText.visible =false
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get smallType(): LimitTaskSmallType {
            return LimitTaskSmallType.money;
        }
        protected get listItemClass(): typeof limit.LimitReapItem {
            return YearReapItem
        }
    }
}