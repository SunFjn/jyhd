/////<reference path="../$.ts"/>
/** 仙盟福利面板 */
namespace modules.$ {
    import CommonUtil = modules.common.CommonUtil;
    import WindowManager = modules.core.WindowManager;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BtnGroup = modules.common.BtnGroup;
    import FactionWealViewUI = ui.FactionWealViewUI;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Item = Protocols.Item;
    import FactionModel = modules.faction.FactionModel;
    import GetFactionTurnReply = Protocols.GetFactionTurnReply;
    import FactionCtrl = modules.faction.FactionCtrl;
    import GetFactionTurnReplyFields = Protocols.GetFactionTurnReplyFields;
    import HTMLDivElement = laya.html.dom.HTMLDivElement;
    import FactionTurnRecord = Protocols.FactionTurnRecord;
    import FactionTurnRecordFields = Protocols.FactionTurnRecordFields;
    import ItemFields = Protocols.ItemFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class FactionWealPanel extends FactionWealViewUI {

        private _angleArr: number[];  //10个最终结果的角度
        private _btnGroup: BtnGroup;
        private _showItems: Array<BaseItem>;
        private _proCtrl: ProgressBarCtrl;
        private _sevTexts: Array<HTMLDivElement>;
        private _sevShowLen: number;
        private _txtContens: string[];
        private _itemDatas: Item[];
        private _tweenJS: TweenJS;
        private _turnIndex: number;
        private _index: number;
        private _isTen: boolean;
        private _eff: CustomClip;
        private _loopTxtSpaceY: number;

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this._angleArr = [];
            for (let i: int = 0; i < 10; i++) {
                this._angleArr.push(36 * i);
            }

            let params: number[] = BlendCfg.instance.getCfgById(36033)[blendFields.intParam];
            this._itemDatas = [];
            for (let i: int = 0, len: int = params.length; i < len; i += 3) {
                this._itemDatas.push([params[i], params[i + 1], 0, null]);
            }

            this._showItems = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6, this.item7, this.item8, this.item9, this.item10];
            for (let i: int = 0, len: int = this._showItems.length; i < len; i++) {
                this._showItems[i].dataSource = this._itemDatas[i];
            }

