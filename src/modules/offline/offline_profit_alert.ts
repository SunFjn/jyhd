/** 离线收益 */


///<reference path="./offline_model.ts"/>
namespace modules.Offline {

    import Sprite = Laya.Sprite;
    import BagItem = modules.bag.BagItem;
    import OfflineProfitAlertUI = ui.OfflineProfitAlertUI;
    import OfflineModel = modules.Offline.OfflineModel;
    import GetMonthCardInfoReply = Protocols.GetMonthCardInfoReply;
    import GetMonthCardInfoReplyFields = Protocols.GetMonthCardInfoReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;


    export class OfflineProfitAlert extends OfflineProfitAlertUI {

        private _con: Sprite;
        private _items: Array<Protocols.Item>;
        private _bagItemPosX: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.sixBox.visible = false;
            this._con = new Sprite();
            this.addChild(this._con);
            this._con.pos(120, 557-11, true);

            let arr:Array<number> = BlendCfg.instance.getCfgById(24005)[blendFields.intParam];
            let getOutLineReply: Protocols.GetOutlineInfoReply = OfflineModel.instance.getOutline;
            let items: Array<Protocols.Item> = [
                [MoneyItemId.copper, getOutLineReply[Protocols.GetOutlineInfoReplyFields.copper], null, null],
                [MoneyItemId.exp, getOutLineReply[Protocols.GetOutlineInfoReplyFields.exp], null, null],
                [MoneyItemId.zq, getOutLineReply[Protocols.GetOutlineInfoReplyFields.zq], null, null],
                [arr[0], getOutLineReply[Protocols.GetOutlineInfoReplyFields.equipCount], null, null],
                [arr[1], getOutLineReply[Protocols.GetOutlineInfoReplyFields.lzCount], null, null]];
            this.equipNameTxt.text = CommonUtil.getNameByItemId(arr[0]);
            this.dragontNameTxt.text = CommonUtil.getNameByItemId(arr[1]);


            this.showOfflineTime(getOutLineReply[Protocols.GetOutlineInfoReplyFields.tm]);
            this.lvUpdata(getOutLineReply[Protocols.GetOutlineInfoReplyFields.curLevel], getOutLineReply[Protocols.GetOutlineInfoReplyFields.newLevel]);
            this.setItems(items);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.monthCardBox, common.LayaEvent.CLICK, this, this.monthCardHandler);
            this.addAutoListener(this.zhizunBox, common.LayaEvent.CLICK, this, this.zhizunHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showZhizunBtn);
        }

        public onOpened(): void {
            super.onOpened();

            this.showMonthCardBtn();
            this.showZhizunBtn();
        }

        public setItems(items: Array<Protocols.Item>): void {

            this._items = items;
            let num: int = items.length;
            for (let i: int = 0; i < num; i++) {
                let bagItem: BagItem = new BagItem();
                bagItem.dataSource = items[i];
                bagItem.nameVisible = false;
                this._con.addChild(bagItem);
                bagItem._numTxt.visible = false;
                if (Math.floor(i / 3) == 0) {
                    this._bagItemPosX = -7;
                } else {
                    this._bagItemPosX = 78;
                }
                bagItem.x = this._bagItemPosX + Math.floor(i % 3) * 169;
                bagItem.y = -150 + Math.floor(i / 3) * (183);
                this.setNumTxt(this._items[i][Protocols.ItemFields.count], i);
            }
            this._con.size(num * 110 + (num - 1) * 10, 120);
            this._con.scrollRect = null;
            if (!items) return;
        }

        //开通月卡
        private monthCardHandler(): void {
            WindowManager.instance.open(WindowEnum.MONTH_CARD_PANEL);
            this.close();
        }

        //开通尊特权
        private zhizunHandler(): void {
            WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            this.close();
        }

        private showMonthCardBtn() {
            let info: GetMonthCardInfoReply = modules.monthCard.MonthCardModel.instance.MonthCardInfoReply;
            if (info) {
                if (info[GetMonthCardInfoReplyFields.flag] === 0) {     // 0未开启 1开启
                    this.monthCardBox.gray = true;
                    this.monthCardTxt.text = "点击开通";
                } else {
                    this.monthCardBox.gray = false;
                    this.monthCardTxt.text = "已开通";
                }
            } else {
                this.monthCardBox.gray = true;
                this.monthCardTxt.text = "点击开通";
            }
        }

        private showZhizunBtn(): void {
            let state: number = zhizun.ZhizunModel.instance.state;
            if (state == null) return;
            let openState: boolean = state == 1;
            if (openState) {
                this.zhizunBox.gray = false;
                this.zhizunTxt.text = "已开通";
            } else {
                this.zhizunBox.gray = true;
                this.zhizunTxt.text = "点击开通";
            }
        }

        // 显示时间
        private showOfflineTime(secs: number): void {
            // 最多显示20小时，超过的不显示
            let hour = (Math.floor(secs / 3600)).toString();
            let min = (Math.floor(Math.floor(secs % 3600) / 60)).toString();
            let second = (Math.floor(Math.floor(Math.floor(secs % 3600) % 60) % 60)).toString();
            this.offlineTime.text = `${hour}小时${min}分${second}秒`;
        }

        // 更新等级
        private lvUpdata(oldLv: number, curLv: number): void {
            this.oldLvText.value = `${oldLv}`;
            // this.oldLvText.color = "#585858";
            this.curLvText.value = `${curLv}`;
            //this.curLvText.color = "#005b11";
            // this.curLvText.color = "#327C03";
        }

        //
        private setNumTxt(num: number, type: number): void {
            switch (type) {
                case 0:
                    this.setNameAndNumTxt(this.coinNameTxt, this.coinNumTxt, num);
                    break;
                case 1:
                    this.setNameAndNumTxt(this.exNametTxt, this.exNumtTxt, num);
                    break;
                case 2:
                    this.setNameAndNumTxt(this.genuineNameTxt, this.genuineNumTxt, num);
                    break;
                case 3:
                    this.setNameAndNumTxt(this.equipNameTxt, this.equipNumtxt, num);
                    break;
                case 4:
                    this.setNameAndNumTxt(this.dragontNameTxt, this.dragontNumTxt, num);
                    break;
            }
        }

        private setNameAndNumTxt(nametxt: laya.display.Text, numtxt: laya.display.Text, num: number): void {
            numtxt.text = "×" + num.toString();
            nametxt.x += (65 - Math.floor((nametxt.width + numtxt.width + 5) / 2));
            numtxt.x = nametxt.x + nametxt.width;
        }


    }
}