///<reference path="../config/prevent_fool_cfg.ts"/>
///<reference path="../prevent_fool_question/prevent_fool_ctrl.ts"/>

namespace modules.prevent_fool_question {
    import PreventFoolCfg = modules.config.PreventFoolCfg;
    import prevent_fool = Configuration.prevent_fool;
    import preventFoolFields = Configuration.prevent_foolFields;
    import Button = Laya.Button;
    import Image = Laya.Image;

    export class PreventFoolAlert extends ui.PreventFoolAlertUI {

        private _id: number;
        private _time: number;
        private _bgImgs: Button[];
        private _imgs: Image[];
        private _flag: int; //标记  -1代表初始状态 非零既真
        private _index: int;

        protected initialize(): void {
            super.initialize();
            this.tipTxt.wordWrap = true;
            this.closeOnSide = false;
            this._bgImgs = [this.answerA, this.answerB];
            this._imgs = [this.icon1, this.icon2];
        }

        protected addListeners(): void {
            super.addListeners();
            this._bgImgs.forEach((btn, index) => {
                this.addAutoListener(btn, common.LayaEvent.CLICK, this, this.btnHandler, [index]);
            });
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PREVENTFOOL_UPDATE, this, this.updateRightAnswers);
        }

        public onOpened(): void {
            super.onOpened();
            this._id = PreventFoolModel.instance.id;
            this._flag = -1;
            this.initShow();
        }

        private updateRightAnswers(): void {
            if (this._id === PreventFoolModel.instance.id) return;
            this._id = PreventFoolModel.instance.id;
            this._imgs[this._index].visible = true;
            this._imgs[this._index].skin = "common/image_common_dg.png";
            this.tipTxt.color = this.secondTxt.color = "#0ecf09";
            let cfg: prevent_fool = PreventFoolCfg.instance.getCfgById(this._id);
            if(cfg){
                this.tipTxt.text = `${cfg[this._index === 0 ? preventFoolFields.tipForAnswer1 : preventFoolFields.tipForAnswer2]}`;
                this.tipTxt.visible = false;
            }
            this.secondTxt.visible = this._imgs[this._index].visible = true;
            this._time = 3;
            this._flag = 1;
            this.loopHandler();
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        private btnHandler(index: int): void {
            if (this._flag != -1) return;
            this._index = index;
            this._bgImgs[index].skin = "prevent_fool/panel_fzp_db2.png";
            let cfg: prevent_fool = PreventFoolCfg.instance.getCfgById(this._id);
            if (cfg[preventFoolFields.answer] == index) {//正确
                PreventFoolCtrl.instance.getAnswerAward(index);
                PreventFoolCtrl.instance.getPreventFool();
            } else {//错误
                this._imgs[index].visible = true;
                this._imgs[index].skin = "common/image_common_hc.png";
                this.tipTxt.color = this.secondTxt.color = "#d73633";
                this.tipTxt.text = `${cfg[index == 0 ? preventFoolFields.tipForAnswer1 : preventFoolFields.tipForAnswer2]}`;
                this._time = 5;
                this._flag = 0;
                this.secondTxt.visible = this.tipTxt.visible = this._imgs[index].visible = true;
                this.loopHandler();
                Laya.timer.loop(1000, this, this.loopHandler);
            }
        }

        private initShow(): void {
            let cfg: prevent_fool = PreventFoolCfg.instance.getCfgById(this._id);
            this.question.text = `${cfg[preventFoolFields.description]}`;
            this.answerA.label = `${cfg[preventFoolFields.answer1]}`;
            this.answerB.label = `${cfg[preventFoolFields.answer2]}`;
            this.secondTxt.visible = this.tipTxt.visible = this.icon1.visible = this.icon2.visible = false;
            this.answerA.skin = this.answerB.skin = `prevent_fool/panel_fzp_db1.png`;
        }

        private loopHandler(): void {
            this._time--;
            if (this._time <= 0) {
                if (this._id > PreventFoolCfg.instance.maxLen) {
                    WindowManager.instance.close(WindowEnum.PREVENT_FOOL_ALERT);
                } else {
                    this.initShow();
                }
                Laya.timer.clear(this, this.loopHandler);
                this._flag = -1;
            } else {
                if (this._flag === 0) {
                    this.secondTxt.text = `${this._time}秒后重置答案`;
                } else if (this._flag === 1) {
                    if (this._id > PreventFoolCfg.instance.maxLen) {
                        this.secondTxt.text = `${this._time}秒后退出答题`;
                    } else {
                        this.secondTxt.text = `${this._time}秒后跳转到下一题`;
                    }
                }
            }
        }

        public close(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.close();
        }

        public destroy(): void {
            this._bgImgs = this.destroyElement(this._bgImgs);
            this._imgs = this.destroyElement(this._imgs);
            super.destroy();
        }
    }
}