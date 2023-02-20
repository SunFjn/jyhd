/**
 *  地鼠消费赠礼 面板
*/
namespace modules.year {
    import LimitDayCumulatePanel = modules.limit.LimitDayCumulatePanel

    export class YearDayCumulatePanel extends LimitDayCumulatePanel {

        protected initialize(): void {
            super.initialize()
           this.bannerLink.skin = "year/image_mrlc_top.png"
           this.HeadText.skin = "cumulate/txt_xbjm_mrlc.png"
        //    this.fishText.visible =false
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get listItemClass(): typeof limit.LimitDayCumulateItem {
            return YearDayCumulateItem
        }
    }
}