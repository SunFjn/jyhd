/**
 *  地鼠消费赠礼 面板
*/
import LimitReapCfg = modules.config.LimitReapCfg
namespace modules.year {
    import LimitReapPanel = modules.limit.LimitReapPanel

    export class YearLoginPanel extends LimitReapPanel {

        protected initialize(): void {
            super.initialize()

        this.bannerLink.skin = "cumulate/image_xfzl_bg.png"
        this.HeadLink.skin = "year/image_lxdl.png"
        this.HeadLink.visible = false
        this.fishText.visible =false
        // this.sureBtn.visible =false

        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
            
        }
        protected get smallType(): LimitTaskSmallType {
            return LimitTaskSmallType.day;
        }
        protected get listItemClass(): typeof limit.LimitReapItem {
            return YearLoginItem
        }
    }
}