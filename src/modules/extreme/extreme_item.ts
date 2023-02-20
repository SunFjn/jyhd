/**  圣装 item */


namespace modules.extreme {
    import ExtremeItemUI = ui.ExtremeItemUI;

    export class ExtremeItem extends ExtremeItemUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LuxuryEquip_ZhiZun_UPDATE, this, this.showSlect);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LuxuryEquip_ZhiZun_UPDATE, this, this.showSlect);

        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.setData(this.iconId)
        }
        protected clickHandler() {
            super.clickHandler();
            extremeModel.instance.nowsSelect = this.data.value - 1;
            this.showSlect();
            GlobalData.dispatcher.event(CommonEventType.LuxuryEquip_ZhiZun_UPDATE);
        }
        protected showSlect() {
            if ((this.iconId - 1) === extremeModel.instance.nowsSelect) {
                this.item_light.visible = true
            } else {
                this.item_light.visible = false
            }
        }

        private iconId: number = 0
        protected setData(value: any): void {
            super.setData(value);
            this.iconId = value.value as number;
            this.title.text = extremeModel.instance.getIcon(this.iconId)[1];
            this.icon.skin = "extreme/desc/" + extremeModel.instance.getIcon(this.iconId)[0] + ".png";
            this.RP.visible = extremeModel.instance.RPs[this.iconId - 1]
            this.showSlect()
            let lev = extremeModel.instance.getLevel(this.iconId)
            this.level.text = lev + ""
            ExtremeCfg.instance.getInfo(this.iconId, lev)
            if (ExtremeCfg.instance.getInfo(this.iconId, lev)) {
                this.level.visible = true;
                this.level_text.visible = true;
                this.level_bg.visible = true;
                this.noActive.visible = false;
            } else {
                this.level.visible = false;
                this.level_text.visible = false;
                this.noActive.visible = true;
                this.level_bg.visible = false;
            }

        }

        public click() {

        }
    }
}
