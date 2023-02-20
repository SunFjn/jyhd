/////<reference path="../$.ts"/>
/** 套装小类item */
namespace modules.equipSuit {
    import EquipSuitTclassItemUI = ui.EquipSuitTclassItemUI;
    import EquipSuitCfg = modules.config.EquipSuitCfg;
    import equip_suit = Configuration.equip_suit;
    import equip_suitFields = Configuration.equip_suitFields;

    export class EquipSuitTclassItem extends EquipSuitTclassItemUI {

        private _id: number;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EQUIP_SUIT_UPDATE, this, this.updateView);
        }

        public setData(sId: number): void {
            this._id = sId;
            this.updateView();
        }

        public clickHandler(): void {
            if (!this.selectEnable) {
                notice.SystemNoticeManager.instance.addNotice(`请先激活上一阶套装`, true);
            }
        }

        public setSelected(value: boolean) {
            super.setSelected(value);
            this.frameImg.visible = value;
        }

        private updateView(): void {
            let indexss: Pair<number, number>[] = EquipSuitModel.instance.lightIndexs;
            this.rpImg.visible = false;
            let tIndexs: Pair<number, number> = EquipSuitModel.instance.getIndexsById(this._id);
            for (let indexs of indexss) {
                if (tIndexs.first === indexs.first && tIndexs.second === indexs.second) {
                    this.rpImg.visible = true;
                    break;
                }
            }

            let bClass: number = Math.floor(this._id / 10);
            let index: number = EquipSuitCfg.instance.bClassIds.indexOf(bClass);
            let name: string = EquipSuitUtil.names[index];
            let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(this._id);
            let star: number = cfg[equip_suitFields.light][2] - 1;
            this.nameTxt.text = `${name}·${star}星`;
            this.setCount();
            this.selectEnable = EquipSuitModel.instance.getState(this._id);
        }

        private setCount(): void {
            let currLightNum: number = EquipSuitModel.instance.getLightCountById(this._id);
            this.countTxt.text = `(${currLightNum}/8)`;
            this.countTxt.color = currLightNum >= 8 ? `#168a17` : `#ff3e3e`;
        }
    }
}