/**背包上拉列表选择框 */

///<reference path="../common/custom_list.ts"/>

namespace modules.bag {
    import CustomList = modules.common.CustomList;
    import BagSelectViewUI = ui.BagSelectViewUI;
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;

    export class BagSelectPanel extends BagSelectViewUI {
        private _fontWidth: number;
        private _openBtnSkin: string;
        private _unOpenBtnSkin: string;
        private _list: CustomList;
        private _isOpen: boolean;
        private _bagSelectData: Array<BagSelectData>;
        private _posX: number;
        private _showColor: string;
        private _rowH: number;
        private _changeH: number;
        private _dataInit: number;
        private _dataLength: number;
        private _colorName: Array<string>;
        private _selectType: string;

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = BagSelectItem;
            this._list.vCount = 2;
            this._list.hCount = 1;
            this._list.width = 200;
            this._list.height = 89;
            this._list.x = 23;
            this._list.y = 504;
            this.addChildAt(this._list, 4);
            this._isOpen = false;
            this._list.visible = false;
            this._fontWidth = 24;
            this._posX = 143;
            this._showColor = "#2d2d2d";
            this._openBtnSkin = "common/btn_tonyong_34.png";
            this._rowH = 46;
            this._unOpenBtnSkin = "common/btn_tonyong_33.png";

            this._colorName = ["紫色", "橙色", "红色"];
        }

        public get isOpen(): boolean {
            return this._isOpen;
        }

        private changeShow(): void {   //改变下方显示内容
            if (this._list.selectedIndex != -1 && this._bagSelectData[this._list.selectedIndex].showNum) {
                let show = this._bagSelectData[this._list.selectedIndex];
                this.showNum.visible = true;
                this.showNum.x = this._posX - show.txtNum * this._fontWidth;
                this.showNum.text = show.showNum.toString();
                this.showTxt.text = show.showTxt;
                this.showTxt.visible = true;
                if (show.firstColor) {
                    this.showNum.color = show.firstColor;
                } else {
                    this.showNum.color = this._showColor;
                }
            } else {
                this.showNum.visible = false;
                this.showTxt.visible = true;
                if (this._list.selectedIndex == -1) {
                    this.showTxt.text = this._bagSelectData[this._dataLength - 1 - this._dataInit].showTxt;
                } else {
                    this.showTxt.text = this._bagSelectData[this._list.selectedIndex].showTxt;
                }
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.selectImg, LayaEvent.CLICK, this, this.openHandler);
            this.addAutoListener(this.controlBtn, LayaEvent.CLICK, this, this.openHandler);
            this.addAutoListener(this._list, LayaEvent.SELECT, this, this.selectHandler);
        }

        public openHandler(event: Event): void {
            if (event) {
                event.stopPropagation();
            }
            if (this._isOpen) {
                this.controlBtn.skin = this._unOpenBtnSkin;
                this.bgImg.visible = this._isOpen = this._list.visible = false;
                this.changeShow();
            } else {
                this.controlBtn.skin = this._openBtnSkin;
                this.bgImg.visible = this._isOpen = this._list.visible = true;
                this.bgImg.height = this._changeH;
                this.showNum.visible = this.showTxt.visible = false;
            }
        }

        private selectHandler(event: Event): void {
            if (this._list.selectedIndex == -1) return;
            this.openHandler(event);
            this.changeShow();
            this.event(`select_${this._selectType}`, this._list.selectedIndex);  //进行选择后抛出事件
        }

        public setRowData(data: Array<BagSelectData>): void {  //根据传入数据调节list高度
            this._bagSelectData = new Array<BagSelectData>();
            if (!data) {
                return;
            }
            this._dataLength = data.length;
            this._bagSelectData = data;
            let len = data.length;
            this._list.vCount = len;
            this._list.height = len * this._rowH;
            this._changeH = len * this._rowH;
            if (len != 2) {  //最少显示两个
                this._list.y = 504 - (len - 2) * this._rowH;
            } else
                this._list.y = 504;
            this._list.datas = this._bagSelectData;
        }

        public initData(type: string): void {
            this._selectType = type;
            if (type == "color") {
                let colorData = new Array<BagSelectData>(); //初始化品质选择框内容信息
                for (let color: int = 5; color > 2; color--) { //0为任意值
                    let colorDataTemps = new BagSelectData();
                    colorDataTemps.firstColor = CommonUtil.getColorByQuality(color);
                    colorDataTemps.showNum = this._colorName[color - 3];
                    colorDataTemps.txtNum = 3;
                    colorDataTemps.showTxt = "及以下";
                    colorData.push(colorDataTemps);
                }
                let colorDataInit = new BagSelectData();
                colorDataInit.showTxt = "任意品质";
                colorData.unshift(colorDataInit);
                this.setRowData(colorData);
                this._list.selectedIndex = 0;
            } else if (type == "stage") {
                let stageData = new Array<BagSelectData>();
                let stageDataInit = new BagSelectData();
                stageDataInit.showTxt = "任意阶数";
                stageData.push(stageDataInit);
                let maxNum: number = BagModel.instance.maxStage;
                for (let stage: int = maxNum; stage >= 4; stage--) {
                    let stageDataTemps = new BagSelectData();
                    stageDataTemps.showNum = `${stage}`;
                    stageDataTemps.txtNum = 4;
                    stageDataTemps.showTxt = "阶及以下";
                    stageData.push(stageDataTemps);
                }
                this.setRowData(stageData);
                this._list.selectedIndex = 0;
            } else {
                let starData = new Array<BagSelectData>();   //初始化星级选择框信息
                let starStartData = new BagSelectData();
                starStartData.showTxt = "全部";
                starData.push(starStartData);

                for (let star: int = 3; star > 0; star--) {
                    let starDataTemps = new BagSelectData();
                    starDataTemps.showNum = `${star}`;
                    starDataTemps.txtNum = 4;
                    starDataTemps.showTxt = "星及以下";
                    starData.push(starDataTemps);
                }
                let starEndData = new BagSelectData();
                starEndData.showTxt = "0星装备";
                starData.push(starEndData);
                this.setRowData(starData);
                let index: number = 0;
                index = BagSmeltUtil.starIndex.indexOf(BagModel.instance.smeltStar);
                this._list.selectedIndex = index;
            }
            this._list.selectedIndex = this._list.selectedIndex;
        }

        public destroy(destroyChild: boolean = true): void {
            this.removeSelf();
            this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }
    }
}