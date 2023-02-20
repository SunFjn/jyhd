/**
 *  地鼠消费赠礼 面板
*/
namespace modules.year {
    import LimitLinkPanel = modules.limit.LimitLinkPanel

    export class YearLinkPanel extends LimitLinkPanel {

        protected initialize(): void {
            super.initialize()
           this.bannerLink.skin = "continue_pay/image_lchl_bg.jpg"
           this.HeadText.skin = "common/txt_xbjm_lchl.png"
           this.payText.visible =true
           this.dayText.visible =true
           this.continueBase.visible =true
        //    this.fishText.visible =false
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected get listItemClass(): typeof limit.LimitLinkItem {
            return YearLinkItem
        }
    }
}