/** 服务器广播跑马灯面板*/
///<reference path="../config/broadcast_cfg.ts"/>

namespace modules.notice {
    import ChatUtil = modules.chat.ChatUtil;
    import Clip = Laya.Clip;
    import Component = Laya.Component;
    import Image = Laya.Image;
    //import Text = Laya.Text;
    import HTMLDivElement = Laya.HTMLDivElement;
    import Event = Laya.Event;

    const enum linkType {
        linkPage = 0, // 为0时跳转界面
    }

    export class ServerBroadcastPanel extends Component {
        private _bg: Image;
        //private _txt: Text;
        private _html: HTMLDivElement;
        private _effect: Clip;
        private _type: number;
        private _linkId: number;
        private maskImg: Image;
        private _broadcasts: Array<string> = new Array<string>();
        private _isPlaying: boolean = false;

        constructor() {
            super();

            this.centerX = 0.5;
            this.top = 150;

            this._bg = new Image("common/txtbg_mainui_pmd.png");
            this._bg.sizeGrid = "0,24,0,24";

            this.addChild(this._bg);
            this._bg.width = 640;
            this._bg.height = 40;
            this.width = this._bg.width;
            this.height = this._bg.height;


            // this._txt = new Text();
            // this.addChild(this._txt);
            // this._txt.width = 560;
            // this._txt.pos(46, 10, true);
            // this._txt.wordWrap = true;

            this._html = new HTMLDivElement();
            this.addChild(this._html);
            this._html.style.height = 24;
            this._html.pos(46, 8, true);
            this._html.style.fontFamily = "SimHei";
            this._html.style.fontSize = 22;
            this._html.style.wordWrap = false;
            this._html.color = "#FFFFFF";

            this.maskImg = new Image("common_sg/image_common_zz.png");
            this.maskImg.width = 640;
            this.maskImg.height = 40;
            this.maskImg.sizeGrid = "1,1,1,1";
            this.mask = this.maskImg;


            this._effect = new Clip();
            this.addChild(this._effect);

            this.anchorX = this.anchorY = 0.5;
            this.on(Event.DISPLAY, this, this.displayHandler);
            this.on(Event.UNDISPLAY, this, this.undisplayHandler);
        }

        private displayHandler(): void {
            this._html.on(Event.LINK, this, this.linkHandler);
        }

        private undisplayHandler(): void {
            this._html.off(Event.LINK, this, this.linkHandler);
        }

        private linkHandler(value: string): void {
            ChatUtil.linkHandler(value);
        }

        public setTxt(txt: string): void {
            this._html.innerHTML = txt;
        }

        public addBroadcast(txt: string): void {
            this._broadcasts.push(txt);
            if (!this._isPlaying) {
                this.tween();
            }
        }

        private tween(): void {
            this._isPlaying = true;
            this._html.pos(640, this._html.y);
            let broadcast: string = this._broadcasts.shift();
            this.setTxt(broadcast);
            TweenJS.create(this._html).to({x: 20}, 600).chain(
                TweenJS.create(this._html).to({x: 0 - this._html.contextWidth}, 5000).chain(
                    TweenJS.create(this._html).delay(0).onComplete(this.delayHandler.bind(this))
                ).delay(2000)
            ).start();

        }

        private delayHandler(): void {
            if (this._broadcasts.length > 0) {
                this.tween();
            } else {
                this._isPlaying = false;
                this.removeSelf();
            }
        }
    }
}
