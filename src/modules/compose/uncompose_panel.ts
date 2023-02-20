namespace modules.compose {
    import Event = laya.events.Event;
    import ComposeCfg = modules.config.ComposeCfg;
    import BtnGroup = modules.common.BtnGroup;
    import Panel = laya.ui.Panel;
    import item_compose = Configuration.item_compose;
    import item_composeFields = Configuration.item_composeFields;
    import idNameFields = Configuration.idNameFields;
    import item_resolveFields = Configuration.item_resolveFields;
    import item_resolve = Configuration.item_resolve;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;


    export class UncomposePanel extends ui.UncomposeViewUI {
        private _tab: BtnGroup;
        private _tabType: BtnGroup;
        // private compose: Array<ComposeSelectPanel>;
        private resolve: Array<ComposeSelectPanel>;

        // private composePanle: Panel;
        private resolvePanle: Panel;

        public destroy(destroyChild: boolean = true): void {
            this._tab = this.destroyElement(this._tab);
            this._tabType = this.destroyElement(this._tabType);
            // this.compose = this.destroyElement(this.compose);
            this.resolve = this.destroyElement(this.resolve);
            // this.composePanle = this.destroyElement(this.composePanle);
            this.resolvePanle = this.destroyElement(this.resolvePanle);
            super.destroy(destroyChild);
        }

        protected initialize() {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._tab = new BtnGroup();
            this._tab.setBtns(this.composeBtn, this.resolveBtn);
            this._tab.selectedIndex = 1;

            this._tabType = new BtnGroup();
            this._tabType.setBtns(this.itemBtn, this.equipBtn);
            this._tabType.selectedIndex = 0;

            this.resolvePanle = new Panel();
            this.resolvePanle.vScrollBarSkin = "";
            this.resolvePanle.width = 173;
            this.resolvePanle.height = 880;
            this.addChild(this.resolvePanle);
            this.resolvePanle.pos(555, 123);
            this.initShowData();
        }

        //初始化显示数据
        public initShowData(): void {
            let top1 = new Array<item_resolve>();
            let arr1: Array<any> = ComposeCfg.instance.getResolveTclassLength();
            for (let i = 1; i <= arr1.length; i++) {
                let rtCfgs = arr1[i];
                if (rtCfgs == null) {
                    continue;
                }
                let cfg1: item_resolve = rtCfgs[0];
                let str: string = cfg1[item_resolveFields.sClass][idNameFields.name];
                if (str != null) {
                    top1.push(cfg1);
                }
                let tclasscfgs = new Array<any>();
                for (let j = 0; j < rtCfgs.length; j++) {
                    let cfg = rtCfgs[j];
                    let sclass = cfg[item_resolveFields.name];
                    let id = sclass[idNameFields.id];
                    if (tclasscfgs[id - 1] == null) {
                        tclasscfgs[id - 1] = [cfg[item_resolveFields.name][idNameFields.name]];
                    }
                }
            }
            this.resolve = new Array<ComposeSelectPanel>();
            for (let i = 0; i < top1.length; i++) {
                this.resolve[i] = new ComposeSelectPanel();
                this.resolve[i].initData(top1[i], i, 1);
                this.resolveResizeShow(null);
            }
        }

        //重新渲染
        private resolveResizeShow(index: number): void {
            let y: number = 0;
            let x: number = 0;
            for (let i = 0; i < this.resolve.length; i++) {
                if (index != null && i != index) {
                    this.resolve[i].closeList();
                }
                this.resolve[i].pos(x, y);
                this.resolvePanle.addChild(this.resolve[i]);
                y = y + this.resolve[i].height;
            }
        }

        //选择某个选项以后抛出index-大的选项，selectItem-小的选项
        private setSelectItem(index: number, selectItem: number, type: number): void {
            let arr = [index + 1, selectItem + 1];

            this.decompseShow(arr);
            // WindowManager.instance.openDialog(WindowEnum.DECOMPOSE_ALERT, arr)
        }

        private uncomposeAlert: DecomposeAlert;
        private decompseShow(arr: any) {
            if (this.uncomposeAlert) {
                this.uncomposeAlert.destroy();
                this.uncomposeAlert = null;
            }
            if (!this.uncomposeAlert) {
                this.uncomposeAlert = new DecomposeAlert(arr);
                this.uncomposeAlert.title_img_1.skin = this._tabType.selectedIndex === 0 ? "compose/image_djfj.png" : "compose/image_wpfj.png";
                this.uncomposeAlert.attributeBox.visible = false;
                this.uncomposeAlert.noAttributeBox.visible = true;
                this.addChild(this.uncomposeAlert);
                this.uncomposeAlert.pos(270, 558);
            }
        }


        protected addListeners(): void {
            super.addListeners();
            this._tab.on(Event.CHANGE, this, this.changeComposeTabHandler);
            // for (let i = 0; i < this.compose.length; i++) {  //监听所有选择项
            //     this.compose[i].on("COMPOSE_RESIZW", this, this.composeResizeShow);
            //     this.compose[i].on("COMPOSE_SELECT", this, this.setSelectItem);
            // }
            this.addAutoListener(this._tabType, Event.CHANGE, this, this.changeTabTpyeHandler);
            for (let i = 0; i < this.resolve.length; i++) {  //监听所有选择项
                this.resolve[i].on("RESOLVE_RESIZW", this, this.resolveResizeShow);
                this.resolve[i].on("RESOLVE_SELECT", this, this.setSelectItem);
            }
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.setDotDic);

            // RedPointCtrl.instance.registeRedPoint(this.coDot, ["composeRP"]);
            // RedPointCtrl.instance.registeRedPoint(this.reDot, ["resolveRP"]);
            this.addAutoRegisteRedPoint(this.itemReRed, ["itemReBtnRP"]);
            this.addAutoRegisteRedPoint(this.equipReRed, ["equipReBtnRP"]);
        }

        private changeTabTpyeHandler() {
            switch (this._tabType.selectedIndex) {
                case 0:
                    this.itemBtnHandler()
                    break;
                case 1:
                    this.equipBtnHandler()
                    break;
            }
        }

        itemBtnHandler() {
            ComposeModel.instance.resolveType = 1;
            this.resetDatas();
            this.resolve[0].event("RESOLVE_SELECT", [0, 0, 1]);
            this.resolve[0].openHandler();
        }

        equipBtnHandler() {
            ComposeModel.instance.resolveType = 2;
            this.resetDatas();
            this.resolve[0].event("RESOLVE_SELECT", [0, 0, 1]);
            this.resolve[0].openHandler();
        }

        private resetDatas() {
            ComposeCfg.instance.resetDataResolve();
            this.reInitData();
        }

        reInitData() {
            this.resolve[0].reInit();
            let top1 = new Array<item_resolve>();
            let arr1: Array<any> = ComposeCfg.instance.getResolveTclassLength();
            for (let i = 1; i <= arr1.length; i++) {
                let rtCfgs = arr1[i];
                if (rtCfgs == null) {
                    continue;
                }
                let cfg1: item_resolve = rtCfgs[0];
                let str: string = cfg1[item_resolveFields.name][idNameFields.name];
                if (str != null) {
                    top1.push(cfg1);
                }
                let tclasscfgs = new Array<any>();
                for (let j = 0; j < rtCfgs.length; j++) {
                    let cfg = rtCfgs[j];
                    let sclass = cfg[item_resolveFields.name];
                    let id = sclass[idNameFields.id];
                    if (tclasscfgs[id - 1] == null) {
                        tclasscfgs[id - 1] = [cfg[item_resolveFields.name][idNameFields.name]];
                    }
                }
            }
            this.resolvePanle.removeChildren();
            this.resolve = new Array<ComposeSelectPanel>();
            for (let i = 0; i < top1.length; i++) {
                this.resolve[i] = new ComposeSelectPanel();
                this.resolve[i].initData(top1[i], i, 1);
                this.resolveResizeShow(null);
            }
            this.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._tab.off(Event.CHANGE, this, this.changeComposeTabHandler);
            // for (let i = 0; i < this.compose.length; i++) {  //移除监听
            //     this.compose[i].off("COMPOSE_RESIZW", this, this.composeResizeShow);
            //     this.compose[i].off("COMPOSE_SELECT", this, this.setSelectItem);
            // }
            for (let i = 0; i < this.resolve.length; i++) {  //移除监听
                this.resolve[i].off("RESOLVE_RESIZW", this, this.resolveResizeShow);
                this.resolve[i].off("RESOLVE_SELECT", this, this.setSelectItem);
            }
            GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.setDotDic);

        }

        private setDotDic(): void {
            ComposeModel.instance.setDotDic();
        }

        private changeComposeTabHandler(): void {
            switch (this._tab.selectedIndex) {
                case 0:
                    this.titleTxt.text = "合成";
                    this.resolvePanle.visible = false;
                    // this.composePanle.visible = true;
                    break;
                case 1:
                    this.titleTxt.text = "分解";
                    this.resolvePanle.visible = true;
                    // this.composePanle.visible = false;
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

            // if (!value) return;
            // this.compose[value[0]].openHandler();
            // this.composeResizeShow(value[0]);
        }

        public close() {
            super.close();
            WindowManager.instance.close(WindowEnum.COMPOSE_STONE_ALERT);
            WindowManager.instance.close(WindowEnum.COMPOSE_EQUIP_ALERT);
            WindowManager.instance.close(WindowEnum.DECOMPOSE_ALERT);
            WindowManager.instance.close(WindowEnum.COMPOSE_SUCCESS_ALERT);
            WindowManager.instance.close(WindowEnum.DECOMPOSE_SUCCESS_ALERT);
        }
    }
}