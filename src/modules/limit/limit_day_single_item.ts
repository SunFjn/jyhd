///<reference path="../config/limit_day_single_cfg.ts"/>
//每日累充
namespace modules.limit {
    import LimitSingleItemUI = ui.LimitDaySingleItemUI;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;

    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;
    import daySinglePayReward = Protocols.daySinglePayReward;
    import daySinglePayRewardFields = Protocols.daySinglePayRewardFields;
    import limit_daysingleFields = Configuration.limit_daysingleFields
    import limit_daysingle = Configuration.limit_daysingle
    export class LimitDaySingleItem extends LimitSingleItemUI {
        private _cfg: limit_daysingle;
        private _btnClip: CustomClip;
        private _itemId: number;
        private _itemIdAr: number[];
        private _stateMoney: number;
        private _count: number;
        private useCount: number;
        private restCount: number;

        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            //用于设置控件属性 或者创建新控件
            this._itemId = 0;
            this._itemIdAr = [];
            this._count =0
            this.useCount =0
            this.restCount =0
            this.cumulateText.color = "#5d2606";
            this.cumulateText.style.fontFamily = "SimHei";
            this.cumulateText.style.fontSize = 26;
            this.CanBuyHTML.color = "#e0b75f";
            this.CanBuyHTML.style.fontFamily = "SimHei";
            this.CanBuyHTML.style.fontSize = 26;
            this.CanBuyHTML.style.align = "left";
            this.creatEffect();
        }

        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -18, true);
            this._btnClip.scale(0.81, 1.1);
            this._btnClip.visible = false;
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_DAY_CUMULATE_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            this.updateView();
        }

        private updateView(): void {
            //更新累充豪礼面板状态 和累充事件绑定
            this.setBtnSure();
            this.setMoney();
        }


        protected setData(value: limit_daysingle): void {
            this._cfg = value as limit_daysingle;
            let awardArr: Array<Items> = [];
            this._itemId = this._cfg[limit_daysingleFields.id];
            this._count = this._cfg[limit_daysingleFields.count];

            this._itemIdAr.push(this._cfg[limit_daysingleFields.id]);
            let showIdArr: number[] = [];
            awardArr = this._cfg[limit_daysingleFields.reward];
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            this.setMoney();
            let count: number = showIdArr.length;
            let DayBase: BaseItem[] = [];
            DayBase.push(this.cumulateBase1);
            DayBase.push(this.cumulateBase2);
            DayBase.push(this.cumulateBase3);
            DayBase.push(this.cumulateBase4);
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            this.setBtnSure();

        }

        private sureBtnHandler(): void {
        
            if (this.restCount<=0) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                WindowManager.instance.close(WindowEnum.CUMULATE_PAY2_UPDATE);
            }else{
                let rewards: Array<Items> = this._cfg[limit_daysingleFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    LimitDaySingleCtrl.instance.GetLimitXunBaoDaySinglePayReward([this.bigtype,this._itemId]);
                }
            }
        }

        private setBtnSure(): void {
        //    未领取次数=总次数-已领取 / 总次数
        //   已领取 : 总次数-已领取次数（useCount）<1
        //   未领取（restCount）>0 ? 可领取（激活领取按钮） : 前往充值

            let rewarList: daySinglePayReward = LimitDaySingleModel.instance.getRewardById(this.bigtype,this._itemId);
            this.useCount  =  rewarList ? rewarList[daySinglePayRewardFields.useCount]:0
            this.restCount =rewarList ? rewarList[daySinglePayRewardFields.restCount]:0
            let notCount = this._count-this.useCount
            if(!notCount){
                notCount =this._count
            }
            let str = `${notCount}/${this._count}`
         
            this.CanBuyHTML.innerHTML = `任务次数:<span style='color:#FF3e3e'>${str}</span>`;
            if(this.useCount >=  this._count){
                
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.receivedImg.visible = true;
                this.sureBtn.visible = false;
                this.CanBuyHTML.innerHTML = ""
            return
            }
            if(this.restCount > 0){

                this.sureBtn.label = "领取";
                this._btnClip.play();
                this._btnClip.visible = true;
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
            }else{
                this.sureBtn.label = "前往充值";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;
                // console.log("前往领取");
             
            }
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }
        private setMoney(): void {
            this._stateMoney = LimitDayCumulateModel.instance.totalMoney(this.bigtype);
            this.cumulateText.innerHTML = `${this._cfg[limit_daysingleFields.money]}元<span style='color:#ffffff'>&nbsp;,可领取奖励！</span>`;
    
        }}
}