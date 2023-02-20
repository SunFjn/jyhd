///<reference path="../config/fishing_cfg.ts"/>
///<reference path="../fish/fish_model.ts"/>
///<reference path="../limit/limit_reap_model.ts"/>
///<reference path="../ceremony_geocaching/ceremony_geocaching_text.ts"/>
namespace modules.year {
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    import CustomList = modules.common.CustomList;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import TreasureCfg = modules.config.TreasureCfg;
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import CommonUtil = modules.common.CommonUtil;
    import StoreModel = modules.store.StoreModel;
    import CelebrationHuntRunReply = Protocols.CelebrationHuntRunReply;
    import CelebrationHuntRunReplyFields = Protocols.CelebrationHuntRunReplyFields;
    const PRICE_ARR = [1, 9, 45];
    import Image = Laya.Image;
    import Text = Laya.Text;
    import FishCtrl = modules.fish.FishCtrl

    export class YearGainAlert extends ui.YearGainAlertUI {
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



        // protected addListeners(): void {

        //     this.addAutoListener(this.oneBtn, Laya.Event.CLICK, this, YearPanel.instance.getBtnHandler, [0]);
        //     this.addAutoListener(this.tenBtn, Laya.Event.CLICK, this, YearPanel.instance.getBtnHandler, [1]);
        //     this.addAutoListener(this.fiftyBtn, Laya.Event.CLICK, this, YearPanel.instance.getBtnHandler, [2]);
        // }
        // protected removeListeners(): void {
        // }

        // ...
        protected addListeners(): void {
            super.addListeners();
            this.oneBtn.on(Event.CLICK, this, this.xunBaoHandler, [0]);
            this.tenBtn.on(Event.CLICK, this, this.xunBaoHandler, [1]);
            this.fiftyBtn.on(Event.CLICK, this, this.xunBaoHandler, [2]);
        }

        protected get weighttype(): LimitWeightType {
            return LimitWeightType.year;
        }
        protected removeListeners(): void {
            super.removeListeners();
            this.oneBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.tenBtn.off(Event.CLICK, this, this.xunBaoHandler);
            this.fiftyBtn.off(Event.CLICK, this, this.xunBaoHandler);
            Laya.timer.clear(this, this.setFlag);
        }
        protected setOpenParam(value: Protocols.RunLimitXunbaoReply): void {
            let array = value[Protocols.RunLimitXunbaoReplyFields.items];
            array = this.distinctArrayByCustom(array);
            let datas = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                datas.push([element[0], element[1], 0, null]);
            }
            // this.showCost();

            this._list.datas = datas;
            this.initPrize()
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
            let condition = TreasureCfg.instance.getItemConditionByGrad(5, grade);
            let cost = condition[idCountFields.count];
            let count = BagModel.instance.getItemCountById(condition[idCountFields.id]);
            return [count, cost]
        }

        private xunBaoHandler(value:number): void {
            // 判断条件
            if (BagModel.instance.getItemCountById(this.prize) < PRICE_ARR[value]) {
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this.prize, 0, true]);
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                return;
            }

            FishCtrl.instance.GainFish(this.weighttype, value);
        }

        private setFlag(): void {
            this._cdFlag = false;
        }

        // 设置消耗道具
        private initPrize() {
            let i_s = CommonUtil.getIconById(this.prize, true);
            this.setPrizeNun();
        }
        private setPrizeNun() {
            let have = BagModel.instance.getItemCountById(this.prize);
            let i_n: Text[] = this.priceNumBox._childs;
            for (let i = 0; i < i_n.length; i++) {
                i_n[i].text = have + "/" + PRICE_ARR[i];
                i_n[i].color = have < PRICE_ARR[i] ? "#be242" : "#ffffff";
            }
        }
        protected get prize(): ItemId {
            return 15650003;
        }
    }
}