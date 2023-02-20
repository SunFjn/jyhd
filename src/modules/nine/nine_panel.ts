/** 九天之巅面板*/


namespace modules.nine {
    import NineViewUI = ui.NineViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BagItem = modules.bag.BagItem;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import NineCopy = Protocols.NineCopy;
    import NineCopyFields = Protocols.NineCopyFields;

    export class NinePanel extends NineViewUI {
        private _info: NineCopy;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this.timeTxt.text = BlendCfg.instance.getCfgById(10815)[blendFields.stringParam][0];

            let arr: Array<number> = BlendCfg.instance.getCfgById(10814)[blendFields.intParam];
            let items: Array<BagItem> = [this.item1, this.item2, this.item3, this.item4];
            let len: int = arr.length > items.length ? items.length : arr.length;
            for (let i: int = 0; i < len; i++) {
                items[i].dataSource = [arr[i], 1, 0, null];
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpHandler);
            this.addAutoListener(this.gotoBtn, Laya.Event.CLICK, this, this.gotoHandler);
            this.addAutoListener(this.xnhsBtn, Laya.Event.CLICK, this, this.xnhsBtnHandler);
            this.addAutoListener(this.topAwardBtn, Laya.Event.CLICK, this, this.topAwardHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.NINE_COPY_INFO_UPDATE, this, this.updateHandler);
            this.addAutoRegisteRedPoint(this.fairyRPImg, ["fairyRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateHandler();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        private helpHandler(): void {
            modules.common.CommonUtil.alertHelp(20026);
        }

        private xnhsBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FAIRY_PANEL);
        }

        private gotoHandler(): void {
            DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_nine_copy);
        }

        private topAwardHandler(): void {
            WindowManager.instance.open(WindowEnum.NINE_TOP_AWARD_ALERT);
        }

        private updateHandler(): void {
            this._info = NineModel.instance.nineCopy;
            if (!this._info) return;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();

        }

        private loopHandler(): void {
            if (this._info[NineCopyFields.reEnterTime] < GlobalData.serverTime) {
                this.gotoBtn.visible = true;
                this.enterTimeTxt.visible = false;
                Laya.timer.clear(this, this.loopHandler);
            } else {
                this.gotoBtn.visible = false;
                this.enterTimeTxt.visible = true;
                this.enterTimeTxt.text = `还需等待${Math.ceil((this._info[NineCopyFields.reEnterTime] - GlobalData.serverTime) * 0.001)}秒才可进入`;
            }
        }
    }
}