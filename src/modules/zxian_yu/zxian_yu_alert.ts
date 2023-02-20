///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/store_cfg.ts"/>
/// <reference path="../store/store_model.ts" />

namespace modules.zxian_yu {
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Point = laya.maths.Point;
    import List = laya.ui.List;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import TreasureCfg = modules.config.TreasureCfg;
    import Image = laya.ui.Image;
    import Label = laya.ui.Label;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import StoreCfg = modules.config.StoreCfg;
    import mallFields = Configuration.mallFields;
    import MallNodeFields = Protocols.MallNodeFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import StoreModel = modules.store.StoreModel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagUtil = modules.bag.BagUtil;
    export class ZXianYuAlert extends ui.ZXianYuAlertUI {
        private _list: List;
        private _showIds: Array<any>;
        private tenWidth: number = 550;
        private fifWidth: number = 807;
        private _costNumArr: Array<Label>;
        private _type: number;
        private _cdFlag: boolean;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._list = new List();
            this._list.vScrollBarSkin = "";
            this._list.width = 620;
            this._list.height = 530;
            this._list.repeatX = 5;
            this._list.spaceX = 20;
            this._list.spaceY = 20;
            this._list.itemRender = BagItem;
            this._list.x = 40;
            this._list.y = 90;
            this.addChild(this._list);

        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tenBtn, Event.CLICK, this, this.xunBaoHandler, [1]);
            this.addAutoListener(this.fiftyBtn, Event.CLICK, this, this.xunBaoHandler, [2]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_XUNBAOINFO, this, this.setItemNum);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.setItemNum);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        public onOpened(): void {
            super.onOpened();
            this.setItemNum();
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value == null) return;
            this._showIds.length = 0;
            let items = value[0];
            this._type = value[1];
            let len = items.length;
            if (len == 10) {
                this.height = this.bg.height = this.tenWidth;
                this._list.height = 280;
                this.btn1.y = 392;
            } else {
                this.height = this.bg.height = this.fifWidth;
                this._list.height = 530;
                this.btn1.y = 649;
            }
            for (let i = 0; i < items.length; i++) {
                let arr = [items[i], 0, 0, null];
                this._showIds.push(arr);
            }
            this._list.array = this._showIds;
            this._list.scrollTo(0);

            this.playEffect(items);

            // let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
        }

        private xunBaoHandler(value: any): void {
            if (this._cdFlag) {
                SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
                return;
            }
            this._cdFlag = true;
            Laya.timer.once(500, this, this.setFlag);
            let oneNum = ZXianYuModel.instance.oneNum;//第一档抽奖所需点券数量
            let twoNum = ZXianYuModel.instance.twoNum;//第二档抽奖所需点券数量
            let threeNum = ZXianYuModel.instance.threeNum;//第三档抽奖所需点券数量
            let bolll = false;
            // let count = modules.player.PlayerModel.instance.copper;
            let count = ZXianYuModel.instance.xianyu;
            switch (value) {
                case 0:
                    bolll = count >= oneNum;
                    break;
                case 1:
                    bolll = count >= twoNum;
                    break;
                case 2:
                    bolll = count >= threeNum;
                    break;
                default:
                    break;
            }
            if (bolll) {
                //发消息
                modules.treasure.TreasureCtrl.instance.runXunbao(this._type, value);
            }
            else {
                //给提示
                BagUtil.openLackPropAlert(modules.zxian_yu.ZXianYuModel.instance.id, 1);
                // CommonUtil.alert('温馨提示', '点券不足，是否前往充值界面充值？', [Handler.create(this, this.openRecharge)]);
            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }
        /**
         * 设置道具数量
         */
        private setItemNum(): void {
            // this.tenCountImg.skin = this.fifityCountImg.skin = CommonUtil.getIconById(ZXianYuModel.instance.id);

            let oneNum = ZXianYuModel.instance.oneNum;//第一档抽奖所需点券数量
            let twoNum = ZXianYuModel.instance.twoNum;//第二档抽奖所需点券数量
            let threeNum = ZXianYuModel.instance.threeNum;//第三档抽奖所需点券数量
            // let count = modules.player.PlayerModel.instance.copper;
            let count = ZXianYuModel.instance.xianyu;
            this.tenCount.text = `${count}/${twoNum}`;
            this.fiftyCount.text = `${count}/${threeNum}`;
            if (twoNum <= count) {
                this.tenCount.color = "#2d2d2d";
            }
            else {
                this.tenCount.color = "#FF3e3e";
            }
            if (threeNum <= count) {
                this.fiftyCount.color = "#2d2d2d";
            }
            else {
                this.fiftyCount.color = "#FF3e3e";
            }
            let W1 = this.tenCountImg.width + this.tenCount.width;
            let pox1 = (this.tenCountBox.width - W1) / 2;
            this.tenCountImg.x = pox1;
            this.tenCount.x = this.tenCountImg.x + this.tenCountImg.width;

            let W2 = this.fifityCountImg.width + this.fiftyCount.width;
            let pox2 = (this.fiftyCountBox.width - W2) / 2;
            this.fifityCountImg.x = pox2;
            this.fiftyCount.x = this.fifityCountImg.x + this.fifityCountImg.width;
        }
        public playEffect(value: any): void {
            let effectItems = value as number[];
            for (let i = 0; i < this._list.cells.length; i++) {
                let x = this._list.cells[i].x + this._list.cells[i].width / 2;
                let y = this._list.cells[i].y + this._list.cells[i].height / 2;
                let start = new Point(x, y);
                let arr = [effectItems[i], start, this.height];
                GlobalData.dispatcher.event(CommonEventType.ZXIANYU_EFFECT, [arr]);
            }
        }
        private setFlag(): void {
            this._cdFlag = false;
        }
        public close(): void {
            this.setFlag();
            Laya.timer.clear(this, this.setFlag);
            super.close();
        }
    }
}