///<reference path="../config/xianfu_decorate_cfg.ts"/>
/** 仙府-家园灵兽游历中弹框 */
namespace modules.xianfu {
    import XianfuPetTravelingAlertUI = ui.XianfuPetTravelingAlertUI;
    import XianfuAnimalCfg = modules.config.XianfuAnimalCfg;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import XianfuCfg = modules.config.XianfuCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import UpdateSpiritAnimalTravel = Protocols.UpdateSpiritAnimalTravel;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import xianfu_travel = Configuration.xianfu_travel;
    import XianfuTravelCfg = modules.config.XianfuTravelCfg;
    import xianfu_travelFields = Configuration.xianfu_travelFields;
    import Event = Laya.Event;
    import weightItem = Configuration.weightItem;
    import Item = Protocols.Item;
    import weightItemFields = Configuration.weightItemFields;
    import BaseItem = modules.bag.BaseItem;
    import CommonUtil = modules.common.CommonUtil;

    export class XianfuPetTravelingAlert extends XianfuPetTravelingAlertUI {

        private _cdTime: number;
        private _state: number;
        private _petId: number;
        private _items: Array<BaseItem>;
        private _travelTxtlastY: number;

        protected initialize(): void {
            super.initialize();

            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.leading = 5;

            this.awardTxt.color = "#2d2d2d";
            this.awardTxt.style.fontFamily = "SimHei";
            this.awardTxt.style.fontSize = 24;
            this.awardTxt.style.leading = 5;

            this._items = [];
            for (let i: int = 0; i < 2; i++) {
                let item: BaseItem = new BaseItem();
                item.y = 368;
                item.nameVisible = false;
                this.addChild(item);
                this._items.push(item);
            }

            this._travelTxtlastY = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.contentTxt, Event.MOUSE_DOWN, this, this.downHandler);
            this.addAutoListener(this.contentTxt, Event.MOUSE_WHEEL, this, this.wheelHandler);
            this.addAutoListener(this.endBtn, Event.CLICK, this, this.endBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_PET_UPDATE, this, this.updateView);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        private downHandler(): void {
            this._travelTxtlastY = this.contentTxt.mouseY;
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
            this.contentTxt.y = this.contentTxt.y - offset;
            if (this.contentTxt.y < this.contentPanel.height - this.contentTxt.height) {
                this.contentTxt.y = this.contentPanel.height - this.contentTxt.height;
                this._travelTxtlastY = this.contentTxt.y;
            } else if (this.contentTxt.y > 0) {
                this._travelTxtlastY = this.contentTxt.y = 0;
            }
        }

