/////<reference path="../$.ts"/>
/** 聚灵厅的结算奖励面板 */
namespace modules.xianfu {
    import FengshuiAttAlertUI = ui.FengshuiAttAlertUI;
    import Event = Laya.Event;
    import BtnGroup = common.BtnGroup;
    import attr = Configuration.attr;
    import xianfu_decorateFields = Configuration.xianfu_decorateFields;
    import AttrUtil = modules.common.AttrUtil;
    import attrFields = Configuration.attrFields;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_itemFields = Configuration.attr_itemFields;

    export class FengshuiAttAlert extends FengshuiAttAlertUI {

        private _btnGroup: BtnGroup;
        private _showAttIndexs: number[];
        private _attTxts: Laya.Text[];
        private _attValues: number[];
        private _fengshuiLvNameStrs: string[];
        private _lastY: number;
        private _attItems: FengshuiAttItem[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1);

            this._attTxts = [this.attTxt_0, this.attTxt_1, this.attTxt_2, this.attTxt_3,
                this.attTxt_4, this.attTxt_5, this.attTxt_6, this.attTxt_7];

            this._attValues = [];
            this._showAttIndexs = config.BlendCfg.instance.getCfgById(22011)[Configuration.blendFields.intParam];

            this._fengshuiLvNameStrs = ["末等", "九等", "八等", "七等", "六等", "五等", "四等", "三等", "二等", "一等"];

            this._lastY = 0;

            this.title_0.tipTxt.text = `农场`;      // 聚灵厅 to 农场
            this.title_1.tipTxt.text = `炼金室`;    // 炼制涯 to 炼金室
            this.title_2.tipTxt.text = `游历`;      // 灵兽阁 to 游历
            this._attItems = [this.item_0, this.item_1, this.item_2, this.item_3, this.item_4, this.item_5,
                this.item_6, this.item_7, this.item_8, this.item_9, this.item_10, this.item_11];

            for (let i: int = 0, len: int = this._attItems.length; i < len; i++) {
                this._attItems[i].type = i;
            }

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_WIND_WATER_UPTATE, this, this.updateView);

            this.addAutoListener(this.listBox, Event.MOUSE_DOWN, this, this.downHandler);
            this.addAutoListener(this.listBox, Event.MOUSE_WHEEL, this, this.wheelHandler);

            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.updateView);
            this._btnGroup.selectedIndex = 0;
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            if (this._btnGroup.selectedIndex == 0) {
                this.btnGroupBox_0.visible = true;
                this.btnGroupBox_1.visible = false;
            } else {
                this.btnGroupBox_0.visible = false;
                this.btnGroupBox_1.visible = true;
                this.setAttTxt();
                let fengshuiLv: number = XianfuModel.instance.fengshuiLv;
                let fengshuiCfg: Configuration.xianfu_fengshui = config.XianfuFengShuiCfg.instance.getCfgById(fengshuiLv);
                this.lvTxt.text = `${fengshuiCfg[Configuration.xianfu_fengshuiFields.name]}(${this._fengshuiLvNameStrs[fengshuiLv - 1]})`;
                let currAttAddValue: number = (fengshuiCfg[Configuration.xianfu_fengshuiFields.attrPer] - 1);
                this.currAttTxt.text = `${Math.floor(currAttAddValue * 100)}%`;
                let nextFengshuiCfg: Configuration.xianfu_fengshui = config.XianfuFengShuiCfg.instance.getCfgById(fengshuiLv + 1);
                if (nextFengshuiCfg) {
                    let nextAttAddValue: number = (nextFengshuiCfg[Configuration.xianfu_fengshuiFields.attrPer] - 1);
                    this.nextAttTxt.text = `${Math.floor(nextAttAddValue * 100)}%`;
                    this.nextHintTxt.text = `下级加成：所有风水属性加成`;
                    this.nextAttTxt.x = 337;
                } else {
                    this.nextHintTxt.text = `下级加成：`;
                    this.nextAttTxt.text = `已满级`;
                    this.nextAttTxt.x = 150;
                }
            }
        }

        private setAttTxt(): void {
            //计算所有的提升值
            //每次重置下数值
            this._attValues.length = 0;
            this._attValues = [];
            let resList: number[] = XianfuModel.instance.fengshuiResList;
            for (let i: int = 0, len: int = resList.length; i < len; i++) {
                let id: number = resList[i];
                let cfg: Configuration.xianfu_decorate = config.XianfuDecorateCfg.instance.getCfgById(id);
                this.setAtts(cfg);
            }
            for (let i: int = 0, len: int = this._attTxts.length; i < len; i++) {
                let attTxt: Laya.Text = this._attTxts[i];
                if (i >= this._showAttIndexs.length) {
                    attTxt.visible = false;
                } else {
                    let attrCfg:attr_item = AttrItemCfg.instance.getCfgById(this._showAttIndexs[i]);
                    attTxt.visible = true;
                    let attrValue:number = this._attValues[i] || 0;
                    this._attTxts[i].text = `${attrCfg[attr_itemFields.name]}:${attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue)}`;
                }
            }
        }

        //计算所有的属性值
        private setAtts(cfg: Configuration.xianfu_decorate): void {
            let attrs:Array<attr> = cfg[xianfu_decorateFields.attrs];
            for (let i: int = 0, len = this._showAttIndexs.length; i < len; i++) {
                let att:attr = AttrUtil.getAttrByType(this._showAttIndexs[i], attrs);
                let attrValue:number = att ? att[attrFields.value] : 0;
                if (!this._attValues[i]) this._attValues[i] = 0;
                this._attValues[i] += attrValue;
            }
        }

        private downHandler(): void {
            this._lastY = this.listBox.mouseY;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offset: number = e.delta * -8;
            this.scroll(offset);
        }

        // 滚动偏移（相对于当前滚动位置的偏移）
        public scroll(offset: number): void {
            this.listBox.y = this.listBox.y - offset;
            if (this.listBox.y < this.listCon.height - this.listBox.height) {
                this.listBox.y = this.listCon.height - this.listBox.height;
                this._lastY = this.listBox.y;
            } else if (this.listBox.y > 0) {
                this._lastY = this.listBox.y = 0;
            }
        }

        private moveHandler(): void {
            let offset: number = this._lastY - this.listBox.mouseY;
            this.scroll(offset);
            this._lastY = this.listBox.mouseY;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }

        public close(): void {
            super.close();
        }

        public destroy(): void {
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            super.destroy();
        }
    }
}