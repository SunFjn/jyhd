///<reference path="../config/xianfu_travel_cfg.ts"/>
/** 宠物准备游历弹框*/
namespace modules.xianfu {
    import XianfuPetReadyGoAlertUI = ui.XianfuPetReadyGoAlertUI;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import xianfu_travel = Configuration.xianfu_travel;
    import XianfuTravelCfg = modules.config.XianfuTravelCfg;
    import xianfu_travelFields = Configuration.xianfu_travelFields;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import Image = Laya.Image;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;

    export class XianfuPetReadyGoAlert extends XianfuPetReadyGoAlertUI {

        private _ids: number[];
        private _sites: Image[];
        private _currIndex: number;
        private _conItem: BaseItem;
        private _isAmulet: boolean;
        private _lpId: number;
        private _petId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.fsTxt.underline = true;
            this.contentTxt_0.color = "#2d2d2d";
            this.contentTxt_0.style.fontFamily = "SimHei";
            this.contentTxt_0.style.fontSize = 24;
            this.contentTxt_0.style.leading = 5;

            this.countTxt.color = "#2d2d2d";
            this.countTxt.style.fontFamily = "SimHei";
            this.countTxt.style.fontSize = 24;

            this._currIndex = 0;
            this._ids = XianfuTravelCfg.instance.ids;
            this._sites = [this.disImg_0, this.disImg_1, this.disImg_2, this.disImg_3];

            this._conItem = new BaseItem();
            // this._conItem.pos(280,595);
            this._conItem.centerX = 0;
            this._conItem.y = 595;
            this._conItem._numTxt.y = 100;
            this._conItem._numTxt.width = 500;
            this._conItem._numTxt.x = -100;
            this._conItem._numTxt.align = `center`;
            this._conItem.scale(0.8, 0.8);

            this.addChild(this._conItem);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.goBtn, Event.CLICK, this, this.goBtnHandler);
            this.addAutoListener(this.lpBtn, Event.CLICK, this, this.buyPropBtnHandler, [0]);
            this.addAutoListener(this.hsfBtn, Event.CLICK, this, this.buyPropBtnHandler, [1]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateView);
            for (let i: int = 0, len: int = this._sites.length; i < len; i++) {
                this.addAutoListener(this._sites[i], Event.CLICK, this, this.disHandler, [i]);
            }
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {

            let type: number = XianfuModel.instance.selectPetIndex;
            this._petId = XianfuAnimalCfg.instance.ids[type];
            // let name: string = ExteriorSKCfg.instance.getCfgById(this._petId)[ExteriorSKFields.name];
            let name = ""
            let info: UpdateSpiritAnimalTravel = XianfuModel.instance.getPetInfos(this._petId);
            let lv: number = info[UpdateSpiritAnimalTravelFields.level];
            this.titleTxt.text = `${name}Lv.${lv}`;
            let travelCfg: xianfu_travel = XianfuTravelCfg.instance.getCfgById(this._ids[this._currIndex]);
            let awardDescribes: string[] = travelCfg[xianfu_travelFields.awardDescribe];
            let content: string = ``;
            for (let i: int = 0, len: int = awardDescribes.length; i < len; i++) {
                content += `<img src="xianfu/1.png" />` + awardDescribes[i] + `<br/>`;
            }
            let getExp: number = travelCfg[xianfu_travelFields.exp];
            getExp = getExp + Math.floor(getExp * XianfuModel.instance.travelExpAddValue * 0.01);
            this.contentTxt_0.innerHTML = `<img src="xianfu/1.png" />` + `灵兽经验: <span style='color:#168a17'>${getExp}</span>点` + `<br/>` + content;
            let consume: Items = travelCfg[xianfu_travelFields.consume];
            let needNum: number = Math.floor(consume[ItemsFields.count] * (1 - XianfuModel.instance.travelConsumeReduceValue * 0.01));
            let haveNum: number = XianfuModel.instance.treasureInfos(1);
            this._conItem.dataSource = [consume[ItemsFields.itemId], needNum, 0, null];
            this._conItem.setNum(`${CommonUtil.bigNumToString(haveNum)}/${CommonUtil.bigNumToString(needNum)}`, haveNum - needNum >= 0 ? "#FDFDFF" : "#ff7462");

            this._lpId = 0;
            this._isAmulet = false;
            let needTime: number = travelCfg[xianfu_travelFields.time];
            this.timeTxt.text = `${CommonUtil.getTimeTypeAndTime(needTime)}`;
            this.countTxt.innerHTML = `今日还可游历<span style='color:#168a17'>${XianfuModel.instance.maxRuningCount - info[UpdateSpiritAnimalTravelFields.travelCount]}</span>次`;
            if (this._currIndex == 0 || this._currIndex == 1) {
                this.hsfBtn.visible = this.lpBtn.visible = this.hsfAddImg.visible = this.lpAddImg.visible = false;
            } else {
                this.lpBtn.visible = true;
                let lpid: number = travelCfg[xianfu_travelFields.extraItems][0];
                let lpHasNum: number = BagModel.instance.getItemCountById(lpid);
                this.lpBtn.gray = this.lpAddImg.visible = !(lpHasNum > 0);
                this._lpId = this.lpBtn.gray ? 0 : lpid;

                // this.hsfBtn.visible = true;
                // let hsfid:number = travelCfg[xianfu_travelFields.amuletId][0];
                // let hsfHasNum:number = BagModel.instance.getItemCountById(hsfid);
                // this.hsfBtn.gray = this.hsfAddImg.visible = !(hsfHasNum>0);
                // this._isAmulet  = !this.hsfAddImg.visible;
            }
            XianfuModel.instance.selectSite = this._currIndex;
        }

        private disHandler(index: number): void {
            this.frameImg.x = this._sites[index].x - 12;
            this.frameImg.y = this._sites[index].y - 18;
            this._currIndex = index;
            this.updateView();
        }

        private goBtnHandler(): void {
            /*灵兽id*/
            /*范围id*/
            /*额外罗盘id*/
            /*是否使用护身符*/
            let siteId: number = XianfuTravelCfg.instance.ids[XianfuModel.instance.selectSite];
            XianfuCtrl.instance.travel([this._petId, siteId, this._lpId, !!this._isAmulet]);
        }

        private buyPropBtnHandler(index: number): void {
            XianfuModel.instance.selectBuyProp = index;
            WindowManager.instance.open(WindowEnum.XIANFU_PET_BUY_PROP_ALERT);
        }
    }
}
