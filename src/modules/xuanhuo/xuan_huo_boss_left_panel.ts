namespace modules.xuanhuo {
    import Event = Laya.Event;

    export class XuanhuoBossLeftPanel extends ui.XuanhuoBossLeftViewUI {

        private _tipBox1Tween: TweenJS;


        protected initialize(): void {
            super.initialize();
            this.left = 17;
            this.bottom = 400;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.handBookBtn, Event.CLICK, this, this.handBookBtnHandler);
            this.addAutoListener(this.rankListBtn, Event.CLICK, this, this.rankListBtnHandler);
            this.addAutoRegisteRedPoint(this.handbookRPImg, ["shenYuBossRP"]);
        }

        public onOpened(): void {
            super.onOpened();
        }


        //打开玄火获取奖励
        private handBookBtnHandler(): void {
      


           

         WindowManager.instance.open(WindowEnum.XUANHUO_GET_AWARD_ALERT);
        }

       

     
        private rankListBtnHandler(): void {
            //打开排行榜
            WindowManager.instance.open(WindowEnum.XUANHUO_RANK_COPY_ALERT);
            // WindowManager.instance.open(this._type ? WindowEnum.BOSS_HOME_AWARD_ALERT : WindowEnum.SHENGYU_BOSS_SHOUYI_ALERT);
        }

        public close(): void {
            super.close();
     
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}