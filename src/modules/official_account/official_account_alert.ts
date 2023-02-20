namespace modules.officialAccount{
    import OfficialAccountUI = ui.OfficialAccountUI;
    import LayaEvent = modules.common.LayaEvent;
    import BlendCfg = modules.config.BlendCfg;
    import BaseItem = modules.bag.BaseItem;
    import blendFields = Configuration.blendFields;
    import OnceRewardModel = modules.onceReward.OnceRewardModel;
    import CustomClip = modules.common.CustomClip;
    import OnceRewardId = ui.OnceRewardId;
    import OnceRewardCtrl = modules.onceReward.OnceRewardCtrl;

    export class OfficialAccountAlert extends OfficialAccountUI{
        private _items:Array<BaseItem>;
        private _btnClip: CustomClip;

        constructor(){
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._items = [this.item1, this.item2, this.item3, this.item4];
            let arr:Array<number> = BlendCfg.instance.getCfgById(OnceRewardId.officialAccount)[blendFields.intParam];
            let len:int = arr.length / 2;
            let offset:number = 444 - (len * 106 + (len - 1) * 8) * 0.5;
            for(let i:int = 0; i < len; i++){
                this._items[i].visible = true;
                this._items[i].x = offset + i * 106 + (i - 1) * 8;
                this._items[i].dataSource = [arr[i * 2], arr[i * 2 + 1], 0, null];
            }

            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let tArr:Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                tArr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = tArr;
            this._btnClip.pos(342, 826, true);
            // this._btnClip.scale(0.8, 0.8, true);
            this._btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.focusBtn, LayaEvent.CLICK, this, this.focusHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OFFICAL_ACCOUNT_STATUS_CHANGE, this, this.statusChangeHandler);
        }

        onOpened(): void {
            super.onOpened();
            this.statusChangeHandler();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._btnClip.visible = false;
            this._btnClip.stop();
        }

        private focusHandler():void{
            if(OfficialAccountModel.instance.status !== 0) {
                OfficialAccountCtrl.instance.focusOfficialAccount();
            }else{
                let ids:Array<number> = OnceRewardModel.instance.gotAwardIds;
                if(ids && ids.indexOf(OnceRewardId.officialAccount) === -1){
                    OfficialAccountCtrl.instance.getAward();
                }
            }
        }

        private statusChangeHandler():void{
            if(OfficialAccountModel.instance.status === 0){
                this.focusBtn.label = "领取奖励";
                this._btnClip.visible = true;
                this._btnClip.play();
            }else{
                this.focusBtn.label = "前往关注";
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        destroy(): void {
            this._btnClip.stop();
            this._btnClip.removeSelf();
            this._btnClip.destroy(true);
            this.destroyElement(this._items);
            super.destroy();
        }
    }
}