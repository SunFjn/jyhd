namespace modules.money_cat{
    import CustomClip = modules.common.CustomClip;
    import BaseItem=modules.bag.BaseItem;
    import money_cat = Configuration.money_cat;
    import money_catFields = Configuration.money_catFields;
    import RechargeCfg = config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import BlendCfg = config.BlendCfg;
    import blend = Configuration.blend;
    import blendFields = Configuration.blendFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class MoneyCatBuyAlert extends ui.MoneyCatBuyAlertUI{

        private _getBtnEff: CustomClip;  //获取按钮按钮粒子效果

        protected initialize(): void {
            super.initialize();

            //按钮粒子效果
            this._getBtnEff = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.getBtn.addChild(this._getBtnEff);
            this._getBtnEff.pos(-7, -18);
            this._getBtnEff.scale(1.1,1.2);
            this._getBtnEff.scaleY = 1.2;
            this._getBtnEff.visible=true;
            this._getBtnEff.play();

            let arr:Array<number>= BlendCfg.instance.getCfgById(49001)[blendFields.intParam];
            let items:Array<BaseItem>=[this.item0,this.item1,this.item2,this.item3,this.item4,this.item5];
            for(let i = 0;i<6;++i){
                if(!arr[i*2]){break;}
                items[i].dataSource=[arr[i*2],arr[i*2+1],0,null];
            }

            let rewardItemID:number=RechargeCfg.instance.getRecharCfgByIndex(4)[rechargeFields.reward][0][ItemsFields.itemId];
            let itemType: number = CommonUtil.getItemTypeById(rewardItemID);
            if (itemType == ItemMType.Unreal) {
                this.rewardItemImg.skin = CommonUtil.getIconById(rewardItemID, true);
            } else {
                this.rewardItemImg.skin = CommonUtil.getIconById(rewardItemID, false);
            }
        }

        public destroy():void{
            this._getBtnEff = this.destroyElement( this._getBtnEff);
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn,Laya.Event.CLICK,this,this.getBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.update);       //画面刷新事件
        }

        public onOpened(): void {
            super.onOpened();
            this.update();
        }

        private update():void{
            //如果已激活，关闭窗口
            // if(MoneyCatModel.instance.actived>=0){
            //     this.close();
            //     return;
            // }

            this.returnTxt.text=`现在投资可立即返还${RechargeCfg.instance.getRecharCfgByIndex(4)[rechargeFields.reward][0][ItemsFields.count]}`;
            if(MoneyCatModel.instance.state){
                if(MoneyCatModel.instance.actived==-1){
                    this.getBtn.visible=true;
                    this.getBtn.label="领取";
                    this._getBtnEff.play();
                }
                else{
                    this.getBtn.visible=false;
                    this._getBtnEff.stop();
                    this._getBtnEff.visible=false;
                }
            }
            else{
                this.getBtn.visible=true;
                this.getBtn.label=`${RechargeCfg.instance.getRecharCfgByIndex(4)[rechargeFields.price]}元投资`;
                this._getBtnEff.visible=true;
                this._getBtnEff.play();
            }
        }

        private getBtnHandler():void{
            //state为true是已购买，是已领取用已激活重数是否为-1来判断
            if(MoneyCatModel.instance.state){
                MoneyCatCtrl.instance.activeMoneyCat();
            }
            else{
                let price:number = RechargeCfg.instance.getRecharCfgByIndex(4)[rechargeFields.price];
                PlatParams.askPay(4,price);        //购买战力护符
            }
        }
    }
}