namespace modules.compose {
    import Event = laya.events.Event;
    import ComposeCfg = modules.config.ComposeCfg;
    import BtnGroup = modules.common.BtnGroup;
    import Panel = laya.ui.Panel;
    import item_compose = Configuration.item_compose;
    import item_composeFields = Configuration.item_composeFields;
    import idNameFields = Configuration.idNameFields;

    export class ComposePanel extends ui.ComposeViewUI {
        private _tab: BtnGroup;
        private _tabType: BtnGroup;
        private compose: Array<ComposeSelectPanel>;
        // private resolve: Array<ComposeSelectPanel>;

        private composePanle: Panel;
        // private resolvePanle: Panel;
        private timeId: number;
        private timeItemId: number;

        public destroy(destroyChild: boolean = true): void {
            this._tab = this.destroyElement(this._tab);
            this._tabType = this.destroyElement(this._tabType);
            this.compose = this.destroyElement(this.compose);
            // this.resolve = this.destroyElement(this.resolve);
            this.composePanle = this.destroyElement(this.composePanle);
            // this.resolvePanle = this.destroyElement(this.resolvePanle);
            super.destroy(destroyChild);
        }

        protected initialize() {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._tab = new BtnGroup();
            this._tab.setBtns(this.composeBtn, this.resolveBtn);
            this._tab.selectedIndex = 0;

            this._tabType = new BtnGroup();
            this._tabType.setBtns(this.stoneBtn, this.equipBtn, this.itemBtn);
            this._tabType.selectedIndex = 0;

            this._selectOne = 0;

            this.composePanle = new Panel();
            this.composePanle.vScrollBarSkin = "";
            this.composePanle.width = 173;
            this.composePanle.height = 880;
            this.addChild(this.composePanle);
            this.composePanle.pos(555, 123);

            // this.resolvePanle = new Panel();
            // this.resolvePanle.vScrollBarSkin = "";
            // this.resolvePanle.width = 607;
            // this.resolvePanle.height = 942;
            // this.addChild(this.resolvePanle);
            // this.resolvePanle.pos(51, 107 + 33);
            this.initShowData();
        }

        //初始化显示数据
        public initShowData(): void {
            let top = new Array<item_compose>();
            let bottom = new Array<Array<any>>();
            let arr: Array<any> = ComposeCfg.instance.getComposeTclassLength();

            for (let i = 1; i < arr.length; i++) {
                let ctCfgs = arr[i];
                let cfg: item_compose = ctCfgs[0];
                let str: string = cfg[item_composeFields.tClass][idNameFields.name];
                if (str != null) {
                    top.push(cfg);
                }
                let sclassNames = new Array<any>();
                for (let j = 0; j < ctCfgs.length; j++) {
                    let cfg = ctCfgs[j];
                    let sclass = cfg[item_composeFields.sClass];
                    let id = sclass[idNameFields.id];
                    if (sclassNames[id - 1] == null) {
                        sclassNames[id - 1] = [cfg[item_composeFields.sClass][idNameFields.name]];
                    }
                }
                bottom.push(sclassNames);
            }

            this.compose = new Array<ComposeSelectPanel>();
            for (let i = 0; i < top.length; i++) {
                this.compose[i] = new ComposeSelectPanel();
                this.compose[i].initData(top[i], i, 0);
                this.composeResizeShow(null);
            }
        }

