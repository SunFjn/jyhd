namespace modules.year {
    import XunbaoNote2 = Protocols.XunbaoNote2;
    import XunbaoNote2Fields = Protocols.XunbaoNote2Fields;

    export class YearItemText extends ItemRender {
        private text: laya.html.dom.HTMLDivElement;

        protected initialize() {
            super.initialize();
            this.text = new laya.html.dom.HTMLDivElement();
            this.text.width = 487;
            this.height = 20;
            this.addChild(this.text);
        }

        protected setData(value: XunbaoNote2): void {
            let itemId = value[XunbaoNote2Fields.itemId];
            let itemColor = CommonUtil.getColorById(itemId);
            let itemName = CommonUtil.getNameByItemId(itemId);

            var html: string = "<span style='color:#2d2d2d;font-size: 20px'>天赐鸿福,</span>";
            html += `<span style='color:rgb(13,121,255);font-size: 20px;'>${PlayerModel.instance.roleName}</span>`;
            html += "<span style='color:#2d2d2d;font-size: 20px'>获得了</span>";
            html += `<span style='color:${itemColor};font-size: 20px;'>${itemName}</span>`;
            this.text.innerHTML = html;
        }
    }
}