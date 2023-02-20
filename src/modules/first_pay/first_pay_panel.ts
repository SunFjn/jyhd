///<reference path="../config/first_pay_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.first_pay {

    import NewFirstPayViewUI = ui.NewFirstPayViewUI;
    import first_pay = Configuration.first_pay;
    import FirstPayCfg = modules.config.FirstPayCfg;
    import first_payFields = Configuration.first_payFields;
    import Items = Configuration.Items;
    import BaseItem = modules.bag.BaseItem;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomClip = modules.common.CustomClip;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import Event = Laya.Event;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GlovesModel = modules.gloves.GlovesModel;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import FightTalismanModel = modules.fight_talisman.FightTalismanModel;
    export class FirstPayPanel extends NewFirstPayViewUI {
        private _btnClip: CustomClip;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        // private _modelClipTween: TweenJS;
        private _togs: Array<Laya.Button>;
        private _dayBtns: Array<Laya.Button>;
        private _texts: Array<Laya.Text>;
        private _items: Array<modules.bag.BaseItem>;
        private _shift: number;
        private _shiftFake: number;
        private _day: number;
        private _currentState: number;
        private _currentId: number;
        private prizeEffect: CustomClip;      //奖品特效

        private glovesShow: boolean;
        private medalShow: boolean;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this.prizeEffect) {
                this.prizeEffect.removeSelf();
                this.prizeEffect.destroy();
                this.prizeEffect = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this.creatEffect();
            this.createAvatar();
            // this.closeOnSide = false;
            this._shift = 10;
            this._shiftFake = 10;
            this.medalShow = false;
            this.glovesShow = false;
            this._day = 1;
            this._dayBtns = [this.day1Btn, this.day2Btn, this.day3Btn];
            this._togs = [this.pay10Btn, this.pay30Btn, this.pay98Btn];
            this._texts = [this.pay10Txt, this.pay30Txt, this.pay98Txt];
            this._items = [this.item1, this.item2, this.item3, this.item4, this.item5];
            this.prizeEffect = new CustomClip();
            this.addChildAt(this.prizeEffect, 2);
            this.prizeEffect.scale(2, 2);
            this.prizeEffect.skin = "assets/effect/scbaoxiang.atlas";
            let arr1 = [];
            for (let i: int = 0; i < 12; i++) {
                arr1[i] = `scbaoxiang/${i}.png`;
            }

            this.prizeEffect.frameUrls = arr1;
            this.prizeEffect.durationFrame = 5;
            this.prizeEffect.loop = true;
            this.prizeEffect.zOrder = 10;
            this.prizeEffect.pos(250, 200);
            this.prizeEffect.scale(3, 3);
            this.height = 980;

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, Laya.Event.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.pay10Btn, Laya.Event.CLICK, this, this.selectShiftHandler, [10]);
            this.addAutoListener(this.pay30Btn, Laya.Event.CLICK, this, this.selectShiftHandler, [30]);
            this.addAutoListener(this.pay98Btn, Laya.Event.CLICK, this, this.selectShiftHandler, [98]);
            //this.addAutoListener(this.pay198Btn, Laya.Event.CLICK, this, this.selectShiftHandler, [198]);

            this.addAutoListener(this.day1Btn, Laya.Event.CLICK, this, this.selectDay, [1]);
            this.addAutoListener(this.day2Btn, Laya.Event.CLICK, this, this.selectDay, [2]);
            this.addAutoListener(this.day3Btn, Laya.Event.CLICK, this, this.selectDay, [3]);
            this.addAutoListener(this.medalBtn, Laya.Event.CLICK, this, this.medalHandler)

            GlobalData.dispatcher.on(CommonEventType.FIRST_PAY_UPDATE, this, this.updateView);
            GlobalData.dispatcher.on(CommonEventType.FIRST_PAY_UPDATE_GETED_STATUS, this, this.updateBtnStatus);
        }

        private createAvatar() {
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(360, 425, true);
            this._skeletonClip.scale(0.9, 0.9);//统一进行一次缩放来控制大小
            this._skeletonClip.zOrder = 5;
        }

        private medalHandler() {
            if (this._shiftFake == 30) {
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            } else if (this._shiftFake == 98) {
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
        }

        // 选择档位
        private selectShiftHandler(shift: number) {
            // if (this._shift == shift) return;
            this._shift = shift;
            this._shiftFake = shift;
            this._togs.forEach(tog => tog.skin = "first_pay/btn_c1.png");
            this._texts.forEach(txt => txt.color = "#fefdd0");
            this[`pay${shift}Btn`].skin = "first_pay/btn_c2.png";
            this[`pay${shift}Txt`].color = "#ff0400";
            // 右侧和下方展示提示文字
            // this.tipsImg.skin = `first_pay/txt_pay_tips_${shift}.png`;
            this.descImg.skin = `first_pay/txt_pay_${shift}.png`;

            // 文字按钮内容
            this.textBtn(shift);

            // 展示当前档位第一天的奖励 
            this.selectDay(this._day);
            this.updateRPStatus();
        }

        private textBtn(shift: number) {
            this.isGlovesMedalShow();
            this.medalBtn.visible = shift == 30 || shift == 98;
            if (shift == 30) {
                this.medalBtn.visible = this.medalShow;
                this.medalBtn.text = "推荐购买勋章解锁";
                this.txtLine.width = 198;
            } else if (shift == 98) {
                this.medalBtn.visible = this.glovesShow;
                this.medalBtn.text = "推荐购买辅助装备解锁";
                this.txtLine.width = 244;
            }
        }

        // 设置clip状态
        private setClipState(active: boolean) {
            this._btnClip.visible = active;
            if (active) {
                this._btnClip.play();
            } else {
                this._btnClip.stop();
            }
        }
        // 设置当前按钮领取状态
        private setBtnState(state: "geted" | "recharge" | "canget" | "cantget", not_desc: string = null) {
            switch (state) {
                case "geted":
                    this.receivedImg.visible = true;
                    this.sureBtn.visible = false;
                    this.notBtn.visible = false;
                    this.btnShadow.visible = false
                    this.setClipState(false);
                    break;
                case "recharge":
                    this.receivedImg.visible = false;
                    this.sureBtn.visible = true;
                    this.notBtn.visible = false;
                    this.btnShadow.visible = true;
                    this.sureBtn.label = "充点小钱";
                    this.setClipState(true);
                    break;
                case "canget":
                    this.receivedImg.visible = false;
                    this.sureBtn.visible = true;
                    this.notBtn.visible = false;
                    this.btnShadow.visible = true;
                    this.sureBtn.label = "领取";
                    this.setClipState(true);
                    break;
                case "cantget":
                    this.receivedImg.visible = false;
                    this.sureBtn.visible = false;
                    this.notBtn.visible = true;
                    this.btnShadow.visible = true;
                    this.notBtn.label = not_desc;
                    this.setClipState(false);
                    break;
            }
        }

        private isEnter: boolean = false;
        tweenBack(day: number) {
            let midX: number = 32;
            let sideX: number = 44;

            this.labelImg.scale(1.4, 1.4);
            TweenJS.create(this.labelImg).to({ scaleX: 1, scaleY: 1 }, 400)
                .easing(utils.tween.easing.circular.InOut)
                .start()

            if (this.isEnter == false) return;
            this.tweenDayBtn(day, 22);
            switch (day) {
                case 1:
                    this.tweenDayBtn(2, midX);
                    this.tweenDayBtn(3, sideX);
                    break;
                case 2:
                    this.tweenDayBtn(1, sideX);
                    this.tweenDayBtn(3, sideX);
                    break;
                case 3:
                    this.tweenDayBtn(1, sideX);
                    this.tweenDayBtn(2, midX);
                    break;
                default:
                    break;
            }
        }

        private tweenDayBtn(selectDay: number, shiftX: number) {
            let moveTime = 260;
            TweenJS.create(this[`day${selectDay}Btn`]).to({ x: shiftX }, moveTime)
                .easing(utils.tween.easing.circular.InOut)
                .start()
        }

        // 展示奖励 day:-1 表示根据领取状态来判断展示某天的奖励
        private selectDay(day: number) {
            this.tweenBack(day);

            // this._modelClip.visible = false;
            let allData = FirstPayCfg.instance.getNewTab();
            let maxCnt = 0;
            for (const key in allData) {
                let shift = Number(key);
                let currentState = FirstPayModel.instance.getStatus(shift, 1);
                maxCnt++;
                if (currentState == 0) {
                    break;
                }
            }
            this._dayBtns.forEach(tog => {
                tog.skin = "first_pay/btn_chooice.png"
                tog.labelColors = "#f2d1af";
            });

            for (let index = 0; index < this._togs.length; index++) {
                this._togs[index].visible = index < maxCnt;
            }

            this[`day${day}Btn`].skin = "first_pay/btn_chooice2.png";
            this[`day${day}Btn`].labelColors = "#421e13";

            // 根据档位和天数获取奖励列表
            let cfg: first_pay = FirstPayCfg.instance.getCfgByShiftAndDay(this._shift, day);
            this._currentId = cfg[first_payFields.id];

            // 赋值
            this._items.forEach(e => { e.visible = false; });
            let rewards = cfg[first_payFields.reward];
            let index = 0;
            for (const key in rewards) {
                const award = rewards[key];
                this._items[index].visible = true;
                this._items[index].dataSource = [award[0], award[1], 0, null];
                index++;
            }

            /*状态 0未开启 1可领取 2已领取*/
            this._currentState = FirstPayModel.instance.getStatus(this._shift, day);
            if (this._currentState == 0) {
                // 当前档位已经达到但是领取时间未达到
                if (day == 2 || day == 3) {
                    let day1State = FirstPayModel.instance.getStatus(this._shift, 1);

                    if (day1State == 2 || day1State == 1) {
                        this.setBtnState("cantget", `第${day}天领取`);
                    } else {
                        this.setBtnState("recharge");
                    }
                } else {
                    this.setBtnState("recharge");
                }

            } else if (this._currentState == 2) {
                this.setBtnState("geted");
            } else if (this._currentState == 1) {
                this.setBtnState("canget");
            }

            // 战力提示展示
            this.powerImg.skin = `first_pay/image_${cfg[first_payFields.fighting]}.png`
            // this.tipsImg.skin = `first_pay/txt_pay_tips_${this._shift}.png`

            // 展示道具显示
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(cfg[first_payFields.showId]);

            let y = modelCfg[ExteriorSKFields.deviationY];
            // y = this._shift == 98 ? (y + 10) : this._shift == 198 ? (y - 15) : y;
            // this._shift == 98 ? this._modelClipTween && this._modelClipTween.stop() : this._modelClipTween && this._modelClipTween.start();

            // 这里直接展示在第一个位置，不区分部位
            let showId = cfg[first_payFields.showId] / 1000 >> 0;
            if (showId == 11) {
                this._skeletonClip.reset(0, 0, 0, 0, 0, cfg[first_payFields.showId]);
                this._skeletonClip.y = 545;
                this._skeletonClip.resetScale(AvatarAniBigType.tianZhu, 1);
            } else if (showId == 10) {
                this._skeletonClip.reset(cfg[first_payFields.showId]);
                this._skeletonClip.y = 335;
            } else {
                this._skeletonClip.reset(cfg[first_payFields.showId]);
                this._skeletonClip.y = 420;
                this._skeletonClip.resetScale(AvatarAniBigType.clothes, 1);
            }
            let totalMoney = FirstPayModel.instance.totalRechargeMoney;
            this.payCountTxt.text = `当前累计充值：${totalMoney}/${this._shift}元`;
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.FIRST_PAY_UPDATE, this, this.updateView);
            GlobalData.dispatcher.off(CommonEventType.FIRST_PAY_UPDATE_GETED_STATUS, this, this.updateBtnStatus);

            // if (this._modelClipTween != null) {
            //     this._modelClipTween.stop();
            //     this._modelClipTween = null;
            // }
        }

        public onOpened(): void {
            super.onOpened();
            this.prizeEffect.play();
            this._btnClip.play();
            this.updateRPStatus();
            this.selectShiftHandler(this._shift);
            // this._modelClip.y = 450;
            // this._modelClipTween = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 20 },
            //     1000).start().yoyo(true).repeat(99999999);
            this.dayBtnEnter()
            this.isEnter = true;
        }

        private dayBtnEnter() {
            this.day1Btn.x = -10;
            this.day2Btn.x = -10;
            this.day3Btn.x = -10;
            let endY = this.payBtnGroup.y;
            let startY = this.payBtnGroup.y - 150;
            this.payBtnGroup.y = startY;
            TweenJS.create(this.day1Btn).to({ x: 44 }, 400)
                .easing(utils.tween.easing.circular.InOut)
                .start()
            TweenJS.create(this.day2Btn).to({ x: 32 }, 400)
                .delay(120)
                .easing(utils.tween.easing.circular.InOut)
                .start()
            TweenJS.create(this.day3Btn).to({ x: 44 }, 400)
                .delay(240)
                .easing(utils.tween.easing.circular.InOut)
                .start()

            TweenJS.create(this.payBtnGroup).to({ y: endY }, 600)
                .easing(utils.tween.easing.bounce.Out)
                .start()
        }

        // 更新红点状态
        private updateRPStatus(): void {
            let shiftSetedState: boolean = false;
            let daySetedState: boolean = false;
            let tab = FirstPayModel.instance.shiftDayStateTab;
            for (const shift in tab) {
                let shiftState = false;
                // if (parseInt(shift) != this._shift) continue;

                let shiftData = tab[shift];
                for (const day in shiftData) {
                    const dayState = shiftData[day];
                    if (dayState == 1) {
                        shiftState = true;
                        if (parseInt(shift) == this._shift) {
                            this[`d${day}RPImg`].visible = true;
                            // 默认开启的档位的天数
                            if (!daySetedState) {
                                daySetedState = true;
                                this._day = parseInt(day);
                            }
                        }
                    } else {
                        if (parseInt(shift) == this._shift) {
                            this[`d${day}RPImg`].visible = false;
                        }
                    }
                }
                // 档位红点
                this[`s${shift}RPImg`].visible = shiftState;

                // 默认开启的档位
                if (!shiftSetedState && shiftState) {
                    shiftSetedState = true;
                    this._shift = parseInt(shift);
                }
            }
        }

        private updateView(): void {
            this.updateRPStatus();
        }

        private updateBtnStatus(): void {
            this.setBtnState("geted");
            this.updateRPStatus();
            this.selectShiftHandler(this._shift);
        }

        private creatEffect(): void {
            // console.log('vtz:this.height',this.height);
            // console.log('vtz:this.sureBtn.y',this.sureBtn.y);
            // console.log('vtz:this.sureBtn.height',this.sureBtn.height);
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(1.1, 1);
            this._btnClip.visible = true;
        }


        private sureBtnHandler(): void {
            // console.log('vtz:sureBtnHandler - - - - -');
            if (this._currentState == 0) {
                if (FirstPayModel.instance.totalRechargeMoney < FirstPayCfg.instance.getCfgDefaultData()[Configuration.first_payFields.money]) {
                    PlatParams.askPay(110, RechargeCfg.instance.getRecharCfgByIndex(110)[rechargeFields.price]);
                } else {
                    this.close();
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                }
            } else if (this._currentState == 1) {
                FirstPayCtrl.instance.getFirstPayReward(this._currentId);
            }
        }

        private isGlovesMedalShow() {
            let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
            if (!info) return;
            let state: int = info[GetGauntletReplyFields.state];

            if (FirstPayModel.instance.totalRechargeMoney < FirstPayCfg.instance.getCfgDefaultData()[Configuration.first_payFields.money]
                && FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                this.glovesShow = true;
            } else {
                if (state == -1 || state == 0 || state == -2) {
                    this.glovesShow = true;
                }
                // 已购买并领取过则打开辅助装备界面
                else {
                    this.glovesShow = false;
                }
            }
            this.medalShow = FightTalismanModel.instance.currMedalType() !== 4;
        }

        close() {
            super.close();
            this.isEnter = false;
        }
    }
}