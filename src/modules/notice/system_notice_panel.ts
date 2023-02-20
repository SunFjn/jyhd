/** 系统提示面板*/


namespace modules.notice {
    import Image = Laya.Image;
    import Sprite = Laya.Sprite;
    import Text = Laya.Text;

    export class SystemNoticePanel extends Sprite {
        private _txt: Text;
        private _bg: Image;
        private _warnImg: Image;

        constructor() {
            super();
            this.mouseEnabled = false;

            this._bg = new Image();
            this._bg.skin = "common_sg/txtbg_common_tipsbg.png";
            this._bg.sizeGrid = "10,90,10,90";
            this.addChild(this._bg);

            this._txt = new Text();
            this.addChild(this._txt);
            this._txt.bold = true;
            // this._txt.stroke = 3;
            // this._txt.strokeColor = "#424242";

            this._warnImg = new Image("common/icon_tongyong_9.png");
            this.addChild(this._warnImg);
        }

        // 设置提示文本、提示颜色
        public setTxt(value: string, color: string, isError: boolean) {
            this._txt.text = value;
            this._txt.color = color;

            this._txt.width = this._txt.textWidth;
            this._txt.height = this._txt.textHeight;
            this._warnImg.visible = isError;
            if (isError) {
                this.width = this._bg.width = this._warnImg.width + 4 + this._txt.width + 60;
                this.height = this._bg.height = this._txt.height + 20;
                this._warnImg.pos(30, 4, true);
                this._txt.pos(73, 10, true);
            } else {
                this.width = this._bg.width = this._txt.width + 60;
                this.height = this._bg.height = this._txt.height + 20;
                this._txt.pos(30, 10, true);
            }
        }
    }
}