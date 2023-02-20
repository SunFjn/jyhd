///<reference path="../config/compose_cfg.ts"/>
///<reference path="../sign/sign_items.ts"/>


namespace modules.compose {
    import ComposeCfg = modules.config.ComposeCfg;
    import CustomList = modules.common.CustomList;
    import item_composeFields = Configuration.item_composeFields;
    import item_compose = Configuration.item_compose;
    import Point = laya.maths.Point;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ItemFields = Protocols.ItemFields;
    import Label = laya.ui.Label;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import gemRefine = Configuration.gemRefine;
    import attr = Configuration.attr;
    import gemRefineFields = Configuration.gemRefineFields;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;
    import GetWayCfg = modules.config.GetWayCfg;
    import get_way = Configuration.get_way;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import item_stoneFields = Configuration.item_stoneFields;
    import runeRefine = Configuration.runeRefine;
    import item_material = Configuration.item_material;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_rune = Configuration.item_rune;
    import item_materialFields = Configuration.item_materialFields;
    import item_equipFields = Configuration.item_equipFields;
    import Image = Laya.Image;

    export class ComposeStoneAlert extends ui.ComposeStoneAlertUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        private _itemArray: Array<ComposeItem>;

        private _compose: ComposeItem;
        private _selectedCfg: item_compose;

        private _composeId: number;

        private tclass: number;
        private sclass: number;

        private _maxNum: number;
        private _pos: Point = new Point(231, 459);
        private _wid: number = 80;
        private _attrNameArr: Array<Label>;
        private _attrValueArr: Array<Label>;
        private _attrBgImgArr: Array<Image>;
        private _attrImgArr: Array<Image>;

        private _composeNum: number;
        public _composeClip: CustomClip;
        private _composeAllClip: CustomClip;

        constructor(value: any) {
            super();
            this.tclass = value[0];
            this.sclass = value[1];
            this.updateList();
            // console.log('arrr', value);
            this._composeClip.play();
            this._composeAllClip.play();
            this.updateBtn();
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            this._composeClip = this.destroyElement(this._composeClip);
            this._composeAllClip = this.destroyElement(this._composeAllClip);
            this._itemArray = this.destroyElement(this._itemArray);
            this._compose = this.destroyElement(this._compose);
            this._attrNameArr = this.destroyElement(this._attrNameArr);
            this._attrValueArr = this.destroyElement(this._attrValueArr);
            this._attrBgImgArr = this.destroyElement(this._attrBgImgArr);
            this._attrImgArr = this.destroyElement(this._attrImgArr);

            // this._sourceBtns = this.destroyElement(this._sourceBtns);
            this._imgs = this.destroyElement(this._imgs);
            this._desTxts = this.destroyElement(this._desTxts);
            this._itemBg = this.destroyElement(this._itemBg);
            this._itemIcon = this.destroyElement(this._itemIcon);
            this._itemTxt = this.destroyElement(this._itemTxt);
            super.destroy()
            // console.log("destor");
        }

        protected initialize() {
            super.initialize();
            this._itemArray = new Array<any>();
            this._showIds = new Array<any>();
            this._list = new CustomList();
            this._list.width = 628;
            this._list.height = 557;
            this._list.hCount = 1;
            this._list.spaceY = 2;
            this._list.itemRender = ComposeStoneItem;
            this._list.x = 39;
            this._list.y = 77;
            this._list.visible = false;
            this._compose = new ComposeItem();
            this._compose.pos(230, 145);
            this._compose.mouseEnabled = true;
            this._compose.scale(0.85, 0.85);

            this.decomposeNum.visible = false;

            this._composeClip = new CustomClip();
            this._composeClip = CommonUtil.creatEff(this.useBtn, `btn_light`, 15);
            this._composeClip.pos(-5, -22, true);
            this._composeClip.scaleX = 1.25
            this._composeClip.scaleY = 1.3
            this._composeAllClip = new CustomClip();
            this._composeAllClip = CommonUtil.creatEff(this.allBtn, `btn_light`, 15);
            this._composeAllClip.pos(-5, -22, true);
            this._composeAllClip.scaleY = 1.25
            this._composeAllClip.scaleY = 1.3

            this._attrNameArr = [this.att_name_0, this.att_name_1];
            this._attrValueArr = [this.att_value_0, this.att_value_1];
            this._attrBgImgArr = [this.attr_bg_img_0, this.attr_bg_img_1];
            this._attrImgArr = [this.attr_img_0, this.attr_img_1];

            this._maxNum = 1;
            this.addChild(this._compose);
            this.createItem();

            // console.log("init");
            // this._sourceBtns = [];
            this._imgs = [];
            this._desTxts = [];

            for (let i: number = 0; i < 5; i++) {
                // this._sourceBtns[i] = new Laya.Image();
                this._imgs[i] = new Laya.Image();
                this._desTxts[i] = new laya.display.Text();
                PropAlertUtil.setDesTxt(this._desTxts[i]);
                // this._sourceBtns[i].mouseEnabled = true;
            }
        }

