/////<reference path="../$.ts"/>
/** 仙丹icon */
namespace modules.xianDan {
    import XianDanIconUI = ui.XianDanIconUI;
    import XianDanCfg = modules.config.XianDanCfg;

    export class XianDanIcon extends XianDanIconUI {

        public id:number;
        public isSelectedIndex:boolean = false;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANDAN_INFO_UPDATE, this, this.update);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANDAN_ITEMS_UPDATE, this, this.update);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_POSITION_UPDATE, this, this.update);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.update);
        }

        public onOpened():void{
            super.onOpened();
            this.update();
        }

        private update(): void {

            let ids: int[] = XianDanCfg.instance.getIdsBySId(this.id);
            let yetCount: number = XianDanModel.instance.getUseCountBySId(this.id);
            let canCount: number = XianDanModel.instance.getLimitByVipLv();

            //按钮处理
            if (yetCount >= canCount) {
                this.rpImg.visible = false;
                this.isSelectedIndex = false;
            } else {
                for (let id of ids) {
                    let count: number = XianDanModel.instance.getItemCountById(id);
                    let useCount: number = XianDanModel.instance.getUseCountById(id);
                    let canCount: number = XianDanModel.instance.getLimit(id);
                    if (count > 0 && useCount < canCount) {
                        this.rpImg.visible = true;
                        this.isSelectedIndex = true;
                        return;
                    }
                }
                this.rpImg.visible = false;
                this.isSelectedIndex = false;
            }
        }
    }
}