///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
namespace modules.zxian_yu {
    import BaseItem = modules.bag.BaseItem;
    import rechargeFields = Configuration.rechargeFields;

    export class ZXianYuItem extends ui.ZXianYuItemUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setData(date: Array<number>): void {
            super.setData(date);
            if (date) {
                let dangci = date[0];
                let num = date[1];
                let shuju = modules.config.RechargeCfg.instance.getRecharCfgByIndex(dangci);
                let name = shuju ? shuju[rechargeFields.name] : "";
                this.nameTxt.text = `充${name}可获得`;
                this.awardTxt.text = `*${num}`;
                //居中处理
                let w = this.nameTxt.textWidth + this.iconImg.width + this.awardTxt.textWidth;
                let pos = (this.width - w) / 2;
                this.nameTxt.x = pos;
                this.iconImg.x = this.nameTxt.x + this.nameTxt.textWidth;
                this.awardTxt.x = this.iconImg.x + this.iconImg.width;
            }
        }
        public destroy(): void {
            super.destroy(true);
        }
    }
}