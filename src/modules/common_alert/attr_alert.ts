/** 宠物修炼属性框 */


namespace modules.commonAlert {

    import Text = Laya.Text;
    import CommonUtil = modules.common.CommonUtil;
    import AttrAlertUI = ui.AttrAlertUI;
    import AttrUtil = modules.common.AttrUtil;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import TypesAttr = Protocols.TypesAttr;

    export class AttrAlert extends AttrAlertUI {

        private _attr: Array<TypesAttr>;
        private _txts: Array<Text>;
        private _attrIds: Array<int>;
        // private _totalAttrIds: Array<int>;//额外的总属性
        // private _type:int;
        constructor() {
            super();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.titleTxt.text = value[0];
            this.fighting = value[1];
            if (value[3]) this._attrIds = value[3];
            // this._totalAttrIds = value[4];
            // this._type = value[5] || 0;
            this.attrs = value[2];
        }

        public set attrs(attr: Array<TypesAttr>) {
            this._attr = attr;
            // if(this._type === 1){
            //     this.updateAttrList1();
            // }else {
            //     this.updateAttrList();
            // }
            this.updateAttrList();
        }

        public set fighting(num: number) {
            this.powerNum.value = num.toString();
        }

        // private updateAttrList() {
        //     if (!this._attr || this._attr.length < 1) return;
        //     if (!this._txts) this._txts = new Array<Text>();
        //     for (let i: int = 0, len: int = this._txts.length; i < len; i++) {
        //         this._txts[i].removeSelf();
        //     }
        //     let t: int = 0;
        //     let nameAndPer: [string, int];
        //     for (let i: int = 0, len: int = this._attrIds.length; i < len; i++) {
        //         let attrValue: number = (<Attr>this._attr)[this._attrIds[i]];
        //         nameAndPer = CommonUtil.getAttrNameAndPerByIndex(this._attrIds[i]);
        //         let str: string = `${nameAndPer[0]}：${Math.round(attrValue * (nameAndPer[1] === 1 ? 100 : 1))}${nameAndPer[1] === 1 ? "%" : ""}`;
        //         let txt: Text = this._txts[t];
        //         if (!txt) {
        //             txt = new Text();
        //             txt.color = "#2d2d2d";
        //             txt.fontSize = 24;
        //             this._txts[t] = txt;
        //         }
        //         this.addChild(txt);
        //         txt.text = str;
        //         txt.pos((t % 2) * 240 + 120, 220 + (t / 2 >> 0) * 36, true);
        //         t++;
        //     }
        //     //总属性的 新加属性 是写死的
        //     if (this._perAttr) {
        //         for (let index = 0; index < this._perAttr.length; index++) {
        //             let element = this._perAttr[index];
        //             let vlue: int = (<Attr>this._attr)[element[0]];
        //             if (vlue) {
        //                 let txt: Text = this._txts[t];
        //                 if (!txt) {
        //                     txt = new Text();
        //                     txt.color = "#2d2d2d";
        //                     txt.fontSize = 24;
        //                     this._txts[t] = txt;
        //                 }
        //                 this.addChild(txt);
        //                 let num = Math.floor(vlue * 100);
        //                 txt.text = `${element[1]} +${num}%`;
        //                 txt.pos((t % 2) * 240 + 120, 220 + (t / 2 >> 0) * 36, true);
        //                 t++;
        //             }
        //         }
        //     }
        // }

        private updateAttrList():void{
            if (!this._attr) return;
            if (!this._txts) this._txts = new Array<Text>();
            for (let i: int = 0, len: int = this._txts.length; i < len; i++) {
                this._txts[i].removeSelf();
            }
            let t: int = 0;
            for (let i: int = 0, len: int = this._attrIds.length; i < len; i++) {
                let attrId:number = this._attrIds[i];
                let att:attr = AttrUtil.getAttrByType(attrId, <Array<attr>>this._attr);
                let attCfg:attr_item = AttrItemCfg.instance.getCfgById(attrId);
                let attValue:number = att ? att[attrFields.value] : 0;
                let attValueStr:string = attCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attValue) + "%" : Math.round(attValue) + "";
                let str:string = `${attCfg[attr_itemFields.name]}：${attValueStr}`;
                let txt: Text = this._txts[t];
                if (!txt) {
                    txt = new Text();
                    txt.color = "#343434";
                    txt.fontSize = 24;
                    this._txts[t] = txt;
                }
                this.addChild(txt);
                txt.text = str;
                txt.pos((t % 2) * 240 + 120, 220 + (t / 2 >> 0) * 36, true);
                t++;
            }
        }

        public destroy(): void {
            if (this._txts) {
                for (let e of this._txts) {
                    e.destroy(true);
                }
                this._txts = null;
            }
            super.destroy();
        }
    }
}