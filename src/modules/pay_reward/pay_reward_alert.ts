///<reference path="../../../libs/LayaAir.d.ts"/>
namespace modules.pay_reward {
    import Point = laya.maths.Point;
    import List = laya.ui.List;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class PayRewardAlert extends ui.PayRewardAlertUI {
        private _list: List;
        private _showIds: Array<any>;
        /**按钮流光特效 */
        private _tenBtnBtnClip: CustomClip;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._tenBtnBtnClip) {
                this._tenBtnBtnClip.removeSelf();
                this._tenBtnBtnClip.destroy();
                this._tenBtnBtnClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._list = new List();
            this._list.vScrollBarSkin = "";
            this._list.width = 565;
            this._list.height = 259;
            this._list.repeatX = 5;
            // list.repeatY = 6;
            this._list.spaceX = 16.25;
            this._list.spaceY = 8;
            this._list.itemRender = BagItem;
            this._list.x = 48;
            this._list.y = 70;
            this.addChild(this._list);
            // this.createItem();
        }

        public onOpened(): void {
            super.onOpened();
            this.changDrawNum();
            CommonUtil.delayedPutInBag();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._tenBtnBtnClip.stop();
            this._tenBtnBtnClip.visible = false;
            CommonUtil.delayedPutInBag();
        }
        public playEffect(value: any): void {
            let effectItems = value;
            for (let i = 0; i < effectItems.length; i++) {
                let x = this._list.cells[i].x + this._list.cells[i].width / 2;
                let y = this._list.cells[i].y + this._list.cells[i].height / 2;
                let start = new Point(x, y);
                let arr = [effectItems[i][0], start, this.height];
                GlobalData.dispatcher.event(CommonEventType.PAY_REWARD_EFFECT, [arr]);
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._showIds.length = 0;
            // if (value.length == 10) {
            //     this.height = this.bg.height = this.tenWidth;
            //     this._list.height = 280;
            //     this.btn1.y = 377;
            // } else {
            //     this.height = this.bg.height = this.fifWidth;
            //     this._list.height = 530;
            //     this.btn1.y = 649;
            // }
            for (let i = 0; i < value.length; i++) {
                let itemId: number = value[i][0];
                let count: number = value[i][1];
                let arr = [itemId, count, 0, null];
                this._showIds.push(arr);
            }
            // this._showIds.sort((l: Item, r: Item): number => {
            //     let lId = l[ItemFields.ItemId];
            //     let rId = r[ItemFields.ItemId];
            //     let lQuailty = CommonUtil.getItemQualityById(lId);
            //     let rQuailty = CommonUtil.getItemQualityById(rId);
            //     if (lQuailty == rQuailty) {
            //         return lId > rId ? -1 : 1;
            //     }
            //     return lQuailty > rQuailty ? -1 : 1;
            // });
            this._list.array = this._showIds;
            this._list.scrollTo(0);
            this.playEffect(value);
            // for(let i=0;i<this._showIds.length;i++){
            //     let item=<TreasureItem>this._list.cells[i];
            //     item.nameVisible=true;
            // }
        }

        protected addListeners(): void {
            super.addListeners();
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PAYREWARD_UPDATE, this, this.changDrawNum);
            this._tenBtnBtnClip = new CustomClip();
            this.addChild(this._tenBtnBtnClip);
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr1[i] = `btn_light/${i}.png`;
            }
            this._tenBtnBtnClip.frameUrls = arr1;
            this._tenBtnBtnClip.pos(230, 382, true);
            this._tenBtnBtnClip.scale(1, 1.25, true);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
        }

        private xunBaoHandler(value: number): void {
            /*抽奖标记(0抽一次 1抽10次)*/
            let drawNum = PayRewardModel.instance.rewardCount;
            if (value == 0) {
                if (drawNum == 0) {
                    SystemNoticeManager.instance.addNotice("抽奖次数不足", true);
                    return;
                }
                PayRewardCtrl.instance.payRewardRun(value);
                this.close();
            } else {
                if (drawNum < 10) {
                    SystemNoticeManager.instance.addNotice("抽奖次数不足", true);
                    return;
                }
                PayRewardCtrl.instance.payRewardRun(value);
                // this.close();
            }

        }

        /**
         * 改變剩餘抽獎次數
         */
        public changDrawNum() {
            let drawNum = PayRewardModel.instance.rewardCount;
            let colorStr = "#ff3e3e";
            drawNum == 0 ? colorStr = "#ff3e3e" : colorStr = "#168a17";
            this.drawNum.color = colorStr;
            this.drawNum.text = `${drawNum}`;
            let wight = this.Text1.width + this.drawNum.width;
            let X = (this.width - wight) / 2;
            this.Text1.x = X;
            this.drawNum.x = this.Text1.x + this.Text1.width;
            if (drawNum == 0) {
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else if (drawNum > 0 && drawNum < 10) {
                this._tenBtnBtnClip.visible = false;
                this._tenBtnBtnClip.stop();
            } else {
                this._tenBtnBtnClip.visible = true;
                this._tenBtnBtnClip.play();
            }
        }
    }
}
