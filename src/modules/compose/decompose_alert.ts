namespace modules.compose {
    import ComposeCfg = modules.config.ComposeCfg;
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import item_resolveFields = Configuration.item_resolveFields;
    import item_resolve = Configuration.item_resolve;
    import ItemFields = Protocols.ItemFields;
    import CommonUtil = modules.common.CommonUtil;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import item_stoneFields = Configuration.item_stoneFields;
    import runeRefine = Configuration.runeRefine;
    import item_material = Configuration.item_material;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_rune = Configuration.item_rune;
    import GetWayCfg = modules.config.GetWayCfg;
    import get_way = Configuration.get_way;
    import item_materialFields = Configuration.item_materialFields;
    import item_equipFields = Configuration.item_equipFields;

    export class DecomposeAlert extends ui.ComposeStoneAlertUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        private _itemArray: Array<ComposeItem>;

        private _compose: ComposeItem;
        private _selectedCfg: item_resolve;

        private _composeId: number;

        private tclass: number;
        private sclass: number;

        private _pos: Point = new Point(428, 363);
        private _wid: number = 80;
        private _maxNum: number;
        private _deComposeNum: number;

        constructor(value: any) {
            super();
            this.tclass = value[0];
            this.sclass = value[1];
            this.updateList();
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._itemArray = this.destroyElement(this._itemArray);
            this._compose = this.destroyElement(this._compose);
            super.destroy();
        }

        protected initialize() {
            super.initialize();
            this._itemArray = new Array<any>();
            this._showIds = new Array<any>();
            this._list = new CustomList();
            this._list.width = 174;
            this._list.height = 557;
            this._list.hCount = 1;
            this._list.spaceY = 2;
            this._list.itemRender = ComposeStoneItem;
            this._list.x = 39;
            this._list.y = 77;
            this._list.visible = false;
            this.useBtn.label = "分解";
            this.useBtn.centerX = 0;
            this.stoneLink.visible = false;
            this._compose = new ComposeItem();
            this._compose.pos(230, 145);
            this.addChild(this._compose);
            this._compose.scale(0.85, 0.85);
            // this.arrowImg.pivot(0, 0);
            // this.arrowImg.rotation = 0;
            this.arrowImg.scaleY = -1;
            this.createItem();
            this.composeAll.visible = false;

            // this._sourceBtns = [];
            // this._imgs = [];
            // this._desTxts = [];

            // for (let i: number = 0; i < 5; i++) {
            //     this._sourceBtns[i] = new Laya.Image();
            //     this._imgs[i] = new Laya.Image();
            //     this._desTxts[i] = new laya.display.Text();
            //     PropAlertUtil.setDesTxt(this._desTxts[i]);
            //     this._sourceBtns[i].mouseEnabled = true;
            // }
        }

        public setOpenParam(value: any) {
            super.setOpenParam(value);
            // this._composeId=value;
            this.tclass = value[0];
            this.sclass = value[1];
            this.updateList();
        }

        private updateList(): void {
            this._showIds.length = 0;
            let cfgs: Array<any> = ComposeCfg.instance.getResolveCfgBySclass(this.tclass, this.sclass);
            for (let i = 0; i < cfgs.length; i++) {
                this._showIds.push([cfgs[i], 1]);
            }
            this._list.datas = this._showIds;
            // console.log("this._showIds", this._showIds)
            if (!this._list.selectedIndex) {
                this._list.selectedIndex = -1;
                this._list.selectedIndex = 0;
            }
            this._list.selectedIndex = ComposeModel.instance.defaultDecomposeSelect;
            this.selectHandler();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._list, Laya.Event.CLICK, this, this.selectHandler);
            this.addAutoListener(this.addBtn, Laya.Event.CLICK, this, this.addHandler, [1]);
            this.addAutoListener(this.addTenBtn, Laya.Event.CLICK, this, this.addHandler, [10]);
            this.addAutoListener(this.reduceBtn, Laya.Event.CLICK, this, this.addHandler, [-1]);
            this.addAutoListener(this.reduceTenBtn, Laya.Event.CLICK, this, this.addHandler, [-10]);
            this.addAutoListener(this.useBtn, Laya.Event.CLICK, this, this.useHandler);
            this.addAutoListener(this.numInput, Laya.Event.INPUT, this, this.inputHandler);
            // this._list.on(Event.SELECT, this, this.selectHandler);
            // this.addBtn.on(Event.CLICK, this, this.addHandler, [1]);
            // this.addTenBtn.on(Event.CLICK, this, this.addHandler, [10]);
            // this.reduceBtn.on(Event.CLICK, this, this.addHandler, [-1]);
            // this.reduceTenBtn.on(Event.CLICK, this, this.addHandler, [-10]);
            // this.useBtn.on(Event.CLICK, this, this.useHandler);
            // this.numInput.on(Event.INPUT, this, this.inputHandler);

            GlobalData.dispatcher.on(CommonEventType.RESOLVE_REPLY, this, this.resolveReply);
            GlobalData.dispatcher.on(CommonEventType.BAG_ADD_ITEM, this, this.updateItem);

            // if (this._sourceBtns) {
            //     for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
            //         this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
            //     }
            // }
        }

        protected removeListeners(): void {
            super.removeListeners();
            // this._list.off(Event.SELECT, this, this.selectHandler);
            // this.addBtn.off(Event.CLICK, this, this.addHandler);
            // this.addTenBtn.off(Event.CLICK, this, this.addHandler);
            // this.reduceBtn.off(Event.CLICK, this, this.addHandler);
            // this.reduceTenBtn.off(Event.CLICK, this, this.addHandler);
            // this.useBtn.off(Event.CLICK, this, this.useHandler);
            // this.numInput.off(Event.INPUT, this, this.inputHandler);

            GlobalData.dispatcher.off(CommonEventType.BAG_ADD_ITEM, this, this.updateItem);
            GlobalData.dispatcher.off(CommonEventType.RESOLVE_REPLY, this, this.resolveReply);
        }

        private inputHandler(): void {
            if (this.numInput.text != "") {
                let num = parseInt(this.numInput.text);
                if (num > this._maxNum) {
                    num = this._maxNum;
                } else if (num < 0) {
                    num = 0;
                }
                this.numInput.text = num.toString();
            } else {
                this.numInput.text = "0";
            }
        }

        private resolveReply(): void {
            let result = ComposeModel.instance.ResolveReply;
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                WindowManager.instance.openDialog(WindowEnum.DECOMPOSE_SUCCESS_ALERT, [this._selectedCfg, this._deComposeNum]);
            }
            this.updateItem();
            this.updateList();
        }

        private createItem() {
            for (let i = 0; i < 4; i++) {
                let baseItem = new ComposeItem();
                baseItem.scale(0.8, 0.8);
                baseItem.visible = false;
                this.addChild(baseItem);
                this._itemArray.push(baseItem);
            }
        }

        private updateItem(): void {
            let cfg: item_resolve = this._selectedCfg;
            let arr = cfg[item_resolveFields.resolveItems];
            this._composeId = cfg[item_resolveFields.itemId];
            let tmp = ComposeModel.instance.getEquip(cfg, 1);

            let zArr = [13350001, 13350002, 13450001, 13450002];
            if (zArr.indexOf(this._composeId) == -1) {
                if (tmp.length > 0) {
                    this._composeId = tmp[0][0];
                } else {
                    let high = Math.floor(this._composeId / 1000);
                    if (high >= 50000) {
                        this._composeId = high * 1000 + 11;
                    } else {
                        this._composeId = high * 1000 + 1;
                    }
                }
            }

            let itemCfgs: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(this._composeId);
            let type: number = CommonUtil.getItemTypeById(this._composeId);
            // if (type == ItemMType.Stone) {
            //     this.setitem(itemCfgs[item_stoneFields.itemSourceId] as number[])
            // } else if (type == ItemMType.Equip) {
            //     this.setitem(itemCfgs[item_equipFields.itemSourceId] as number[])
            // } else if (type == ItemMType.Material) {
            //     this.setitem(itemCfgs[item_materialFields.itemSourceId] as number[])
            // }
            //新增 觉醒丹分解 强行扭转ID 
            //一共4种觉醒丹   13240001 "黄级觉醒丹" 13250005 "玄级觉醒丹" 13250006 "地级觉醒丹" 13250007 "天级觉醒丹"
            //转换方式 Math.floor(ID / 1000)
            //后三种 大ID转换以后 ID相同 指向神源丹
            //追了下代码 这个读取策划表 改动太多 无法预计影响区域
            let zsArr = [13250005, 13250006, 13250007]
            if (zsArr.indexOf(cfg[item_resolveFields.itemId]) > -1)
                this._composeId = cfg[item_resolveFields.itemId];



            let len = arr.length;
            this._compose.setData(this._composeId);
            this.composeName.text = this._compose._nameTxt.text;
            this._maxNum = BagModel.instance.getItemCountById(this._composeId);
            this.decomposeNum.text = "拥有数量:" + this._maxNum.toString();
            this.numInput.text = "1";
            let arrPos = [];
            this.two_img.visible = len === 1;
            this.three_img.visible = len === 2;
            this.four_img.visible = len == 3;
            if (len == 1) {
                arrPos = [[231, 461]];
            } else if (len == 2) {
                arrPos = [[62, 436], [400, 436]];
            } else {
                arrPos = [[51, 461], [232, 461], [412, 461]];
            }

            for (let i = 0; i < 4; i++) {
                let baseItem = this._itemArray[i];
                if (i < len) {
                    let itemId = arr[i][idCountFields.id];
                    baseItem.setData(itemId);
                    baseItem.setNum(arr[i][idCountFields.count].toString(), "#ffffff");
                    //let width = this._wid * len + 13 * (len - 1);
                    baseItem.pos(arrPos[i][0], arrPos[i][1]);
                    baseItem.visible = true;
                } else {
                    baseItem.visible = false;
                }
            }

        }

        private selectHandler(): void {
            let data = this._list.selectedData;
            if (data != null) {
                this._selectedCfg = data[0];
            }
            if (!this._selectedCfg) return;
            this.updateItem();

        }

        private useHandler(): void {
            let arr1 = new Array<number>();
            // let id = this._selectedCfg[item_resolveFields.itemId];
            let id = this._composeId;
            let items = BagModel.instance.getItemsById(id);
            this._deComposeNum = parseInt(this.numInput.text);
            for (let i = 0; i < items.length; i++) {
                if (i < this._deComposeNum) {
                    let uid = items[i][ItemFields.uid];
                    arr1.push(uid);
                }
            }
            // if(items.length>0){
            //     let uid=items[0][ItemFields.uid];
            //     arr1.push(uid);
            // }
            if (arr1.length > 0) {
                Channel.instance.publish(UserFeatureOpcode.Resolve, [id, arr1, this._deComposeNum]);
            } else {
                CommonUtil.noticeError(17007);
            }
        }

        private addHandler(value: number): void {
            let num = parseInt(this.numInput.text) + value;
            if (num > this._maxNum) {
                num = this._maxNum;
            } else if (num < 0) {
                num = 0;
            }
            this.numInput.text = num.toString();
        }

        public onOpened() {
            super.onOpened();
        }

        public close() {
            super.close();
        }

        // public setitem(arrStone: number[]) {
        //     this.removeChildSource();
        //     for (let i: number = 0, len: number = arrStone.length; i < len; i++) {
        //         this.getWayBtn(this._sourceBtns[i], arrStone[i], arrStone.length, i, this._imgs[i]);
        //     }
        // }

        // private getWayBtn(img: Laya.Image, arr: number, len: number, n: number, image: Laya.Image): void {

        //     let getWayCfg: Configuration.get_way;
        //     this.addChild(image);
        //     this.addChild(img);
        //     getWayCfg = GetWayCfg.instance.getCfgById(arr);
        //     img.pos(30 + (660 - 158 * len + 42 * (len - 1)) * 0.5 + n * 116, 650);
        //     img.skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
        //     image.skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
        //     image.pos(img.x, img.y);
        //     img.addChild(this._desTxts[n]);
        //     this._desTxts[n].pos(6, 70);
        //     this._desTxts[n].text = getWayCfg[Configuration.get_wayFields.desc];
        // }

        private getOpenPlaneId(index: number): void {
            let itemCfgs: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(this._composeId);
            let arr: number[];
            let type: number = CommonUtil.getItemTypeById(this._composeId);
            if (type == ItemMType.Stone) {
                arr = itemCfgs[item_stoneFields.itemSourceId] as number[];
            } else if (type == ItemMType.Equip) {
                arr = itemCfgs[item_equipFields.itemSourceId] as number[];
            } else if (type == ItemMType.Material) {
                arr = itemCfgs[item_materialFields.itemSourceId] as number[];
            }
            let getWayCfg: get_way = GetWayCfg.instance.getCfgById(arr[index]);
            let id: number = getWayCfg[Configuration.get_wayFields.id];
            if (id != 500) {
                this.close();
                WindowManager.instance.closeAllDialog();
            } else {
                modules.notice.SystemNoticeManager.instance.addNotice("请多关注游戏内活动哦", false);
            }
            let skipId: number = getWayCfg[Configuration.get_wayFields.params][0];
            if (skipId) {
                if (skipId > 999) { //进场景
                    if (skipId == SCENE_ID.scene_homestead) {
                        xianfu.XianfuCtrl.instance.enterScene();
                    } else {
                        dungeon.DungeonCtrl.instance.reqEnterScene(skipId);
                    }
                } else {
                    WindowManager.instance.openByActionId(skipId);
                }
            }
        }

        // private _sourceBtns: Array<Laya.Image>;
        // private _imgs: Array<Laya.Image>;
        // private _desTxts: Array<laya.display.Text>;

        // private removeChildSource(): void {
        //     if (this._sourceBtns) {
        //         for (let i: number = 0; i < this._sourceBtns.length; i++) {
        //             this.removeChild(this._sourceBtns[i]);
        //         }
        //     }
        //     if (this._imgs) {
        //         for (let i: number = 0; i < this._imgs.length; i++) {
        //             this.removeChild(this._imgs[i]);
        //             this.removeChild(this._desTxts[i]);
        //         }
        //     }
        // }
    }
}