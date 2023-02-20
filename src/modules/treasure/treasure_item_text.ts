namespace modules.treasure {
    import XunbaoNote = Protocols.XunbaoNote;
    import XunbaoNoteFields = Protocols.XunbaoNoteFields;

    export class TreasureItemText extends ItemRender {
        private text: laya.html.dom.HTMLDivElement;

        protected initialize() {
            super.initialize();
            this.text = new laya.html.dom.HTMLDivElement();
            this.text.width = 487;
            this.height = 20;
            this.addChild(this.text);
        }

        protected setData(value: XunbaoNote): void {
            let name = value[XunbaoNoteFields.name];
            let itemId = value[XunbaoNoteFields.itemId];
            let itemColor = CommonUtil.getColorById(itemId);
            let itemName = CommonUtil.getNameByItemId(itemId);

            var html: string = "<span style='color:#ffffff;font-size: 20px'>天赐鸿福,</span>";
            html += `<span style='color:rgb(13,121,255);font-size: 20px;'>${name}</span>`;
            html += "<span style='color:#ffffff;font-size: 20px'>获得了</span>";
            html += `<span style='color:${itemColor};font-size: 20px;'>${itemName}</span>`;
            this.text.innerHTML = html;
        }
    }
}