/** 图片标题文本弹框*/


namespace modules.nine {
    import ImgTitleAlertUI = ui.ImgTitleAlertUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import ScenePromoteFields = Protocols.ScenePromoteFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;

    export class ImgTitleAlert extends ImgTitleAlertUI {
        private _time: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.closeOnSide = false;
            this.contentTxt.color = "#2d2d2d";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.valign = "middle";
            this.contentTxt.style.lineHeight = 28;
            this.contentTxt.mouseEnabled = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Laya.Event.CLICK, this, this.okHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let type: number = value;
            if (type === 1) {     // 九天之巅通关最后一层
                this.titleImg.skin = "nine/txt_jtzd_gxddtxt.png";
                this.contentTxt.innerHTML = `恭喜您通关<span style="color:#EA8706">第8层</span>，即将进入顶层宝箱层！您是<span style="color:#EA8706">第${NineModel.instance.scenePromote[ScenePromoteFields.selfRank]}个</span>登顶者！`;
            } else if (type === 2) {       // 九天之巅通关前几层
                this.titleImg.skin = "nine/txt_jtzd_cgjjtxt.png";
                let lv: number = SceneModel.instance.enterScene[EnterSceneFields.level];
                this.contentTxt.innerHTML = `恭喜您通关<span style="color:#EA8706">第${lv}层</span>，即将进入下一层`;
            }
        }

        public onOpened(): void {
            this._time = BlendCfg.instance.getCfgById(10812)[blendFields.intParam][0] * 0.001;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            Laya.timer.clear(this, this.loopHandler);
        }

        private loopHandler(): void {
            this.okBtn.label = `确定(${this._time})`;
            this._time--;
            if (this._time < 0) {
                Laya.timer.clear(this, this.loopHandler);
                this.enterNextLv();
            }
        }

        private enterNextLv(): void {
            // 倒计时结束请求进入下一层
            DungeonCtrl.instance.reqEnterNextLevel();
            this.close();
        }

        private okHandler(): void {
            this.enterNextLv();
        }
    }
}