///<reference path="../common_alert/equip_base_alert.ts"/>

/** 装备穿戴弹框*/
namespace modules.commonAlert {

    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import EquipBaseAlert = modules.commonAlert.EquipBaseAlert;
    import IMsgFields = Protocols.IMsgFields;

    export class EquipWearAlert extends EquipBaseAlert {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.isNeedContrast = false;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this.item = value;
        }

        public set item(value: Protocols.Item) {

            let itemData: Item = value;
            this.setBaseInfo(itemData);
            this.setBaseAttr(itemData);
          
            let itemId: number = itemData[Protocols.ItemFields.ItemId];

            let iMsg: Protocols.IMsg = itemData[ItemFields.iMsg];
            let bestAttrCount: number = this.setBestAttr(iMsg);

            if (bestAttrCount == 0) {
                this.stoneBox.y = this.bestAttrBox.y;
                this.bestAttrBox.visible = false;
            } else {
                this.bestAttrBox.visible = true;
                this.stoneBox.y = this._bestAttrLastY + 10;
            }
            this.setStoneAttr(iMsg);
            this.stoneBox.height = this.stoneTxt.y + this.stoneTxt.contextHeight;
            this.xiLianBox.y = this.stoneBox.y + this.stoneBox.height;
            this.xiLianBox.height = this.setXiLian(value[ItemFields.iMsg][IMsgFields.xilianAttr]);
            this.zhuHunBox.y = this.xiLianBox.y + this.xiLianBox.height;
            this.zhuHunBox.height = this.setZhuHun(itemData);
            this.elseBox.y = this.conBox.y + this.setConHeight(this.xiLianBox.y + this.xiLianBox.height + this.zhuHunBox.height) + 8;
            let _sourceBtnBg: Array<Laya.Image> = this.setSource(itemData);
            if (_sourceBtnBg.length > 0) {
                // 98=btn_ydrk_bg.height
                // 49 btn_ydrk_bg与来源标题Y距离
                // 147=98+49
                this.soureBtn.removeChildren()
                this.soureBox.height = 147;
                this.soureBox.visible = true;
                this.soureBox.y = this.elseBox.y + 60;
                this.soureBtn.addChildren(..._sourceBtnBg);
            } else {
                this.soureBox.visible = false;
            }
            this.setRank(itemId);
        }
        public destroy(): void {
            this.soureBtn = this.destroyElement(this.soureBtn);
            super.destroy();
        }
    }
}