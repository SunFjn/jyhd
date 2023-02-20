///<reference path="../config/compose_cfg.ts"/>


namespace modules.compose {
    import ComposeCfg = modules.config.ComposeCfg;
    import CustomList = modules.common.CustomList;
    import Event = laya.events.Event;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import item_composeFields = Configuration.item_composeFields;
    import item_compose = Configuration.item_compose;
    import item_equipFields = Configuration.item_equipFields;
    import ItemFields = Protocols.ItemFields;
    import Point = Laya.Point;
    import idCountFields = Configuration.idCountFields;
    import Item = Protocols.Item;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;

    class itemPit {
        public item: ComposeItem;
        public uid: number;

        constructor(item: ComposeItem, uid: number) {
            this.item = item;
            this.uid = uid;
        }
    }

    export class ComposeEquipAlert extends ui.ComposeEquipAlertUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        private _compose: ComposeItem;
        private tclass: number;
        private sclass: number;

        private _itemPitArr: Array<itemPit>;
        private _itemId: number;
        private _startPos: Array<Point>;
        private _selectedCfg: item_compose;
        private _stoneDia: ComposeAddAlert;
        private _composeClip: CustomClip;

        constructor(value: any) {
            super();
            this.tclass = value[0];
            this.sclass = value[1];
            this.updateList();
            this._composeClip.play();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._composeClip) {
                this._composeClip.removeSelf();
                this._composeClip.destroy();
                this._composeClip = null;
            }
            super.destroy();
        }

        protected initialize() {
            super.initialize();
            this._showIds = new Array<any>();
            this._itemPitArr = new Array<itemPit>();
            this._list = new CustomList();
            this._list.width = 600;
            this._list.height = 143;
            this._list.hCount = 4;
            this._list.spaceY = 5;
            this._list.itemRender = ComposeEquipItem;
            this._list.x = 53;
            this._list.y = 645;
            this.addChild(this._list);

            this._compose = new ComposeItem();
            this._compose.pos(225, 141);
            this._compose.needTip = true;
            this._compose.scale(0.85, 0.85)
            this.addChild(this._compose);

            this._startPos = [new Point(43, 312), new Point(408, 305), new Point(43, 484), new Point(227, 484), new Point(408, 484)];
            for (let i = 0; i < 5; i++) {
                let baseItem = new ComposeItem();
                baseItem._qualityBg.skin = `compose/btn_tanchuang_01.png`;
                baseItem.pos(this._startPos[i].x, this._startPos[i].y);
                baseItem.dataSource = null;
                baseItem.needTip = false;
                this.addChild(baseItem);
                let pit = new itemPit(baseItem, null);
                this._itemPitArr.push(pit);
            }
            this._stoneDia = new ComposeAddAlert();

            this._composeClip = new CustomClip();
            this.useBtn.addChildAt(this._composeClip, 0);
            this._composeClip.pos(-5, -9, true);
            this._composeClip.skin = "assets/effect/btn_light.atlas";
            this._composeClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._composeClip.durationFrame = 5;
            this._composeClip.play();
            this._composeClip.visible = false;
        }

        public setOpenParam(value: any) {
            super.setOpenParam(value);
            // this._composeId=value;
            // console.log("config赋值", value)
            // this.tclass = value[0];
            // this.sclass = value[1];
            // this.updateList();

        }

        private updateList(): void {
            this._showIds.length = 0;
            let cfgs: Array<any> = ComposeCfg.instance.getComposeCfgBySclass(this.tclass, this.sclass);
            for (let i = 0; i < cfgs.length; i++) {
                this._showIds.push(cfgs[i]);
            }
            this._list.datas = this._showIds;
            this._list.selectedIndex = -1;
            this._list.selectedIndex = 0;

            this.selectHandler();
        }

        protected addListeners(): void {
            super.addListeners();
            for (let i = 0; i < this._itemPitArr.length; i++) {
                if (typeof this._itemPitArr[i].item.lockBtn.visible != "undefined" && !this._itemPitArr[i].item.lockBtn.visible) {
                    this._itemPitArr[i].item.on(Event.CLICK, this, this.addDiolg, [i]);
                }
            }
            this.addAutoListener(this.allAddBtn, Laya.Event.CLICK, this, this.allAddHandler);
            this.addAutoListener(this.useBtn, Laya.Event.CLICK, this, this.useHandler);
            this.addAutoListener(this._list, Laya.Event.CLICK, this, this.selectHandler);
            GlobalData.dispatcher.on(CommonEventType.ADD_EQUIP, this, this.updatePitArr);
            GlobalData.dispatcher.on(CommonEventType.COMPOSE_REPLY, this, this.composeReply);
            // GlobalData.dispatcher.on(CommonEventType.BAG_ADD_ITEM,this,this.updateList);
        }

        protected removeListeners(): void {
            super.removeListeners();
            for (let i: number = 0; i < this._itemPitArr.length; i++) {
                this._itemPitArr[i].item.off(Event.CLICK, this, this.addDiolg);
            }
            GlobalData.dispatcher.off(CommonEventType.ADD_EQUIP, this, this.updatePitArr);
            GlobalData.dispatcher.off(CommonEventType.COMPOSE_REPLY, this, this.composeReply);
            // GlobalData.dispatcher.off(CommonEventType.BAG_ADD_ITEM,this,this.updateList);
        }

        private composeReply() {
            let result = ComposeModel.instance.ComposeReply;
            if (result != 0) {
                CommonUtil.noticeError(result);
                if (result == ErrorCode.CRComposeFail) {
                    this.updateList();
                }
            } else {
                WindowManager.instance.openDialog(WindowEnum.COMPOSE_SUCCESS_ALERT, [this._itemId, ""]);
                this.updateList();
            }
        }

        /**
         * 添加装备时触发
         */
        private updatePitArr(): void {
            // 添加的物品
            let items = ComposeModel.instance.currEquipId;
            if (items.length > 0) {
                let count = 0;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (item != null) {
                        count++;
                        this._itemPitArr[i].item.setData(item);
                        this._itemPitArr[i].uid = item[ItemFields.uid];
                    } else {
                        this._itemPitArr[i].item.dataSource = null;
                        this._itemPitArr[i].uid = null;
                        this._itemPitArr[i].item._qualityBg.skin = `compose/btn_tanchuang_01.png`;
                    }
                }
                //let needId  = this._selectedCfg[item_composeFields.needItemId][0][0];
                let needNum = this._selectedCfg[item_composeFields.needItemId][0][1];
                if (count >= needNum) {
                    this._composeClip.visible = true;
                } else {
                    this._composeClip.visible = false;
                }
                //this.updatePersent();
            }
        }

        private selectHandler(): void {
            this._selectedCfg = this._list.selectedData;
            if (!this._selectedCfg) return;
            this.updateEquip();
        }

        private updateEquip(): void {
            let needNum = this._selectedCfg[item_composeFields.needItemId][0][1];
            for (let i = 0; i < this._itemPitArr.length; i++) {
                if (i < needNum) {
                    this._itemPitArr[i].item.lockBtn.visible = false;
                    this._itemPitArr[i].item.on(Event.CLICK, this, this.addDiolg, [i]);
                } else {
                    this._itemPitArr[i].item.lockBtn.visible = true;
                    this._itemPitArr[i].item.lockBtn.centerX = this._itemPitArr[i].item.lockBtn.centerY = -11;
                    this._itemPitArr[i].item.off(Event.CLICK, this, this.addDiolg);
                }
            }
            ComposeModel.instance.currEquipId.length = 0;
            this._itemId = this._selectedCfg[item_composeFields.itemId];
            // let html: string = "<span style='color:#ffffff;font-size: 24px'>可放入</span>";
            // html += `<span style='color:#ff332f;font-size: 24px'>${this._selectedCfg[item_composeFields.tips]}</span>`;
            // html += `<span style='color:#ffffff;font-size: 24px'>装备，必得一件</span>`;
            // html += `<span style='color:#ff332f;font-size: 24px'>${this._selectedCfg[item_composeFields.retTips]}</span>`;
            // html += `<span style='color:#ffffff;font-size: 24px'>装备</span>`;
            // this.htmlText.innerHTML = html;
            let needId = this._selectedCfg[item_composeFields.needItemId][0][0];
            let count = ComposeModel.instance.setNum(needId);
            let frontId = (needId / 1000 >> 0) * 1000;
            let srandId = ((needId * 0.1 >> 0) % 100);
            // let lastId = needId%10;
            // console.log("setNum", frontId, srandId)
            // console.log("列表选择", this._list.selectedData, this._list.selectedIndex, "合成", needId, "数量", count, "配置", this._selectedCfg[item_composeFields.needItemId])
            this.materiNum.text = count.toString();
            let itemCfg = CommonUtil.getItemCfgById(this._itemId);
            if (!itemCfg) throw new Error("不存在的道具ID：" + this._itemId);
            this.composeName.text = itemCfg[item_equipFields.name].toString();
            this._compose.setData(this._itemId);
            for (let i = 0; i < this._itemPitArr.length; i++) {
                this._itemPitArr[i].item.dataSource = null;
                this._itemPitArr[i].uid = null;
                this._itemPitArr[i].item._qualityBg.skin = `compose/btn_tanchuang_01.png`;
            }
            this._composeClip.visible = false;
            this.percent.text = ""
        }

        private addDiolg(picIndex: number): void {
            if (!this._itemPitArr[picIndex].item.itemData) { //未放入装备
                let arr: Array<any> = [picIndex, this._selectedCfg];
                let flag: boolean = ComposeModel.instance.getEquip(this._selectedCfg).length > 0; //有装备换
                if (flag) {
                    this._stoneDia.setOpenParam(arr);
                    this._stoneDia.showDelBtn = false;
                    this.addChild(this._stoneDia);
                } else {  //没装备换
                    WindowManager.instance.open(WindowEnum.COMPOSE_EQUIP_GET_ALERT, this._selectedCfg);
                }
            } else {
                let arr: Array<any> = [picIndex, this._selectedCfg];
                this._stoneDia.setOpenParam(arr);
                this._stoneDia.showDelBtn = true;
                this.addChild(this._stoneDia);
            }
        }

        private useHandler(): void {
            let arr = new Array<number>();
            for (let i = 0; i < this._itemPitArr.length; i++) {
                if (this._itemPitArr[i].uid != null) {
                    arr.push(this._itemPitArr[i].uid);
                }
            }
            console.log("发送合成请求", this._selectedCfg, this._selectedCfg[item_composeFields.id], arr, 1)
            Channel.instance.publish(UserFeatureOpcode.Compose, [this._selectedCfg[item_composeFields.id], arr, 1]);
        }

        private allAddHandler(): void {
            let needNum = this._selectedCfg[item_composeFields.needItemId][0][1];
            let arr: Array<Item> = ComposeModel.instance.getEquip(this._selectedCfg);
            if (arr.length > 0) {
                for (let i = 0; i < needNum; i++) {
                    if (this._itemPitArr[i].uid == null) {
                        let item = ArrayUtils.random(arr);
                        arr.splice(arr.indexOf(item), 1);
                        ComposeModel.instance.currEquipId[i] = item;
                    }
                }
                GlobalData.dispatcher.event(CommonEventType.ADD_EQUIP);
            } else {
                // CommonUtil.noticeError(17006);
                WindowManager.instance.open(WindowEnum.COMPOSE_EQUIP_GET_ALERT, this._selectedCfg);
            }

        }

        public onOpened(): void {
            super.onOpened();
            // this._composeClip.play();
        }

        public close(): void {
            super.close();
            this._composeClip.stop();

        }
    }
}