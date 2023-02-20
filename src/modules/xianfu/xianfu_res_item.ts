/////<reference path="../config/wing_cfg.ts"/>
/////<reference path="../wing/wing_model.ts"/>

/** 风水物件Item */
namespace modules.xianfu {
    import XianfuResItemUI = ui.XianfuResItemUI;

    export class XianfuResItem extends XianfuResItemUI {

        protected initialize(): void {
            super.initialize();
            this.frameImg.visible = false;
        }

        protected setData(value: any): void {
            super.setData(value);

            let id: number = value;
            let cfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(id);
            let nextCfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(id + 1);
            let nameRes: string = cfg[Configuration.xianfu_decorateFields.nameRes];
            let iconRes: string = cfg[Configuration.xianfu_decorateFields.iconRes];
            this.iconImg.skin = `assets/icon/ui/xianfu_decorate/${iconRes}.png`;
            this.nameImg.skin = `assets/icon/ui/xianfu_decorate/${nameRes}.png`;
            let lv: number = id % 100;
            if (lv) { //已经激活
                this.lvTxt.text = `Lv.${lv}`;
                this.lvTxt.color = `#473607`;
                this.iconImg.gray = false;
            } else {
                this.iconImg.gray = true;
                this.lvTxt.text = `未激活`;
                this.lvTxt.color = `#ff3e3e`;
            }
            let needItemId: number = cfg[Configuration.xianfu_decorateFields.items][Configuration.ItemsFields.itemId];
            let needItemNum: number = cfg[Configuration.xianfu_decorateFields.items][Configuration.ItemsFields.count];
            let hasItemNum: number = bag.BagModel.instance.getItemCountById(needItemId);
            this.RPImg.visible = !!((hasItemNum >= needItemNum) && nextCfg);
        }


        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.frameImg.visible = value;
        }
    }
}