            this._proCtrl = new ProgressBarCtrl(this.barImg, this.barImg.width, this.barTxt);
            let maxValue: number = BlendCfg.instance.getCfgById(36031)[blendFields.intParam][0];
            this._proCtrl.maxValue = maxValue;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.btnGroup_0, this.btnGroup_1);

            this._sevTexts = [];
            this._txtContens = [];
            this._sevShowLen = 4;
            this._loopTxtSpaceY = 200;
            for (let i = 0; i < this._sevShowLen; i++) {
                let text = new laya.html.dom.HTMLDivElement();
                text.width = 280;
                text.style.height = this._loopTxtSpaceY;
                text.pos(0, i * this._loopTxtSpaceY);
                text.style.fontFamily = "SimHei";
                text.style.fontSize = 20;
                text.style.wordWrap = true;
                this._sevTexts.push(text);
                this.severPanel.addChild(text);
            }
            this.updateSeverList();

            this._turnIndex = 0;

            this._eff = CommonUtil.creatEff(this, `ok_state`, 7);
            this._eff.pos(-80, -70);
            this.awardBK.addChild(this._eff);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.updateView);
            this._btnGroup.selectedIndex = 1;

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_WEAL_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_TURN_LIST, this, this.updateRecordList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_TURN_RESULT, this, this.turnResultHandler);
            this.addAutoListener(this.oneBtn, common.LayaEvent.CLICK, this, this.turnBtnHandler, [1]);
            this.addAutoListener(this.tenBtn, common.LayaEvent.CLICK, this, this.turnBtnHandler, [10]);
            this.addAutoListener(this.awardBtn, common.LayaEvent.CLICK, this, this.awardBtnHandler);

            this.addAutoRegisteRedPoint(this.wealRPImg, ["factionDialRP"]);
            this.addAutoRegisteRedPoint(this.skillRPImg, ["factionSkillRP"]);

            Laya.timer.frameLoop(1, this, this.updateSeverList);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.updateSeverList);
        }

        public onOpened(): void {
            super.onOpened();

            FactionCtrl.instance.getFactionTurn();
            FactionCtrl.instance.getFactionTurnRecord();

            this.frameImg.rotation = this._angleArr[this._index];
            this.frameImg.visible = false;

            this.updateView();
        }

        private turnBtnHandler(time: number): void {
            let item: Items = this.getNeedProp(time);
            if (!item) {
                if (this._tweenJS && this._tweenJS.isPlaying) {
                    SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
                    return;
                }
                FactionCtrl.instance.factionTurn(time);
            } else {
                let needItemId: number = item[ItemsFields.itemId];
                let needItemCount: number = item[ItemsFields.count];
                let haveCount: number = CommonUtil.getPropCountById(needItemId);
                if (haveCount >= needItemCount) {
                    FactionCtrl.instance.factionTurn(time);
                } else {
                    bag.BagUtil.openLackPropAlert(needItemId, needItemCount - haveCount);
                }
            }
        }

        private turnResultHandler(): void {
            let awardList: number[] = FactionModel.instance.turnResult;
            this._isTen = awardList.length > 1;
            if (this._isTen) { //如果是10次
                WindowManager.instance.open(WindowEnum.FACTION_TEN_ALERT, awardList);
                return;
            }
            this._index = awardList[awardList.length - 1];
            if (this._tweenJS) this._tweenJS.stop();
            this._tweenJS =
                TweenJS.create(this).to({ turnToIndex: this._showItems.length * 6 + this._index },
                    4000).start().onStart(() => {
                        this.frameImg.visible = true;
                    }).easing(utils.tween.easing.quadratic.InOut).onUpdate(() => {
                        this.frameImg.rotation = this._angleArr[this.turnToIndex];
                    }).onComplete(() => {
                        CommonUtil.delayedPutInBag();
                        this._tweenJS.stop();
                        this._tweenJS = null;
                    });
        }

        public set turnToIndex(index: number) {
            this._turnIndex = index;
        }

        public get turnToIndex(): number {
            return Math.floor(this._turnIndex) % this._showItems.length;
        }

        private updateView(): void {
            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.FACTION_SKILL_PANEL);
                return;
            } else {
                let info: GetFactionTurnReply = FactionModel.instance.dialInfo;
                if (!info) return;
                this._proCtrl.value = info[GetFactionTurnReplyFields.blessing];
                let freeCount: number = info[GetFactionTurnReplyFields.freeCount];
                let needItemId: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][0];
                let needItemCount: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][1];
                let haveCount: number = CommonUtil.getPropCountById(needItemId);
                if (freeCount <= 0) { //免费次数已经领完  要显示消耗
                    this.oneBtn.label = `转一次`;
                    this.onePropBox.visible = true;
                    this.onePropTxt.text = `${haveCount}/${needItemCount}`;
                    this.onePropTxt.color = haveCount >= needItemCount ? `#168a17` : `#ff3e3e`;
                } else {
                    this.oneBtn.label = `免费`;
                    this.onePropBox.visible = false;
                }
                this.onePropImg.skin = this.tenPropImg.skin = CommonUtil.getIconById(needItemId, true);
                this.tenPropTxt.text = `${haveCount}/${needItemCount * 10}`;
                this.tenPropTxt.color = haveCount >= needItemCount * 10 ? `#168a17` : `#ff3e3e`;

                let getCount: number = info[GetFactionTurnReplyFields.getCount];
                if (getCount) {
                    this._eff.visible = true;
                    this._eff.play();
                } else {
                    this._eff.visible = false;
                    this._eff.stop();
                }
            }
        }

        private getNeedProp(time: number): Items {
            let info: GetFactionTurnReply = FactionModel.instance.dialInfo;
            if (!info) return;
            let freeCount: number = info[GetFactionTurnReplyFields.freeCount];
            let needItemId: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][0];
            let needItemCount: number = BlendCfg.instance.getCfgById(36030)[blendFields.intParam][1];
            let haveCount: number = CommonUtil.getPropCountById(needItemId);

            if (time == 1) {
                return freeCount > 0 ? null : [needItemId, needItemCount - haveCount];
            } else {
                needItemCount = needItemCount * 10;
                if (haveCount >= needItemCount) { //免费次数已经领完  要显示消耗
                    return null;
                } else {
                    return [needItemId, needItemCount];
                }
            }
        }

        private updateSeverList(): void {
            if (this._txtContens.length > 0) {
                for (let i = 0; i < this._sevTexts.length; i++) {
                    this._sevTexts[i].y -= 1 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 2 : 1);
                    if (this._sevTexts[i].y <= -(this._loopTxtSpaceY + 1)) {
                        this._sevTexts[i].y = this.severPanel.height + 1;
                        if (this._sevShowLen < this._txtContens.length) {
                            this._sevShowLen++;
                            this._sevTexts[i].innerHTML = this._txtContens[this._sevShowLen - 1];
                        } else {
                            this._sevShowLen = 1;
                            this._sevTexts[i].innerHTML = this._txtContens[this._sevShowLen - 1];
                        }
                    }
                }
            }
        }

        private updateRecordList() {
            let svrList: Array<FactionTurnRecord> = FactionModel.instance.turnList;
            if (!svrList) return;
            if (svrList.length > 0) {
                if (this._txtContens.length > 0) {
                    this._txtContens.length = 0;
                }
                svrList.reverse();//最新的数据在后面 翻转下
                let len: number = svrList.length > this._sevTexts.length ? svrList.length : this._sevTexts.length;
                for (let i = 0; i < len; i++) {
                    let content: string;
                    if (svrList[i]) {
                        let name: string = svrList[i][FactionTurnRecordFields.name];
                        let index: number = svrList[i][FactionTurnRecordFields.index];
                        if (!this._itemDatas[index]) continue;
                        let itemId: number = this._itemDatas[index][ItemFields.ItemId];
                        let itemName: string = ItemMaterialCfg.instance.getItemCfgById(itemId)[item_materialFields.name];
                        let itemCount: number = this._itemDatas[index][ItemFields.count];
                        let itemColor: string = CommonUtil.getColorById(itemId);
                        content = "<span style='color:#585858;'>天赐鸿福,</span>";
                        content += `<span style='color:rgb(13,121,255);'>${name}</span>`;
                        content += "<span style='color:#585858;'>获得了</span><br/>";
                        content += `<span style='color:${itemColor};'>${itemName}*${itemCount}</span>`;
                    } else {
                        content = `<br/>`;
                    }
                    this._txtContens.push(content);
                }
            }
        }

        private awardBtnHandler(): void {
            let getCount: number = FactionModel.instance.dialInfo[GetFactionTurnReplyFields.getCount];
            if (getCount) {  //可以领 就领啊 垃圾
                FactionCtrl.instance.getBlessAward();
            } else {
                let params: number[] = BlendCfg.instance.getCfgById(36032)[blendFields.intParam];
                let data: Item = [params[0], params[1], 0, null];
                WindowManager.instance.open(WindowEnum.COMMON_ITEMS_ALERT, [[data], `奖励预览`]);
            }
        }

        public close(): void {
            if (this._tweenJS) {
                this._tweenJS.stop();
            }
            CommonUtil.delayedPutInBag();
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._angleArr) {
                this._angleArr.length = 0;
                this._angleArr = null;
            }
            if (this._txtContens) {
                this._txtContens.length = 0;
                this._txtContens = null;
            }
            if (this._itemDatas) {
                this._itemDatas.length = 0;
                this._itemDatas = null;
            }
            if (this._tweenJS) {
                this._tweenJS.stop();
                this._tweenJS = null;
            }
            this._eff = this.destroyElement(this._eff);
            this._sevTexts = this.destroyElement(this._sevTexts);
            this._proCtrl = this.destroyElement(this._proCtrl);
            this._showItems = this.destroyElement(this._showItems);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy(destroyChild);
        }
    }
}
