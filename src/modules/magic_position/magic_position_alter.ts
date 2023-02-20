/**成就获得弹窗 */


///<reference path="../config/xianwei_rise_cfg.ts"/>

namespace modules.magicPosition {
    import MagicPositionAlterUI = ui.MagicPositionAlertUI;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import xianwei_riseFields = Configuration.xianwei_riseFields;
    import ItemsFields = Configuration.ItemsFields;
    import BagItem = modules.bag.BagItem;
    import xianwei_rise = Configuration.xianwei_rise;
    import Items = Configuration.Items;
    import Text = Laya.Text;

    export class MagicPositionAlter extends MagicPositionAlterUI {

        constructor() {
            super();
        }

        private _lv: number;

        protected initialize(): void {
            super.initialize();

            this.clickCD = true;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._lv = value as number;
            this.updateShow();
        }

        private updateShow(): void {
            let cfg: xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(this._lv);
            let lastCfg: xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(this._lv, -1);
            this.setAttr(cfg, lastCfg);
            let icon: string = cfg[xianwei_riseFields.resName];
            this.nameImg.skin = `assets/icon/ui/position_name/${icon}.png`;
            this.stageImg.skin = `${MagicPositionUtil.getSkinByLv(this._lv)}`;
            let reward: Items = cfg[xianwei_riseFields.reward][0];
            if (reward) {
                let data: Protocols.Item = [reward[ItemsFields.itemId], reward[ItemsFields.count], 0, null];
                this.item.dataSource = data;
                this.itemBox.visible = true;
            } else {
                this.itemBox.visible = false;
            }
        }
        private setAttr(cfg: xianwei_rise, lastCfg: xianwei_rise): void {
            let attTxts: Text[] = [this.attrTxt_0, this.attrTxt_1, this.attrTxt_2];
            let value_0: number = cfg[xianwei_riseFields.attack] - lastCfg[xianwei_riseFields.attack];
            let value_1: number = cfg[xianwei_riseFields.hp] - lastCfg[xianwei_riseFields.hp];
            let value_2: number = cfg[xianwei_riseFields.defense] - lastCfg[xianwei_riseFields.defense];
            let values: number[] = [value_0, value_1, value_2];
            values.forEach((ele, index) => {
                attTxts[index].text = `+${ele}`;
            });
        }
    }
}
