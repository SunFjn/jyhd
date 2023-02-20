///<reference path="../config/treasure_cfg.ts"/>
/**探索面板*/



namespace modules.treasure {
    export class TreasureDianFengPanel extends TreasurePanel {
        protected initialize(): void {
            super.initialize();
            this._type = 1;
            this.artImg.skin = "treasure/image_xb_txt4.png";
            this.titleImg.skin = "treasure/txt_xbjm_dfxb.png";

            this.regGuideSpr(GuideSpriteId.TREASURE_DIANFENG_BTN, this.oneBtn);
            this.regGuideSpr(GuideSpriteId.TREASURE_EQUIP_TAB_BTN, this._buttonList.items[0]);
            this.regGuideSpr(GuideSpriteId.TREASURE_TALISMAN_TAB_BTN, this._buttonList.items[1]);
            this.regGuideSpr(GuideSpriteId.TREASURE_DIANFENG_TAB_BTN, this._buttonList.items[2]);
            this.regGuideSpr(GuideSpriteId.TREASURE_ZHIZUN_TAB_BTN, this._buttonList.items[3]);
        }

        public setOpenParam(value: number): void {
            super.setOpenParam(1);
        }

        public probabilityNoticeFun() {
            CommonUtil.alertHelp(74504);
        }

    }
}