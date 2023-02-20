/**单人boss单元项*/
///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
namespace modules.feed_back {
    import Feedback = Protocols.Feedback;
    import FeedbackFields = Protocols.FeedbackFields;
    export class FeedBackkItem extends ui.FeedBackItemUI {
        constructor() {
            super();
        }


        private _Date: Feedback;
        protected initialize(): void {
            super.initialize();
            this.yiJianHtml.color = "#585858";
            this.yiJianHtml.style.fontFamily = "SimHei";
            this.yiJianHtml.style.fontSize = 22;
            this.yiJianHtml.style.align = "left";
            this.yiJianHtml.width = 528;
            this.yiJianHtml.style.leading = 5;

            this.daFuHtml.color = "#585858";
            this.daFuHtml.style.fontFamily = "SimHei";
            this.daFuHtml.style.fontSize = 22;
            this.daFuHtml.style.align = "left";
            this.daFuHtml.width = 528;
            this.daFuHtml.style.leading = 5;

            this.timeHtml.color = "#3a5385";
            this.timeHtml.style.fontFamily = "SimHei";
            this.timeHtml.style.fontSize = 22;
            this.timeHtml.style.align = "right";
            this.timeHtml.style.leading = 5;
            // this.timeHtml.style.lineHeight = 28;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();
            // this.adaptiveaText();
        }

        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        protected setData(value: Feedback): void {
            super.setData(value);
            if (value) {
                this._Date = value;
                this.updateUI();
            }

        }

        public updateUI() {
            this.showText();
        }
        public timeStampToDate(ms: number): string {
            let date: Date = new Date(ms);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            let monthStr = `` + month;
            if (month < 10) {
                monthStr = `0${month}`;
            }
            let dayStr = `` + day;
            if (day < 10) {
                dayStr = `0${day}`;
            }
            let str: string = `${year}-${monthStr}-${dayStr}`;
            return str;
        }
        public timeStampToDate1(ms: number): string {
            let date: Date = new Date(ms);
            let hours = date.getHours();
            let minute = date.getMinutes();
            let seconds = date.getSeconds();

            let minuteStr = `` + minute;
            if (minute < 10) {
                minuteStr = `0${minute}`;
            }
            let secondsStr = `` + seconds;
            if (seconds < 10) {
                secondsStr = `0${seconds}`;
            }
            let str: string = `${hours}:${minuteStr}:${secondsStr}`;
            return str;
        }
        public showText() {
            // ask = 1,			/*提问*/
            //     reply = 2,			/*回复*/
            //     time = 3,			/*回复时间*/
            let yijian = this._Date[FeedbackFields.ask];
            let dafu = this._Date[FeedbackFields.reply];
            let tm = this.timeStampToDate1(this._Date[FeedbackFields.time]);
            let rq = this.timeStampToDate(this._Date[FeedbackFields.time]);
            let time = rq + " " + tm;
            // console.log("time:   " + time);
            this.yiJianHtml.innerHTML = `意见:<span style='color:#3a5385'>${yijian}</span>`;
            this.daFuHtml.innerHTML = `答复:<span style='color:#3a5385'>${dafu}</span>`;
            this.timeHtml.innerHTML = `<span style='color:#168a17'>${time}</span>`;
            this.setPosHight();
        }
        public setPosHight() {
            this.daFuHtml.y = this.yiJianHtml.y + this.yiJianHtml.contextHeight + 5;
            this.timeHtml.y = this.daFuHtml.y + this.daFuHtml.contextHeight + 5;
            this.height = this.yiJianHtml.y + this.yiJianHtml.contextHeight + this.daFuHtml.contextHeight + this.timeHtml.contextHeight + 15;
        }
    }
}