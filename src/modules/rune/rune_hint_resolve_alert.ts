namespace modules.rune {
    import CommonTxtAlertUI = ui.CommonTxtAlertUI;
    import Event = Laya.Event;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;

    export class RuneHintResolveAlert extends CommonTxtAlertUI {

        private _value: Protocols.Pair[];

        protected initialize(): void {
            super.initialize();

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.valign = "middle";
            this.contentTxt.style.lineHeight = 28;
            this.contentTxt.mouseEnabled = false;

            this.titleTxt.text = `温馨提示`;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.cancelBtn, Event.CLICK, this, this.close);
        }

        private okBtnHandler(): void {
            RuneCtrl.instance.resolveRune(this._value);
            this.close();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._value = value[0];  //uid 数组
            let specialRuneIds: number[] = value[1];  //id数组

            let specialRuneStr: string[] = [];
            for (let i: int = 0, len: int = specialRuneIds.length; i < len; i++) {
                let id: number = specialRuneIds[i];
                let lv: number = id % 10000;
                let dimId: number = (id * 0.0001 >> 0) * 10000;  //模糊Id
                let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
                let name: string = dimCfg[item_runeFields.name];
                specialRuneStr.push(`[${name}Lv.${lv}],`);
            }

            let str: string = ``;
            for (let i: int = 0, len: int = specialRuneStr.length; i < len; i++) {
                str += specialRuneStr[i];
            }
            this.contentTxt.innerHTML = `分解的玉荣中包含<span style='color:#FF0000'>史诗辟邪玉${str}</span>是否确认进行一键分解。`;
        }
    }
}
