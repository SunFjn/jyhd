/*活动列表*/
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
///<reference path="../kunlun/kunlun_model.ts"/>
///<reference path="../kunlun/kunlun_ctrl.ts"/>
namespace modules.kunlun {
    /**
     * 肥皂类
     */
    class Soap extends Laya.Image {
        public _moveJS: TweenJS;
        public _closeMoveJS: TweenJS;
        public ISzhua: boolean = false;
        public isMoveJS: boolean = false;
        public isCloseMove: boolean = false;

        constructor() {
            super();
            this.ISzhua = false;
            this.skin = "kunlun/icon_klyc_fz.png";
            this.visible = true;
            this.anchorX = 0.5;
            this.pos(0, -70);
        }

        public Move(timeNum: number, overFun: Function) {
            this.alpha = 1;
            this.pos(0, -70);
            this.ISzhua = false;
            this.isMoveJS = false;
            this.isCloseMove = false;
            this.visible = true;
            this._moveJS = TweenJS.create(this).to({ x: (this.x + 500) }, timeNum).onComplete((): void => {
                if (!this.ISzhua) {
                    overFun();
                }
                this.isMoveJS = true;
                this.closeMove();
            });
            this._moveJS.start();
        }

        public closeMove() {
            this._moveJS.stop();
            if (this._closeMoveJS) {
                this._closeMoveJS.stop();
            }
            this._closeMoveJS = TweenJS.create(this).to({
                x: (this.x + 100),
                y: (this.y + 100),
                alpha: 0
            }, 500).onComplete((): void => {
                this.visible = false;
                if (WindowManager.instance.isOpened(WindowEnum.KUNLUN_GAME_PANLE)) {
                    if (WindowManager.instance.getPanelById(WindowEnum.KUNLUN_GAME_PANLE)) {
                        let Win = WindowManager.instance.getPanelById(WindowEnum.KUNLUN_GAME_PANLE) as KunLunGamePanel;
                        Win._Soaps.push(this);
                    }
                }
            });
            this._closeMoveJS.start();
            this.isCloseMove = true;
        }

        public destroy(destroyChild?: boolean): void {
            if (this._moveJS) {
                this._moveJS.stop();
                this._moveJS = null;
            }
            if (this._closeMoveJS) {
                this._closeMoveJS.stop();
                this._closeMoveJS = null;
            }
            super.destroy(destroyChild);
        }
    }

