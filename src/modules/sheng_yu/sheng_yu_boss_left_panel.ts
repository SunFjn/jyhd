/////<reference path="../$.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.sheng_yu {
    import Event = Laya.Event;
    export class ShengYuBossLeftPanel extends ui.ShengYuBossLeftViewUI {

        private _tipBox1Tween: TweenJS;
        private _type: int;

        protected initialize(): void {
            super.initialize();
            this.left = 17;
            this.bottom = 400;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
            this._type = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.handBookBtn, Event.CLICK, this, this.handBookBtnHandler);


            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoRegisteRedPoint(this.handbookRPImg, ["shenYuBossRP"]);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateBag();
        }

        public setOpenParam(type: int): void {
            super.setOpenParam(type);
            // 0是圣域  1是boss之家
            this._type = type;
        }

        private handBookBtnHandler(): void {
            //打开收益记录界面
            WindowManager.instance.open(this._type ? WindowEnum.BOSS_HOME_AWARD_ALERT : WindowEnum.SHENGYU_BOSS_SHOUYI_ALERT);
        }


        private updateBag(bagId: number = BagId.temple): void {
            this.BagManTipBox.visible = false;
            if (bagId == BagId.temple) {
                let lengNum = modules.bag.BagModel.instance.getBagEnoughById(BagId.temple);
                if (lengNum <= ShengYuBossModel.instance.tipsNum) {
                    this.newTitleBtnEffectLoop();
                } else {
                    if (this._tipBox1Tween) {
                        this._tipBox1Tween.stop();
                    }
                }
            }
        }
        private newTitleBtnEffectLoop(): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this.BagManTipBox.visible = false;
            }
            this.BagManTipBox.y = -61;
            this.BagManTipBox.visible = true;
            this._tipBox1Tween = TweenJS.create(this.BagManTipBox).to({ y: this.BagManTipBox.y - 15 },
                600).start().yoyo(true).repeat(99999999);
        }
        public close(): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this.BagManTipBox.visible = false;
            }
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this._tipBox1Tween = null;
            }
            super.destroy(destroyChild);
        }
    }
}