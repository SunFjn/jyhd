/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.kuanghuan {
    import KuangHuanViewUI = ui.KuangHuanViewUI;
    import CustomList = modules.common.CustomList;
    import KuanghuanNote = Protocols.KuanghuanNote;
    import KuanghuanNoteFields = Protocols.KuanghuanNoteFields;
    import kuanghuan = Configuration.kuanghuan;
    import KuanghuanTask = Protocols.KuanghuanTask;
    import KuanghuanTaskFields = Protocols.KuanghuanTaskFields;
    import Event = laya.events.Event;
    export class KuangHuanPanel extends KuangHuanViewUI {
        //List滑动条
        private _list: CustomList;
        //当前类型
        private _type: number;
        //全民狂欢表
        private _kuanghuanArr: kuanghuan[];
        //倒计时时间
        private _activityTime: number = 0;

        constructor() {
            super();
            this._type = 2;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = KuangHuanItem;
            // this._list.vCount = 7;
            this._list.hCount = 1;
            this._list.width = 640;
            this._list.height = 651;
            this._list.x = 5;
            this._list.y = 12;
            this.itemPanel.addChild(this._list);
            this.centerX = this.centerY = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUANGHUAN, this, this._updateView);
            // this.addAutoListener();
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.activityHandler);
        }

        public onOpened(): void {
            super.onOpened();
            if (KuangHuanModel.instance.openState == 1) {
                KuangHuanCtrl.instance.GetKuanghuanInfo();
                this._updateView();
            }
            this.showUI();
        }
        public showUI() {
            //战力护符 自尊  招财猫
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040);
            }
        }
        public okBtnHandler() {
            //战力护符 自尊  招财猫
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            if (!modules.fight_talisman.FightTalismanModel.instance.state) {
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        private _updateView(): void {
            this.updateItem();
        }

        private updateItem() {
            let nodeList: Array<KuanghuanNote> = KuangHuanModel.instance.nodeList;
            if (nodeList) {
                for (let i: int = 0; i < nodeList.length; i++) {
                    if (nodeList[i][KuanghuanNoteFields.type] !== 1 && nodeList[i][KuanghuanNoteFields.type] !== 9) {
                        this._type = nodeList[i][KuanghuanNoteFields.type];
                        this._activityTime = nodeList[i][KuanghuanNoteFields.restTm] + GlobalData.serverTime;
                    }
                }
                this._kuanghuanArr = KuangHuanCfg.instance.getCfgBytype(this._type);
                this._kuanghuanArr.sort(this.sortFunc.bind(this));
                this._list.datas = this._kuanghuanArr;
                this.setActivitiTime();
            }
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            if (this._activityTime) {
                let isOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.kuanghuan2);
                if (this._activityTime >= GlobalData.serverTime &&
                    isOpen) {
                    this.activityText1.color = "#ffffff";
                    this.activityText.visible = true;
                    this.activityText1.text = "活动倒计时:";
                    this.activityHandler();
                    Laya.timer.loop(1000, this, this.activityHandler);
                } else {
                    this.activityText1.color = "#FF3e3e";
                    this.activityText.visible = false;
                    this.activityText1.text = "活动已结束";
                }
            }
        }

        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(this._activityTime)}`;
            if (this._activityTime < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }



        private sortFunc(a: kuanghuan, b: kuanghuan): number {
            let nodeList: Array<KuanghuanNote> = KuangHuanModel.instance.nodeList;
            let taskList: Array<KuanghuanTask> = [];
            let taskTab: Table<KuanghuanTask> = {};
            for (let i: int = 0; i < nodeList.length; i++) {
                if (this._type == nodeList[i][KuanghuanNoteFields.type]) {
                    taskList = nodeList[i][KuanghuanNoteFields.taskList];
                }
            }
            for (let i: int = 0; i < taskList.length; i++) {
                taskTab[taskList[i][KuanghuanTaskFields.taskId]] = taskList[i];
            }
            let aTaskId: number = a[KuanghuanTaskFields.taskId];
            let bTaskId: number = b[KuanghuanTaskFields.taskId];
            let aState: number = taskTab[aTaskId] ? taskTab[aTaskId][KuanghuanTaskFields.state] : 0;
            let bState: number = taskTab[bTaskId] ? taskTab[bTaskId][KuanghuanTaskFields.state] : 0;
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {
                return aTaskId - bTaskId;
            } else {
                return aState - bState;
            }
        }

        public close(): void {
            super.close();
        }
    }
}