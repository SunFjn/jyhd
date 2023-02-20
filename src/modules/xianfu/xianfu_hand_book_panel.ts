///<reference path="../talisman/talisman_item.ts"/>
///<reference path="../config/xianfu_hand_book_cfg.ts"/>
/** 仙府-家园的图鉴面板 */
namespace modules.xianfu {
    import XianfuHandBookViewUI = ui.XianfuHandBookViewUI;
    import CustomList = modules.common.CustomList;
    import xianfu_illustrated_handbook = Configuration.xianfu_illustrated_handbook;
    import XianfuHandBookCfg = modules.config.XianfuHandBookCfg;
    import xianfu_illustrated_handbookFields = Configuration.xianfu_illustrated_handbookFields;
    import ItemsFields = Configuration.ItemsFields;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import Event = Laya.Event;
    import CustomClip = modules.common.CustomClip;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;

    export class XianfuHandBookPanel extends XianfuHandBookViewUI {

        protected _index: number;
        private _list: CustomList;
        private _attrNameTxts: Array<Text>;
        private _valueArr: Array<Text>;
        private _liftArr: Array<Text>;
        private _upImgsArr: Array<Image>;
        private _btnClip: CustomClip;
        private _ratioBar: ProgressBarCtrl;
        private _currId: number;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.pos(10, 163);
            this._list.width = 720// 611;
            this._list.height = 475;
            this._list.hCount = 4;
            this._list.spaceX = 2;
            this._list.spaceY = 4;
            this._list.itemRender = XianfuHandBookItem;
            this.addChild(this._list);

            this._btnClip = CommonUtil.creatEff(this.upBtn, "btn_light", 15);
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(1.1, 1.2);
            this._btnClip.visible = false;

            this._liftArr = [this.proAttTxt_0, this.proAttTxt_1, this.proAttTxt_2];
            this._upImgsArr = [this.arrImg_0, this.arrImg_1, this.arrImg_2];
            this._valueArr = [this.attValueTxt_0, this.attValueTxt_1, this.attValueTxt_2];
            this._attrNameTxts = [this.attNameTxt_0, this.attNameTxt_1, this.attNameTxt_2];

            this._ratioBar = new ProgressBarCtrl(this.barImg, this.barImg.width, this.barTxt);
            this._currId = -1;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.HAND_BOOK_UPDATE, this, this.setList);
            this.addAutoListener(this._list, Event.SELECT, this, this.updateView);
            this.addAutoListener(this.upBtn, Event.CLICK, this, this.upBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            if (this.panelId == WindowEnum.XIANFU_HAND_BOOK_BLUE_PANEL) { //蓝
                this._index = 0;
            } else if (this.panelId == WindowEnum.XIANFU_HAND_BOOK_VIOLET_PANEL) {//紫
                this._index = 1;
            } else if (this.panelId == WindowEnum.XIANFU_HAND_BOOK_ORANGE_PANEL) {//橙
                this._index = 2;
            } else if (this.panelId == WindowEnum.XIANFU_HAND_BOOK_RED_PANEL) {//红
                this._index = 3;
            }

            this._btnClip.play();
            this.setList();
            this.searchRPIndex();
            this.updateView();
        }

        private searchRPIndex(currId: number = null): void {
            let datas: Array<[number, number]> = this._list.datas;
            for (let i: int = 0, len: int = datas.length; i < len; i++) {
                let id: number = datas[i][0];
                if (currId) {
                    if (currId == id) {
                        this._list.selectedIndex = i;
                        return;
                    }
                } else {
                    let state: TalismanState = XianfuModel.instance.getHandbookStateById(id);
                    if (state == TalismanState.active || state == TalismanState.up) {
                        this._list.selectedIndex = i;
                        this._currId = id;
                        return;
                    }
                }

            }
            this._list.selectedIndex = 0;
            this._currId = this._list.selectedData[0];
        }

        private setList(): void {
            let idsTab: Table<number> = XianfuHandBookCfg.instance.getIdsByType(this._index);
            let idAndLvArr: Array<[number, number]> = [];
            let atkVale: number = 0;
            for (let key in idsTab) {
                let id: number = idsTab[key];
                let level = XianfuModel.instance.handBook[id];
                if (!level) level = 0;
                else {
                    let atkNum: number = XianfuHandBookCfg.instance.getCfgByIdAndLv(id, level)[xianfu_illustrated_handbookFields.fighting];
                    atkVale += atkNum;
                }
                idAndLvArr.push([id, level]);

            }
            idAndLvArr = idAndLvArr.sort(this.sortFunc.bind(this));
            this._list.datas = idAndLvArr;
            this.atkMsz.value = atkVale.toString();

            if (this._currId == -1) {
                return;
            }
            if (this.checkIsHaveRP()) {
                this.searchRPIndex(this._currId);
            } else {
                this.searchRPIndex();
            }

        }

        //检测选中的是否有红点
        private checkIsHaveRP(): boolean {
            let selectState: number = XianfuModel.instance.getHandbookStateById(this._currId);
            if (selectState == TalismanState.active || selectState == TalismanState.up) {
                return true;
            }
            return false;
        }

        protected updateView(): void {
            let datas: [number, number] = this._list.selectedData;
            let id: number = this._currId = datas[0];
            let lv: number = datas[1];
            let currCfg: xianfu_illustrated_handbook = config.XianfuHandBookCfg.instance.getCfgByIdAndLv(id, lv);
            let nextCfg: xianfu_illustrated_handbook = XianfuHandBookCfg.instance.getCfgByIdAndLv(id, lv + 1);
            this.desTxt.text = currCfg[xianfu_illustrated_handbookFields.des];
            common.AttrUtil.setAttrTxts(
                currCfg,
                nextCfg,
                this._attrNameTxts,
                this._valueArr,
                this._upImgsArr,
                this._liftArr,
                xianfu_illustrated_handbookFields.attrs
            );
            let needItemId: number = currCfg[xianfu_illustrated_handbookFields.items][ItemsFields.itemId];
            let needItemNum: number = currCfg[xianfu_illustrated_handbookFields.items][ItemsFields.count];
            let haveNum: number = XianfuModel.instance.handBookRes.get(needItemId);
            if (!haveNum) haveNum = 0;
            this._ratioBar.maxValue = needItemNum;
            this._ratioBar.value = haveNum;
            this._btnClip.visible = !!(haveNum >= needItemNum && nextCfg);
            this.showItem.setData(datas);
            this.showItem.redDot.visible = false;

            if (nextCfg) {
                this.maxLvBox.visible = true;
                this.maxLvTxt.visible = false;
                this.upBtn.label = lv ? `升级` : `激活`;
            } else {
                this.maxLvBox.visible = false;
                this.maxLvTxt.visible = true;
            }
        }

        /** 可激活＞可升级＞已满级＞不能升级＞未激活 */
        private sortFunc(l: [number, number], r: [number, number]): number {
            let lState: number = XianfuModel.instance.getHandbookStateById(l[0]);
            let rState: number = XianfuModel.instance.getHandbookStateById(r[0]);
            if (lState > rState) {
                return -1;
            } else if (lState < rState) {
                return 1;
            } else {
                if (l < r) {
                    return -1;
                } else if (l > r) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        private upBtnHandler(): void {
            let id: number = this._list.selectedData[0];
            XianfuCtrl.instance.PromoteIllustratedHandbook([id]);
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}