        public setOpenParam(value: any) {
            super.setOpenParam(value);
            // this.tclass = value[0];
            // this.sclass = value[1];
            // this.updateList();
            // // 并未被调用
            // this._composeClip.play();
            // this._composeAllClip.play();
            // this.updateBtn();
        }

        public onOpened() {
            super.onOpened();
        }

        private updateBtn() {
            let flag = heroAura.HeroAuraModel.instance.flag;
            if (flag == 1) {
                this.composeAll.visible = false;
                this.allBtn.visible = true;
                this.useBtn.centerX = 162;
                // this._composeAllClip.play();
                // this._composeAllClip.visible = true;
            } else {
                this.composeAll.visible = true;
                this.allBtn.visible = false;
                this.useBtn.centerX = 0;
                // this._composeAllClip.stop();
                // this._composeAllClip.visible = false;
            }
            if (this._list.datas[0][0][item_composeFields.tClass][Configuration.idNameFields.id] == 2) {
                this.composeAll.visible = true;
                this.allBtn.visible = false;
                this.useBtn.centerX = 0;
            }
        }

        private updateList(): void {
            this._showIds.length = 0;
            let cfgs: Array<any> = ComposeCfg.instance.getComposeCfgBySclass(this.tclass, this.sclass);
            // console.log("listCFGS", cfgs);
            for (let i = 0; i < cfgs.length; i++) {
                this._showIds.push([cfgs[i], 0]);
            }
            this._list.datas = this._showIds;
            this._list.selectedIndex = this.searchOne();
            this._list.scrollToIndex(this._list.selectedIndex);
            this.selectHandler();

            // 如果是耳环魔法石则去掉数量显示
            if (this._list.datas[0][0][item_composeFields.tClass][Configuration.idNameFields.id] == 2) {
                this.lineType.visible = false;
            } else {
                this.lineType.visible = true;
            }
        }

        private searchOne(): number {
            let datas = this._list.datas;
            for (let i: int = 0, len: int = datas.length; i < len; i++) {
                let cfg = datas[i][0];
                let param: Configuration.idCount = cfg[item_composeFields.params][0];
                let id: number = param[idCountFields.id];
                let needCount: number = param[idCountFields.count];
                let haveCount: number = BagModel.instance.getItemCountById(id);
                if (haveCount >= needCount) {
                    return i;
                }
            }
            return 0;
        }

