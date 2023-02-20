namespace modules.weekConsume{
    import WeekConsumeCfg = modules.config.WeekConsumeCfg;
    import week_consume = Configuration.week_consume;
    import week_consumeFields = Configuration.week_consumeFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import ThreeNumber=Protocols.ThreeNumber;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    enum DatFields{
        id=0,       //id
        state=1,    //状态：0不可领，1可领，2已领
        consume=2,  //消费代币券数
    }

    export class WeekConsumeItem extends ui.WeekConsumeItemUI{
        private _dat: ThreeNumber;      //[id,状态：0不可领，1可领，2已领,消费代币券数]
        private _btnClip: CustomClip;

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
            this.conditionTxt.color = "#ffffff";
            this.conditionTxt.style.fontFamily = "SimHei";
            this.conditionTxt.style.fontSize = 26;
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, Laya.Event.CLICK, this, this.sureBtnHandler);       //领取按钮
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_CONSUME_ITEM_UPDATE, this, this.updateView);       //画面刷新事件
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this.updateView();
        }

        private updateView(): void {
            //如果活动结束，替换成已结束
            if(WeekConsumeModel.instance.state==false){
                this.sureBtn.label="";
                this.sureBtn.skin="common/txt_commmon_yjies.png";
                this._btnClip.visible = false;
            }
        }

        protected setData(value: ThreeNumber): void {
            this._dat = value;
            let wcCfg=WeekConsumeCfg.instance.getCfgByID(this._dat[DatFields.id]);
            let curConsume=this._dat[DatFields.consume];            //当前消费代币券数
            let needConsume=wcCfg[week_consumeFields.consume];   //需要消费代币券数
            //条件显示
            this.conditionTxt.innerHTML = `累计消费<span style='color:#ffffff'>&nbsp;${needConsume}</span>代币券,可领取奖励！`;
            //消费代币券显示
            if(curConsume>=needConsume){this.consumeTxt.color="#16ba17";}
            else{this.consumeTxt.color="#FF3e3e"}
            this.consumeTxt.text=`(${curConsume}/${needConsume})`;
            //奖励道具显示
            let rewardArr:Array<Items>=wcCfg[week_consumeFields.award];
            let DayBase: modules.bag.BaseItem[] = [this.reward0,this.reward1,this.reward2,this.reward3];
            for (let i: int = 0; i < 4; i++) {
                if (i < rewardArr.length) {
                    DayBase[i].visible = true;
                    DayBase[i].dataSource = [rewardArr[i][ItemsFields.itemId], rewardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            this.setBtnState();
        }

        private setBtnState(): void {
            this.sureBtn.label="领取";
            this.sureBtn.skin="common/btn_tongyong_23.png";
            if(this._dat[DatFields.state]==0){
                this._btnClip.visible = false;
            }
            else if(this._dat[DatFields.state]==1){
                this._btnClip.visible = true;
            }
            else{
                this.sureBtn.label="";
                this.sureBtn.skin="common/txt_commmon_ylq.png";
                this._btnClip.visible = false;
            }
        }

        private sureBtnHandler():void{
            if(WeekConsumeModel.instance.state==false){return;}     //如果活动已结束，不执行
            if(this._dat[DatFields.state]==0){
                SystemNoticeManager.instance.addNotice("消费代币券数不足",true);
            }
            else if(this._dat[DatFields.state]==1){
                //SystemNoticeManager.instance.addNotice("可领取",false);
                WeekConsumeCtrl.instance.getWeekConsumeAward(this._dat[DatFields.id]);
            }
            else{
                //SystemNoticeManager.instance.addNotice("已领取",false);
            }
        }

        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(0.8, 1);
            this._btnClip.visible = false;
        }
    }
}