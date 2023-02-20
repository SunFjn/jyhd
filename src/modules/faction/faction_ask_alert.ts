/////<reference path="../$.ts"/>
/** 申请入盟列表弹框 */
namespace modules.faction {
    import CommonEventType = modules.common.CommonEventType;
    import FactionCtrl = modules.faction.FactionCtrl;
    import WindowManager = modules.core.WindowManager;
    import FactionAskAlertUI = ui.FactionAskAlertUI;
    import CustomList = modules.common.CustomList;
    import FactionJoin = Protocols.FactionJoin;
    import FactionJoinFields = Protocols.FactionJoinFields;

    export class FactionAskAlert extends FactionAskAlertUI {

        private _list: CustomList;
        private _cd: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 560;
            this._list.height = 545;
            this._list.hCount = 1;
            this._list.itemRender = FactionAskItem;
            this._list.x = 51;
            this._list.y = 180;
            this._list.spaceY = 5;
            this.addChild(this._list);

            this._cd = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.limitBtn, common.LayaEvent.CLICK, this, this.limitBtnHandler);
            this.addAutoListener(this.flagBtn, common.LayaEvent.CLICK, this, this.flagBtnHandler);
            this.addAutoListener(this.searchBtn, common.LayaEvent.CLICK, this, this.searchBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_JOIN_LIST, this, this.updateList);

            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            FactionCtrl.instance.getFactionJoinList();

            this.updateView();
            this.updateList();
        }

        private updateView(): void {
            this.flagBtn.selected = !FactionModel.instance.examine;
            this._cd = FactionModel.instance.cd;
            this.loopHandler();
            let limit: number = FactionModel.instance.limit;
            if (limit <= 0) {
                this.limitTxt.text = `无限制`;
            } else {
                let limitFight: string = CommonUtil.bigNumToString(limit);
                this.limitTxt.text = `需达到${limitFight}战力`;
            }
        }

        private updateList(): void {
            let list: FactionJoin[] = FactionModel.instance.requestJoinList;
            if (!list) return;
            list = list.concat().sort(this.sortFunc.bind(this));
            this._list.datas = list;
            this.noImg.visible = this.noTxt.visible = !(list.length > 0);
        }

        private sortFunc(l: FactionJoin, r: FactionJoin): number {
            let lFight: number = l[FactionJoinFields.fight];
            let rFight: number = r[FactionJoinFields.fight];
            if (lFight > rFight) {
                return -1;
            } else if (lFight < rFight) {
                return 1;
            } else {
                let lVip: number = l[FactionJoinFields.vip];
                let rVip: number = r[FactionJoinFields.vip];
                if (lVip > rVip) {
                    return -1;
                } else if (lVip < rVip) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        private loopHandler(): void {
            if (FactionModel.instance.cd <= GlobalData.serverTime) {
                this.timeTxt.visible = false;
                return;
            }
            this.timeTxt.visible = true;
            this.timeTxt.text = CommonUtil.timeStampToMMSS(this._cd);
        }

        private limitBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FACTION_JOIN_LIMIT_SET_ALERT);
        }

        private flagBtnHandler(): void {
            FactionCtrl.instance.setExamine([this.flagBtn.selected]);
        }

        private searchBtnHandler(): void {
            FactionCtrl.instance.broadcastRecruit();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        public close(): void {
            super.close();
            WindowManager.instance.open(WindowEnum.FACTION_MANAGE_PANEL);
        }
    }
}
