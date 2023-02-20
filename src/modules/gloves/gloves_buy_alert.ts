/** 装备购买弹框*/



namespace modules.gloves{
    import GlovesBuyAlertUI = ui.GlovesBuyAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import LayaEvent = modules.common.LayaEvent;
    import CustomClip = modules.common.CustomClip;

    export class GlovesBuyAlert extends GlovesBuyAlertUI{
        private _items:Array<BaseItem>;
        private _btnClip: CustomClip;

        protected initialize(): void {
            super.initialize();
            this._items = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6];
            this.item1.needTip = false;

            let arr:Array<number> = BlendCfg.instance.getCfgById(51001)[blendFields.intParam];
            for(let i:int = 0, len:int = arr.length; i < len; i += 2){
                this._items[i * 0.5].dataSource = [arr[i], arr[i + 1], 0, null];
            }

            this._btnClip = CommonUtil.creatEff(this, `btn_light`, 15);
            this._btnClip.pos(this.buyBtn.x + 42, this.buyBtn.y + 32, true);
            this._btnClip.scale(1.47, 1.25);
            this._btnClip.visible = true;
            this._btnClip.play();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.updateInfo);
            this.addAutoListener(this.buyBtn, LayaEvent.CLICK, this, this.buyClickHandler);
            this.addAutoListener(this.item1, LayaEvent.CLICK, this, this.glovesClickHandler);
        }

        onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this.updateInfo();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._btnClip.stop();
        }

        private updateInfo():void{
            let info:GetGauntletReply = GlovesModel.instance.glovesInfo;
            if(!info) return;
            let state:number = info[GetGauntletReplyFields.state];
            if(state === -1){
                this.buyBtn.label = "立即抢购";
                this._btnClip.visible = true;
                this.buyBtn.visible = true;
                this.gotImg.visible = false;
            }else if(state === 0){
                this.buyBtn.label = "领取奖励";
                this._btnClip.visible = true;
                this.buyBtn.visible = true;
                this.gotImg.visible = false;
            }else if(state === 1){
                this._btnClip.visible = false;

                this.buyBtn.visible = false;
                this.gotImg.visible = true;
            }
        }

        private buyClickHandler():void{
            let info:GetGauntletReply = GlovesModel.instance.glovesInfo;
            if(!info) return;
            let state:number = info[GetGauntletReplyFields.state];
            if(state === -1) {
                GlovesCtrl.instance.buy(RechargeId.gauntlet);
            }else{
                GlovesCtrl.instance.drawGauntlet();
            }
        }

        private glovesClickHandler():void{
            WindowManager.instance.open(WindowEnum.GLOVES_TIPS_ALERT);
        }

        destroy(): void {
            this._items = this.destroyElement(this._items);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy();
        }
    }
}