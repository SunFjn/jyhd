/**  GM 地图编辑器 item */


namespace modules.gm {
    import GM_MapRegionItemUI = ui.GM_MapRegionItemUI;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import Event = Laya.Event;// 事件
    import CustomClip = modules.common.CustomClip; // 序列帧
    import CustomList = modules.common.CustomList; // List
    export class GM_MapRegionItem extends GM_MapRegionItemUI {

        constructor() {
            super();
        }

        private _list: CustomList;
        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();


        }

        protected removeListeners(): void {
            super.removeListeners();

        }
        public itemId: number = 0
        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.selectImg.visible = value;
            if (value) {
                console.log('研发测试_chy:地图', 'value.tag', this._vo.tag);
            }
        }
        private _vo;
        protected setData(value): void {
            super.setData(value);
            this._vo = value
            let type = 0
            if (value.type == 0) {
                type = 0
            } if (value.type == 3) {
                type = 3
            } else {
                type = GM_MapModel.instance._flags[value.index]
            }
            switch (type) {
                case 1:
                    this.iconbg.skin = value.url + "" + value.y + "_" + value.x + ".til";
                    break;
                case 3:
                    this.iconbg.skin = value.url + "" + value.y + "_" + value.x + ".png";
                    break;
                default:
                    this.iconbg.skin = value.url + "" + value.y + "_" + value.x + ".jpg";
                    break;
            }



            this.data.skin = this.iconbg.skin

            let i = value.tag
            if (value.type == 0) {
                for (let y = 0; y < 32; y++) {
                    for (let x = 0; x < 32; x++) {
                        GM_MapModel.instance._map[32 * value.hCount * y + x + i] = 15
                    }
                }
            }

            this.checkRegion();


        }

        private checkRegion() {
            let is = false
            let i = this._vo.tag
            this.clearRegion();
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    let _x = x + this._vo._x
                    let _y = y + this._vo._y
                    let id = GM_MapModel.instance.getRegionId(_x, _y, 0)
                    if (id > -1) {
                        this.setTxt(id.toString());
                    }
                }
            }

            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    let _x = x + this._vo._x
                    let _y = y + this._vo._y
                    let id = GM_MapModel.instance.getRegionId(_x, _y, 1)
                    if (id > -1) {
                        if (!is) {
                            this.tagID.text += '/'
                            is = true
                        }
                        this.setTxt(id.toString());
                    }
                }
            }
        }

        public setTxt(value: string): void {
            if (value == "" || value == "-1") {
                this.clearRegion();
                return;
            }
            this.addRegion(value)
        }
        private _region: Array<string> = [];
        public addRegion(value: string) {
            if (this._region.indexOf(value) != -1) return;
            this.tagBG.visible = true
            this._region.push(value)
            this._region.sort((a, b) => { return parseInt(a) - parseInt(b) });
            let str = ''
            for (let index = 0; index < this._region.length; index++) {
                str += this._region[index]
                if (index != this._region.length - 1) str += ","
            }
            this.tagID.visible = true
            this.tagID.text = str
            // if( this._region.length==1)this.tagID.align=''
            //this.tagBG.width = this.tagID.width + 20
            //this.tagID.x = this.tagBG.width / 2 - this.tagID.width / 2
        }
        public clearRegion() {
            this.tagBG.visible = false
            this.tagID.text = ''
            this._region = [];
        }

        public destroy() {

            super.destroy()
        }


    }
}
