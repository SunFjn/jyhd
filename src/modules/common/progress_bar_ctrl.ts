/** 进度条控制器*/


namespace modules.common {
    import Image = Laya.Image;
    import Text = Laya.Text;

    export class ProgressBarCtrl {
        // 进度条
        private _bar: Image;
        // 最大宽度
        private _maxWidth: number;
        // 文本框
        private _txt: Text;
        // 最大值
        private _maxValue: number;
        // 值
        private _value: number;

        constructor(bar: Image, maxWidth: number, txt: Text = null) {
            this._bar = bar;
            this._maxWidth = maxWidth;
            this._txt = txt;
        }

        public get maxValue(): number {
            return this._maxValue;
        }

        public set maxValue(value: number) {
            this._maxValue = value;
        }

        public get value(): number {
            return this._value;
        }

        public set value(t: number) {
            this._value = Math.floor(t);
            t = t / this._maxValue * this._maxWidth >> 0;
            if (t > this._maxWidth) t = this._maxWidth;

            this._bar.width = t + Math.random() / 10;
            // console.log("设置宽度：", this._bar.width + "/" + this._maxWidth);

            if (this._txt) this._txt.text = `${this._value}/${this._maxValue}`;
        }

        public set txt(value: string) {
            if (this._txt) this._txt.text = value;
        }

        public destroy(): void {
            this._bar = null;
            this._txt = null;
        }

        public set moleculeTxt(num: int) {
            this._value = num;
            if (this._txt) this._txt.text = `${this._value}/${this._maxValue}`;
        }
    }
}