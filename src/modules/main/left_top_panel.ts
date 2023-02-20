///<reference path="../scene/scene_model.ts"/>
///<reference path="../buff/buff_model.ts"/>
///<reference path="../sound/sound_ctrl.ts"/>
///<reference path="../main/left_top_rp_config.ts"/>


/** 主界面左上面板*/
namespace modules.main {
    import LeftTopRPConfig = main.LeftTopRPConfig;
    import PlayerModel = modules.player.PlayerModel;
    import LeftTopViewUI = ui.LeftTopViewUI;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import Layer = ui.Layer;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import MonthCardModel = modules.monthCard.MonthCardModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import action_open = Configuration.action_open;

    export class LeftTopPanel extends LeftTopViewUI {

        private _idArr: number[];
        private _hiddenBtnId: number[];
        private _btnTab: Table<ActivityIconItem>;
        private _sceneType: number;
        private _tween: TweenJS;

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.top = 128;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this._btnTab = {};
            this._sceneType = 0;

            this.foldBtn.visible = false;
            this.unfoldBtn.visible = true;
            this.foldBtn.hitArea = new Laya.Rectangle(0, -10, this.foldBtn.width + 25, this.foldBtn.height + 20);
            this.unfoldBtn.hitArea = new Laya.Rectangle(0, -10, this.unfoldBtn.width + 25, this.unfoldBtn.height + 20);