        private reInitData() {
            let top = new Array<item_compose>();
            let bottom = new Array<Array<any>>();
            let arr: Array<any> = ComposeCfg.instance.getComposeTclassLength();

            for (let i = 1; i < arr.length; i++) {
                let ctCfgs = arr[i];
                let cfg: item_compose = ctCfgs[0];
                let str: string = cfg[item_composeFields.sClass][idNameFields.name];
                if (str != null) {
                    top.push(cfg);
                }
                let sclassNames = new Array<any>();
                for (let j = 0; j < ctCfgs.length; j++) {
                    let cfg = ctCfgs[j];
                    let sclass = cfg[item_composeFields.sClass];
                    let id = sclass[idNameFields.id];
                    if (sclassNames[id - 1] == null) {
                        sclassNames[id - 1] = [cfg[item_composeFields.sClass][idNameFields.name]];
                    }
                }
                bottom.push(sclassNames);
            }
            this.composePanle.removeChildren();
            this.compose = new Array<ComposeSelectPanel>();
            for (let i = 0; i < top.length; i++) {
                this.compose[i] = new ComposeSelectPanel();
                this.compose[i].initData(top[i], i, 0);
                this.composeResizeShow(null);
            }

            this.compose[0].reInit();
            this.addListeners();
        }

        //重新渲染
        private composeResizeShow(index: number): void {
            let y: number = 0;
            let x: number = 2;
            this._selectOne = index;
            this.composePanle.removeChildren();
            for (let i = 0; i < this.compose.length; i++) {
                if (index != null && i != index) {
                    this.compose[i].closeList();
                }
                this.compose[i].pos(x, y);

                this.composePanle.addChild(this.compose[i]);
                y = y + this.compose[i].height;
            }
        }

        private _selectOne: number;

        //选择某个选项以后抛出index-大的选项，selectItem-小的选项
        private setSelectItem(index: number, selectItem: number, type: number): void {
            let arr = [index + 1, selectItem + 1];
            if (ComposeModel.instance.composeType == 2) {
                let cfgs: Array<item_compose> = ComposeCfg.instance.getComposeCfgBySclass(index + 1, selectItem + 1);
                // console.log("adad", cfgs[0][item_composeFields.alertType], cfgs.length, cfgs);
                if (cfgs[0][item_composeFields.alertType] == 1) {
                    this.equipShow(arr);
                } else {
                    this.stoneShow(arr);
                }
            } else {
                this.stoneShow(arr);
            }
        }

        private stoneAlert: ComposeStoneAlert;
        private equipAlert: ComposeEquipAlert;
        private stoneShow(arr: number[]) {
            if (this.stoneAlert) {
                this.stoneAlert.destroy();
                this.stoneAlert = null;
            }
            if (this.equipAlert) {
                this.equipAlert.destroy();
                this.equipAlert = null;
            }

            if (!this.stoneAlert) {
                this.stoneAlert = new ComposeStoneAlert(arr);
                this.stoneAlert.title_img_1.skin = "compose/image_djhc.png";
                this.addChild(this.stoneAlert);
                this.stoneAlert.pos(270, 558);

                if (this.stoneAlert) {
                    this.addAutoListener(this.stoneAlert.useBtn, Event.CLICK, this, this.updateList)
                }
            }
        }

        private equipShow(arr: number[]) {
            if (this.equipAlert) {
                this.equipAlert.destroy();
                this.equipAlert = null;
            }
            if (this.stoneAlert) {
                this.stoneAlert.destroy();
                this.stoneAlert = null;
            }

            if (!this.equipAlert) {
                this.equipAlert = new ComposeEquipAlert(arr);
                this.addChild(this.equipAlert);
                this.equipAlert.pos(270, 555);

                // if (this.equipAlert) {
                //     this.addAutoListener(this.equipAlert.useBtn, Event.CLICK, this, this.updateList)
                // }
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this._tab.on(Event.CHANGE, this, this.changeComposeTabHandler);
            this.addAutoListener(this._tabType, Event.CHANGE, this, this.changeTabTpyeHandler);
            for (let i = 0; i < this.compose.length; i++) {  //监听所有选择项
                this.compose[i].on("COMPOSE_RESIZW", this, this.composeResizeShow);
                this.compose[i].on("COMPOSE_SELECT", this, this.setSelectItem);
            }
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.setDotDic);
            if (this.stoneAlert) {
                this.addAutoListener(this.stoneAlert.useBtn, Event.CLICK, this, this.updateList)
            }
            this.addAutoRegisteRedPoint(this.itemRed, ["itemBtnRP"]);
            this.addAutoRegisteRedPoint(this.stoneRed, ["stoneBtnRP"]);
            this.addAutoRegisteRedPoint(this.equipRed, ["equipBtnRP"]);
        }

