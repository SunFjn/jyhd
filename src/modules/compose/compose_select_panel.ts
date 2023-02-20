/**背包上拉列表选择框 */



///<reference path="../common/custom_list.ts"/>

namespace modules.compose {
    import CustomList = modules.common.CustomList;
    import ComposeSelectViewUI = ui.ComposeSelectViewUI;
    import Event = Laya.Event;
    import item_compose = Configuration.item_compose;
    import item_resolve = Configuration.item_resolve;
    import idNameFields = Configuration.idNameFields;
    import item_composeFields = Configuration.item_composeFields;
    import item_resolveFields = Configuration.item_resolveFields;
    import ComposeCfg = modules.config.ComposeCfg;

    export class ComposeSelectPanel extends ComposeSelectViewUI {

        private _list: CustomList;
        private _isOpen: boolean;
        private _bagSelectData: Array<string>;
        private _selectIndex: number;
        private _rowH: number;
        private _changeH: number;
        private _index: number;
        private _type: number;
        private _bottom: Array<any>;
        private _bottom1: Array<any>;
        private _downImage: Laya.Image
        private _downBgImage: Laya.Image


        protected initialize(): void {
            super.initialize();
            this._downImage = new Laya.Image("compose/image_jt.png");
            this._downImage.y = 63
            this._downImage.x = 55
            this.addChild(this._downImage)
            this._downImage.visible = false;
            this._downBgImage = new Laya.Image("compose/image_tongyong2.png");
            this._downBgImage.sizeGrid = "6,6,5,5"
            this._downBgImage.width = 156
            this._downBgImage.y = 83
            this._downBgImage.x = 2
            this.addChild(this._downBgImage)
            this._downBgImage.visible = false

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = ComposeSelectItem;
            this._list.vCount = 2;
            this._list.hCount = 1;
            this._list.width = 607;
            this._list.height = 83;
            this._list.x = 0;
            this._list.spaceY = 2
            this._rowH = 53;
            this._list.y = 88;
            this.addChild(this._list);
            this._isOpen = false;
            this._list.visible = false;
            this._selectIndex = -1;
            this._bottom = new Array<any>();
            this._bottom1 = new Array<any>();

            this.reInit()
        }

        public reInit() {
            let arr: Array<any> = ComposeCfg.instance.getComposeTclassLength();
            this._bottom = [];
            this._bottom1 = [];
            for (let i = 1; i < arr.length; i++) {
                let ctCfgs = arr[i];
                let sclassNames = new Array<any>();
                for (let j = 0; j < ctCfgs.length; j++) {
                    let cfg = ctCfgs[j];
                    let sclass = cfg[item_composeFields.name];
                    let id = sclass[idNameFields.id];
                    if (sclassNames[id - 1] == null) {
                        // sclassNames[id - 1] = [cfg[item_composeFields.sClass][idNameFields.name]];
                        sclassNames[id - 1] = cfg;
                    }
                }
                this._bottom.push(sclassNames);
            }
            let arr1: Array<any> = ComposeCfg.instance.getResolveTclassLength();
            for (let i = 1; i < arr1.length; i++) {
                let rtCfgs = arr1[i];
                let tclasscfgs = new Array<any>();
                for (let j = 0; j < rtCfgs.length; j++) {
                    let cfg = rtCfgs[j];
                    let sclass = cfg[item_resolveFields.sClass];
                    let id = sclass[idNameFields.id];
                    if (tclasscfgs[id - 1] == null) {
                        tclasscfgs[id - 1] = cfg;
                    }
                }
                this._bottom1.push(tclasscfgs);
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.btn.on(Event.CLICK, this, this.openHandler);
            this._list.on(Event.SELECT, this, this.selectHandler);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.setRowData);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.btn.off(Event.CLICK, this, this.openHandler);
            this._list.off(Event.SELECT, this, this.selectHandler);
            GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.setRowData);
        }

        protected onOpened(): void {
            super.onOpened();
            this.setRowData();
        }

        public openHandler(): void {
            if (this._isOpen) {
                this._isOpen = this._list.visible = false;
                this._downImage.visible = false
                this._downBgImage.visible = false
                this.btn.selected = false;
                this.height = this._rowH;
            } else {
                this._isOpen = this._list.visible = true;
                this._downImage.visible = true
                this._downBgImage.visible = true
                this.btn.selected = true;
                this.height = this._changeH;
            }
            // 在此处判断是否为耳环等不需要点出来的compose，打开后，派发前
            if (this._list.datas) {
                if ((this._list.datas[0][0][item_composeFields.tClass][idNameFields.id] == 2) && (this._list.datas[0][0][item_composeFields.alertType] == 0)) {
                    this.height = this._rowH;
                }
            }

            if (this._type < 1) {
                this.event("COMPOSE_RESIZW", this._index);
            } else {
                this.event("RESOLVE_RESIZW", this._index);
            }
            this.updateList();
        }

