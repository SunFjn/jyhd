namespace modules.rune {
    import RuneAllListViewUI = ui.RuneAllListViewUI;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;

    export class RuneAllListPanel extends RuneAllListViewUI {

        private _spaceX: number;
        private _spaceY: number;
        private _recordY: number;

        protected initialize(): void {
            super.initialize();
            this._spaceX = 140;
            this._spaceY = 184;
            this._recordY = 0;
        }

        protected setData(value: any): void {
            let unlockLayer: number = value as number;
            let tipImg: RuneTipItem = new RuneTipItem(unlockLayer);
            this.addChild(tipImg);
            let runeArr: Array<item_rune> = config.ItemRuneCfg.instance.getCfgByUnlock(unlockLayer);
            for (let j: int = 0, len2: int = runeArr.length; j < len2; j++) {
                let itemId: number = runeArr[j][item_runeFields.itemId];
                let rune: RuneItem = new RuneItem();
                this.addChild(rune);
                rune.setData(itemId);
                let color: string = CommonUtil.getColorById(itemId);
                rune.nameTxt.color = color;
                rune.pos(16 + ((unlockLayer == -1 ? j + 1 : j) % 4) * this._spaceX, 50 + Math.floor(j / 4) * this._spaceY);
                if (unlockLayer == -1) {
                    rune.x -= j % 2 ? -50 : 50;
                }
                this._recordY = rune.y;
            }
            this.height = this._recordY + 150;
        }
    }
}