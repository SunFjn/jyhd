///<reference path="../config/xianfu_build_cfg.ts"/>
/** 仙府-家园的炼丹熔炼面板 */
namespace modules.xianfu {
    import XianfuSmeltAlertUI = ui.XianfuSmeltAlertUI;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import GetBuildingInfoReplyFields = Protocols.GetBuildingInfoReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import xianfu_build = Configuration.xianfu_build;
    import XianfuBuildCfg = modules.config.XianfuBuildCfg;
    import xianfu_buildFields = Configuration.xianfu_buildFields;
    import item_materialFields = Configuration.item_materialFields;

    export class XianfuSmeltAlert extends XianfuSmeltAlertUI {

        //private _list: CustomList;
        private _products: Array<Array<number>>;
        private _productsByLv: Array<Array<number>>;

        private _centerItem: BaseItem;
        private _numInputCtrl: NumInputCtrl;
        private _oldIndex: number;
        private _materialLimit: number;
        private _materialCount: number;
        private _cfgLimit: number;
        private _selectedOne:number;
        private _datas:Item;

        protected initialize(): void {
            super.initialize();

            this._centerItem = new BaseItem();
            this._centerItem.pos(280, 111);
            this.addChild(this._centerItem);

            this._numInputCtrl = new NumInputCtrl(this.inputTxt, this.addBtn, this.subBtn);
            this._oldIndex = -1;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.smeltBtn, Event.CLICK, this, this.smeltBtnHandler);
            this.addAutoListener(this.maxBtn, common.LayaEvent.CLICK, this, this.maxBtnHandler);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.aboutBtnHandler);
            this.addAutoListener(this.inputTxt, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.inputTxt, common.LayaEvent.INPUT, this, this.changeHandler);
            this.addAutoListener(this.addBtn, common.LayaEvent.CLICK, this, this.addBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.setMax);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_WIND_WATER_UPTATE, this, this.setCfgLimit);

            this._numInputCtrl.addListeners();
        }

        protected removeListeners(): void {
            this._numInputCtrl.removeListeners();
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();

            this._materialCount = XianfuModel.instance.treasureInfos(0);

            this.setCfgLimit();
            this._numInputCtrl.value = 1;
            this.updateView();
            this.selectListHandler();
        }

        private selectListHandler(): void {
            let index: number = this._selectedOne;
            let selectedData: Item = this._datas;
            if (!selectedData) return;
            if (this._centerItem.itemData) {
                if (index != this._oldIndex) {
                    let count: number = this._numInputCtrl.value;
                    if (count > 1) {
                        this._numInputCtrl.value = this._numInputCtrl.min;
                    }
                }
            }
            this._centerItem.dataSource = selectedData;
            this.conImg.skin = CommonUtil.getIconById(this._products[index][2]);
            this.setConsume();
            if (this._productsByLv[index][4] * 100 + XianfuModel.instance.successAddValue <= 100) {
                this.succeedPerTxt.text = `${this._productsByLv[index][4] * 100 + XianfuModel.instance.successAddValue}%`;
            }
            else if (this._productsByLv[index][4] * 100 + XianfuModel.instance.successAddValue > 100) {
                this.succeedPerTxt.text = "100%";
            } else {
                this.succeedPerTxt.text = "err";
            }
            this.setMax();
            this._oldIndex = index;
            this.changeHandler();
        }

        private setCfgLimit(): void {
            this._cfgLimit = XianfuModel.instance.maxOutput[2] + XianfuModel.instance.dailySmeltTimeAddValue;
            this._numInputCtrl.max = this._cfgLimit;
        }

        private setMax(): void {
            this._materialCount = XianfuModel.instance.treasureInfos(0);
            let index: number = this._selectedOne;
            let data: number[] = this._products[index];
            let needPropCount: number = data[3];
            this._materialLimit = Math.floor(this._materialCount / needPropCount);
            let maxCount: number = this._materialLimit > this._cfgLimit ? this._cfgLimit : this._materialLimit == 0 ? 1 : this._materialLimit;
            this._numInputCtrl.max = maxCount;
        }

        private updateView(): void {
            //2炼丹炉 3炼器炉 4炼魂炉
            let buildType: number = XianfuModel.instance.buildType;
            let buildLv: number = XianfuModel.instance.getBuildInfo(buildType)[GetBuildingInfoReplyFields.level];
            let maxLv: number = XianfuBuildCfg.instance.getMaxLvById(buildType);
            let buildCfg: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(buildType, maxLv);
            let buildCfgByBuildLv: xianfu_build = XianfuBuildCfg.instance.getCfgByIdAndLv(buildType, buildLv);

            this._products = buildCfg[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            this._productsByLv = buildCfgByBuildLv[xianfu_buildFields.produce]; //总共可以选择炼制的产物
            let itemCfg = CommonUtil.getItemCfgById(this._datas[0]);
            this.nameTxt.text = itemCfg[item_materialFields.name].toString();
        }

        private maxBtnHandler(): void {
            this._numInputCtrl.value = this._numInputCtrl.max;
        }


        private setConsume(mult: number = 1): void {
            let index: number = this._selectedOne;
            let needNum: number = Math.floor(this._products[index][3] * mult * (1 - XianfuModel.instance.smeltConsumeReduceValue * 0.01));

            this.consumeTxt.text = `${CommonUtil.bigNumToString(this._materialCount)}/${CommonUtil.bigNumToString(needNum)}`;
            this.consumeTxt.color = this._materialCount >= needNum ? `#ffffff` : `#ff3e3e`;
        }

        private addBtnHandler(): void {
            let count: number = parseInt(this.inputTxt.text);
            if (count >= this._materialLimit) {
                notice.SystemNoticeManager.instance.addNotice(`已达当前材料可炼最大上限`);
            } else if (count >= this._cfgLimit) {
                notice.SystemNoticeManager.instance.addNotice(`已达每次开炉可炼最大上限`);
            }
        }

        private changeHandler(): void {
            let count: number = parseInt(this.inputTxt.text);
            let index: number = this._selectedOne;
            let eachTime: number = this._products[index][7];
            this.needTimeTxt.text = `${CommonUtil.formatTime(eachTime * count)}`;
            this.setConsume(count);
        }

        private smeltBtnHandler(): void {
            XianfuCtrl.instance.makeItem([XianfuModel.instance.buildType, [[this._selectedOne, this._numInputCtrl.value]]]);
            this.close();
            WindowManager.instance.close(WindowEnum.XIANFU_SMELT_PANEL);
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20062);
        }

        public destroy(): void {
            super.destroy();
        }

        protected setOpenParam(value:any) {
            super.setOpenParam(value);
            this._selectedOne = value[0];
            this._datas = value[1];
        }
    }
}