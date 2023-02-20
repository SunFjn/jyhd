///<reference path="../fairy/fairy_model.ts"/>
///<reference path="../config/fairy_cfg.ts"/>
/** 仙女护送面板 */
namespace modules.fairy {
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FairyCfg = modules.config.FairyCfg;
    import FairyModel = modules.fairy.FairyModel;
    import FairyEscore = Protocols.FairyEscore;
    import FairyEscoreFields = Protocols.FairyEscoreFields;
    import BlendCfg = modules.config.BlendCfg;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;

    export class FairyPanel extends ui.FairyViewUI {

        private _moveTween: TweenJS[];
        private _shadeTween: TweenJS[];
        private _yPoss: number[];
        private _fairyImgs: Array<Laya.Image>;
        private _cd: number;
        private _selectFrame: Laya.Image;
        private _isNotice: boolean;
        private _btnClip: CustomClip;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._yPoss = [];
            for (let i: int = 0; i < 7; i++) {
                this._yPoss.push(80 * i);
            }

            this._fairyImgs = [];
            this._moveTween = [];
            this._shadeTween = [];
            for (let i: int = 0; i < FairyModel.instance.maxFairyNum; i++) {
                let img: Laya.Image = new Laya.Image(`fairy/image_hsxv_xv1.png`);
                img.visible = false;
                this._fairyImgs.push(img);
                this.wayPanel.addChild(img);
                this._moveTween.push(TweenJS.create(img));
                this._shadeTween.push(TweenJS.create(img));
            }

            this._selectFrame = new Laya.Image();
            this.wayPanel.addChild(this._selectFrame);
            this._selectFrame.visible = false;

            this._cd = 0;

            this._btnClip = CommonUtil.creatEff(this.gotoBtn, "btn_light", 15);
            this._btnClip.pos(-5, -19);
            this._btnClip.scale(1.23, 1.25);
            this._btnClip.visible = false;

            this.instructionsHTML.style.fontFamily = "SimHei";
            this.instructionsHTML.style.align = "left";
            this.instructionsHTML.style.fontSize = 22;
            this.instructionsHTML.innerHTML = config.BlendCfg.instance.getCfgById(31015)[Configuration.blendFields.stringParam][0];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.jtzdBtn, Laya.Event.CLICK, this, this.jtzdBtnHandler);
            this.addAutoListener(this.updateBtn, Laya.Event.CLICK, this, this.updateBtnHandler);
            this.addAutoListener(this.helpBtn, Laya.Event.CLICK, this, this.helpBtnHandler);
            this.addAutoListener(this.gotoBtn, Laya.Event.CLICK, this, this.gotoBtnHandler);
            this.addAutoListener(this.aboutBtn, Laya.Event.CLICK, this, this.aboutBtnHandler);

