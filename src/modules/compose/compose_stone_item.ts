namespace modules.compose {

    import item_composeFields = Configuration.item_composeFields;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import item_resolveFields = Configuration.item_resolveFields;
    import idNameFields = Configuration.idNameFields;

    export class ComposeStoneItem extends ui.ComposeStoneItemUI {

        protected initialize() {
            super.initialize();
            this.itemBtn.selected = true;
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg = value[0];
            let type = value[1];//0合成 ，1分解
            if (type == 0) {
                let arr = cfg[item_composeFields.params];
                let maxArr = new Array<number>();
                for (let i = 0; i < arr.length; i++) {
                    let id = arr[i][idCountFields.id];
                    let count = BagModel.instance.getItemCountById(id);
                    let needCount = arr[i][idCountFields.count];
                    let num = count / needCount >> 0;
                    maxArr.push(num);
                }
                maxArr.sort((l: number, r: number): number => {
                    return l > r ? -1 : 1;
                });
                let maxNum = maxArr.pop();
                if (maxNum > 0) {
                    this.redDot.visible = true;
                } else {
                    this.redDot.visible = false;
                }
                this.itemBtn.label = cfg[item_composeFields.name][Configuration.idNameFields.name].toString();
            } else {
                let needId = cfg[item_resolveFields.itemId];
                let count = ComposeModel.instance.setNum(needId);
                if (count > 0) {
                    this.redDot.visible = true;
                    ComposeModel.instance.defaultDecomposeSelectJudgeZero = this.index;
                } else {
                    this.redDot.visible = false;
                }               
                this.itemBtn.label = cfg[item_resolveFields.sClass][idNameFields.name].toString();

                // this.itemBtn.label=cfg[item_composeFields.name].toString();

            }

        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.itemBtn.selected = !value;
        }

        public close(): void {
            super.close();
        }


    }
}