namespace modules.rune {
    import RuneComposeItemUI = ui.RuneComposeItemUI;
    import rune_compose = Configuration.rune_compose;
    import rune_composeFields = Configuration.rune_composeFields;

    export class RuneComposeItem extends RuneComposeItemUI {
        private bigClass: number;
        private composedID: number;

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COMPOSE_UPDATE_SELECT_SMALL_HANDLER, this, this.updateSelectedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_COMPOSE_RP_UPDATE, this, this.updateRPHandler);
            this.addAutoListener(this.btn, Laya.Event.CLICK, this, this.onClickHandler);
        }

        public onClickHandler(): void {
            this.btn.selected = true;
            this.btn_mask.visible = true;
        }

        private updateSelectedHandler(select_index: number): void {
            if (select_index == this.index) {
                return;
            }
            this.btn_mask.visible = false;
            this.btn.selected = false;
        }

        protected setData(value: rune_compose): void {
            super.setData(value);
            this.btn.label = value[rune_composeFields.sClass][1];
            this.bigClass = value[rune_composeFields.mClass][0];
            this.composedID = value[rune_composeFields.id];
            this.updateRPHandler();
        }

        /**
         * 更新红点状态
         */
        private updateRPHandler(): void {
            let trigger: boolean = RuneModel.instance.compsoeRPTab[this.bigClass][this.composedID];
            this.RP.visible = trigger;
        }
    }
}