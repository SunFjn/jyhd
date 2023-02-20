///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
namespace modules.vip {
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import Event = Laya.Event;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;
    import CustomClip = modules.common.CustomClip;

    export class VipMeiRiRewordAlert extends ui.VipMeiRiRewordAlertUI {
        private _list: CustomList;
        private _challengeClip: CustomClip;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 522;
            this._list.height = 130;
            this._list.hCount = 4;
            this._list.spaceX = 30;
            this._list.spaceY = 17;
            //  30=  this._list.spaceX * (this._list.hCount );
            this._list.itemRender = modules.yunmeng.YunMengItem;
            this._list.x = 69;
            this._list.y = 125;
            this.addChild(this._list);


            this._challengeClip = new CustomClip();
            this.sureBtn.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-5, -17, true);
            this._challengeClip.scale(1, 1.2)
            this._challengeClip.skin = "assets/effect/btn_light.atlas";
            this._challengeClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._challengeClip.durationFrame = 5;
            this._challengeClip.visible = false;
        }

        public onOpened(): void {
            super.onOpened();
            let dengji = VipModel.instance.vipLevel;
            dengji = dengji == 0 ? 1 : dengji;
            let cfg: privilege = VipModel.instance.getVipCfgByLevel(dengji);
            if (cfg) {
                let reward = cfg[privilegeFields.dayReward];
                if (reward) {
                    this._list.datas = reward;
                }
            }
            this.titleTxt.text = "SVIP" + dengji + "每日奖励";
            this.showMeiRiBox();
            this.showRewardList();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._challengeClip) {
                this._challengeClip.removeSelf();
                this._challengeClip.destroy();
                this._challengeClip = null;
            }
            super.destroy();
        }

        public setOpenParam(value: Array<Item>): void {
            super.setOpenParam(value);


        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.showMeiRiBox);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
        }

        /**
         * sureBtnHandler
         */
        public sureBtnHandler() {
            if (VipModel.instance.vipLevel > 0) {
                VipCtrl.instance.getVipDayReward();
            }
            else {
                modules.notice.SystemNoticeManager.instance.addNotice("SVIP1可领取", true);
            }
        }

        public showMeiRiBox() {
            if (VipModel.instance.dayRewardState == false && VipModel.instance.vipLevel > 0) {
                this._challengeClip.play();
                this._challengeClip.visible = true;
            } else {
                this._challengeClip.stop();
                this._challengeClip.visible = false;
            }
            this.sureBtn.visible = !VipModel.instance.dayRewardState;
            this.receiveImg.visible = VipModel.instance.dayRewardState;
        }

        public showRewardList(): void {
            let leng = this._list.datas.length;
            leng = leng > 5 ? 5 : leng;
            let chagndu = leng * 100 + (leng - 1) * this._list.spaceX;
            this._list.x = (this.width - chagndu) / 2;
        }
    }
}