        updateList() {
            if (this.stoneAlert._composeClip.visible == true) {
                clearTimeout(this.timeId);
                this.timeId = setTimeout(() => {
                    this.compose[this._selectOne].updateList();
                }, 80);
            }
        }


        stoneBtnHandler() {
            ComposeModel.instance.composeType = 1;
            this.resetDatas();
            this.compose[0].event("COMPOSE_SELECT", [0, 0, 0]);
            this.compose[0].openHandler();
        }

        equipBtnHandler() {
            ComposeModel.instance.composeType = 2;
            this.resetDatas();
            this.compose[0].event("COMPOSE_SELECT", [0, 0, 0]);
            this.compose[0].openHandler();
        }

        itemBtnHandler() {
            ComposeModel.instance.composeType = 3;
            this.resetDatas();
            this.compose[0].event("COMPOSE_SELECT", [0, 0, 0]);
            this.compose[0].openHandler();
        }

        private resetDatas() {
            ComposeCfg.instance.resetData();
            this.reInitData();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._tab.off(Event.CHANGE, this, this.changeComposeTabHandler);
            for (let i = 0; i < this.compose.length; i++) {  //移除监听
                this.compose[i].off("COMPOSE_RESIZW", this, this.composeResizeShow);
                this.compose[i].off("COMPOSE_SELECT", this, this.setSelectItem);
            }
            // for (let i = 0; i < this.resolve.length; i++) {  //移除监听
            //     this.resolve[i].off("RESOLVE_RESIZW", this, this.resolveResizeShow);
            //     this.resolve[i].off("RESOLVE_SELECT", this, this.setSelectItem);
            // }
            GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.setDotDic);

        }

        private setDotDic(): void {
            ComposeModel.instance.setDotDic();

            let tempOne: number = 0;
            clearTimeout(this.timeItemId);
            this.timeItemId = setTimeout(() => {
                for (let i = 0; i < this.compose.length; i++) {
                    if (!this.compose[this._selectOne].redDot.visible) {

                        if (this.compose[i].redDot.visible) {
                            tempOne = i;
                            this.compose[i].openHandler();
                            return;
                        }
                    }
                }
            }, 120);
        }

        private changeComposeTabHandler(): void {
            switch (this._tab.selectedIndex) {
                case 0:
                    this.titleTxt.text = "合成";
                    // this.resolvePanle.visible = false;
                    this.composePanle.visible = true;
                    break;
                case 1:
                    // this.titleTxt.text = "分解";
                    // this.resolvePanle.visible = true;
                    // this.composePanle.visible = false;
                    break;
            }
        }

        private changeTabTpyeHandler(): void {
            switch (this._tabType.selectedIndex) {
                case 0:
                    this.stoneBtnHandler()
                    break;
                case 1:
                    this.equipBtnHandler()
                    break;
                case 2:
                    this.itemBtnHandler()
                    break;
            }
        }

        protected onOpened() {
            super.onOpened();
            this.changeComposeTabHandler();

            this._tabType.selectedIndex = 0;
            this.changeTabTpyeHandler()
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public close() {
            super.close();
            WindowManager.instance.close(WindowEnum.COMPOSE_STONE_ALERT);
            WindowManager.instance.close(WindowEnum.COMPOSE_EQUIP_ALERT);
            WindowManager.instance.close(WindowEnum.DECOMPOSE_ALERT);
            WindowManager.instance.close(WindowEnum.COMPOSE_SUCCESS_ALERT);
            WindowManager.instance.close(WindowEnum.DECOMPOSE_SUCCESS_ALERT);
            clearTimeout(this.timeId);
            clearTimeout(this.timeItemId);
        }
    }
}