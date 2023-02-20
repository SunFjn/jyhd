/** 背包选择单元项*/



namespace modules.compose {
    import ComposeSelectItemUI = ui.ComposeSelectItemUI;
    import item_composeFields = Configuration.item_composeFields;
    import idNameFields = Configuration.idNameFields;
    import item_compose = Configuration.item_compose;
    import item_resolveFields = Configuration.item_resolveFields;
    import item_resolve = Configuration.item_resolve;

    export class ComposeSelectItem extends ComposeSelectItemUI {
        private _bagSelectData: string;

        protected initialize(): void {
            super.initialize();
            this.redDot.visible = false;
        }

        protected setData(value: any): void {
            super.setData(value);
            let index = value[1];//合成类型
            let selectIndex = value[2];
            let type = value[3];//合成或分解
            
            if (type == 0) {
                let cfg = value[0] as item_compose;
                this.redDot.visible = ComposeModel.instance.checkPoint(index, selectIndex);
                this._bagSelectData = cfg[item_composeFields.name][idNameFields.name];
            } else {
                let cfg = value[0] as item_resolve;
                this.redDot.visible = ComposeModel.instance.checkPointResolve(index, selectIndex);
                this._bagSelectData = cfg[item_resolveFields.sClass][idNameFields.name];
            }
            this.dataText.text = this._bagSelectData;
        }
    }
}