        public addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.selectHandler);
            this.addAutoListener(this.addBtn, common.LayaEvent.CLICK, this, this.addHandler, [1]);
            this.addAutoListener(this.addTenBtn, common.LayaEvent.CLICK, this, this.addHandler, [10]);
            this.addAutoListener(this.reduceBtn, common.LayaEvent.CLICK, this, this.addHandler, [-1]);
            this.addAutoListener(this.reduceTenBtn, common.LayaEvent.CLICK, this, this.addHandler, [-10]);
            this.addAutoListener(this.useBtn, common.LayaEvent.CLICK, this, this.useHandler);
            this.addAutoListener(this.allBtn, common.LayaEvent.CLICK, this, this.allHandler);
            this.addAutoListener(this.stoneLink, common.LayaEvent.CLICK, this, this.stoneLinkHandler);
            this.addAutoListener(this.numInput, common.LayaEvent.INPUT, this, this.inputHandler);
            this.addAutoListener(this.composeAll, common.LayaEvent.CLICK, this, this.stoneLinkAllHandler)

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.COMPOSE_REPLY, this, this.composeReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_ADD_ITEM, this, this.updateStone);
            // if (this._sourceBtns) {
            //     for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
            //         this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
            //     }
            // }
        }

        private inputHandler(): void {
            if (this.numInput.text != "") {
                let num = parseInt(this.numInput.text);
                if (!this._maxNum) {
                    num = 0;
                } else if (num > this._maxNum && this._maxNum > 0) {
                    num = this._maxNum;
                } else if (num < 1 && this._maxNum > 0) {
                    num = 1;
                } else if (num < 0) {
                    num = 0;
                }
                if (num >= 100) {
                    num = 100;
                }
                this.numInput.text = num.toString();
            } else if (this._maxNum > 0) {
                this.numInput.text = "1";
            } else {
                this.numInput.text = "0";
            }
        }

        private stoneLinkHandler(): void {
            WindowManager.instance.open(WindowEnum.STONE_PANEL);
            this.close();
        }

        private stoneLinkAllHandler(): void {
            let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.HERO_AURA_PANEL]);
            CommonUtil.alert('温馨提示', '激活黑钻特权即可一键合成.是否前往激活?', [handler]);
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

        private updateStone(): void {
            let cfg = this._selectedCfg;
            let arr = cfg[item_composeFields.params];
            this._composeId = cfg[item_composeFields.itemId];
            let len = arr.length;
            this._compose.setData(this._composeId);
            let itemType = CommonUtil.getItemTypeById(this._composeId);
            this.composeName.text = this._compose._nameTxt.text;

            // 更新获取途径
            let itemCfgs: item_material | item_equip | item_stone | runeRefine | item_rune = CommonUtil.getItemCfgById(this._composeId);
            let type: number = CommonUtil.getItemTypeById(this._composeId);
            if (type == ItemMType.Stone) {
                this.setitem(itemCfgs[item_stoneFields.itemSourceId], type)
            } else if (type == ItemMType.Equip) {
                this.setitem(itemCfgs[item_equipFields.itemSourceId], type)
            } else if (type == ItemMType.Material) {
                this.setitem(itemCfgs[item_materialFields.itemSourceId], type)
            }

            let showAttr = itemType == ItemMType.Stone || itemType == ItemMType.Equip;
            this.attributeBox.visible = showAttr;
            this.noAttributeBox.visible = !showAttr;
            this.attributeBox.y = itemType == ItemMType.Equip ? 654 : 577;
            this.content_bg_img.height = itemType == ItemMType.Equip ? 150 : 224;
            this.composeAll.y = itemType == ItemMType.Equip ? 790 : 713;
            this.stoneLink.y = itemType == ItemMType.Equip ? 790 : 713;
            this.title_img_bg_0.visible = itemType != ItemMType.Equip;

            if (itemType == ItemMType.Stone || itemType == ItemMType.Equip) {
                this.stoneLink.visible = true;
                let attrs: Array<attr> = [];
                if (itemType == ItemMType.Stone) {
                    let cfg = ComposeCfg.instance.getGemRefineCfgById(this._composeId);
                    attrs = cfg[gemRefineFields.attrs];
                } else if (itemType == ItemMType.Equip) {
                    let cfg = modules.config.ItemEquipCfg.instance.getItemCfgById(this._composeId);
                    attrs = cfg[item_equipFields.baseAttr];
                }
                for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                    let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                    let attrValueStr: string = `${attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrs[i][attrFields.value]) + "%" : Math.round(attrs[i][attrFields.value])}`;

                    this._attrNameArr[i].text = `${attrCfg[attr_itemFields.name]}:`;
                    this._attrValueArr[i].text = "+" + attrValueStr;
                    this._attrNameArr[i].visible = true;
                    this._attrValueArr[i].visible = true;
                    this._attrBgImgArr[i].visible = true;
                    this._attrImgArr[i].visible = true;
                    if (i == 2) break;
                }
            } else {
                this.stoneLink.visible = false;
                for (let i = 0; i < this._attrNameArr.length; i++) {
                    this._attrNameArr[i].visible = false;
                    this._attrValueArr[i].visible = false;
                    this._attrBgImgArr[i].visible = false;
                    this._attrImgArr[i].visible = false;
                }
            }

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

            let maxArr = new Array<number>();
            for (let i = 0; i < 4; i++) {
                let baseItem = this._itemArray[i];
                if (i < len) {
                    let itemId = arr[i][idCountFields.id];
                    let count = BagModel.instance.getItemCountById(itemId);
                    if (this.checkIsEquip(itemId)) {//装备了数量要加1,背包中不包含，但是要参与合成
                        count += 1;
                    }
                    baseItem.setData(itemId);
                    if (count < arr[i][idCountFields.count]) {
                        baseItem.setNum(count + "/" + arr[i][idCountFields.count], "#ff7462");
                    } else {
                        baseItem.setNum(count + "/" + arr[i][idCountFields.count], "#ffffff");
                    }
                    let num = count / arr[i][idCountFields.count] >> 0;
                    maxArr.push(num);
                    //let width = this._wid * len + 13 * (len - 1);
                    //baseItem.pos(this._pos.x - width / 2 + i * 93 - 95, this._pos.y);
                    baseItem.pos(arrPos[i][0], arrPos[i][1]);
                    baseItem.visible = true;
                } else {
                    baseItem.visible = false;
                }
            }
            maxArr.sort((l: number, r: number): number => {
                return l > r ? -1 : 1;
            });
            this._maxNum = maxArr.pop();
            // if (this.tclass == 5) {//打雷为戒指玉佩的合成数量为1
            //     this.numInput.text = "1";
            // } else {
            this.numInput.text = this._maxNum.toString();
            if (this._maxNum > 0) {
                this._composeClip.visible = true;
                this._composeAllClip.visible = true;
            } else {
                this._composeClip.visible = false;
                this._composeAllClip.visible = false;
            }

        }

        private composeReply(): void {
            let result = ComposeModel.instance.ComposeReply;
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                SystemNoticeManager.instance.addNotice("合成成功", false);
                // WindowManager.instance.openDialog(WindowEnum.COMPOSE_SUCCESS_ALERT, [this._composeId, this._composeNum]);
            }
            this.updateList();
        }

        private selectHandler(): void {
            let data = this._list.selectedData;
            if (data != null) {
                this._selectedCfg = data[0];
            }
            if (!this._selectedCfg) return;
            this.updateStone();

        }
        private timeOutId: number;
        private allHandler() {
            let timeout = 2000;
            // if (this.deltaFlag) return;
            let type = this._list.datas[0][0][item_composeFields.tClass][Configuration.idNameFields.id];
            Channel.instance.publish(UserFeatureOpcode.ComposeAll, [type])
            console.log("一键合成TYPE", type);

            // 对于一键合成新增倒计时和置灰效果
            this.allBtn.mouseEnabled = false;
            this.allBtn.gray = true;

            this.deltaT = timeout - 1000;
            this.allBtn.label = `一键合成(${timeout / 1000})`;
            Laya.timer.loop(1000, this, this.loopHandler);

            clearTimeout(this.timeOutId);
            this.timeOutId = setTimeout(() => {
                // this.deltaFlag = false;
                this.allBtn.mouseEnabled = true;
                this.allBtn.gray = false;
            }, timeout);
        }

        private deltaT: number;

        private loopHandler() {
            this.allBtn.label = `一键合成(${this.deltaT / 1000})`;
            if (this.deltaT == 0) {
                this.allBtn.label = "一键合成";
                Laya.timer.clear(this, this.loopHandler);
            }
            this.deltaT -= 1000;
        }

        private useHandler(): void {
            let arr = this._selectedCfg[item_composeFields.params];
            let arr1 = new Array<number>();
            for (let i = 0; i < arr.length; i++) {
                let id = arr[i][idCountFields.id];
                let items = BagModel.instance.getItemsById(id);
                if (items.length > 0) {
                    let uid = items[0][ItemFields.uid];
                    arr1.push(uid);
                }
            }
            this._composeNum = parseInt(this.numInput.text);
            // 如果是耳环魔法石则去掉数量显示
            if (this._list.datas[0][0][item_composeFields.tClass][Configuration.idNameFields.id] == 2 && this._composeNum != 0) {
                this._composeNum = 1;
            }
            Channel.instance.publish(UserFeatureOpcode.Compose, [this._selectedCfg[item_composeFields.id], arr1, this._composeNum]);
        }

        private addHandler(value: number): void {
            let num = parseInt(this.numInput.text) + value;
            if (num > this._maxNum) {
                num = this._maxNum;
            } else if (this._maxNum > 0 && num < 1) {
                num = 1;
            } else if (num < 0) {
                num = 0;
            }
            if (num >= 100) {
                num = 100;
            }
            this.numInput.text = num.toString();
        }

        public close() {
            super.close();
            this._composeClip.stop();
            this._composeAllClip.stop();
            if (this.timeOutId) {
                clearTimeout(this.timeOutId);
            }
        }



        public setitem(arrStone: number[] | number, type: number) {
            this.removeChildSource();
            // if (type == ItemMType.Stone) {
            // for (let i: number = 0, len: number = (arrStone as number[]).length; i < len; i++) {
            //     this.getWayBtn(this._sourceBtns[i], arrStone[i], (arrStone as number[]).length, i, this._imgs[i]);
            // }
            // } else {
            //     this.getWayBtn(this._sourceBtns[0], arrStone as number, 1, 0, this._imgs[0]);
            // }

        }

        private getWayBtn(img: Laya.Image, arr: number, len: number, n: number, image: Laya.Image): void {
            let getWayCfg: Configuration.get_way;
            this.addChild(image);
            this.addChild(img);
            getWayCfg = GetWayCfg.instance.getCfgById(arr);
            img.pos(30 + (660 - 158 * len + 42 * (len - 1)) * 0.5 + n * 116, 650);
            img.skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
            image.skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
            image.pos(img.x, img.y);
            img.addChild(this._desTxts[n]);
            this._desTxts[n].pos(6, 70);
            this._desTxts[n].text = getWayCfg[Configuration.get_wayFields.desc];
        }

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
            let skipId: number = getWayCfg[Configuration.get_wayFields.params][0];
            // console.log("skipid", skipId);
            if (skipId == 27) {
                modules.notice.SystemNoticeManager.instance.addNotice("您已在合成界面", false);
                return;
            }
            if (id != 500) {
                this.close();
                WindowManager.instance.closeAllDialog();
            } else {
                modules.notice.SystemNoticeManager.instance.addNotice("请多关注游戏内活动哦", false);
            }

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

        private _itemBg: Laya.Image;
        private _itemIcon: Laya.Image;
        private _itemTxt: Laya.Text;
        // private _sourceBtns: Array<Laya.Image>;
        private _imgs: Array<Laya.Image>;
        private _desTxts: Array<laya.display.Text>;

        private removeChildSource(): void {
            // if (this._sourceBtns) {
            //     for (let i: number = 0; i < this._sourceBtns.length; i++) {
            //         this.removeChild(this._sourceBtns[i]);
            //     }
            // }
            if (this._imgs) {
                for (let i: number = 0; i < this._imgs.length; i++) {
                    this.removeChild(this._imgs[i]);
                    this.removeChild(this._desTxts[i]);
                }
            }
        }

        // 检查是否装备
        private checkIsEquip(itemId: number): boolean {
            let dic = PlayerModel.instance.equipsDic;
            for (const data of dic.values) {
                if (data && itemId == data[ItemFields.ItemId]) {
                    return true;
                }
            }
            return false;
        }
    }
}