            this.showBtnId();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.foldBtn, common.LayaEvent.CLICK, this, this.selectShow, [0]);
            this.addAutoListener(this.unfoldBtn, common.LayaEvent.CLICK, this, this.selectShow, [1]);

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SHOW_PAY_STATUS, this, this.wxIosPayShow);      //微信ios支付显示
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.enterScene);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_MONTH_CARD_INFO_REPLY, this, this.showBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_MONTH_CARD_INFO, this, this.showBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.showNobleBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RED_POINT, this, this.checkRedPoint);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
        }

        protected removeListeners(): void {

            RedPointCtrl.instance.retireRedPoint(this.operateRPImg);
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();
            this.enterScene();
            this.showNobleBtn();
            this.checkRedPoint();
            this.setActionPreviewPos();

            if (Main.instance.isWXChannel) {
                this.y = 112;
            }
            DawData.ins.isShow();//判断显示区长战力分红 只判断一次
        }

        /**
         * 存储对应功能预览 对应的飞入点
         */
        public setActionPreviewPos() {
            this.callLater(this.setPosActionPreview);
        }

        public setPosActionPreview() {
            // Point.TEMP.setTo(this.vipBox.width / 2, this.vipBox.height / 2);
            // let pos = this.vipBox.localToGlobal(Point.TEMP, true);
            // modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.vip, pos);

            // Point.TEMP.setTo(this.nobleBtn.width / 2, this.nobleBtn.height / 2);
            // let pos1 = this.nobleBtn.localToGlobal(Point.TEMP, true);
            // modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.recharge, pos1);
        }

        public close(): void {
            super.close();
            if (this._tween) this._tween.stop();
        }

        private selectShow(value: int): void {
            console.log("点击切换tab")
            this.foldBtn.visible = this.unfoldBtn.visible = true;
            value ? this.unfoldBtn.visible = false : this.foldBtn.visible = false;
            this.showBtnHandler();
        }

        private checkRedPoint(): void {
            if (this.unfoldBtn.visible) {
                let rps: Array<keyof ui.LTIocnRP> = [];
                for (let i: int = 0, len: int = this._hiddenBtnId.length; i < len; i++) {
                    let funcId: number = this._hiddenBtnId[i];
                    let tempRps: Array<keyof ui.LTIocnRP> = LeftTopRPConfig.instance.getRps(funcId);
                    if (!tempRps) continue;
                    rps.push(...tempRps);
                }
                RedPointCtrl.instance.registeRedPoint(this.operateRPImg, rps);
            } else {
                RedPointCtrl.instance.retireRedPoint(this.operateRPImg);
                this.operateRPImg.visible = false;
            }
        }

        //获取要显示的功能ID
        private showBtnId(): void {

            this._hiddenBtnId = [];
            this._idArr = [];
            let operatorCfgArr = ActionOpenCfg.instance.getOperatorCfg();
            // console.log("operatorCfgArr", operatorCfgArr)
            for (let i: int = 0, len: int = operatorCfgArr.length; i < len; i++) {
                let id = operatorCfgArr[i][action_openFields.id];
                if (Main.instance.isWXiOSPay) {
                    // wxios需要隐藏
                    if (Main.instance.isWXiOSPayFunId.indexOf(id)>=0) {
                        // console.log('vtz:id',id);
                        continue;
                    }
                }
                        // console.log('vtz:----id',id);
                        // console.log("活动id", id, FuncOpenModel.instance.getFuncStateById(id))
                if (id == ActionOpenId.levelhb || id == ActionOpenId.superhb) {//370 372移到左上角这不显示
                    continue;
                }
                if (FuncOpenModel.instance.getFuncStateById(id) === -1) {
                    switch (id) {
                        // 299 300 301 移到左下角的面板去了
                        case 302:
                        case 315:   //九霄令
                            break;
                        default:
                            this._idArr.push(id);
                            break;
                    }

                } else {
                    let isShow: boolean = this.judgeIsShow(id);
                    // console.log(id, "活动 isshow", isShow)
                    if (isShow) {
                        if (this.unfoldBtn.visible) {  //运营按钮关闭 收起状态
                            if (operatorCfgArr[i][action_openFields.hidden] && this._sceneType == 0) {  //不隐藏的显示
                                this._idArr.push(id);
                            } else {
                                this._hiddenBtnId.push(id);
                            }
                        } else {     //运营按钮打开 无脑显示
                            this._idArr.push(id);
                        }
                    } else {
                        this._hiddenBtnId.push(id);
                    }
                }
            }

            let tempIdArr: number[] = this._idArr.concat();
            for (let i: number = 0, len: number = this._idArr.length; i < len; i++) {
                this.creatActivityBtn(tempIdArr[i]);
                if (this._idArr[i] == ActionOpenId.monthCard && MonthCardModel.instance.flag == 1) {
                    this._hiddenBtnId.push(this._idArr[i]);
                    this._idArr.splice(i, 1);
                }
            }

            // this._idArr.push(349);
            this._idArr = this._idArr.sort(this.sortFunc);
            // console.log("@@@ 要显示的活动ID:",this._idArr.join(","));

            this._hiddenBtnId = this._hiddenBtnId.sort(this.sortFunc);
            // console.log("@@@ 要隐藏的活动ID:",this._hiddenBtnId.join(","));
        }

        private judgeIsShow(id: number): boolean {
            let isShow: boolean = false;
            if (FuncOpenModel.instance.getFuncNeedShow(id)) { //不论其他 入口功能开了才可以判断
                let cfg: action_open = ActionOpenCfg.instance.getCfgById(id);
                let subs: number[] = cfg[action_openFields.subfunctions];
                let isSub: boolean = subs.length > 0;
                if (isSub) {//是入口功能 就判断子功能全部开启
                    let flag: boolean = false;
                    for (let id of subs) {
                        if (FuncOpenModel.instance.getFuncNeedShow(id)) {
                            flag = true;
                            break;
                        }
                    }
                    isShow = flag;
                } else {
                    isShow = true;
                }
            }
            return isShow;
        }

        private showBtnHandler(): void {

            this.showBtnId();
            let alignNum = 6;

            for (let i: int = 0, len: int = this._idArr.length; i < len; i++) {
                let id = this._idArr[i];
                this.creatActivityBtn(id);
                this._btnTab[id].pos(600 - (i % alignNum) * 74, 14 + Math.floor(i / alignNum) * 75);
                this.addChild(this._btnTab[id]);
            }

            for (let i: int = 0, len: int = this._hiddenBtnId.length; i < len; i++) {
                let id = this._hiddenBtnId[i];
                if (this._btnTab[id]) {
                    this._btnTab[id].destroy(true);
                    delete this._btnTab[id];
                }
            }
            this.checkRedPoint();
            
            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_RESIZE_UI);
        }

        private sortFunc(a: number, b: number): number {

            let cfg1 = ActionOpenCfg.instance.getCfgById(a);
            let cfg2 = ActionOpenCfg.instance.getCfgById(b);

            if (cfg1[action_openFields.index] > cfg2[action_openFields.index]) return 1;
            else if (cfg1[action_openFields.index] < cfg2[action_openFields.index]) return -1;
            else return 0;
        }

        private wxIosPayShow() {
            this.showNobleBtn();
            this.showBtnId();
        }

        private showNobleBtn(): void {
            this.showBtnHandler();
        }

        // 更新场景
        private enterScene(mapId: number = -1): void {
            if (mapId === -1 && !SceneModel.instance.enterScene) return;
            this._sceneType = SceneCfg.instance.getCfgById(mapId !== -1 ? mapId : SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];

            if (this._sceneType === 0) {      // 挂机
                this.unfoldBtn.visible = false;
                this.foldBtn.visible = true;
                this.showNobleBtn();
                if (this._tween) this._tween.stop();
                this._tween = TweenJS.create(this).to({ right: 0 }, CommonConfig.panelTweenDuration).start();
            } else {      // 副本
                this.unfoldBtn.visible = true;
                this.foldBtn.visible = false;
                if (this._tween) this._tween.stop();
                this._tween = TweenJS.create(this).to({ right: 0 }, CommonConfig.panelTweenDuration).start();
                this.showBtnHandler();
            }
        }

        private creatActivityBtn(id: number): void {
            if (!this._btnTab[id]) {
                // console.log("活动iDDDDDDDDDDD:",id);

                let btn = new ActivityIconItem(id);
                this.addChild(btn);
                this._btnTab[id] = btn;
            }
        }
    }

}