    import Point = laya.maths.Point;
    import Event = Laya.Event;
    import CustomClip = modules.common.CustomClip;
    import KunLunModel = modules.kunlun.KunLunModel;
    import KunLunCtrl = modules.kunlun.KunLunCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class KunLunGamePanel extends ui.KunLunGameViewUI {
        public _Soaps: Array<Soap>;
        public _NowSoaps: Soap;
        /**奸笑表情*/
        private _jianXiaoEffect: CustomClip;
        /**尬笑表情*/
        private _gaXiaoEffect: CustomClip;
        private _isJianFeiZhao: boolean = false;//是否可以捡肥皂
        private _isJianFeiZhaoAni: boolean = false;//是否正在捡肥皂
        private _isLoseHarl: boolean = false;//失败时 肥皂移到最末端 时候执行刷新肥皂请求
        private _speedNum: number = 1000;//肥皂移动最末端的时间  （毫秒）
        private _handImgSpeedDown: number = 300;//手下降的时间
        private _handImgSpeedUp: number = 300;//手上升的时间
        private _WinTime: number = 2000;//胜利动画时间
        private _LoseTime: number = 2000;//失败动画时间
        constructor() {
            super()
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._jianXiaoEffect) {
                this._jianXiaoEffect.removeSelf();
                this._jianXiaoEffect.destroy();
                this._jianXiaoEffect = null;
            }
            if (this._gaXiaoEffect) {
                this._gaXiaoEffect.removeSelf();
                this._gaXiaoEffect.destroy();
                this._gaXiaoEffect = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.bottom = 217;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
            this._Soaps = new Array<Soap>();
            this._jianXiaoEffect = new CustomClip();
            this.baba.addChildAt(this._jianXiaoEffect, 0);
            this._jianXiaoEffect.skin = "assets/effect/feizao.atlas";
            this._jianXiaoEffect.frameUrls = ["feizao/00000.png", "feizao/00001.png", "feizao/00002.png", "feizao/00003.png", "feizao/00004.png"];
            this._jianXiaoEffect.durationFrame = 5;
            this._jianXiaoEffect.loop = true;
            this._jianXiaoEffect.scale(1, 1, true);
            this._jianXiaoEffect.visible = false;
            this._gaXiaoEffect = new CustomClip();
            this.baba.addChildAt(this._gaXiaoEffect, 0);
            this._gaXiaoEffect.skin = "assets/effect/chat_face/2007.atlas";
            this._gaXiaoEffect.frameUrls = ["2007/0001.png", "2007/0002.png", "2007/0003.png", "2007/0004.png"];
            this._gaXiaoEffect.durationFrame = 5;
            this._gaXiaoEffect.loop = true;
            this._gaXiaoEffect.scale(1, 1, true);
            this._gaXiaoEffect.visible = false;
        }

        public onOpened(): void {
            super.onOpened();
            // this._isJianFeiZhao = false;
            this._isJianFeiZhaoAni = false;
            this.setDrawNum();
            // KunLunModel.instance._isShowBuff = false;
            if (this._jianXiaoEffect) {
                this._jianXiaoEffect.visible = false;
                this._jianXiaoEffect.stop();
            }
            if (this._gaXiaoEffect) {
                this._gaXiaoEffect.visible = false;
                this._gaXiaoEffect.stop();
            }
            KunLunCtrl.instance.GetSwimmingInfo();
        }

        public close(): void {
            super.close();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_UPDATE, this, this.setDrawNum);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_STATE_UPDATE, this, this.setDrawNumState);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_ZHUAN, this, this.zhuaSoapHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_SHOWSOAP, this, this.setEffectiveRangeImg);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_SHOWSOAP, this, this.showSoap);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUNLUN_BAG_ADD_ITEM, this, this.addItemHandler);
            this.okBtn.on(Event.CLICK, this, this.okBtnBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.okBtn.off(Event.CLICK, this, this.okBtnBtnHandler);
            Laya.timer.clear(this, this.stopJianXiaoEffect);
            Laya.timer.clear(this, this.stopGaXiaoEffect);
        }

        public addItemHandler(item: Protocols.Item, source: ItemSource, manual: boolean = false): void {
            if (source === ItemSource.swimming) {
                let start = new Point(300, 0);
                let arr = [item[0], start, this.height];
                GlobalData.dispatcher.event(CommonEventType.KUNLUN_REWARD_EFFECT, [arr]);
            }
        }

        public okBtnBtnHandler(): void {
            if (!this._isJianFeiZhaoAni && this._isJianFeiZhao) {
                this._isJianFeiZhaoAni = true;
                // this._isLoseHarl = false;
                if (this._NowSoaps) {
                    this._NowSoaps.ISzhua = true;
                }
                // TweenJS.create(this.handImg).to({ y: (this.handImg.y + 70) }, this._handImgSpeedDown).onComplete((): void => {
                KunLunCtrl.instance.GrabSoap();
                // }).start();
            } else {
                if (!this._isJianFeiZhao) {
                    SystemNoticeManager.instance.addNotice("达到抓取上限", true);
                }
            }
        }

        public zhuaSoapHandler() {
            // TweenJS.create(this.handImg).to({ y: (this.handImg.y - 70) }, this._handImgSpeedUp).onComplete((): void => {
            // }).start();
            if (KunLunModel.instance.result == 1) {
                SystemNoticeManager.instance.addNotice("成功捡到肥皂，奖励双倍时间延长2分钟", false, ui.Layer.EFFECT_LAYER, 2000);
                this.soapShowImg.visible = true;
                this.playJianXiaoEffect();
                if (this._NowSoaps) {
                    this._NowSoaps.ISzhua = true;
                    this._NowSoaps.visible = false;
                    if (this._NowSoaps._moveJS) {
                        this._NowSoaps._moveJS.stop();
                    }
                    if (this._NowSoaps._closeMoveJS) {
                        this._NowSoaps._closeMoveJS.stop();
                    }
                    this._NowSoaps.destroy;
                }

            } else {
                SystemNoticeManager.instance.addNotice("抓取失败", true);
                if (this._NowSoaps) {
                    this._NowSoaps.ISzhua = false;
                }
            }
        }

        public aniHandler() {
            if (WindowManager.instance.isOpened(WindowEnum.KUNLUN_GAME_PANLE)) {
                if (WindowManager.instance.getPanelById(WindowEnum.KUNLUN_GAME_PANLE)) {
                    let Win = WindowManager.instance.getPanelById(WindowEnum.KUNLUN_GAME_PANLE) as KunLunGamePanel;
                    if (Win._isJianFeiZhao) {
                        KunLunCtrl.instance.GetSoapInfo();
                    } else {
                        Win.soapImg.visible = true;
                        // KunLunModel.instance._isShowBuff = true;
                    }
                }
            }
        }

        public showSoap() {
            //如果是点击抓取的时候暂时不要生成
            if (WindowManager.instance.isOpened(WindowEnum.KUNLUN_GAME_PANLE)) {
                if (WindowManager.instance.getPanelById(WindowEnum.KUNLUN_GAME_PANLE)) {
                    let Win = WindowManager.instance.getPanelById(WindowEnum.KUNLUN_GAME_PANLE) as KunLunGamePanel;
                    Win._isJianFeiZhaoAni = false;
                    if (!Win._isJianFeiZhaoAni) {
                        let feizhao = Win._Soaps.shift();
                        if (feizhao) {
                            feizhao.Move(Win._speedNum, Win.aniHandler);
                            console.log("取");
                        } else {
                            feizhao = new Soap();
                            Win.baba.addChildAt(feizhao, 0);
                            feizhao.Move(Win._speedNum, Win.aniHandler);
                            console.log("生");
                        }
                        if (Win._NowSoaps) {
                            this._NowSoaps.ISzhua = true;
                            if (!Win._NowSoaps.isMoveJS) {//如果上一个肥皂的 第一段移动动画结束就有了下一个请求  开挂啦！！！！！
                                if (Win._NowSoaps._closeMoveJS) {
                                    Win._NowSoaps._closeMoveJS.stop();
                                }
                                if (Win._NowSoaps._moveJS) {
                                    Win._NowSoaps._moveJS.stop();
                                    Win._NowSoaps.destroy();//删掉上一个！！！
                                }
                            }
                        }
                        Win._NowSoaps = feizhao;
                    }
                }
            }
        }

        /**
         * 设置黄色区域的长宽以及位置
         */
        public setEffectiveRangeImg() {
            // KunLunModel.instance._isShowBuff = true;
            let leng = this.baba.width;
            let biliNum = leng / KunLunModel.instance.MaxLengNum;//算出比例
            let lv = KunLunModel.instance.le;
            let start = KunLunModel.instance.startPos;
            //算出 黄色区域长度
            let widthNum = lv * biliNum;
            this.effectiveRangeImg.width = widthNum;
            //算出 黄色区域位置
            let stateX = start * biliNum;
            this.effectiveRangeImg.x = stateX;
            this._speedNum = KunLunModel.instance.speedNum * KunLunModel.instance.MaxLengNum;
            this.soapShowImg.visible = false;
            //手的位子与黄色区域对齐
            this.handImg.x = this.effectiveRangeImg.x + this.effectiveRangeImg.width / 2;
            this._jianXiaoEffect.pos(191, -149, true);//117 139
            this._gaXiaoEffect.pos(this.handImg.x + 30, this.handImg.y - 64, true);
        }

        public setDrawNumState() {
            this.setDrawNum();
            if (this._isJianFeiZhao) {
                KunLunCtrl.instance.GetSoapInfo();
            } else {
                this.soapImg.visible = true;
                // KunLunModel.instance._isShowBuff = true;
            }
        }

        /**
         * 设置剩余捡肥皂次数
         */
        public setDrawNum() {
            let drawNum = KunLunModel.instance.gameMaxNum - KunLunModel.instance.count;
            drawNum = drawNum >= 0 ? drawNum : 0;
            let colorStr = "#ff3e3e";
            drawNum == 0 ? colorStr = "#ff3e3e" : colorStr = "#55ff28";
            this.drawNum.color = colorStr;
            this.drawNum.text = `${drawNum}/${KunLunModel.instance.gameMaxNum}`;
            let wight = this.Text1.width + this.drawNum.width;
            let X = (this.width - wight) / 2;
            this.Text1.x = X;
            this.drawNum.x = this.Text1.x + this.Text1.width;
            this._isJianFeiZhao = drawNum > 0 ? true : false;
            //这里还要处理  减肥照按钮在次数为零的情况下 变灰
            if (!this._isJianFeiZhao) {
                this.okBtn.gray = true;
            } else {
                this.okBtn.gray = false;
            }
        }

        /**
         * 播放奸笑表情
         */
        public playJianXiaoEffect() {
            this._jianXiaoEffect.play();
            this._jianXiaoEffect.visible = true;
            Laya.timer.clear(this, this.stopJianXiaoEffect);
            Laya.timer.once(this._WinTime, this, this.stopJianXiaoEffect);
        }

        public stopJianXiaoEffect() {
            this._jianXiaoEffect.stop();
            this._jianXiaoEffect.visible = false;
            this.soapShowImg.visible = false;
            this.aniHandler();
        }

        /**
         * 播放尬笑表情表情
         */
        public playGaXiaoEffect() {
            this._gaXiaoEffect.play();
            this._gaXiaoEffect.visible = true;
            Laya.timer.clear(this, this.stopGaXiaoEffect);
            Laya.timer.once(this._LoseTime, this, this.stopGaXiaoEffect);
        }

        public stopGaXiaoEffect() {
            this._gaXiaoEffect.stop();
            this._gaXiaoEffect.visible = false;
            // if (this._isLoseHarl) {
            //     this.aniHandler();
            // }
        }
    }
}