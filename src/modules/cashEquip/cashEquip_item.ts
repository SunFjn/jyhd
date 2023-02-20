/**  现金装备-奇珍异宝 item */


namespace modules.cashEquip {
    import CashEquipItemUI = ui.CashEquipItemUI;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import Event = Laya.Event;// 事件
    import CustomClip = modules.common.CustomClip; // 序列帧

    export class CashEquipItem extends CashEquipItemUI {

        constructor() {
            super();
        }
        private _smeltClip: CustomClip;
        protected initialize(): void {
            super.initialize();
            this._smeltClip = new CustomClip();
            this._smeltClip.skin = "assets/effect/smelt_effect.atlas";
            this._smeltClip.frameUrls = ["smelt_effect/0.png", "smelt_effect/1.png", "smelt_effect/2.png", "smelt_effect/3.png"];
            this._smeltClip.durationFrame = 5;
            this._smeltClip.loop = false;
            this._smeltClip.pos(this.cumulateBase1.x - 35, this.cumulateBase1.y - 35, true);
            this._smeltClip.visible = false;
            this.addChild(this._smeltClip)
        }

        protected addListeners(): void {
            super.addListeners();
            this.goBtn.on(Event.CLICK, this, this._clickHandler);
            if (this._vo[cashEquipDataFields.id] as number == 15260001) this.guideSprDisplayHandler(GuideSpriteId.BOTTOM_CashEquip_SELL_BTN, this.goBtn);
            if (this._vo[cashEquipDataFields.id] as number == 15260002) this.guideSprDisplayHandler(GuideSpriteId.BOTTOM_CashEquip_TIANGUAN10, this.goBtn);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.guideSprUndisplayHandler(GuideSpriteId.BOTTOM_CashEquip_SELL_BTN);
            this.guideSprUndisplayHandler(GuideSpriteId.BOTTOM_CashEquip_TIANGUAN10);

        }
        public itemId: number = 0
        protected setSelected(value: boolean): void {
            super.setSelected(value);
            // this.setData(this.iconId)
        }
        private _vo: cashEquipData;
        protected setData(value: cashEquipData): void {
            super.setData(value);
            this._vo = value
            this.itemId = value[cashEquipDataFields.id] as number
            let count = value[cashEquipDataFields.have] as number
            let gold = value[cashEquipDataFields.gold] as number
            let cfg = CashEquipCfg.instance.getCfgId(this.itemId)
            this.cumulateBase1.dataSource = [this.itemId, count, 0, null]

            this.descTxt.color = count > 0 ? "#CD3A00" : "#743C31"
            this.goBtn.label = count > 0 ? "出售" : "获得"
            this.goldTxt.text = gold + '元'
            this.goldBox.centerX = 0
            this.descTxt.text = cfg[cash_EquipFields.name] + ""



        }

        private _clickHandler() {
            let have = this._vo[cashEquipDataFields.have] as number
            if (have > 0) {
                //出售
                WindowManager.instance.open(WindowEnum.CashEquip_Sell_Alert, [this.itemId, have]);
            } else {
                //获得
                WindowManager.instance.openDialog(WindowEnum.CashEquip_ALERT, [this.itemId, have, 0, null]);
            }
        }
        public destroy() {
            this.guideSprUndisplayHandler(GuideSpriteId.BOTTOM_CashEquip_SELL_BTN);
            super.destroy()
        }

        public setClip(value: boolean) {
            this.cumulateBase1.setClip(value)
            this.cumulateBase1.disabled = !value

        }
        private effectImg: Laya.Image;
        // 展示合成效果
        public showComposeEffect(effectImg) {
            this.effectImg = effectImg;
            this._smeltClip.play();
            this._smeltClip.visible = true;
            this._smeltClip.on(Event.COMPLETE, this, this.effectHandler);
        }
        private effectHandler(): void {
            this._smeltClip.visible = false;
            this._smeltClip.off(Event.COMPLETE, this, this.effectHandler);
            this.effectImg.skin = "bag/zs_hecheng_2.png"
        }

    }
}
