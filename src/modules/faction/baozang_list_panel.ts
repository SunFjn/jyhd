/////<reference path="../$.ts"/>
/** 宝藏列表 */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import WindowManager = modules.core.WindowManager;
    import FactionModel = modules.faction.FactionModel;
    import FactionBoxFields = Protocols.FactionBoxFields;
    import BaozangListViewUI = ui.BaozangListViewUI;
    import CustomList = modules.common.CustomList;
    import GetBoxInfoReply = Protocols.GetBoxInfoReply;
    import FactionBox = Protocols.FactionBox;
    import GetBoxInfoReplyFields = Protocols.GetBoxInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class BaozangListPanel extends BaozangListViewUI {

        private _list: CustomList;
        private _time: number;
        private _searchBoxId: string;
        private _freeTime: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 40;
            this._list.y = 237;
            this._list.width = 636;
            this._list.height = 705;
            this._list.hCount = 1;
            this._list.itemRender = BaozangItem;
            this._list.spaceY = 5;
            this.addChild(this._list);

            this._freeTime = this._time = 0;

            this.freeCDTxt.color = "#ffffff";
            this.freeCDTxt.style.fontFamily = "SimHei";
            this.freeCDTxt.style.fontSize = 26;
            this.freeCDTxt.mouseEnabled = false;
            this.freeCDTxt.style.wordWrap = false;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_INFO_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_INFO_UPDATE, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_LIST_UPDATE, this, this.updateList);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAOZANG_HELP_LIST_UPDATE, this, this.updateF5Time);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);

            Laya.timer.loop(1000, this, this.updateF5);
            Laya.timer.loop(1000, this, this.updateFree);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.updateF5);
            Laya.timer.clear(this, this.updateFree);
        }

        protected setOpenParam(boxId: string): void {
            super.setOpenParam(boxId);

            this._searchBoxId = boxId;
        }

        public onOpened(): void {
            super.onOpened();

            FactionCtrl.instance.getBoxInfo();
            FactionCtrl.instance.getBoxList();
            FactionCtrl.instance.getAssistBoxList();

            this.updateView();
            this.updateList();
            this.updateF5Time();
        }

        private updateView(): void {
            let info: GetBoxInfoReply = FactionModel.instance.boxInfo;
            if (!info) return;
            let maxTime: number = BlendCfg.instance.getCfgById(36014)[blendFields.intParam][0];
            let remainTime: number = maxTime - info[GetBoxInfoReplyFields.openCount];
            this.remainTimeTxt.text = `${remainTime}`;
            this.remainTimeTxt.color = remainTime > 0 ? `#168a17` : `#ff3e3e`;
            let freeCount: number = info[GetBoxInfoReplyFields.freeCount];
            this.freeTimeTxt.text = `${freeCount}`;

            this._freeTime = info[GetBoxInfoReplyFields.freeCountCD];
            this.updateFree();

            let maxF5Count: number = BlendCfg.instance.getCfgById(36011)[blendFields.intParam][0];
            let freeF5Count: number = info[GetBoxInfoReplyFields.freeF5Count];
            if (freeF5Count < maxF5Count) {  //有免费刷新次数
                this.f5TimeTxt.text = `免费刷新次数:${maxF5Count - freeF5Count}`;
                this.f5TimeTxt.visible = true;
                this.propBox.visible = false;
            } else {
                this.f5TimeTxt.visible = false;
                this.propBox.visible = true;
                let needPropId: number = BlendCfg.instance.getCfgById(36012)[blendFields.intParam][0];
                let needPropCount: number = BlendCfg.instance.getCfgById(36012)[blendFields.intParam][1];
                let haveCount: number = CommonUtil.getPropCountById(needPropId);
                this.propImg.skin = CommonUtil.getIconById(needPropId, true);
                this.propTxt.text = CommonUtil.bigNumToString(needPropCount);
                this.propTxt.color = haveCount >= needPropCount ? `#ffffff` : `#ff3e3e`;
            }
        }

        private updateF5Time(): void {
            let time: number = FactionModel.instance.boxListF5Time;
            if (time == null) return;
            this._time = time;
            this.updateF5();
        }

        private updateList(): void {
            let list: Array<FactionBox> = FactionModel.instance.boxList;
            if (!list) return;
            let info: GetBoxInfoReply = FactionModel.instance.boxInfo;
            if (!info) return;
            // list = list.concat().sort(FactionModel.instance.sortByQuality.bind(this));
            let datas: [FactionBox, BAOZANG_ITEM_TYPE][] = [];
            let index: number;
            for (let i: int = 0; i < list.length; i++) {
                datas.push([list[i], BAOZANG_ITEM_TYPE.LIST]);
                let id: string = list[i][FactionBoxFields.id];
                if (id == this._searchBoxId) {
                    index = i;
                }
            }
            this._list.datas = datas;

            if (index != null) {
                this._list.scrollToIndex(index);
            }
        }

        private btnHandler(): void {

            let flag: boolean = false;
            let datas: [FactionBox, BAOZANG_ITEM_TYPE][] = this._list.datas;
            for (let i: int = 0, len: int = datas.length; i < len; i++) {
                let ele: FactionBox = datas[i][0];
                let color: FactionBoxColor = ele[FactionBoxFields.color];
                if (color >= FactionBoxColor.orange) {
                    flag = true;
                    break;
                }
            }
            if (FactionModel.instance.isTipF5Alert && flag) {
                WindowManager.instance.open(WindowEnum.BAOZANG_F5_ALERT);
            } else {
                FactionCtrl.instance.f5Box();
            }
        }

        private updateF5(): void {
            this.timeTxt.text = `自动刷新倒计时: ${CommonUtil.timeStampToHHMMSS(this._time)}`;
        }

        private updateFree(): void {
            let result: boolean = GlobalData.serverTime >= this._freeTime;
            this.freeTimeBox.visible = result;
            this.freeCDTxt.visible = !result;
            if (!result) { //倒计时没结束
                let str: string = `免费挖掘:<span style='color:#ffffff'>${CommonUtil.timeStampToHHMMSS(this._freeTime)}后恢复1次</span>`;
                this.freeCDTxt.innerHTML = str;
                CommonUtil.centerChainArr(720, [this.freeCDTxt]);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}
