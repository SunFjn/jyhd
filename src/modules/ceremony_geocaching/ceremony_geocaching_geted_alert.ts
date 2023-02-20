///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/store_cfg.ts"/>
/// <reference path="../store/store_model.ts" />

namespace modules.ceremony_geocaching {
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Point = laya.maths.Point;

    import CustomList = modules.common.CustomList;
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
    import CelebrationHuntRunReply = Protocols.CelebrationHuntRunReply;
    import CelebrationHuntRunReplyFields = Protocols.CelebrationHuntRunReplyFields;

    export class CeremonyGeocachingGetedAlert extends ui.CeremonyGeocachingGetedAlertUI {
        private _list: CustomList;
        private _showIds: Array<any>;
        private tenWidth: number = 550;
        private fifWidth: number = 807;
        private _cdFlag: boolean;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._showIds = new Array<any>();
            this._list = new CustomList();
            this._list.width = 580;
            this._list.height = 365;
            this._list.hCount = 5;
            this._list.spaceX = 15;
            this._list.spaceY = 15;
            this._list.itemRender = BagItem;
            this._list.x = 50;
            this._list.y = 60;
            this.addChild(this._list);
        }

        public close(): void {
            this.setFlag();
            super.close();
        }

        // ...
        protected setOpenParam(value: CelebrationHuntRunReply): void {
            let array = value[CelebrationHuntRunReplyFields.list];
            array = this.distinctArrayByCustom(array);
            let datas = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                datas.push([element[0], element[1], 0, null]);
            }
            this.showCost();
            this._list.datas = datas;
        }


        // item去重，重复的数量相加
        private distinctArrayByCustom(arrayList) {
            let tab = {};
            let arr = [];
            for (let index = 0; index < arrayList.length; index++) {
                const element = arrayList[index];
                const key = element[0];
                if (tab.hasOwnProperty(key)) {
                    tab[key][1]++;
                } else {
                    tab[key] = element;
                    tab[key][1] = 1;
                }
            }

            for (const key in tab) {
                if (Object.prototype.hasOwnProperty.call(tab, key)) {
                    const element = tab[key];
                    arr.push(element);
                }
            }

            return arr;
        }

        // 花费展示
        private showCost() {
            let cost0 = this.getCost(0);
            let cost1 = this.getCost(1);
            let cost2 = this.getCost(2);
            // 拥有的抽奖券与各个阶级的消耗显示
            this.card1Txt.text = `${cost0[0]}/${cost0[1]}`;
            this.card10Txt.text = `${cost1[0]}/${cost1[1]}`;
            this.card50Txt.text = `${cost2[0]}/${cost2[1]}`;
            // 字体颜色
            this.card1Txt.color = cost0[0] > cost0[1] ? "#ffffff" : "#be2422";
            this.card10Txt.color = cost1[0] > cost1[1] ? "#ffffff" : "#be2422";
            this.card50Txt.color = cost2[0] > cost2[1] ? "#ffffff" : "#be2422";
        }

        // 检测抽奖券是否足够
        private checkEnoughCost(grade: 0 | 1 | 2): boolean {
            let data = this.getCost(grade);
            let count = data[0];
            let cost = data[1];

            return count >= cost;
        }

        // 获取抽奖消费
        private getCost(grade: 0 | 1 | 2): Array<number> {
            let condition = TreasureCfg.instance.getItemConditionByGrad(6, grade);
            let cost = condition[idCountFields.count];
            let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);

            return [count, cost]
        }

        private xunBaoHandler(value: any): void {
            // 判断条件
            if (this.checkEnoughCost(value)) {

                if (value != null) {
                    if (this._cdFlag) {
                        SystemNoticeManager.instance.addNotice(`操作过于频繁`, true);
                        return;
                    }
                    this._cdFlag = true;
                    Laya.timer.once(500, this, this.setFlag);
                }

                CeremonyGeocachingCtrl.instance.startGeocaching([value]);
            } else {
                SystemNoticeManager.instance.addNotice("抽奖券不足", true);
            }
        }

        private setFlag(): void {
            this._cdFlag = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.oneBtn.on(Event.CLICK, this, this.xunBaoHandler, [0]);
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.fiftyBtn.on(Event.CLICK, this, this.xunBaoHandler, [2]);
        }

        //监听下 购买返回事件 成功了就关闭界面
        private puchaseReply() {
            let result = modules.store.StoreModel.instance.PurchaseReply[BuyMallItemReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                WindowManager.instance.close(WindowEnum.STORE_ALERT);
                this.close();
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.oneBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.fiftyBtn.off(Event.CLICK, this, this.xunBaoHandler);
            // GlobalData.dispatcher.off(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
            Laya.timer.clear(this, this.setFlag);
        }
    }
}