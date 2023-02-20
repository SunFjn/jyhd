/**
 * 在线礼包Item
 */
namespace modules.onlineGift {
    import online_reward = Configuration.online_reward;
    import online_rewardFields = Configuration.online_rewardFields;
    import SignItem = modules.sign.SignItem;
    import idCountFields = Configuration.idCountFields;
    import Point = laya.maths.Point;
    import Event = laya.events.Event;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import OnlineRewardFields = Protocols.OnlineRewardFields;
    import OnlineGiftCfg = modules.config.OnlineGiftCfg;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ErrorCodeCfg = modules.config.ErrorCodeCfg;
    import erorr_codeFields = Configuration.erorr_codeFields;

    export class OnlineGiftItem extends ui.OnLineGiftItemUI {
        private _itemCfg: online_reward;
        private _itemArray: Array<SignItem>;
        private _pos: Point = new Point(30, 52);
        private _itemId: number;
        private _wid: number = 95;
        private _obtaintime: number;
        private _obtainClip: CustomClip;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._obtainClip) {
                this._obtainClip.removeSelf();
                this._obtainClip.destroy();
                this._obtainClip = null;
            }

            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._itemArray = new Array<SignItem>();
            this._obtainClip = new CustomClip();
            this.getBtn.addChildAt(this._obtainClip, 0);
            this._obtainClip.pos(-6, -16, true);
            this._obtainClip.scale(0.98, 1, true);
            this._obtainClip.skin = "assets/effect/btn_light.atlas";
            this._obtainClip.frameUrls = [
                "btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png"
                , "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._obtainClip.durationFrame = 5;
            this.createItem();
        }

        protected addListeners(): void {
            super.addListeners();
            this.getBtn.on(Event.CLICK, this, this.gainHandler);
            GlobalData.dispatcher.on(CommonEventType.AWARD_REPLY, this, this.awardReply);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.getBtn.off(Event.CLICK, this, this.gainHandler);
            GlobalData.dispatcher.off(CommonEventType.AWARD_REPLY, this, this.awardReply);

            Laya.timer.clear(this, this.updatetime);
        }

        public awardReply(): void {
            let result: number = OnlineGiftModel.instance.AwardReply;
            if (result == 0) {
                SystemNoticeManager.instance.addNotice(ErrorCodeCfg.instance.getErrorCfgById(ErrorCode.ORReceive)[erorr_codeFields.msg_ZN], false);
            }
        }

        public updatetime() {
            let str = CommonUtil.timeStampToHHMMSS(this._obtaintime);
            if (this._obtaintime < GlobalData.serverTime) {
                this.time.visible = false;
            } else {
                this.time.visible = true;
            }
            this.time.text = "倒计时 " + str;
        }

        private createItem() {
            for (let i = 0; i < 3; i++) {
                let baseItem = new SignItem();
                baseItem.scale(0.8, 0.8);
                baseItem.visible = false;
                baseItem.nameVisible = false;
                this.addChild(baseItem);
                this._itemArray.push(baseItem);
            }
        }

        protected setData(value: any): void {
            super.setData(value);
            this._itemCfg = value;
            let state = this._itemCfg[OnlineRewardFields.state];
            /*状态 0未达成 1可领取 2已领取*/
            this.getBtn.visible = this.receiveImg.visible = true;
            this._obtainClip.stop();
            this._obtainClip.visible = false;
            if (state == OnlineRewardState.not) { //0未达成 
                this.receiveImg.skin = `common/txt_commmon_wdc.png`;
                this._obtainClip.stop();
                this._obtainClip.visible = false;
                this.getBtn.visible = false;
            } else if (state == OnlineRewardState.can) {//1可领取 
                this._obtainClip.play();
                this._obtainClip.visible = true;
                this.receiveImg.visible = false;
            } else { //2 和3 已领取
                this.receiveImg.skin = `common/txt_commmon_ylq.png`;
                this._obtainClip.stop();
                this._obtainClip.visible = false;
                this.getBtn.visible = false;
            }
            this._obtaintime = this._itemCfg[OnlineRewardFields.time];
            if (this._obtaintime > GlobalData.serverTime) {
                this.updatetime();
                this.time.visible = true;
                Laya.timer.loop(1000, this, this.updatetime);
            } else {
                this.time.visible = false;
                Laya.timer.clear(this, this.updatetime);
            }

            this._itemId = this._itemCfg[OnlineRewardFields.id];
            let itemCfg = OnlineGiftCfg.instance.getCfgsById(this._itemId);
            this.tips.text = itemCfg[online_rewardFields.time] / 60000 + "分钟";
            this.followTip.pos(this.tips.x + this.tips.width, this.tips.y);
            let rewards = itemCfg[online_rewardFields.reward];
            let len = rewards.length;
            for (let i = 0; i < 3; i++) {
                let baseItem = this._itemArray[i];
                if (i < len) {
                    let itemId = rewards[i][idCountFields.id];
                    let count = rewards[i][idCountFields.count];
                    baseItem.dataSource = [itemId, count, 0, null];
                    baseItem.pos(this._pos.x + this._wid * i, this._pos.y);
                    baseItem.visible = true;
                } else {
                    baseItem.visible = false;
                }
            }
        }

        protected onOpened(): void {
            super.onOpened();
            // this._obtainClip.play();
        }

        public gainHandler(): void {
            let state = this._itemCfg[OnlineRewardFields.state];
            /*状态 0未达成 1可领取 2已领取*/
            switch (state) {
                case 1:
                    Channel.instance.publish(UserFeatureOpcode.GetOnlineRewardAward, [this._itemId]);
                    break;
                case 0:
                    CommonUtil.noticeError(ErrorCode.ORWithoutTime);
                    break;
            }
        }

        public close(): void {
            super.close();
            this._obtainClip.stop();

        }
    }
}