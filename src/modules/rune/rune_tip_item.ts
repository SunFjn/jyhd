namespace modules.rune {
    import runeTipItemUI = ui.RuneTipItemUI;

    export class RuneTipItem extends runeTipItemUI {

        constructor(layer: number) {
            super();
            if (!layer) {
                this.tipTxt.text = `默认解锁`;
                this.lineLeft.x = 28;
                this.lineRight.x = 525;
            } else if (layer == -1) {
                this.tipTxt.text = `史诗辟邪玉`;
                this.lineLeft.x = 28;
                this.lineRight.x = 525;
            } else {
                this.tipTxt.text = `未央幻境${layer}层解锁`;
                this.lineLeft.x = 0;
                this.lineRight.x = 553;
            }
        }
    }
}