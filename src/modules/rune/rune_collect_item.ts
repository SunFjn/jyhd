namespace modules.rune {
    import RuneCollectItemUI = ui.RuneCollectItemUI;
    import RuneCollectGradeInfo = Protocols.RuneCollectGradeInfo;
    import RuneCollectGradeInfoFields = Protocols.RuneCollectGradeInfoFields;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;

    export class RuneCollectItem extends RuneCollectItemUI {
        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COLLECT_UPDATE_SELECT_SMALL_HANDLER, this, this.updateSelectedHandler);

        }

        private updateSelectedHandler(select_index: number): void {
            this.selected_img.visible = select_index == this.index;
        }

        protected setData(value: RuneCollectGradeInfo): void {
            super.setData(value);
            let id: number = value[RuneCollectGradeInfoFields.id];
            let itemData: item_rune = modules.config.ItemRuneCfg.instance.getCfgById(id);
            let name: string = itemData[item_runeFields.name];
            let jie: number = value[RuneCollectGradeInfoFields.grade];
            let star: number = value[RuneCollectGradeInfoFields.stars];
            this.txt_exp.text = `${name} ${jie}阶`;
            this.txt_exp.color = CommonUtil.getColorById(id);
            this.level_star_1.visible = star >= 1;
            this.level_star_2.visible = star >= 2;
            this.level_star_3.visible = star >= 3;

            this.rp.visible = value[RuneCollectGradeInfoFields.rpState];

            this.icon.skin = `assets/icon/item/${itemData[item_runeFields.ico]}.png`;
        }
    }
}