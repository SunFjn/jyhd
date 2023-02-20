/**
 *  地鼠消费赠礼 面板
*/
namespace modules.year {
    import LimitCumulatePanel = modules.limit.LimitCumulatePanel

    export class YearCumulatePanel extends LimitCumulatePanel {

        protected initialize(): void {
            super.initialize()
           this.bannerLink.skin = "cumulate/image_leichl_bg.png"
           this.HeadText.skin = "cumulate/txt_xbjm_leichl.png"
        //    this.fishText.visible =false
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get listItemClass(): typeof limit.LimitCumulateItem {
            return YearCumulateItem
        }
    }
}