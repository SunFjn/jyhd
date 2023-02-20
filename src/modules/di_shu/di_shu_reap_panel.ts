/**
 *  地鼠消费赠礼 面板
*/
namespace modules.dishu {
    import LimitReapPanel = modules.limit.LimitReapPanel

    export class DishuReapPanel extends LimitReapPanel {
            constructor(){
                super()
          
            }
        protected initialize(): void {
            super.initialize()
            this.bannerLink.skin = "cumulate/image_xfzl_bg.png"
            this.HeadLink.skin = "cumulate/txt_xbjm_xfzl.png"
            this.fishText.visible =false
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.dishu;
        }
        protected get listItemClass(): typeof limit.LimitReapItem {
            return DishuReapItem
        }
    }
}