namespace modules.buff {
    import EffectCfg = modules.config.EffectCfg;
    import Text = laya.display.Text;
    import Event = laya.events.Event;
    import Buff = Protocols.Buff;
    import Image = Laya.Image;
    import effect = Configuration.effect;
    import BuffFields = Protocols.BuffFields;
    import effectFields = Configuration.effectFields;
    import LayaEvent = modules.common.LayaEvent;

    export class BuffAlert extends ui.BuffAlertUI {
        private _timeTxts: Array<Text>;
        private _iconBgs: Array<Image>;
        private _icons: Array<Image>;
        private _nameTxts: Array<Text>;
        private _descTxts: Array<Text>;
        private _lines: Array<Image>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 80;
            this.top = 140;
            this.mouseThrough = false;
            this.mouseEnabled = true;
            this._timeTxts = new Array<laya.display.Text>();
            this._iconBgs = new Array<Image>();
            this._icons = new Array<Laya.Image>();
            this._nameTxts = new Array<Text>();
            this._descTxts = new Array<Text>();
            this._lines = new Array<Laya.Image>();
            this.height = 172;
            this.bgImg.height = 172;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_BUFF_LIST, this, this.updateBuffList);
            this.addAutoListener(Laya.stage, LayaEvent.MOUSE_DOWN, this, this.stageClickHandler);
            Laya.timer.loop(1000, this, this.loopHandler);

        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened() {
            super.onOpened();
            this.updateBuffList();
        }

        private stageClickHandler(e: Event): void {
            if (e.target !== this.bgImg && e.target !== this) {
                this.close();
            }
        }

        private setTime(timeTxt: Text, time: number): void {
            time = Math.floor(time * 0.001);
            if (time >= 3600) {
                if (time % 3600 === 0) {
                    timeTxt.text = `${time / 3600}小时`;
                } else {
                    timeTxt.text = (time / 3600).toFixed(1) + "小时";
                }
            } else if (time >= 60) {
                if (time % 60 === 0) {
                    timeTxt.text = `${time / 60}分钟`;
                } else {
                    timeTxt.text = Math.floor(time / 60) + "分钟" + time % 60 + "秒";
                }
            } else if (time >= 0) {
                timeTxt.text = time + "秒";
            } else if (time < 0) {
                timeTxt.text = "0秒";
            }
        }

        private updateBuffList(): void {
            this.bgImg.height = 172;
            this.height = 172;
            this.removeChildren(1);
            let buffs: Array<Buff> = BuffModel.instance.buffs;
            if (buffs) {
                for (let i: int = 0, len: int = buffs.length; i < len; i++) {
                    let buff: Buff = buffs[i];
                    let cfg: effect = EffectCfg.instance.getCfgById(buff[BuffFields.buffId]);
                    if (i !== len - 1) {
                        let line: Image = this._lines[i];
                        if (!line) {
                            line = new Image("common_sg/split_common_fgx3.png");
                            line.size(415, 2);
                            this._lines.push(line);
                        }
                        this.addChild(line);
                        line.pos(10, 79 + i * 80, true);
                    }

                    let iconBg: Image = this._iconBgs[i];
                    if (!iconBg) {
                        iconBg = new Image("buff/iconbg_buff.png");
                        this._iconBgs.push(iconBg);
                        iconBg.zOrder = 1;
                    }
                    this.addChild(iconBg);
                    iconBg.pos(13, 13 + i * 80, true);

                    let icon: Image = this._icons[i];
                    if (!icon) {
                        icon = new Image();
                        this._icons.push(icon);
                        icon.zOrder = 2;
                    }
                    this.addChild(icon);
                    icon.skin = `assets/icon/buff/${cfg[effectFields.icon]}.png`;
                    icon.pos(iconBg.x, iconBg.y, true);

                    let nameTxt: Text = this._nameTxts[i];
                    if (!nameTxt) {
                        nameTxt = new Text();
                        this._nameTxts.push(nameTxt);
                        nameTxt.zOrder = 3;
                        nameTxt.color = "#0ecf09";
                        nameTxt.font = "SimHei";
                        nameTxt.fontSize = 20;
                        nameTxt.width = 123;
                        nameTxt.height = 22;
                    }
                    this.addChild(nameTxt);
                    nameTxt.text = cfg[effectFields.name];
                    nameTxt.pos(iconBg.x + 64, iconBg.y + 2, true);

                    let timeTxt: Text = this._timeTxts[i];
                    if (!timeTxt) {
                        timeTxt = new Text();
                        this._timeTxts.push(timeTxt);
                        timeTxt.zOrder = 3;
                        timeTxt.color = "#50ff28";
                        timeTxt.font = "SimHei";
                        timeTxt.fontSize = 20;
                        timeTxt.width = 80;
                        timeTxt.height = 20;
                        timeTxt.align = "right";
                    }
                    this.addChild(timeTxt);
                    timeTxt.pos(iconBg.x + 300, iconBg.y + 2, true);

                    let descTxt: Text = this._descTxts[i];
                    if (!descTxt) {
                        descTxt = new Text();
                        this._descTxts.push(descTxt);
                        descTxt.zOrder = 3;
                        descTxt.color = "#ffffff";
                        descTxt.font = "SimHei";
                        descTxt.fontSize = 20;
                    }
                    this.addChild(descTxt);
                    descTxt.pos(iconBg.x + 64, iconBg.y + 33, true);
                    descTxt.text = cfg[effectFields.desc];
                }

                let h: number = buffs.length * 80;
                this.bgImg.height = this.height = h > 172 ? h : 172;
                this.loopHandler();
            }
        }

        private loopHandler(): void {
            let buffs: Array<Buff> = BuffModel.instance.buffs;
            for (let i: number = 0, len: int = buffs.length; i < len; i++) {
                let buff: Buff = buffs[i];
                this.setTime(this._timeTxts[i], buff[BuffFields.endTime] - GlobalData.serverTime);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._timeTxts) {
                for (let e of this._timeTxts) {
                    e.destroy(true);
                }
                this._timeTxts = null;
            }

            if (this._iconBgs) {
                for (let e of this._iconBgs) {
                    e.destroy(true);
                }
                this._iconBgs = null;
            }

            if (this._icons) {
                for (let e of this._icons) {
                    e.destroy(true);
                }
                this._icons = null;
            }

            if (this._nameTxts) {
                for (let e of this._nameTxts) {
                    e.destroy(true);
                }
                this._nameTxts = null;
            }

            if (this._descTxts) {
                for (let e of this._descTxts) {
                    e.destroy(true);
                }
                this._descTxts = null;
            }

            if (this._lines) {
                for (let e of this._lines) {
                    e.destroy(true);
                }
                this._lines = null;
            }

            super.destroy(destroyChild);
        }
    }
}