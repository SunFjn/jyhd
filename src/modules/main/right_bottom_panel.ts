///<reference path="../mission/mission_model.ts"/>
///<reference path="../config/scene_copy_tianguan_cfg.ts"/>
///<reference path="../mission/mission_ctrl.ts"/>


/** 主界面右下面板*/
namespace modules.main {
    import RightBottomViewUI = ui.RightBottomViewUI;
    import Layer = ui.Layer;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class RightBottomPanel extends RightBottomViewUI {

        //奇遇 日常 副本 boss 竞技
        private _enterIdArr: number[];
        private _showIdArr: number[];
        private _hiddenIdArr: number[];
        private _btnTab: Table<EnterItem>;

        private _tween: TweenJS;

        constructor() {
            super();
        }

        protected initialize() {
            super.initialize();

            this.right = 0;
            if (Main.instance.isWXChannel) {
                this.top = 550;
            } else {
                this.top = 610;
            }
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this._showIdArr = [];
            this._hiddenIdArr = [];
            this._enterIdArr = [ActionOpenId.daily, ActionOpenId.adventureEnter, ActionOpenId.copy, ActionOpenId.sports, ActionOpenId.ClanEntry];/*, ActionOpenId.boss ActionOpenId.xianFuEnter,*/
            this._btnTab = {};

            this.updateShowId();
            // localStorage.setItem("ranktime");
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.showBtnHandler);
        }

        protected removeListeners(): void {

            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();

            this.showBtnHandler();

            this.right = 30;
            if (this._tween) this._tween.stop();
            this._tween = TweenJS.create(this).to({ right: -50 }, CommonConfig.panelTweenDuration).onComplete(() => {
                GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_RESIZE_UI);
            }).start();
        }

        public close(): void {
            this._tween.stop();
            this._tween = TweenJS.create(this).to({ right: 30 }, CommonConfig.panelTweenDuration).onComplete((): void => {
                super.close();
            }).start();
        }

        protected updateShowId(): void {

            this._showIdArr = [];
            this._hiddenIdArr = [];

            for (let i: int = 0, len: int = this._enterIdArr.length; i < len; i++) {
                let id = this._enterIdArr[i];
                if (FuncOpenModel.instance.getFuncStateById(id) === -1) continue;
                if (FuncOpenModel.instance.getFuncNeedShow(id)) {
                    this._showIdArr.push(id);
                } else {
                    this._hiddenIdArr.push(id);
                }
            }
        }

        protected showBtnHandler(): void {
            this.updateShowId();
            let spaceY = this._showIdArr.length <= 6 ? 68 : 60;

            for (let i: int = 0, len: int = this._showIdArr.length; i < len; i++) {
                let id = this._showIdArr[i];
                if (!this._btnTab[id]) {
                    let btn = new EnterItem(id);
                    this.addChild(btn);
                    this._btnTab[id] = btn;
                }
                // this._btnTab[id].pos(0, i * 65);
                this._btnTab[id].pos(0, i * spaceY);
                this._btnTab[id].visible = true;

            }

            for (let i: int = 0, len: int = this._hiddenIdArr.length; i < len; i++) {
                let id = this._hiddenIdArr[i];
                if (this._btnTab[id])
                    this._btnTab[id].visible = false;
            }
            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_RESIZE_UI);
        }

        destroy(destroyChild: boolean = true): void {
            this._showIdArr.length = 0;
            this._showIdArr = null;
            this._hiddenIdArr.length = 0;
            this._hiddenIdArr = null;
            this._enterIdArr.length = 0;
            this._enterIdArr = null;
            this._btnTab = null;
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            super.destroy(destroyChild);
        }
    }
}
