/**
 *  地鼠消费赠礼 面板
*/
namespace modules.year {
    import LimitDaySinglePanel = modules.limit.LimitDaySinglePanel

    export class YearDaySinglePanel extends LimitDaySinglePanel {

        protected initialize(): void {
            super.initialize()
           this.bannerLink.skin = "year/image_dbcz_top.png"
           this.HeadText.skin = "common/txt_xbjm_dbcz.png"
        //    this.fishText.visible =false
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get listItemClass(): typeof limit.LimitDaySingleItem {
            return YearDaySingleItem
        }
    }
}