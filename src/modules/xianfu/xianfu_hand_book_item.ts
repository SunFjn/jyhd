/////<reference path="../$.ts"/>

/** 仙府-家园图鉴item */
namespace modules.xianfu {
    import xianfu_illustrated_handbook = Configuration.xianfu_illustrated_handbook;
    import xianfu_illustrated_handbookFields = Configuration.xianfu_illustrated_handbookFields;
    import Item = modules.talisman.Item;
    import ItemsFields = Configuration.ItemsFields;
    import XianfuHandBookCfg = modules.config.XianfuHandBookCfg;

    export class XianfuHandBookItem extends ui.TalismanItemUI {

        protected initialize(): void {
            super.initialize();

            this.icon.y = 0;
            this.icon.x = 25;
            this.frameImg.skin = `xianfu/selected_xf_kpxzk.png`;
        }

        public setData(value: any): void {
            this._data = value;
            let id: number = value[0];
            let lv: number = value[1];
            let cfg: xianfu_illustrated_handbook = config.XianfuHandBookCfg.instance.getCfgByIdAndLv(id, lv);
            let icon: string = cfg[xianfu_illustrated_handbookFields.ico];
            let item = new Item(this.levelText, this.isExit, this.activeTxt, this.redDot);
            let quality: int = cfg[xianfu_illustrated_handbookFields.quality];
            if (quality > 5) quality = 5;
            this.bg.skin = `talisman/dt_fabao_${quality}.png`;
            this.bg2.skin = `talisman/txtbg_${quality}.png`;
            this.icon.skin = `assets/icon/item/${icon}.png`;
            this.maxLvImg.visible = false;
            this.nameText.text = cfg[xianfu_illustrated_handbookFields.name].toString();
            this.levelText.text = lv.toString();
            let needItemId = cfg[xianfu_illustrated_handbookFields.items][ItemsFields.itemId];
            let needItemNum = cfg[xianfu_illustrated_handbookFields.items][ItemsFields.count];
            let hasItemNum = XianfuModel.instance.handBookRes.get(needItemId);
            let widt: number = 165;
            item.status = XianfuModel.instance.getHandbookStateById(id);
            if (lv !== XianfuHandBookCfg.instance.maxLv) {
                if (!hasItemNum) {
                    hasItemNum = 0;
                }
                this.nowExp.text = hasItemNum.toString() + "/" + needItemNum;
                if (hasItemNum / needItemNum >= 1) {
                    this.expProgress.width = widt
                } else {
                    this.expProgress.width = widt * (hasItemNum / needItemNum);
                }
            } else {
                this.nowExp.text = "已满级";
                this.expProgress.width = widt;
                this.maxLvImg.skin = `talisman/txt_common_ymj_${quality}.png`;
                this.maxLvImg.visible = true;
            }
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.frameImg.visible = value;
        }
    }
}