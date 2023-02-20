/** 现金装备-奇珍异宝 面板*/
namespace modules.cashEquip {
    import CashEquipViewUI = ui.CashEquipViewUI; // UI
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧



    import BagModel = modules.bag.BagModel; // 背包
    import attr = Configuration.attr; //战力
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import TweenGroup = utils.tween.TweenGroup;

    export class CashEquipPanel extends CashEquipViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;


        public destroy(destroyChild: boolean = true): void {
            // this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._tweenGroup = new TweenGroup();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 655;
            this._list.height = 670;
            this._list.vCount = 2;
            this._list.hCount = 4;
            this._list.itemRender = CashEquipItem;
            this._list.x = 31;
            this._list.y = 320;
            this._list.spaceY = 1;
            this._list.spaceX = 15
            this.addChild(this._list);
            this.regGuideSpr(GuideSpriteId.BOTTOM_CashEquip_MONEY_BTN, this.moneyBtn);
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Item_change, this, this.updateHandler);
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Money_change, this, this.updateMoney);
            GlobalData.dispatcher.on(CommonEventType.CashEquip_showComposeEffect, this, this.showComposeEffect);
            this.moneyBtn.on(Event.CLICK, this, this.openMoneyPanl);



        }

        protected removeListeners(): void {
            super.removeListeners();
            // this._list.off(Event.SELECT, this, this.selectHandler);
            this.guideSprUndisplayHandler(GuideSpriteId.BOTTOM_CashEquip_MONEY_BTN);
            GlobalData.dispatcher.off(CommonEventType.CashEquip_Item_change, this, this.updateHandler);
            GlobalData.dispatcher.off(CommonEventType.CashEquip_Money_change, this, this.updateMoney);
            GlobalData.dispatcher.off(CommonEventType.CashEquip_showComposeEffect, this, this.showComposeEffect);

        }

        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);



        }
        protected onOpened(): void {
            super.onOpened();
            CashEquipModel.instance.sellPageChange(1, null)
            this.updateHandler();
        }


        //数据更新
        private updateHandler(): void {
            let arr: Array<cash_Equip> = CashEquipCfg.instance.getCfg()
            //首先根据数量 分类
            //再根据价格分类
            let have: Array<cashEquipData> = Array<cashEquipData>();
            let haveNo: Array<cashEquipData> = Array<cashEquipData>();
            for (let i = 0; i < arr.length; i++) {
                let itemId = Number(arr[i][cash_EquipFields.itemId])
                let cont = CashEquipModel.instance.getItemCount(itemId)

                if (cont > 0) have.push([itemId, cont, Number(arr[i][cash_EquipFields.gold])])
                else haveNo.push([itemId, cont, Number(arr[i][cash_EquipFields.gold])])
            }
            have.sort((a, b) => { return b[cashEquipDataFields.gold] - a[cashEquipDataFields.gold] })
            haveNo.sort((a, b) => { return b[cashEquipDataFields.gold] - a[cashEquipDataFields.gold] })
            let data = have.concat(haveNo)
            if (this._list) this._list.datas = data
            this.updateMoney();
        }


        //数据更新
        private updateHandler2(): void {
            let arr: Array<cash_Equip> = CashEquipCfg.instance.getCfg()
            let have: Array<cashEquipData> = Array<cashEquipData>();
            for (let i = 0; i < arr.length; i++) {
                let itemId = Number(arr[i][cash_EquipFields.itemId])
                let cont = CashEquipModel.instance.getItemCount(itemId)
                have.push([itemId, cont, Number(arr[i][cash_EquipFields.gold])])
            }
            have.sort((a, b) => { return b[cashEquipDataFields.gold] - a[cashEquipDataFields.gold] })
            if (this._list) this._list.datas = have
        }


        private openMoneyPanl(): void {
            WindowManager.instance.openDialog(WindowEnum.CashEquip_Money_Alert);
        }
        //更新余额
        private updateMoney(): void {
            //window['SDKNet']("api/game/recovery/change/log", { page: 1, page_count: 8 }, (data) => {
            //    if (data.code == 200) {
            //        this.moneyTxt.text =  Number(data.data.money) + "元"
            //    }
            //})
            if (this.moneyTxt && this.moneyBtn) {
                this.moneyTxt.text = Number(CashEquipModel.instance.money) + "元"
                this.moneyBtn.x = this.moneyTxt.x + this.moneyTxt.width + 15
            } else {
                console.log("现金装备余额更新失败", this.moneyTxt, this.moneyBtn)
            }

        }
        // 展示合成效果
        private showComposeEffect() {
            this.showSnowEffect();
        }
        private _tweenGroup: TweenGroup;
        // 飘雪效果
        private showSnowEffect() {
            this.updateHandler2();
            let items: Array<CashEquipItem> = this._list.items as Array<CashEquipItem>
            items[0].setClip(false);
            for (let i = 1; i < items.length; i++) {
                items[i].setClip(false);
                // 飘星特效
                let img: Image = new Image();
                img.skin = CommonUtil.getIconById(items[i].itemId)
                this._list.addChild(img);
                items[i].showComposeEffect(img);
                img.anchorX = img.anchorY = 0.5;
                img.pos(items[i].x + 100, items[i].y + 130, true);
                img.alpha = 1;
                let startX: number = img.x;
                let startY: number = img.y;
                let endX: number = 85;
                let endY: number = 115;
                let midX: number = 0.3 * endX + 0.7 * startX;
                let midY: number = 0.3 * endY + 0.7 * startY;
                let k: number = (startX - endX) / (endY - startY);
                let b: number = midY - k * midX;
                let angle: number = Math.atan(k);
                let rand: number = Math.random() + 0.5;
                let t: int = Math.random() < 0.5 ? 1 : -1;
                let destX: number = midX + 100 * Math.sin(angle) * rand * t;
                let destY: number = midY + 100 * Math.cos(angle) * rand * t;
                let callback = (): void => {
                    img.removeSelf();
                };
                TweenJS.create(img, this._tweenGroup).to({ x: destX, y: destY }, 300).chain(
                    TweenJS.create(img, this._tweenGroup).to({
                        x: endX,
                        y: endY,
                        alpha: 0.3
                    }, i * 30 + Math.random() * 200).onComplete(callback).onStop(callback)
                ).start();
            }
            Laya.timer.once(600, this, () => {
                items[0].setClip(true)
            })
            Laya.timer.once(1500, this, () => {
                for (let i = 1; i < items.length; i++) {
                    items[i].setClip(true)
                }
                
            })

        }



        // 关闭
        private closeHandler(): void {
            this.close();

        }

        close(): void {
            super.close();
            //if (WindowManager.instance.isOpened(WindowEnum.GUIDE_PANEL)) WindowManager.instance.close(WindowEnum.GUIDE_PANEL)
        }
    }
}
