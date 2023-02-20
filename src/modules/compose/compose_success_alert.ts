namespace modules.compose {


    export class ComposeSuccessAlert extends ui.ComposeSuccessAlertUI {
        constructor() {
            super();
        }

        private _itemId: number;
        private _compose: ComposeItem;

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._itemId = value[0];
            let itemCfg = modules.common.CommonUtil.getItemCfgById(this._itemId);
            if (!itemCfg) throw new Error("不存在的道具ID：" + this._itemId);
            this._compose.setData(value[0]);
            this._compose.setNum(value[1], "#ffffff");

        }

        protected initialize(): void {
            super.initialize();
            this._compose = new ComposeItem();
            this._compose.pos(233, 155);
            this._compose.nameVisible = true;
            this.addChild(this._compose);
        }

        public close(): void {
            super.close();
        }
    }
}