        private moveHandler(): void {
            let offset: number = this._travelTxtlastY - this.contentTxt.mouseY;
            this.scroll(offset);
            this._travelTxtlastY = this.contentTxt.mouseY;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let type: number = XianfuModel.instance.selectPetIndex;
            this._petId = XianfuAnimalCfg.instance.ids[type];
            // let name: string = ExteriorSKCfg.instance.getCfgById(this._petId)[ExteriorSKFields.name];
            let info: UpdateSpiritAnimalTravel = XianfuModel.instance.getPetInfos(this._petId);
            let speaksInfo: number[] = info[UpdateSpiritAnimalTravelFields.list];
            let rangeId: number = info[UpdateSpiritAnimalTravelFields.rangeId];
            if (!rangeId) {
                return;
            }
            let travelCfg: xianfu_travel = XianfuTravelCfg.instance.getCfgById(rangeId);
            let startSpeak: string = travelCfg[xianfu_travelFields.startStr];
            let endSpeak: string = travelCfg[xianfu_travelFields.endStr];
            let rangeName: string = travelCfg[xianfu_travelFields.rangeName];
            let lv: number = info[UpdateSpiritAnimalTravelFields.level];
            // this.titleTxt.text = `${name} Lv.${lv}`;
            this.titleTxt.text = `Lv.${lv}`;
            this._state = info[UpdateSpiritAnimalTravelFields.state];
            let openCfg: Configuration.xianfu = XianfuCfg.instance.getCfgByPetId(this._petId);
            let speaks: string[] = openCfg[Configuration.xianfuFields.speak];
            let speaksStr: string = startSpeak;
            for (let i: int = 0, len: int = speaksInfo.length; i < len; i++) {
                speaksStr += `<br/>` + `${speaks[speaksInfo[i]]}`;
            }
            if (this._state == 1) { //游历中
                this.contentTxt.innerHTML = speaksStr;
                this._items[0].visible = this._items[1].visible = false;
                this._cdTime = info[UpdateSpiritAnimalTravelFields.time];
                this.timeTxt.text = CommonUtil.timeStampToHHMMSS(this._cdTime);
                this.goingBox.visible = true;
                this.endBtn.y = 570;
                this.height = this.bgImg.height = 685;
                this.endBtn.label = `立即结束`;
                this.endPosTxt.text = rangeName;
                let awardDescribes: string[] = travelCfg[xianfu_travelFields.awardDescribe];
                let getExp: number = travelCfg[xianfu_travelFields.exp];
                getExp = getExp + Math.floor(getExp * XianfuModel.instance.travelExpAddValue * 0.01);
                let content: string = `<img src="xianfu/1.png" />` + `灵兽经验: <span style='color:#168a17'>${getExp}</span>点` + `<br/>`;
                for (let i: int = 0, len: int = awardDescribes.length; i < len; i++) {
                    content += `<img src="xianfu/1.png" />` + awardDescribes[i] + `<br/>`;
                }
                this.awardTxt.innerHTML = content;
                this.awardTxt.visible = true;
            } else { //游历回来
                this.awardTxt.visible = this.goingBox.visible = false;
                this.endBtn.y = 500;
                this.height = this.bgImg.height = 620;
                this.endBtn.label = `领取`;
                this.contentTxt.innerHTML = speaksStr + `<br/>` + endSpeak;
                let items: Item[] = [];
                //沿途礼包索引
                let passBackIndex: number = info[UpdateSpiritAnimalTravelFields.passByPack];
                //终点礼包索引
                let endBackIndex: number = info[UpdateSpiritAnimalTravelFields.endPack];
                let passBacks: Array<weightItem> = travelCfg[xianfu_travelFields.passByPack];
                let endBacks: Array<weightItem> = travelCfg[xianfu_travelFields.endPack];
                if (passBacks[passBackIndex][weightItemFields.itemId]) {
                    let item: Item = [passBacks[passBackIndex][weightItemFields.itemId], passBacks[passBackIndex][weightItemFields.count], 0, null];
                    items.push(item);
                }
                console.log(`endBackIndex---${endBackIndex}`);
                console.log(`endBacks.length---${endBacks.length}`);
                if (endBacks[endBackIndex][weightItemFields.itemId]) {
                    let item: Item = [endBacks[endBackIndex][weightItemFields.itemId], endBacks[endBackIndex][weightItemFields.count], 0, null];
                    items.push(item);
                }
                if (items.length == 1) {
                    let item: BaseItem = this._items[0];
                    item.dataSource = items[0];
                    this._items[0].visible = true;
                    this._items[1].visible = false;
                    item.x = 281;
                } else {
                    this._items[0].visible = this._items[1].visible = true;
                    this._items[0].dataSource = items[0];
                    this._items[1].dataSource = items[1];
                    this._items[0].x = 180;
                    this._items[1].x = 380;
                }
            }
            this.hintCloseTxt.y = this.height + 50;
            this.contentTxt.style.height = this.contentTxt.contextHeight;
            if (this.contentTxt.height > this.contentPanel.height) {
                this.contentTxt.y = this.contentPanel.height - this.contentTxt.height;
            } else {
                this._travelTxtlastY = this.contentTxt.y = 0;
            }
        }

        private endBtnHandler(): void {
            if (this._state == 1) { //游历中
                WindowManager.instance.open(WindowEnum.XIANFU_PET_AT_ONCE_END_ALERT);
            } else {//游历结束 领取
                XianfuCtrl.instance.getTravelAward([this._petId]);
            }
            this.close();
        }

        private loopHandler(): void {
            if (this._cdTime <= 0) {
                this.timeTxt.visible = false;
                return;
            } else {
                this.timeTxt.visible = true;
                this.timeTxt.text = `${CommonUtil.timeStampToHHMMSS(this._cdTime)}`;
            }
        }
    }
}