            for (let i: int = 0; i < FairyModel.instance.maxFairyNum; i++) {
                this.addAutoListener(this._fairyImgs[i], Laya.Event.CLICK, this, this.imgsClickHandler, [i]);
            }

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAIRY_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAIRY_UPDATE, this, this.showFairyList);

            this.addAutoRegisteRedPoint(this.fairyRPImg, ["fairyRP"]);

            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this._isNotice = false;
            FairyCtrl.instance.getFairyInfo();

            this.updateBtnHandler();
            this.updateView();
            this.showFairyList();
        }

        private updateView(): void {
            let stateInfo = dungeon.DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.fairy);
            if (!stateInfo) {
                this.doubleImg.visible = false;
            } else {
                this.doubleImg.visible = stateInfo[Protocols.CopySceneStateFields.state] == 2;
            }
            let tempTime: number = BlendCfg.instance.getCfgById(31005)[Configuration.blendFields.intParam][0];
            this.sendTimeTxt.text = `${tempTime - FairyModel.instance.escort}/${tempTime}`;
            tempTime = BlendCfg.instance.getCfgById(31006)[Configuration.blendFields.intParam][0];
            this.holdupTimeTxt.text = `${tempTime - FairyModel.instance.intercept}/${tempTime}`;

            this._btnClip.stop();
            this._btnClip.visible = false;
            if (FairyModel.instance.sendState == 1) { //护送中
                this.gotoBtn.label = `护送中...`;
            } else if (FairyModel.instance.sendState == 0) { //闲置
                this.gotoBtn.label = `护送神女`;
            } else { //结束
                this.gotoBtn.label = `领取奖励`;
                this._btnClip.play();
                this._btnClip.visible = true;
            }
        }

        private showFairyList(): void {

            for (let i: int = 0; i < FairyModel.instance.maxFairyNum; i++) {
                let moveTween: TweenJS = this._moveTween[i];
                let shadeTween: TweenJS = this._shadeTween[i];
                if (moveTween.isPlaying || shadeTween.isPlaying) { //正在播放
                    continue;
                }
                let info: FairyEscore = FairyModel.instance.escortList[i];
                if (!info) { //没有数据
                    moveTween.stop();
                    shadeTween.stop();
                    this._fairyImgs[i].visible = false;
                    this._fairyImgs[i].alpha = 1;
                    continue;
                }//有数据

                let fairyId: number = info[FairyEscoreFields.id];
                this._fairyImgs[i].skin = `fairy/image_hsxv_xv${fairyId}.png`;
                let needTime: number = FairyCfg.instance.getCfgById(fairyId)[Configuration.fairyFields.onceTime];
                let endTime: number = info[FairyEscoreFields.time] - GlobalData.serverTime;
                let goingTime: number;
                let per: number; //百分比
                if (endTime > needTime) {  //大于一次过屏
                    per = (endTime % needTime) / needTime;
                } else {
                    per = endTime / needTime;
                }
                this._fairyImgs[i].x = 670 * (1 - per) - 70;
                goingTime = per * needTime;
                this._fairyImgs[i].y = this._yPoss[Math.floor(Math.random() * this._yPoss.length)];
                this._fairyImgs[i].zOrder = this._fairyImgs[i].y;
                this._fairyImgs[i].visible = true;
                this._fairyImgs[i].alpha = 1;
                if (!moveTween || !shadeTween) {
                    return;
                }
                moveTween.to({ x: 600 }, goingTime).start().onComplete(() => {
                    shadeTween.to({ alpha: 0 }, 1000).start().onComplete(() => {
                        this._fairyImgs[i].visible = false;
                        this._fairyImgs[i].alpha = 1;
                        let fairyId: number = FairyModel.instance.escortList[i][Protocols.FairyEscoreFields.agentId];
                        FairyModel.instance.escortListFlags[fairyId] = null;
                        FairyModel.instance.escortList[i] = null;
                        FairyCtrl.instance.getFairyEscortList();
                    });
                    FairyModel.instance.escortListFlags[fairyId] = null;
                });
            }
        }

        private imgsClickHandler(index: number): void {
            let value = FairyModel.instance.escortList[index];
            WindowManager.instance.open(WindowEnum.FAIRY_SEND_ALERT, value);
        }

        private jtzdBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.NINE_PANEL);
        }

        private updateBtnHandler(): void {
            if (this._cd > 0) {
                SystemNoticeManager.instance.addNotice(`刷新CD中`, true);
                return;
            }
            FairyModel.instance.initEscortList();
            for (let i: int = 0; i < FairyModel.instance.maxFairyNum; i++) {
                this._moveTween[i].stop();
                this._shadeTween[i].stop();
                FairyModel.instance.initeEscortListFlags();
                this._fairyImgs[i].x = -70;
            }
            FairyCtrl.instance.getFairyEscortList();
            this._cd = BlendCfg.instance.getCfgById(31004)[Configuration.blendFields.intParam][0];
            if (this._isNotice) {
                SystemNoticeManager.instance.addNotice(`刷新成功`);
            }
            this._isNotice = true;
        }

        private loopHandler(): void {
            if (this._cd <= 0) {
                this._cd = 0;
                return;
            } else {
                this._cd -= 1000;
            }
        }

        private gotoBtnHandler(): void {
            if (FairyModel.instance.sendState == 0) { //挑选仙女
                let tempTime: number = BlendCfg.instance.getCfgById(31005)[Configuration.blendFields.intParam][0];
                if (tempTime > FairyModel.instance.escort) {
                    WindowManager.instance.open(WindowEnum.FAIRY_CHOOSE_ALERT);
                } else {
                    CommonUtil.noticeError(ErrorCode.FairyEscortLimit);
                }
            } else if (FairyModel.instance.sendState == 2) {  //领取奖励
                FairyCtrl.instance.getFairyAward();
            } else if (FairyModel.instance.sendState == 1) {
                SystemNoticeManager.instance.addNotice(`正在护送中`);
            }
        }

        private helpBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FAIRY_LOG_ALERT);
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20042);
        }

        public close(): void {
            super.close();
            this._cd = 0;
            for (let i: int = 0, len: int = FairyModel.instance.maxFairyNum; i < len; i++) {
                this._moveTween[i].stop();
                this._shadeTween[i].stop();
            }
        }

        public destroy(): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._fairyImgs = this.destroyElement(this._fairyImgs);
            this._selectFrame = this.destroyElement(this._selectFrame);
            super.destroy();
            for (let i: int = 0, len: int = FairyModel.instance.maxFairyNum; i < len; i++) {
                this._moveTween[i] = null;
                this._shadeTween[i] = null;
            }
        }
    }
}