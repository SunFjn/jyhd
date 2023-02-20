/////<reference path="../$.ts"/>
/** 游历宠物立即结束弹框 */
namespace modules.xianfu {
    import XianfuPetBuyPropAlertUI = ui.XianfuPetBuyPropAlertUI;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Event = Laya.Event;

    export class XianfuPetAtOnceEndAlert extends XianfuPetBuyPropAlertUI {

        private _state: boolean;

        protected initialize(): void {
            super.initialize();

            this.onceBox.visible = true;
            this.contentTxt.visible = false;
            this.okBtn.label = `立即结束`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {

            let goldIcon: string = ItemMaterialCfg.instance.getItemCfgById(MoneyItemId.glod)[item_materialFields.ico];
            let type: number = XianfuModel.instance.selectPetIndex;
            let petId: number = XianfuAnimalCfg.instance.ids[type];
            let info: UpdateSpiritAnimalTravel = XianfuModel.instance.getPetInfos(petId);
            let time: number = info[UpdateSpiritAnimalTravelFields.time];
            let remainTime = Math.ceil((time - GlobalData.serverTime) / 60000);//分钟数
            let coe: number = BlendCfg.instance.getCfgById(27005)[blendFields.intParam][0];
            let goldNum: number = remainTime * coe;
            let haveNum: number = CommonUtil.getPropCountById(MoneyItemId.glod);
            this._state = haveNum >= goldNum;
            // let hsfId:number = XianfuTravelCfg.instance.getCfgById(1)[xianfu_travelFields.amuletId][0];
            // let hsfIcon:string = ItemMaterialCfg.instance.getItemCfgById(hsfId)[item_materialFields.ico];
            this.numTxt.text = goldNum.toString();
        }

        private okBtnHandler(): void {
            if (this._state) {
                XianfuCtrl.instance.travelFinish([XianfuAnimalCfg.instance.ids[XianfuModel.instance.selectPetIndex]]);
                this.close();
            } else {
                CommonUtil.goldNotEnoughAlert();
            }
        }
    }
}