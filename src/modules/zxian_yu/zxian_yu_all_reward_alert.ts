///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.zxian_yu {
    import CustomList = modules.common.CustomList;
    import Item = Protocols.Item;
    import BaseItem = modules.bag.BaseItem;
    export class ZXianYuAllRewardAlert extends ui.ZXianYuAllRewardAlertUI {
        private _list: CustomList;
        private _list1: CustomList;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 540;
            this._list.height = 274;
            this._list.hCount = 5;
            this._list.spaceX = 10;
            this._list.itemRender = ZXianYuAllRewardItem;
            this._list.x = 60;
            this._list.y = 100;
            this.addChild(this._list);

            this._list1 = new CustomList();
            this._list1.width = 540;
            this._list1.height = 274;
            this._list1.hCount = 5;
            this._list1.spaceX = 10;
            this._list1.itemRender = ZXianYuAllRewardItem;
            this._list1.x = 59;
            this._list1.y = 463;
            this.addChild(this._list1);
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._list1) {
                this._list1.removeSelf();
                this._list1.destroy();
                this._list1 = null;
            }
            super.destroy();
        }

        public setOpenParam(value: Array<Item>): void {
            super.setOpenParam(value);

            let jiangLi = new Array<Item>();
            for (let index = 0; index < ZXianYuModel.instance._awardAee.length; index++) {
                let element = ZXianYuModel.instance._awardAee[index];
                let shuju: Item = [element[0], element[1], 0, null];
                jiangLi.push(shuju);
            }


            this._list.datas = jiangLi;
            let jiangLi1 = new Array<Item>();
            for (let index = 0; index < ZXianYuModel.instance._awardAee1.length; index++) {
                let element = ZXianYuModel.instance._awardAee1[index];
                let shuju: Item = [element[0], element[1], 0, null];
                jiangLi1.push(shuju);
            }
            this._list1.datas = jiangLi1;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
    }
}