        private selectHandler(): void {
            if (this._list.selectedIndex == -1) return;
            this.specialCompose();

            for (const m of this._list.items) {
                (m as ComposeSelectItem).img_bg.skin = "compose/btn_0.png";
            }
            (this._list.selectedItem as ComposeSelectItem).img_bg.skin = "compose/btn_1.png"
            this._list.selectedIndex = -1;
        }

        // 耳环魔法石等内容设定为自动排列，取消list
        private specialCompose() {
            let listSelect = 0;
            let data = this._list.datas;
            for (let m = 0; m < data.length; m++) {
                let dm = data[m][0];
                if (dm[item_composeFields.tClass][0] == 2 && dm[item_composeFields.alertType] == 0) {
                    let needCount = dm[item_composeFields.params][0][Configuration.idCountFields.count];
                    let ownId = dm[item_composeFields.params][0][Configuration.idCountFields.id];
                    let count = ComposeModel.instance.setNum(ownId);
                    if (count >= needCount) {
                        this._list.selectedIndex = listSelect = m;
                    }

                    let itemId = dm[item_composeFields.itemId];
                    let gotCount = ComposeModel.instance.setNum(itemId);
                    if (gotCount >= 1) {
                        this._list.selectedIndex = listSelect = m;
                    }

                    this._list.visible = false;
                    this._downImage.visible = false;
                    this._downBgImage.visible = false;
                }
            }
            this._selectIndex = this._list.selectedIndex;
            console.log("选项参", [this._index, this._selectIndex, this._type])
            if (this._type < 1) {
                this.event("COMPOSE_SELECT", [this._index, this._selectIndex, this._type]);  //进行选择后抛出事件
            } else {
                this.event("RESOLVE_SELECT", [this._index, this._selectIndex, this._type]);  //进行选择后抛出事件
            }
        }

        updateList() {
            this._list.selectedIndex = this.searchOne();
            this.selectHandler();
        }

        searchOne() {
            let tempOne: number = 0;
            let flag: boolean;
            if (this._type < 1) {
                for (let m = 0; m < this._list.datas.length; m++) {
                    flag = ComposeModel.instance.checkPoint(this._index, m);
                    if (flag == true) {
                        tempOne = m
                        return tempOne;
                    }
                }
            } else {
                for (let m = 0; m < this._list.datas.length; m++) {
                    flag = ComposeModel.instance.checkPointResolve(this._index, m);
                    if (flag == true) {
                        tempOne = m;
                        return tempOne;
                    }
                }
            }
            return tempOne;
        }

        public closeList(): void {
            this._isOpen = this._list.visible = false;
            this._downImage.visible = false;
            this._downBgImage.visible = false
            this.btn.selected = false;
            this.height = this._rowH;
        }

        public setRowData(): void {  //根据传入数据调节list高度
            let data;
            this.reInit();

            if (this._type == 0) {
                data = this._bottom[this._index];
            } else {
                data = this._bottom1[this._index];
            }

            if (data) {
                this._bagSelectData = data;
                let len = data.length;
                this._list.vCount = len;
                this._list.height = len * (this._rowH + this._list.spaceY) + 20 + 20;
                this._downBgImage.height = len * (this._rowH + this._list.spaceY);
                this._changeH = (len + 1) * (this._rowH + this._list.spaceY) + 20 + 20;
                let arr = new Array<any>();
                for (let i = 0; i < this._bagSelectData.length; i++) {
                    arr.push([this._bagSelectData[i], this._index, i, this._type]);
                }
                this._list.datas = arr;
                this.setDot();
            }
        }

        public setDot(): void {
            let arr = this._list.datas;
            let flag: boolean = false;

            for (let i = 0; i < arr.length; i++) {
                let data = arr[i];
                let index = data[1];//合成类型
                let selectIndex = data[2];
                let type = data[3];//合成或分解
                if (type == 0) {
                    flag = ComposeModel.instance.checkPoint(index, selectIndex);
                    if (flag) break;
                } else if (type == 1) {
                    flag = ComposeModel.instance.checkPointResolve(index, selectIndex);
                    if (flag) break;
                }
            }
            this.redDot.visible = flag;
        }

        public initData(cfg: item_compose | item_resolve, index: number, type: number): void {
            //type 0合成 1分解
            let str: string;
            if (type == 0) {
                str = (<item_compose>cfg)[item_composeFields.sClass][idNameFields.name];
            } else {
                str = (<item_resolve>cfg)[item_resolveFields.name][idNameFields.name];
            }
            this.btn.label = str;
            this._index = index;
            this._type = type;
            this.setRowData()
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            if (this._downImage) {
                this.destroyElement(this._downImage)
            }
            super.destroy(destroyChild);
        }
    }
}