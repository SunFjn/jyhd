///<reference path="../first_pay/first_pay_model.ts"/>
///<reference path="../config/first_pay_cfg.ts"/>
///<reference path="../config/pet_fazhen_cfg.ts"/>
///<reference path="../config/ride_fazhen_cfg.ts"/>
///<reference path="../config/fashion_magic_show_cfg.ts"/>
///<reference path="../config/tian_zhu_magic_show_cfg.ts"/>
/// <reference path="../config/shenqi_cfg.ts" />
/// <reference path="../shenqi/shenqi_model.ts" />



namespace modules.player_title {
    import CustomClip = modules.common.CustomClip;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import designation = Configuration.designation;
    import designationFields = Configuration.designationFields;
    import DesignationCfg = modules.config.DesignationCfg;
    export class PlayerTitleActiveAlert extends ui.PlayerTitileActiveAlertUI {

        private _effect: CustomClip;      //特效
        private _tweenJS: TweenJS;
        private _nameTextArry: Array<Laya.Text>;
        constructor() {
            super();
        }

        public destroy(): void {
            // if (this._effect) {
            //     this._effect.removeSelf();
            //     this._effect.destroy();
            //     this._effect = null;
            // }
            if (this._tweenJS) {
                this._tweenJS.stop();
                this._tweenJS = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._nameTextArry = [
                this.nameText1, this.valueText1,
                this.nameText2, this.valueText2,
                this.nameText3, this.valueText3,
                this.nameText4, this.valueText4,
                this.nameText5, this.valueText5,
                this.nameText6, this.valueText6,
                this.nameText7, this.valueText7,
                this.nameText8, this.valueText8
            ];
            // this._effect = new CustomClip();
            // this.BG.addChild(this._effect);
            // this._effect.scale(2.5, 2.5);
            // this._effect.skin = "assets/effect/ok_state.atlas";
            // this._effect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
            //     "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            // this._effect.durationFrame = 5;
            // this._effect.play();
            // this._effect.loop = true;
            // this._effect.pos(-50, -100);
            this.clickCD = true;
            // this._tweenJS = TweenJS.create(this.showImg).to({ y: this.showImg.y - 20 },
            //     1000).yoyo(true).repeat(99999999);
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
            // if (this._tweenJS) {
            //     this._tweenJS.stop();
            // }
        }

        public close(): void {
            super.close();
            // if (this._effect) {
            //     this._effect.stop();
            // }
        }
        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            if (value) {
                let shuju = DesignationCfg.instance.getCfgById(value);
                if (shuju) {
                    let atkNum = shuju[designationFields.atkNum];
                    let src = shuju[designationFields.src];
                    let condition = shuju[designationFields.condition];
                    let showProgress = shuju[designationFields.showProgress];///*是否显示进度 0/1*/
                    let limitTime = shuju[designationFields.limitTime];///*是否显示进度 0/1*/
                    this.showImg.skin = `assets/icon/ui/designation/${src}.png`;
                    this.showImg.visible = true;
                    this.atkValueMsz.value = `` + atkNum;
                    // if (this._effect) {
                    //     this._effect.play();
                    // }
                    let attrTips = shuju[designationFields.attrTips];
                    if (!attrTips) {
                        if (attrTips.length == 0) {
                            modules.notice.SystemNoticeManager.instance.addNotice("无属性加成", true);
                            return
                        }
                    }
                    let leng: number = <number>(attrTips.length / 2);//该称号 属性个数
                    leng = Math.round(leng);
                    let lineNum = Math.round(leng / 2);//两个一行 算出多少行
                    let zengJiaLeng = 0;
                    if (lineNum == 0) {
                        lineNum = 1;
                    } else {
                        if ((lineNum * 2) < leng) {
                            lineNum = lineNum + 1;
                        }
                    }
                    zengJiaLeng = 50 * lineNum;
                    this.bg1.height = this.bg2.height = zengJiaLeng;
                    this.setArr(attrTips);
                }

            }
        }
        public setArr(attrTips: any) {
            if (attrTips) {
                for (let index = 0; index < this._nameTextArry.length; index++) {
                    let element = this._nameTextArry[index];
                    element.visible = false;
                }
                for (let index = 0; index < attrTips.length; index++) {
                    let element = attrTips[index];
                    if (this._nameTextArry[index]) {
                        this._nameTextArry[index].text = element;
                        this._nameTextArry[index].visible = true;
                    }
                }
            }
        }
    }
}