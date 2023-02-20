/** 现金装备-奇珍异宝 数据 */
namespace modules.cashEquip {
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import ItemsFields = Configuration.ItemsFields;
    import ItemFields = Protocols.ItemFields;

    import BagModel = modules.bag.BagModel; // 背包
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    export class CashEquipModel {
        private static _instance: CashEquipModel = new CashEquipModel();
        public static get instance(): CashEquipModel {
            return this._instance;
        }

        constructor() {
            this.Init();

        }
        public moneyHis: number = 0
        private _money: number = 0;

        public pageType: number = 0
        public page: number = 0
        public pageMax: number = 0

        public ItemCount: Map<number, number> = new Map<number, number>()

        //
        /**
         * 初始化需要的数据
         */
        public Init() {
            GlobalData.dispatcher.on(CommonEventType.BAG_ADD_ITEM_CashEquip, this, this.updateItem);
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Completion_Callback, this, this.updateItemCallback);
        }

        //出售页码变化
        public sellPageChange(page: number, call: Function): void {
            window['SDKNet']("api/game/recovery/change/log", { page: page, page_count: 8 }, (data) => {
                if (data.code == 200) {
                    this.moneyHis = data.data.total_money;
                    this.page = data.data.page;
                    this.pageMax = data.data.total_page;
                    this.money = data.data.money;
                    call && call(data.data);
                } else {
                    this.page = 0;
                    this.pageMax = 0;
                    call && call(data.data);
                }
            })
        }
        //提现页码变化
        public cashPageChange(page: number, call: Function): void {



            window['SDKNet']("api/game/recovery/withdraw/log", { page: page, page_count: 8 }, (data) => {
                if (data.code == 200) {
                    this.page = data.data.page;
                    this.pageMax = data.data.total_page;
                    call && call(data.data);
                } else {
                    this.page = 0;
                    this.pageMax = 0;
                    call && call(data.data);
                }
            })
        }



        public updateItem(item: Protocols.Item): void {
            if (!item) return;
            if (item[ItemFields.ItemId] == 15260007) return;
            //这块判断显示现金装备获得逻辑 
            // 如果结算奖励界面存在就延迟展示一个获得效果
            // 如果结算奖励不存在 就单独显示现金装备
            if (CommonUtil.getItemSubTypeById(item[ItemsFields.itemId]) == 52) {
                if (WindowManager.instance.isOpened(WindowEnum.WIN_PANEL) || WindowManager.instance.isOpened(WindowEnum.ARENA_WIN_ALERT)) {
                    // 结算界面 奖励特效
                    Laya.timer.once(300, this, () => {
                        SuccessEffectCtrl.instance.play2("assets/others/tx_jinjiechengong9.png");
                    });
                    // 结算界面 通知展示物品
                    Laya.timer.once(500, this, () => {
                        GlobalData.dispatcher.event(CommonEventType.CashEquip_Merge_Awards, [item]);
                    });

                } else {
                    WindowManager.instance.open(WindowEnum.CashEquip_Share_Alert, item);
                 
                }
            }

        }


        public updateItemCallback(item: Protocols.Item): void {
            if (!item) return;
            if (CommonUtil.getItemSubTypeById(item[ItemsFields.itemId]) == 52) {
                WindowManager.instance.open(WindowEnum.CashEquip_Share_Alert, item);
            }

        }


        public getItemCount(itemId: number) {
            return BagModel.instance.getItemCountById(itemId);
        }
        public openTips(iteamId, count) {
            WindowManager.instance.open(WindowEnum.CashEquip_Tips_Alert, [iteamId, count]);
        }

        public get money(): number {
            return this._money;
        }

        public set money(value: number) {
            if (!value) return;
            this._money = value;
            GlobalData.dispatcher.event(CommonEventType.CashEquip_Money_change);
        }

        //获取剩余数量
        public getSurplusCount(itemId: number): number {
            let count = 0;
            if (this.ItemCount.has(itemId)) {
                count = this.ItemCount.get(itemId)
            }
            return count;
        }

        //保存剩余数量
        public saveSurplusCount(arr: Array<[number, number]>): void {
            arr.forEach((item) => {
                this.ItemCount.set(item[0], item[1]);
            })


        }


    }
}