namespace modules.monthCard {

    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class MonthCardItem extends ui.MonthCardItemUI {
        private _btnClip: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._btnClip = new CustomClip();
            this.creatEffect();
            this._btnClip.visible = false;
            //this._btnClip.play();
            let prvilege: Configuration.privilege = PrivilegeCfg.instance.getCfgByType(PrivilegeGrade.monthCard);
            let num: number = prvilege[Configuration.privilegeFields.nodes][0][Configuration.PrivilegeNodeFields.param2];
            let _goldItem: BaseItem = new BaseItem();
            _goldItem.dataSource = [90140001, num, null, null];

            this.goldImage.addChild(_goldItem);
            this.reddotImage.visible = false;

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getRewardBtn, Laya.Event.CLICK, this, this.getReward);
        }


        public setData(value: any): void {
            super.setData(value);
            let t: [number, number] = value;
            this.descTxt.text = "第" + (t[0] + 1) + "天可领取";
            this.getRewardBtn.gray = false;
            if (t[1] === 0) {   //0未达到领取天数
                this.getRewardBtn.visible = true;
                this.recevedImage.visible = false;
                this.getRewardBtn.gray = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
            if (t[1] == 1) {   //可领取
                this.getRewardBtn.visible = true;
                this.recevedImage.visible = false;
                this._btnClip.visible = true;
                this._btnClip.play();
                //this.reddotImage.visible=true;
            }
            if (t[1] == 2) {  //已领取
                this.getRewardBtn.visible = false;
                this.recevedImage.visible = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
            }

        }

        private creatEffect(): void {
            this._btnClip.scale(0.9, 0.1);
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.loop = true;
            this._btnClip.pos(this.getRewardBtn.x - 5, this.getRewardBtn.y - 16);
            this._btnClip.visible = false;
        }

        public getReward(): void {
            if (this._data[1] === 0) {
                SystemNoticeManager.instance.addNotice("未达到领取天数", true);
            }
            if (this._data[1] === 1) {
                //领取
                this.getRewardBtn.visible = false;
                this.recevedImage.visible = true;
                this.reddotImage.visible = false;
                MonthCardCtrl.instance.getMonthCardReward(this._data[0]);
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this._btnClip.play();
        }

        public close(): void {
            super.close();
            this._btnClip.stop();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.stop();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }
    }
}
