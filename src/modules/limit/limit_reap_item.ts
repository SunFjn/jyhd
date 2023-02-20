/////<reference path="../limit_xunbao_cumulative_task_cfg_cfg.ts"/>
/** 消费赠礼 */
namespace modules.limit {

    import Items = Configuration.Items;
    import limit_xunbao_cumulative_task_cfg = Configuration.limit_xunbao_cumulative_task_cfg;
    import limit_xunbao_cumulative_task_cfgField = Configuration.limit_xunbao_cumulative_task_cfgField;
    import CustomClip = modules.common.CustomClip;
    import ItemsFields = Configuration.ItemsFields;
    import LimitXunBaoCumulativeTaskReward = Protocols.LimitXunBaoCumulativeTaskReward;
    import LimitXunBaoCumulativeTaskRewardFields = Protocols.LimitXunBaoCumulativeTaskRewardFields;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class LimitReapItem extends ui.LimitReapItemUI {
        private _cfg: limit_xunbao_cumulative_task_cfg;
        private getState: number = 0;
        private _btnClip: CustomClip;
        private _itemId: number;
        private _describe : string;
        private _smallType: number;
        private _itemIdAr: number[];
        private _stateMoney: number;
        private _cumuMoney: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            //用于设置消费赠礼控件属性 或者创建新控件
            this._itemId = 0;
            this._itemIdAr = [];
            this._describe  = '';
            this.continueText.color = "#ffffff";
            this.continueText.style.fontFamily = "SimHei";
            this.continueText.style.fontSize = 19;

            this.creatEffect();
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;;
        }
        protected get smallType(): LimitTaskSmallType {
            return LimitTaskSmallType.null;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CONSUME_REWARD_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            // this._btnClip.play();
            this.updateView();
        }

        private updateView(): void {
            //更新面板状态 和消费赠礼事件绑定
            this.setBtnSure();
            this.setMoney();
        }

        protected setData(value: any): void {
            this._cfg = value as limit_xunbao_cumulative_task_cfg;
            let awardArr: Array<Items> = [];
            this._cumuMoney = this._cfg[limit_xunbao_cumulative_task_cfgField.condition];
            this._itemId = this._cfg[limit_xunbao_cumulative_task_cfgField.id];
            this._describe = this._cfg[limit_xunbao_cumulative_task_cfgField.describe];
            this._smallType = this._cfg[limit_xunbao_cumulative_task_cfgField.smallType];
            this._itemIdAr.push(this._cfg[limit_xunbao_cumulative_task_cfgField.id]);
            let showIdArr: number[] = [];
            awardArr = this._cfg[limit_xunbao_cumulative_task_cfgField.rewards];


            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            this.setMoney();
            let count: number = showIdArr.length;
            let DayBase: modules.bag.BaseItem[] = [];
            DayBase.push(this.continueBase1);
            DayBase.push(this.continueBase2);
            DayBase.push(this.continueBase3);
            for (let i: int = 0; i < 3; i++) {
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

        private creatEffect(): void {
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-5, -15);
            this._btnClip.scale(0.9, 1);
            this._btnClip.visible = false;
        }

        private sureBtnHandler(): void {


            if (this.getState == 0) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                WindowManager.instance.close(WindowEnum.CUMULATE_PAY2_UPDATE);
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[limit_xunbao_cumulative_task_cfgField.rewards];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                // LimitReapCtrl.instance.getLimitReap([this.bigtype, this._taskId,this._smallType]);
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    LimitReapCtrl.instance.getLimitReap([this.bigtype, this._itemId, this._smallType]);
                }
            }
            this.wdc.visible =false


        }

        private setBtnSure(): void {
            this.getState = 0;//重置

            let rewarList: Table<LimitXunBaoCumulativeTaskReward> = LimitReapModel.instance.rewarTable(this.bigtype, this.smallType);
            let value = rewarList[this._itemId];

            if (!value) {
                this.sureBtn.label = "前往充值";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;
                // console.log("前往领取");
                if (this.smallType == LimitTaskSmallType.day) {
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = false;
                    this.wdc.visible =true
                }
            } else {
                this.wdc.visible =false
                this.getState = value[LimitXunBaoCumulativeTaskRewardFields.state];
                if (this.getState !== 0) {
                    this.sureBtn.label = "领取";
                    if (this.getState == 1) {
                        this._btnClip.play();
                        this._btnClip.visible = true;
                        this.sureBtn.visible = true;
                        this.receivedImg.visible = false;
                 
                    } else {
                        this.sureBtn.visible = false;
                        this.receivedImg.visible = true;
                     
                    }
                }
            }



        }

        public close(): void {
            super.close();
        }

        private setMoney(): void {
            this._stateMoney = LimitReapModel.instance.totalValue(this.bigtype, this.smallType);
            // this.continueText.innerHTML = `${this._cfg[limit_xunbao_cumulative_task_cfgField.name]}<span style='color:#ffff68'>${this._cfg[limit_xunbao_cumulative_task_cfgField.condition]}</span>可领取`;
            this.continueText.innerHTML =this._describe;
            this.scheduleText.text = `(${this._stateMoney}/${this._cumuMoney})`;
            if (this._stateMoney >= this._cumuMoney) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#EC695D";
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }
    }
}